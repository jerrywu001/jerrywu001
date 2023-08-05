import fs from 'fs';

// https://nuxt.com/docs/getting-started/configuration
export default defineNuxtConfig({
  // https://github.com/nuxt/framework/issues/1600
  // node_modules/@nuxt/schema/dist/index.d.ts 2239
  vite: {
    server: {
      hmr: {
        overlay: false,
      },
    },
    define: {
      'process.env.LOG': {},
    },
  },

  runtimeConfig: {
    public: {
      dev: process.env.NODE_ENV !== 'production',
      host: process.env.HOST,
      port: process.env.PORT,
      supbaseProject: process.env.NUXT_SUPABASE_PROJECT,
      supabaseKey: process.env.NUXT_SUPABASE_CLIENT_KEY,
    },
  },

  modules: [
    '@vueuse/nuxt',
    '@nuxt/devtools',
    'nuxt-windicss',
    '@unocss/nuxt',
    '@nuxtjs/eslint-module', // https://juejin.cn/post/7043762203740094477
    // [
    //   './modules/content',
    //   {
    //     dir: 'docs',
    //     tocDepth: 3,
    //     sidebarDepth: 3,
    //   },
    // ],
  ],

  css: ['~/assets/main.css', '~/assets/post.css'],

  devtools: {
    timeline: {
      enabled: true,
    },
  },
});
