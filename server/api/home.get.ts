export default defineEventHandler(async event => getHome(await getContentStore(event)));
