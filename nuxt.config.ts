export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      contentfulSpaceId: process.env.CTF_SPACE_ID,
      contentfulAccessToken: process.env.CTF_CDA_ACCESS_TOKEN,
    },
  },
  modules: ["@nuxtjs/tailwindcss", "nuxt-maplibre"],
  css: ["@/assets/css/main.css"], // for Tailwind global styles
});
