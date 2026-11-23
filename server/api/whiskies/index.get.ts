export default defineEventHandler(async event => getWhiskies(await getContentStore(event)));
