const getBase = require('../../src/vitepress/config/baseConfig')
const path = require('path')

module.exports = (async () => {
  const base = await getBase()
  return {
    ...base,

    vite: {
      ...base.vite,
      build: {
        minify: false
      },
      resolve: {
        alias: {
          '@vue/theme': path.join(__dirname, '../../src')
        }
      }
    },

    lang: 'en-US',
    title: 'front-end-blog',
    description: 'front end blog',

    themeConfig: {
      logo: '/img/logo-vue.svg',

      algolia: {
        indexName: 'vuejs-v3',
        appId: 'BH4D9OD16A',
        apiKey: 'bc6e8acb44ed4179c30d0a45d6140d3f'
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/vuejs/vue' },
      ],

      nav: [
        {
          text: 'React',
          activeMatch: `^/(guide|examples)/`,
          items: [
            {
              items: [
                { text: 'Guide', link: '/guide/introduction' },
                { text: 'Installtion', link: '/guide/installation' },
              ],
            },
          ],
        },
        {
          text: 'Vue3',
          activeMatch: `^/api/`,
          link: '/api/',
        },
      ],

      sidebar: {
        '/guide/': [
          {
            text: 'Essentials',
            items: [
              { text: 'Introduction', link: '/guide/introduction' },
              { text: 'Installation', link: '/guide/installation' },
            ],
          },
        ],
        '/api/': [
          {
            text: 'Global API',
            items: [
              { text: 'Application', link: '/api/application' },
            ],
          },
        ],
      },
    },
  };
})();
