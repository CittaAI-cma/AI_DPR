/** Scheme-default style checks used by the scheme-style API. */

export const SCHEME_CODE = /^[A-Z0-9_-]{2,40}$/;

export function canSaveSchemeDefault(role?: string | null): boolean {
  return role === 'super_admin' || role === 'admin';
}

export function cleanDocumentStyle(input: unknown): Record<string, unknown> | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  let json = '';
  try {
    json = JSON.stringify(input);
  } catch {
    return null;
  }
  if (json.length > 1_500_000) return null;
  return JSON.parse(json);
}
