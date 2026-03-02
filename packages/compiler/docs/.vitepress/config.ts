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
            text: '编译示例',
            items: [
              {
                text: '入门',
                items: [
                  { text: '计数器组件', link: '/guide/basic-tutorial' },
                  { text: '模板基础稳态转换', link: '/guide/beginner-template-stable' },
                  { text: '组件通信稳态转换', link: '/guide/beginner-component-communication' },
                ],
              },
              {
                text: '进阶',
                items: [
                  {
                    text: '上下文 + 事件 + 插槽链路',
                    link: '/guide/advanced-context-events-slots',
                  },
                  { text: 'SFC 样式处理链路', link: '/guide/advanced-style-pipeline' },
                  { text: '非 SFC 脚本文件链路', link: '/guide/advanced-script-only-pipeline' },
                ],
              },
              {
                text: '☣️心灵控制',
                items: [
                  { text: '说明', link: '/guide/mind-control-readme' },
                  { text: '可控混写', link: '/guide/mind-control-controlled-mixed' },
                  { text: '彻底暴走', link: '/guide/mind-control-full-ecosystem' },
                ],
              },
            ],
          },
          {
            text: '配置',
            items: [
              { text: 'CLI', link: '/guide/cli' },
              { text: '插件', link: '/guide/plugin' },
            ],
          },
          { text: '常见问题', link: '/guide/faq' },
          {
            text: '规范与最佳实践',
            items: [
              { text: '编译约定', link: '/guide/specification' },
              { text: '最佳实践', link: '/guide/best-practices' },
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
          {
            text: 'API',
            items: [
              { text: '总览', link: '/api/' },
              { text: '配置 API', link: '/api/config' },
              { text: '编译器 API', link: '/api/compiler' },
              { text: '流水线 API', link: '/api/pipeline' },
              { text: '插件系统 API', link: '/api/plugin-system' },
              { text: '类型与结果', link: '/api/types' },
              { text: '导出清单', link: '/api/exports' },
            ],
          },
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
