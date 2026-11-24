export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8');
  if (isNonProduction()) {
    setHeader(event, 'x-robots-tag', 'noindex, nofollow');
    return 'User-agent: *\nDisallow: /\n';
  }
  return `User-agent: *\nAllow: /\n\nSitemap: ${getSiteConfig(event).url}/sitemap.xml\n`;
});
