/** Vercel sets VERCEL_ENV to `production`, `preview` or `development`; outside Vercel (local, other hosts) only NODE_ENV tells. */
export function isNonProduction(): boolean {
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv) return vercelEnv !== 'production';
  return process.env.NODE_ENV !== 'production';
}
