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

  // Pages that show Contentful content are rendered on every request and nothing is cached, so a published change shows
  // up on the next refresh. About and Contact have no Contentful content and are prerendered (see nitro.prerender).
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
    format: ['webp'],
    quality: 75,
  },

  sitemap: { sources: ['/api/sitemap-urls'] },
});
