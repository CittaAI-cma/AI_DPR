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
  const pageMargin = options?.pageMargin || '0';
  const pageSize = clone.getAttribute('data-page-size') || 'A4';
  const wideLandscape = clone.getAttribute('data-wide-landscape') === '1';
  const styled = clone.getAttribute('data-dpr-styled') === '1';
  if (styled) {
    const parts = (clone.style.padding || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 4) clone.style.padding = `0 ${parts[1]} 0 ${parts[3]}`;
    else if (parts.length === 2) clone.style.padding = `0 ${parts[1]} 0 ${parts[1]}`;
    else if (parts.length === 1 && parts[0]) clone.style.padding = `0 ${parts[0]} 0 ${parts[0]}`;
  }

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

  // Page inset is applied by Puppeteer (16mm for Latest DPR). @page margin stays 0 so it is not added twice.
  // Wide bank sheets scroll on screen (min-width: 720px); on A4 they must shrink to the page.
  const printFixes = `
    @page { size: ${pageSize}; margin: ${isIndividual ? '0' : pageMargin}; }
    ${wideLandscape ? `@page dpr-land { size: ${pageSize} landscape; margin: 0; } .dpr-wide-landscape .cmep-fin-scroll { page: dpr-land; break-before: page; }` : ''}
    [data-page-push] { margin-top: 0 !important; }
    .individual-qa-block, .individual-particulars, .individual-cover, .individual-toc, .dpr-slot-figure { break-inside: avoid; page-break-inside: avoid; }
    .individual-sec { break-inside: auto; page-break-inside: auto; }
    .individual-sec-title { break-after: avoid; page-break-after: avoid; }
    .dpr-slot-resize { display: none !important; }
    html, body { margin: 0; padding: 0; width: auto; max-width: 100%; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .pdf-capture-root { width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; }
    .pdf-capture-root table { table-layout: fixed !important; width: 100% !important; max-width: 100% !important; min-width: 0 !important; }
    .pdf-capture-root th, .pdf-capture-root td { overflow-wrap: anywhere; word-break: break-word; min-width: 0 !important; }
    .pdf-capture-root .cmep-fin-scroll { overflow: visible !important; }
    .pdf-capture-root .cmep-fin-table { min-width: 0 !important; }
    .pdf-capture-root .cmep-fin-year { white-space: normal !important; }
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

