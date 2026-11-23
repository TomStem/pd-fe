export default defineEventHandler(async (event) => {
  const trip = getTrip(await getContentStore(event), getRouterParam(event, 'slug') ?? '');
  return trip ? { trip } : notFound('Trip');
});
