const getBase = require('../src/vitepress/config/baseConfig')

module.exports = (async () => {
  const base = await getBase()

  return {
    ...base,
    lang: 'en-US',
    title: 'front-end-blog',
    description: 'front end blog',

    themeConfig: {
      algolia: {
        indexName: 'vuejs-v3',
        appId: 'BH4D9OD16A',
        apiKey: 'bc6e8acb44ed4179c30d0a45d6140d3f'
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/jerrywu001/jerrywu001' },
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
