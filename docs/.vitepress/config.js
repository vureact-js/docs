
export default {
  title: 'vureact',

  description: `A modern automatic compilation tool that quickly converts Vue3 code to React (Jsx/Tsx). It meets the daily business and component engineering needs of small and medium-sized projects, enabling lossless syntax conversion and precise logic migration. Leverage Vue's mental model advantages to write React code—ready to use right after conversion.`,

  head: [
    // ! robots 必须在正式发布项目后移除
    ['meta', { name: 'robots', content: 'noindex, nofollow' }],
    ['link', {
      rel: 'icon',
      href: '/favicon.ico',
      sizes: 'any',
      type: 'image/webp'
    }],
    [
      'style',
      {},
      `
      :root {
        --vp-c-brand-1: #4DD9E0;
        --vp-c-brand-2: #3FB9C1;
        --vp-c-brand-3: #62E0E7;
        --vp-nav-logo-height: 40px;
      }
      `
    ]
  ],

  themeConfig: {
    logo: '/logo.webp',
    footer: {
      message: 'Released under the MIT License',
      copyright: 'Copyright © 2025-present Ryan John',
    },
  },

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
      title: '',
      description: '',
      themeConfig: {
        socialLinks: [
          {
            icon: 'gitee',
            link: 'https://gitee.com/Ryan-Zhong/vureact.git',
          },
          {
            icon: 'github',
            link: 'https://github.com/smirk9581/vureact.git',
          },
        ],

        nav: [
          {
            text: '适配指南',
            items: [
              {
                text: '',
                link: ''
              },
            ]
          },
        ],

        sidebar: [
          { text: '', link: '' },
        ],
      }
    },

    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: '',
      description: '',
    },
  },
};