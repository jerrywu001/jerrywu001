import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  // Doing something with nuxtApp
  if (process.server) {
    // console.log(nuxtApp.ssrContext.url);
  }
});
