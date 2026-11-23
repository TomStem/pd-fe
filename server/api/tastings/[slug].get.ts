export default defineEventHandler(async (event) => {
  const tasting = getTasting(await getContentStore(event), getRouterParam(event, 'slug') ?? '');
  return tasting ? { tasting } : notFound('Tasting');
});
