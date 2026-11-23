export default defineEventHandler(async event => getCountries(await getContentStore(event)));
