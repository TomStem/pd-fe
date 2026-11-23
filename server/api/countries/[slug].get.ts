export default defineEventHandler(async (event) => {
  const detail = getCountryDetail(await getContentStore(event), getRouterParam(event, 'slug') ?? '');
  return detail ?? notFound('Country');
});
