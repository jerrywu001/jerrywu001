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
        indexName: 'front-end-blog',
        appId: 'AQK1O7WBIN',
        apiKey: '5ebc33c7967641c311f2d4b92704ec24'
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/jerrywu001/jerrywu001' },
      ],

      nav: [
        {
          text: 'React',
          items: [
            {
              items: [
                { text: 'About React', link: '/react/about-react' },
              ],
            },
          ],
        },
        {
          text: 'Vue3',
          link: '/vue3/application',
        },
        {
          text: 'code style',
          link: '/code-styles/Airbnb-JavaScript-Style-Guide',
        },
      ],

      sidebar: {
        '/react/': [
          {
            text: 'React',
            items: [
              { text: 'About React', link: '/react/about-react' },
            ],
          },
        ],
        '/vue3/': [
          {
            text: 'Vue3',
            items: [
              { text: 'Application', link: '/vue3/application' },
            ],
          },
        ],
        '/code-styles/': [
          {
            text: 'Code Style',
            items: [
              { text: 'Airbnb-JavaScript-Style-Guide', link: '/code-styles/Airbnb-JavaScript-Style-Guide' },
              { text: 'css-style-guide', link: '/code-styles/css-style-guide' },
              { text: 'es-next-style-guide', link: '/code-styles/es-next-style-guide' },
              { text: 'html-style-guide', link: '/code-styles/html-style-guide' },
              { text: 'less-code-style', link: '/code-styles/less-code-style' },
              { text: 'vue-style-guide', link: '/code-styles/vue-style-guide' },
            ],
          },
        ],
      },
    },
  };
})();
