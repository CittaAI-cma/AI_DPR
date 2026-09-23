// @ts-nocheck
/**
 * Capture an element's HTML along with all same-origin stylesheets in the current document.
 * This is used to generate a PDF that matches the on-screen React preview 1:1.
 */

export function captureElementAsStandaloneHTML(
  rootEl: Element,
  options?: { pageMargin?: string }
): string {
  if (!rootEl) throw new Error('Root element not found');

  // Clone to avoid mutating the live DOM
  const clone = rootEl.cloneNode(true) as HTMLElement;

  // Add a marker class so we can target print fixes
  clone.classList.add('pdf-capture-root');
  const isIndividual = clone.classList.contains('individual-dpr-document');
  const pageMargin = options?.pageMargin || (isIndividual ? '16mm' : '0');

  // Collect CSS from all accessible stylesheets (Vite injected + Tailwind output included)
  let cssText = '';
  const styleSheets = Array.from(document.styleSheets || []);
  for (const sheet of styleSheets) {
    try {
      const rules = (sheet as CSSStyleSheet).cssRules;
      if (!rules) continue;
      for (const rule of Array.from(rules)) {
        cssText += rule.cssText + '\n';
      }
    } catch (e) {
      // Ignore CORS-restricted stylesheets
    }
  }

  // Individual docs need page margins so tables/cover are not clipped at A4 edges.
  const printFixes = `
    @page { size: A4; margin: ${pageMargin}; }
    html, body { margin: 0; padding: 0; width: auto; max-width: 100%; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .pdf-capture-root { width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; }
    .pdf-capture-root table { table-layout: fixed !important; width: 100% !important; max-width: 100% !important; }
    .pdf-capture-root th, .pdf-capture-root td { overflow-wrap: anywhere; word-break: break-word; }
    .page-break { break-after: page; page-break-after: always; }
    .no-print { display: none !important; }
  `;

  const fullHTML = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>${printFixes}\n${cssText}</style>
  </head>
  <body>${clone.outerHTML}</body>
</html>`;

  return fullHTML;
}

