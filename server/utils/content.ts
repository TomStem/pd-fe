import type { H3Event } from 'h3';
import type { ContentStore } from '#shared/types/content';
import { fetchContentfulStore } from './content/contentful';
import { loadFixtureStore } from './content/fixtures';

export * from './content/queries';

const CACHE_TTL_MS = 10_000;
let cache: { key: string; at: number; store: ContentStore } | undefined;
let inflight: { key: string; promise: Promise<ContentStore> } | undefined;

/**
 * Returns the full content store: from Contentful when credentials are configured,
 * otherwise from the local fixtures in `content/fixtures`.
 * The store is kept in memory for a few seconds per server instance; concurrent requests share one fetch.
 */
export async function getContentStore(event: H3Event): Promise<ContentStore> {
  const { spaceId, environment, deliveryToken, previewToken, usePreview } = useRuntimeConfig(event).contentful;
  const preview = usePreview && Boolean(previewToken);
  const accessToken = preview ? previewToken : deliveryToken;

  if (!spaceId || !accessToken) return loadFixtureStore();

  const key = `${spaceId}/${environment}/${preview}`;
  if (!preview && cache?.key === key && Date.now() - cache.at < CACHE_TTL_MS) return cache.store;

  if (!inflight || inflight.key !== key) {
    const promise = fetchContentfulStore({ spaceId, environment, accessToken, preview }).then((store) => {
      if (!preview) cache = { key, at: Date.now(), store };
      return store;
    });
    inflight = { key, promise };
    promise.then(clearInflight, clearInflight);
  }

  try {
    return await inflight.promise;
  }
  catch (error) {
    if (cache?.key === key) return cache.store;
    console.error('Fetching content from Contentful failed', error);
    throw createError({ statusCode: 502, statusMessage: 'Content temporarily unavailable' });
  }
}

function clearInflight() {
  inflight = undefined;
}

export function notFound(what: string): never {
  throw createError({ statusCode: 404, statusMessage: `${what} not found` });
}
