import { defineConfig } from 'vitepress';
import commonConfig from '../../../../config';

export default defineConfig({
  ...commonConfig,

  title: 'VuReact',

  description:
    'Experimental Vue 3 to React compiler for new projects and controlled progressive migration.',

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
      description:
        '实验版 Vue 3 到 React 编译器。优先服务新项目与可控的渐进式迁移，不承诺全量旧项目无改动迁移。',
      themeConfig: {
        socialLinks: [
          {
            icon: 'gitee',
            link: 'https://gitee.com/vureact-js/core.git',
          },
          {
            icon: 'github',
            link: 'https://github.com/vureact-js/core.git',
          },
        ],
        nav: [
          {
            text: '赞助',
            link: 'https://afdian.com/a/vureact-js/plan',
          },
          {
            text: '生态系统',
            items: [
              {
                text: '官方库',
                items: [
                  { text: 'VuReact Runtime', link: 'https://vureact-runtime.vercel.app' },
                  { text: 'VuReact Router', link: 'https://router-vureact.vercel.app' },
                ],
              },
            ],
          },
        ],
        sidebar: [
          {
            text: '介绍',
            items: [
              { text: '开始', link: '/guide/introduction' },
              { text: '理念', link: '/guide/philosophy' },
              { text: '为什么选 VuReact', link: '/guide/why' },
              { text: '更新日志', link: '/guide/release-notes' },
            ],
          },
          {
            text: '入门',
            items: [
              {
                text: '转换示例',
                items: [
                  { text: '计数器组件', link: '/guide/basic-tutorial' },
                  { text: '子组件通信与插槽', link: '/guide/child-component-tutorial' },
                  { text: '计数器 & 子组件通信', link: '/guide/counter-child-tutorial' },
                ],
              },
              { text: '常见问题', link: '/guide/faq' },
            ],
          },
          {
            text: '配置与使用',
            items: [
              { text: 'CLI 与配置', link: '/guide/cli-and-config' },
              { text: '使用插件', link: '/guide/plugin' },
            ],
          },
          {
            text: '规范与最佳实践',
            items: [
              { text: '编译约定', link: '/guide/specification' },
              { text: '最佳实践', link: '/guide/best-practices' },
              { text: '混合编写（激进）', link: '/guide/mixed-writing' },
              { text: '路由适配', link: '/guide/router-adaptation' },
            ],
          },
          {
            text: '能力矩阵',
            items: [
              { text: '总览', link: '/guide/capabilities-overview' },
              { text: '模板能力', link: '/guide/capabilities-template' },
              { text: '脚本能力', link: '/guide/capabilities-script' },
              { text: '样式能力', link: '/guide/capabilities-style' },
            ],
          },
          {
            text: '转换指南',
            items: [
              { text: '总览', link: '/guide/conversion-overview' },
              { text: '模板指南', link: '/guide/conversion-template' },
              { text: '脚本指南', link: '/guide/conversion-script' },
              { text: '样式指南', link: '/guide/conversion-style' },
            ],
          },
          { text: 'API 参考', items: [] },
        ],
      },
    },

    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      description:
        'Experimental Vue-to-React compiler focused on new projects and controlled progressive migration.',
      themeConfig: {
        socialLinks: [
          {
            icon: 'github',
            link: 'https://github.com/vureact-js/core.git',
          },
          {
            icon: 'gitee',
            link: 'https://gitee.com/vureact-js/core.git',
          },
        ],
      },
    },
  },
});
