import type { H3Event } from 'h3';
import type { ContentStore } from '#shared/types/content';
import { fetchContentfulStore } from './content/contentful';
import { loadFixtureStore } from './content/fixtures';

export * from './content/queries';

const CACHE_TTL_MS = 60_000;
let cache: { key: string; at: number; store: ContentStore } | undefined;

/**
 * Returns the full content store: from Contentful when credentials are configured,
 * otherwise from the local fixtures in `content/fixtures`.
 */
export async function getContentStore(event: H3Event): Promise<ContentStore> {
  const { spaceId, environment, deliveryToken, previewToken, usePreview } = useRuntimeConfig(event).contentful;
  const preview = usePreview && Boolean(previewToken);
  const accessToken = preview ? previewToken : deliveryToken;

  if (!spaceId || !accessToken) return loadFixtureStore();

  const key = `${spaceId}/${environment}/${preview}`;
  if (!preview && cache?.key === key && Date.now() - cache.at < CACHE_TTL_MS) return cache.store;

  try {
    const store = await fetchContentfulStore({ spaceId, environment, accessToken, preview });
    if (!preview) cache = { key, at: Date.now(), store };
    return store;
  }
  catch (error) {
    if (cache?.key === key) return cache.store;
    console.error('Fetching content from Contentful failed', error);
    throw createError({ statusCode: 502, statusMessage: 'Content temporarily unavailable' });
  }
}

export function notFound(what: string): never {
  throw createError({ statusCode: 404, statusMessage: `${what} not found` });
}
