const INSECURE_DEV_SECRET = 'dev-only-insecure-jwt-secret';
const FORBIDDEN_DEFAULTS = new Set(['your-secret-key', 'secret', 'jwt-secret', INSECURE_DEV_SECRET]);

export function getJwtSecret(): string {
  const secret = (process.env.JWT_SECRET || '').trim();
  const isProduction = process.env.NODE_ENV === 'production';

  if (!secret || FORBIDDEN_DEFAULTS.has(secret)) {
    if (isProduction) {
      throw new Error('JWT_SECRET must be set to a strong unique value in production.');
    }
    console.warn('⚠️  JWT_SECRET is missing or weak. Using a local dev secret. Do not use this in production.');
    return INSECURE_DEV_SECRET;
  }

  return secret;
}
