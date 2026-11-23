export default defineEventHandler(async (event) => {
  return getDistilleryDetail(await getContentStore(event), getRouterParam(event, 'slug') ?? '') ?? notFound('Distillery');
});
