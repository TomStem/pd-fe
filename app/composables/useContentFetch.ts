/** Fetches content from the Nitro API and turns a failed request (e.g. unknown slug) into a proper error page. */
export async function useContentFetch<T>(url: string) {
  const { data, error } = await useFetch<T>(url);
  if (error.value || !data.value) {
    throw createError({
      statusCode: error.value?.statusCode ?? 404,
      statusMessage: error.value?.statusMessage ?? 'Page not found',
      fatal: true,
    });
  }
  return data as Ref<T>;
}
