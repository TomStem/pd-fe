import { afterEach, describe, expect, it, vi } from 'vitest';
import { isNonProduction } from '../server/utils/environment';

describe('isNonProduction', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('is false on Vercel production', () => {
    vi.stubEnv('VERCEL_ENV', 'production');
    vi.stubEnv('NODE_ENV', 'production');
    expect(isNonProduction()).toBe(false);
  });

  it('is true on Vercel preview, even in a production build', () => {
    vi.stubEnv('VERCEL_ENV', 'preview');
    vi.stubEnv('NODE_ENV', 'production');
    expect(isNonProduction()).toBe(true);
  });

  it('falls back to NODE_ENV outside Vercel', () => {
    vi.stubEnv('VERCEL_ENV', '');
    vi.stubEnv('NODE_ENV', 'production');
    expect(isNonProduction()).toBe(false);
    vi.stubEnv('NODE_ENV', 'development');
    expect(isNonProduction()).toBe(true);
  });
});
