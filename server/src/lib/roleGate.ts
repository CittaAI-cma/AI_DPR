/** Same allow / deny split the route guard uses. */
export function roleAllowed(role: string | undefined, allowed: string[]): 'ok' | 'unauthenticated' | 'forbidden' {
  if (!role) return 'unauthenticated';
  if (!allowed.includes(role)) return 'forbidden';
  return 'ok';
}
