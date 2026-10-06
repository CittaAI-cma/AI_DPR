/** A stored answer the user actually gave. Blank, a dash, and a bare zero are not answers. */
export function isEnteredDocText(value: unknown): boolean {
  const text = String(value ?? '').trim();
  return text !== '' && text !== '—' && text !== '0';
}

/** True when any cell the user can fill has an answer. skipIndexes are labels such as "Year". */
export function isEnteredDocRow(cells: unknown[], skipIndexes: number[] = []): boolean {
  return cells.some((cell, index) => !skipIndexes.includes(index) && isEnteredDocText(cell));
}
