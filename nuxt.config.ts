// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
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
  modules: [
    '@vueuse/nuxt',
    'nuxt-windicss',
    '@unocss/nuxt',
    '@nuxtjs/eslint-module', // https://juejin.cn/post/7043762203740094477
    [
      './modules/content',
      {
        dir: 'docs',
        tocDepth: 3,
        sidebarDepth: 3,
      },
    ],
  ],
  css: ['~/assets/main.css', '~/assets/post.css'],
});
