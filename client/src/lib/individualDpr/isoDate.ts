/** YYYY-MM-DD that is a real calendar day between 1990 and 2100. */
export function isReasonableIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return false;
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  if (`${year}-${month}-${day}` !== value) return false;
  return year >= 1990 && year <= 2100;
}
