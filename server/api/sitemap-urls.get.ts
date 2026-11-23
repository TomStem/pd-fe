export default defineEventHandler(async event => getSitemapPaths(await getContentStore(event)).map(loc => ({ loc })));
