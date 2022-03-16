import { defineNuxtModule } from '@nuxt/kit';

interface Option {}

export default defineNuxtModule<Option>({
  meta: {
    name: '@nuxtjs/content',
    configKey: 'content',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: {},
  hooks: {},
  async setup(moduleOptions, nuxt) {},
});
