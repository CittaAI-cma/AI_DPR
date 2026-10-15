// @ts-nocheck
import { User } from '../models/User.model';

/**
 * Whether an account may still use its tokens. A short cache keeps this to about one database read per user
 * every few seconds, and an admin action on this server clears the entry at once, so access ends immediately here and
 * within ACCOUNT_STATUS_TTL_MS (default 10 s, never more than 25 s) on any other server or after a direct database change.
 */
export const STATUS_TTL_MS = Math.min(25_000, Math.max(0, Number(process.env.ACCOUNT_STATUS_TTL_MS) || 10_000));

export type AccountStatus = { active: boolean; validFromMs: number; name: string; role: string; reviewDistrict: string | null };

const cache = new Map<string, { at: number; value: AccountStatus }>();
const GONE: AccountStatus = { active: false, validFromMs: 0, name: '', role: '', reviewDistrict: null };

export async function getAccountStatus(userId: string): Promise<AccountStatus> {
  const hit = cache.get(userId);
  if (hit && Date.now() - hit.at < STATUS_TTL_MS) return hit.value;
  let value = GONE;
  try {
    const user: any = await User.findById(userId).select('isActive sessionsValidFrom name role reviewDistrict').lean();
    if (user) {
      value = {
        active: user.isActive !== false,
        validFromMs: user.sessionsValidFrom ? new Date(user.sessionsValidFrom).getTime() : 0,
        name: user.name || '',
        role: user.role || '',
        reviewDistrict: user.reviewDistrict || null,
      };
    }
  } catch {
    // An unreadable id or a database hiccup must not let a request through on a stale "active".
    value = GONE;
  }
  cache.set(userId, { at: Date.now(), value });
  if (cache.size > 5000) cache.clear();
  return value;
}

export function invalidateAccount(userId: string): void {
  cache.delete(String(userId));
}

export function clearAccountCache(): void {
  cache.clear();
}
