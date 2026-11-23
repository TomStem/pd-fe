export default defineEventHandler(async event => getTastings(await getContentStore(event)));
