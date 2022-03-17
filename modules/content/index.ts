import path from 'path';
import chalk from 'chalk';
import { defineNuxtModule } from '@nuxt/kit';
import MdTransform from './markdown/mdTranform';

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
  setup(moduleOptions, nuxt) {
    const rootDir = nuxt.options.rootDir;
    const docsDir = path.join(rootDir, 'docs');
    const md = new MdTransform({
      rootDir,
      docsDir,
    });

    nuxt.hook('close', () => md.close());

    try {
      md.init();
    } catch (error) {
      if (error) {
        console.log(chalk.red(error));
      }
    }
  },
});
