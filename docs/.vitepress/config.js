
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
          {
            text: '编译器',
            items: [
              {
                text: '介绍',
                link: ''
              },
              {
                text: '安装',
                link: ''
              },
              {
                text: '开始使用',
                link: ''
              },
              {
                text: '重点实现原理',
                items: [
                  {
                    text: 'AST中间层映射',
                    link: ''
                  },
                  {
                    text: '模板处理',
                    items: [
                      {
                        text: 'v-if',
                        link: ''
                      },
                      {
                        text: 'v-for',
                        link: ''
                      },
                      {
                        text: 'v-model',
                        link: ''
                      },
                      {
                        text: 'v-slot',
                        link: ''
                      },
                      {
                        text: 'v-bind',
                        link: ''
                      },
                      {
                        text: 'HTML属性',
                        link: ''
                      },
                    ]
                  },
                  {
                    text: '脚本处理',
                    items: [
                      {
                        text: '依赖分析',
                        link: ''
                      },
                      {
                        text: '剥离.value后缀',
                        link: ''
                      },
                      {
                        text: '收集props与emits',
                        link: ''
                      },
                      {
                        text: '响应式值的更新语法替换',
                        link: ''
                      },
                      {
                        text: 'watchEffect 清理函数',
                        link: ''
                      },
                      {
                        text: '优化顶层常量与函数',
                        link: ''
                      },
                    ]
                  },
                ]
              },
            ]
          },

          {
            text: '运行时适配包',
            items: [
              {
                text: '介绍与安装',
                link: ''
              },
              {
                text: '组件',
                items: [
                  {
                    text: '',
                    link: ''
                  },
                ]
              },
              {
                text: '钩子',
                items: [
                  {
                    text: '',
                    link: ''
                  },
                ]
              },
              {
                text: '路由器',
                items: [
                  {
                    text: '',
                    link: ''
                  },
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
      title: '',
      description: '',
    },
  },
};