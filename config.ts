import { defineConfig } from 'vitepress';

const commonConfig = defineConfig({
  appearance: 'dark',

  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.ico',
        type: 'image/x-icon',
      },
    ],
  ],

  themeConfig: {
    logo: '/logo.png',
    footer: {
      message: 'Released under the MIT License',
      copyright: 'Copyright © 2025-present Ryan John',
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索文档' },
            },
          },
          en: {
            translations: {
              button: { buttonText: 'Search' },
            },
          },
        },
      },
    },
  },
});

export default commonConfig;
