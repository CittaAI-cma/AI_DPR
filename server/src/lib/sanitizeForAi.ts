const SENSITIVE_KEY =
  /^(aadhaa?r.*|.*aadhaa?r.*|pan|panNumber|panCard|pancard|passbook.*|.*passbook.*|upi.*|.*upiQr.*|kyc.*|.*kyc.*|ration.*|voterId|passport.*|ifsc.*|accountNumber|bankAccount|documentUrl|fileUrl|scanUrl|idProof|photoId|cloudinary.*)$/i;

const AADHAAR_RE = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;
const PAN_RE = /\b[A-Z]{5}\d{4}[A-Z]\b/g;
const FILE_URL_RE =
  /https?:\/\/[^\s"'<>]*(cloudinary|res\.cloudinary|\/uploads\/)[^\s"'<>]*/gi;

function redactString(value: string): string {
  return value
    .replace(AADHAAR_RE, '[ID_REDACTED]')
    .replace(PAN_RE, '[PAN_REDACTED]')
    .replace(FILE_URL_RE, '[FILE_URL_REDACTED]');
}

function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEY.test(key);
}

export function sanitizeForAi<T>(value: T, seen: WeakSet<object> = new WeakSet()): T {
  if (value == null) return value;
  if (typeof value === 'string') return redactString(value) as T;
  if (typeof value !== 'object') return value;
  if (seen.has(value as object)) return undefined as T;
  seen.add(value as object);

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForAi(item, seen)) as T;
  }

  const out: Record<string, unknown> = {};
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    if (isSensitiveKey(key)) continue;
    out[key] = sanitizeForAi(nested, seen);
  }
  return out as T;
}
