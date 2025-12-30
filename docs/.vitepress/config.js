
export default {
  title: 'VuReact',

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
      copyright: 'Copyright © 2025-present Owen Dells',
    },
  },

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
      title: 'React Vue3 Hooks',
      description: '跨框架组件封装工具',
      themeConfig: {
        socialLinks: [
          {
            icon: 'github',
            link: 'https://github.com/smirk9581/vureact',
          },
          {
            icon: 'gitee',
            link: 'https://gitee.com/Ryan-Zhong/vureact',
          },
        ],

        nav: [
          {
            text: '适配指南',
            items: [
              {
                text: 'react vue3 components',
                link: 'https://react-vue3-components.vercel.app/guide/introduction.html'
              },
              {
                text: 'react vue3 router',
                link: 'https://react-vue3-components.vercel.app/router/guide.html'
              },
              {
                text: 'react vue3 hooks',
                link: 'https://react-vue3-hooks.vercel.app/guide/introduction.html'
              },
            ]
          },
        ],

        sidebar: [
          { text: '介绍', link: '/guide/introduction' },
          { text: '安装', link: '/guide/install' },
          { text: '编译器', items: [] },
          {
            text: '运行时集合',
            items: [
              { text: '入门', link: '/runtime/introduction' },
              { text: '组件', items: [] },
              {
                text: '工具方法', items: [
                  { text: 'vBind', link: '/runtime/utils/vBind' },
                  { text: 'vModel', link: '/runtime/utils/vModel' },
                  { text: 'vOn', link: '/runtime/utils/vOn' },
                  { text: 'vShow', link: '/runtime/utils/vShow' },
                ]
              },
            ]
          },
        ],
      }
    },

    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'React Vue3 Hooks',
      description: 'A modern automatic compilation tool...',

      themeConfig: {
        socialLinks: [
          {
            icon: 'github',
            link: 'https://github.com/smirk9581/vureact',
          },
        ],

        nav: [
          {
            text: 'Guides',
            items: [
              {
                text: 'react vue3 components',
                link: 'https://react-vue3-components.vercel.app/en/guide/introduction.html'
              },
              {
                text: 'react vue3 router',
                link: 'https://react-vue3-components.vercel.app/en/router/guide.html'
              },
              {
                text: 'react vue3 hooks',
                link: 'https://react-vue3-hooks.vercel.app/en/guide/introduction.html'
              },
            ]
          },
        ],

        sidebar: [
          { text: 'Introduction', link: '/en/guide/introduction' },
          { text: 'Install', link: '/en/guide/install' },
          { text: 'Tutorial Instructions', link: '/guide/tutorial-instructions' },
          {
            text: 'Hooks',
            items: [
              { text: '', link: '' },
            ]
          },
        ],
      }
    },
  },
};