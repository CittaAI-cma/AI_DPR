import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import fs from 'node:fs';
import puppeteer from 'puppeteer';
import { pdfOptionsFromCapturedHtml } from './lib/pdfPageOptions.ts';

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    @page { size: A3; margin: 0; }
    body { margin: 0; font-family: sans-serif; }
  </style>
</head>
<body>
  <div class="individual-dpr-document" data-dpr-styled="1" data-page-size="A3" data-page-edge-top="18" data-page-edge-bottom="14">
    <h1>Styled report smoke test</h1>
    <p>One page, A3.</p>
  </div>
</body>
</html>`;

function chromePath() {
  const fromEnv = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH;
  if (fromEnv && fs.existsSync(fromEnv)) return fromEnv;
  const installed = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  return fs.existsSync(installed) ? installed : undefined;
}

function mediaBox(pdf: Buffer) {
  const text = pdf.toString('latin1');
  const match = text.match(/\/MediaBox\s*\[\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\]/);
  assert.ok(match, 'PDF has no MediaBox');
  return {
    width: Number(match[3]) - Number(match[1]),
    height: Number(match[4]) - Number(match[2]),
  };
}

describe('styled PDF smoke', () => {
  it('writes a real A3 PDF for a styled report', { timeout: 120_000 }, async () => {
    const options = pdfOptionsFromCapturedHtml(html);
    assert.ok(options && 'format' in options);
    assert.equal(options.format, 'A3');
    assert.equal(options.marginTop, '18mm');
    assert.equal(options.marginBottom, '14mm');

    const executablePath = chromePath();
    const browser = await puppeteer.launch({
      headless: true,
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });
    try {
      const page = await browser.newPage();
      await page.setJavaScriptEnabled(false);
      await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      const pdf = Buffer.from(await page.pdf({
        format: options.format,
        printBackground: true,
        displayHeaderFooter: false,
        margin: {
          top: options.marginTop,
          right: options.marginRight,
          bottom: options.marginBottom,
          left: options.marginLeft,
        },
        preferCSSPageSize: options.preferCssPageSize,
      }));
      assert.equal(pdf.subarray(0, 4).toString('ascii'), '%PDF');
      const box = mediaBox(pdf);
      const longEdge = Math.max(box.width, box.height);
      const shortEdge = Math.min(box.width, box.height);
      assert.ok(Math.abs(longEdge - 1190.55) < 3, `long edge ${longEdge}`);
      assert.ok(Math.abs(shortEdge - 841.89) < 3, `short edge ${shortEdge}`);
    } finally {
      await browser.close();
    }
  });
});
