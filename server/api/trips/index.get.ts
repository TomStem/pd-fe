export default defineEventHandler(async event => getTrips(await getContentStore(event)));
