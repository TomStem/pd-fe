export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8');
  return `User-agent: *\nAllow: /\n\nSitemap: ${getSiteConfig(event).url}/sitemap.xml\n`;
});
