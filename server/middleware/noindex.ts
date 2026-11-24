export default defineEventHandler((event) => {
  if (isNonProduction()) setHeader(event, 'x-robots-tag', 'noindex, nofollow');
});
