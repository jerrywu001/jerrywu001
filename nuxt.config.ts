// https://nuxt.com/docs/getting-started/configuration
export default defineNuxtConfig({
  // https://github.com/nuxt/framework/issues/1600
  // node_modules/@nuxt/schema/dist/index.d.ts 2239
  vite: {
    server: { hmr: { overlay: false } },
    define: { 'process.env.LOG': {} },
  },
  routeRules: { '/api/bilibili/**': { cors: true } },
  components: {
    global: true,
    dirs: [
      '~/components',
      '~/md-components',
      '~/sandpack-demos',
    ],
  },
  runtimeConfig: {
    imageKitPublickey: process.env.IMAGEKIT_PUBLIC,
    imageKitPrivatekey: process.env.IMAGEKIT_SECRET,
    imageKitUrlEndpoint: 'https://ik.imagekit.io/jerrywu001',
    public: {
      https: process.env.HTTPS === 'true' || false,
      host: process.env.HOST || 'localhost',
      dev: process.env.NODE_ENV !== 'production',
      baseUrl: process.env.BASE_URL,
    },
  },
  // https://supabase.nuxtjs.org/
  supabase: {
    url: `https://${process.env.NUXT_SUPABASE_PROJECT}.supabase.co`,
    key: process.env.NUXT_SUPABASE_CLIENT_KEY,
    serviceKey: process.env.NUXT_SUPABASE_SERVER_KEY,
    redirectOptions: {
      login: '/login',
      callback: '/login',
      exclude: ['/*'],
    },
    clientOptions: { auth: { persistSession: true } },
  },
  modules: [
    // '@sentry/nuxt/module',
    '@vueuse/nuxt',
    '@nuxt/devtools',
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode', // https://color-mode.nuxtjs.org/
  ],
  sourcemap: { client: true },
  // sentry: {
  //   sourceMapsUploadOptions: {
  //     org: 'personal-qt1',
  //     project: 'jerrywu-blog',
  //     authToken: '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',
  //   },
  // },
  colorMode: { classSuffix: '' },
  devtools: { timeline: { enabled: true } },
  compatibilityDate: '2024-10-29',
});
