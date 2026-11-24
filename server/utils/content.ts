import type { H3Event } from 'h3';
import type { ContentStore } from '#shared/types/content';
import { fetchContentfulStore } from './content/contentful';
import { loadFixtureStore } from './content/fixtures';

export * from './content/queries';

let cache: { key: string; store: ContentStore } | undefined;
let inflight: { key: string; promise: Promise<ContentStore> } | undefined;

/**
 * Returns the full content store: from Contentful when credentials are configured,
 * otherwise from the local fixtures in `content/fixtures`.
 * Every call fetches fresh content; requests that arrive while a fetch is running share it, and the last good store is
 * only used as a fallback when Contentful fails.
 */
export async function getContentStore(event: H3Event): Promise<ContentStore> {
  const { spaceId, environment, deliveryToken, previewToken, usePreview } = useRuntimeConfig(event).contentful;
  const preview = usePreview && Boolean(previewToken);
  const accessToken = preview ? previewToken : deliveryToken;

  if (!spaceId || !accessToken) return loadFixtureStore();

  const key = `${spaceId}/${environment}/${preview}`;

  if (!inflight || inflight.key !== key) {
    const promise = fetchContentfulStore({ spaceId, environment, accessToken, preview }).then((store) => {
      if (!preview) cache = { key, store };
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
