import path from 'path';
import chalk from 'chalk';
import { defineNuxtModule, createResolver, addComponentsDir } from '@nuxt/kit';
import { WebSocketServer } from 'ws';
import MdTransform from './markdown/mdTranform';

interface Option {
  /** Directory used for writing content. */
  dir: string;
  /**
   * You can change maximum heading depth to include in the table of contents
   * @default 3
   */
  tocDepth: number;
  /**
   * You can change maximum depth to include in the sidebar
   * @default 2
   */
  sidebarDepth: number;
}

export default defineNuxtModule<Option>({
  meta: {
    name: '@nuxtjs/content',
    configKey: 'content',
    compatibility: {
      nuxt: '^3.0.0-rc.9',
    },
  },
  defaults: {
    dir: 'docs',
    tocDepth: 3,
    sidebarDepth: 2,
  },
  async setup(moduleOptions, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    // Register components
    await addComponentsDir({
      path: resolve('./components'),
      pathPrefix: false,
      prefix: '',
      level: 999,
      global: true,
    });

    await addComponentsDir({
      path: resolve('../../sandpack-demos'),
      pathPrefix: false,
      prefix: '',
      level: 999,
      global: true,
    });

    const docsDirName = moduleOptions.dir;
    const rootDir = nuxt.options.rootDir;
    const docsPath = path.join(rootDir, docsDirName);
    const md = new MdTransform({
      rootDir,
      docsPath,
      docsDirName,
      sidebarDepth: moduleOptions.sidebarDepth,
      tocDepth: moduleOptions.tocDepth,
    });

    try {
      md.init();
    } catch (error) {
      if (error) {
        console.log(chalk.red(error));
      }
    }

    nuxt.hook('builder:watch', (event, path) => {
      if (path && path.startsWith(docsDirName)) {
        md.onFileChange(event, path.split(docsDirName)[1]);
      }
    });

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line import/no-named-as-default-member
      const wss = new WebSocketServer({ port: 8080 });

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
