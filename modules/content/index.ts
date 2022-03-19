import path from 'path';
import chalk from 'chalk';
import { defineNuxtModule } from '@nuxt/kit';
import Websocket from 'ws';
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

    try {
      md.init();
    } catch (error) {
      if (error) {
        console.log(chalk.red(error));
      }
    }

    nuxt.hook('builder:watch', (event, path) => {
      if (path && path.startsWith('docs')) {
        md.onFileChange(event, path.split('docs')[1]);
      }
    });

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line import/no-named-as-default-member
      const wss = new Websocket.Server({ port: 8080 });

      wss.on('open', function open() {
        console.info('websocket connected');
      });

      wss.on('close', function close() {
        console.info('websocket disconnected');
      });

      // Publish event and data to all connected clients
      md.hook('file:transformed', (event, path) => {
        for (const client of wss.clients) {
          try {
            client.send(path.replace(/\\/g, '/'));
          } catch (err) {
            // Ignore error (if client not ready to receive event)
          }
        }
      });

      nuxt.hook('close', () => wss.close());
    }
  },
});
