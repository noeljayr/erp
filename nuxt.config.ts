// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      GITHUB_ACCESS_TOKEN: process.env.NUXT_GITHUB_ACCESS_TOKEN,
      ORG_NAME: process.env.NUXT_ORG_NAME,
    },
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    'motion-v/nuxt',
  ],
  css: [
    '@/assets/css/globals.css',
    '@fontsource/inter/300.css',
    '@fontsource/inter/400.css',
    '@fontsource/inter/500.css',
    '@fontsource/inter/600.css',
    '@fontsource/inter/700.css',
    '@fontsource/inter/800.css',
    '@fontsource/sora/300.css',
    '@fontsource/sora/400.css',
    '@fontsource/sora/500.css',
    '@fontsource/sora/600.css',
    '@fontsource/sora/700.css',
    '@fontsource/sora/800.css',
  ],
});
