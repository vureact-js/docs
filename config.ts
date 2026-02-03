import { defineConfig } from 'vitepress';

const commonConfig = defineConfig({
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.ico',
        type: 'image/x-icon',
      },
    ],
    [
      'style',
      {},
      `
      :root {
        --vp-c-brand-1: #4DD9E0;
        --vp-c-brand-2: #3FB9C1;
        --vp-c-brand-3: #62E0E7;
      }
      `,
    ],
  ],

  themeConfig: {
    logo: '/logo.webp',
    footer: {
      message: 'Released under the MIT License',
      copyright: 'Copyright © 2025-present Ryan John',
    },
  },
});

export default commonConfig;
