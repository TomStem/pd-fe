export default defineEventHandler(async event => getDistilleries(await getContentStore(event)));
