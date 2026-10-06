export type CapturedPdfOptions =
  | {
      marginTop: string;
      marginBottom: string;
      marginLeft: string;
      marginRight: string;
      format: 'A4' | 'A3' | 'Letter' | 'Legal';
      preferCssPageSize: true;
    }
  | { margin: '16mm' }
  | undefined;

/** Page box for a captured live-DPR HTML download. */
export function pdfOptionsFromCapturedHtml(html: string): CapturedPdfOptions {
  const isIndividual = html.includes('individual-dpr-document');
  const styled = html.includes('data-dpr-styled="1"');
  const sizeMatch = html.match(/data-page-size="(A4|A3|Letter|Legal)"/);
  const edgeTop = html.match(/data-page-edge-top="([\d.]+)"/);
  const edgeBottom = html.match(/data-page-edge-bottom="([\d.]+)"/);
  const format = (sizeMatch?.[1] || 'A4') as 'A4' | 'A3' | 'Letter' | 'Legal';
  if (styled) {
    return {
      marginTop: `${edgeTop?.[1] || 12}mm`,
      marginBottom: `${edgeBottom?.[1] || 12}mm`,
      marginLeft: '0',
      marginRight: '0',
      format,
      preferCssPageSize: true,
    };
  }
  if (isIndividual) return { margin: '16mm' };
  return undefined;
}
