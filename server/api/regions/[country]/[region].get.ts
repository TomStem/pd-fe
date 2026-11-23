export default defineEventHandler(async (event) => {
  const { country = '', region = '' } = getRouterParams(event);
  return getRegionDetail(await getContentStore(event), country, region) ?? notFound('Region');
});
