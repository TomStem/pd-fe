export default defineEventHandler(async (event) => {
  return getWhiskyDetail(await getContentStore(event), getRouterParam(event, 'slug') ?? '') ?? notFound('Whisky');
});
