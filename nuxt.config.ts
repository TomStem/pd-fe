import tailwindcss from '@tailwindcss/vite';

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://pourdecisions.nl';
const staticExport = process.env.STATIC_EXPORT === 'true';

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxt/image', '@nuxtjs/sitemap'],
  devtools: { enabled: false },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [{ name: 'theme-color', content: '#14110F' }],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  css: ['~/assets/css/main.css'],

  site: { url: siteUrl, name: 'Pour Decisions', defaultLocale: 'en' },

  runtimeConfig: {
    contentful: {
      spaceId: process.env.CONTENTFUL_SPACE_ID || '',
      environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
      deliveryToken: process.env.CONTENTFUL_DELIVERY_TOKEN || '',
      previewToken: process.env.CONTENTFUL_PREVIEW_TOKEN || '',
      usePreview: process.env.CONTENTFUL_USE_PREVIEW === 'true',
    },
  },

  // Pages that show Contentful content are rendered on every request (no ISR/SWR) so published changes show up on the next
  // refresh; the short in-memory content cache in server/utils/content.ts is the only delay. About and Contact are static.
  routeRules: {
    '/about': { prerender: true },
    '/contact': { prerender: true },
    '/api/**': { headers: { 'cache-control': 'no-store' } },
    '/proeverijen/**': { redirect: { to: '/tastings/**', statusCode: 301 } },
    '/reizen/**': { redirect: { to: '/trips/**', statusCode: 301 } },
    '/landen/**': { redirect: { to: '/countries/**', statusCode: 301 } },
    '/whiskys/**': { redirect: { to: '/whiskies/**', statusCode: 301 } },
    '/over-ons': { redirect: { to: '/about', statusCode: 301 } },
  },
  compatibilityDate: '2026-11-01',

  nitro: {
    prerender: {
      routes: staticExport
        ? ['/', '/countries', '/about', '/contact']
        : ['/about', '/contact'],
      crawlLinks: staticExport,
      failOnError: true,
    },
  },
  vite: { plugins: [tailwindcss()] },

  eslint: {
    config: {
      stylistic: {
        semi: true,
        quotes: 'single',
        commaDangle: 'always-multiline',
      },
    },
  },

  fonts: {
    families: [
      {
        name: 'Fraunces',
        provider: 'google',
        weights: [500, 700],
        styles: ['normal', 'italic'],
      },
      { name: 'Inter', provider: 'google', weights: [400, 500, 600] },
    ],
  },

  image: {
    domains: ['images.ctfassets.net'],
  },

  sitemap: { sources: ['/api/sitemap-urls'] },
});
