import { defineConfig } from 'vitepress';
import commonConfig from '../../../../config';

export default defineConfig({
  ...commonConfig,

  title: 'VuReact',

  description: 'Write in Vue 3, compile to React 18+ code.',

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
      description: '一个让你用 Vue 3 语法编写 React 18+ 应用的编译器。',
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
          {
            icon: {
              svg: '<svg t="1776145003696" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6924" width="200" height="200"><path d="M512 0c282.784 0 512 229.216 512 512s-229.216 512-512 512S0 794.784 0 512 229.216 0 512 0z m189.952 752l11.2-108.224c-31.904 9.536-100.928 16.128-147.712 16.128-134.464 0-205.728-47.296-195.328-146.304 11.584-110.688 113.152-145.696 232.64-145.696 54.784 0 122.432 8.8 151.296 18.336L768 272.704C724.544 262.24 678.272 256 599.584 256c-203.2 0-388.704 94.88-406.4 263.488C178.336 660.96 303.584 768 535.616 768c80.672 0 138.464-6.432 166.336-16z" p-id="6925"></path></svg>',
            },
            link: 'https://blog.csdn.net/weixin_46921149?spm=1011.2415.3001.10640',
          },
        ],
        nav: [
          {
            text: '联系',
            link: '/guide/contact',
          },
          {
            text: '赞助',
            link: '/guide/sponsor',
          },
          {
            text: '在线案例',
            items: [
              {
                text: '客户关系管理后台（标准）',
                link: 'https://codesandbox.io/p/github/vureact-js/example-crm-admin-backend/master',
              },
              {
                text: '客户支持协同后台（混写）',
                link: 'https://codesandbox.io/p/github/vureact-js/example-customer-support-hub/master?import=true',
              },
            ],
          },
          {
            text: '指南',
            items: [
              { text: '介绍', link: '/guide/introduction' },
              { text: '更新日志', link: '/guide/changelog' },
              { text: '教程与实战', link: '/guide/basic-tutorial' },
              { text: '配置', link: '/guide/cli' },
              { text: '常见问题', link: '/guide/faq' },
              { text: '规范与最佳实践', link: '/guide/specification' },
              { text: '能力矩阵', link: '/guide/capabilities-overview' },
              { text: '转换指南', link: '/guide/conversion-overview' },
              { text: 'API', link: '/api/' },
            ],
          },
          {
            text: '生态系统',
            items: [
              {
                text: '官方库',
                items: [
                  { text: 'VuReact Runtime 1.x', link: 'https://runtime.vureact.top' },
                  { text: 'VuReact Router 2.x', link: 'https://router.vureact.top' },
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
              { text: '什么是语义感知', link: '/guide/what-is-semantic-aware' },
              { text: '为什么选 VuReact', link: '/guide/why' },
              { text: '更新日志', link: '/guide/changelog' },
            ],
          },
          {
            text: '教程与实战',
            items: [
              {
                text: '基础教程',
                items: [
                  { text: '计数器组件', link: '/guide/basic-tutorial' },
                  { text: '模板基础', link: '/guide/beginner-template-stable' },
                  { text: '组件通信', link: '/guide/beginner-component-communication' },
                  { text: '组件引用', link: '/guide/beginner-component-references' },
                  { text: 'SFC高级特性', link: '/guide/advanced-context-events-slots' },
                  { text: '组件内样式', link: '/guide/advanced-style-pipeline' },
                  { text: '脚本文件处理', link: '/guide/advanced-script-only-pipeline' },
                  { text: '样式文件处理', link: '/guide/advanced-style-only-pipeline' },
                ],
              },
              {
                text: '项目实战',
                items: [
                  { text: '客户关系管理后台（标准）', link: '/guide/crm-admin-backend' },
                  {
                    text: '客户支持协同后台（混写）',
                    link: '/guide/customer-support-hub',
                  },
                ],
              },
              {
                text: '心灵控制',
                items: [
                  { text: '说明', link: '/guide/mind-control-readme' },
                  { text: '可控混写', link: '/guide/mind-control-controlled-mixed' },
                  { text: '全生态释放', link: '/guide/mind-control-full-ecosystem' },
                ],
              },
            ],
          },
          {
            text: '配置',
            items: [
              { text: 'CLI', link: '/guide/cli' },
              { text: '插件', link: '/guide/plugin' },
              { text: '路由适配', link: '/guide/router-adaptation' },
              { text: 'ESLint 规则冲突', link: '/guide/eslint-rule-conflicts' },
            ],
          },
          { text: '常见问题', link: '/guide/faq' },
          {
            text: '规范与最佳实践',
            items: [
              { text: '编译约定', link: '/guide/specification' },
              { text: '最佳实践', link: '/guide/best-practices' },
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
              { text: '上下文 API', link: '/api/compiler-context' },
              { text: '类型与结果', link: '/api/types' },
              { text: '导出清单', link: '/api/exports' },
            ],
          },
          {
            text: '其他',
            items: [
              { text: '赞助', link: '/guide/sponsor' },
              { text: '联系', link: '/guide/contact' },
            ],
          },
        ],
      },
    },

    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
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
        nav: [
          {
            text: 'Contact',
            link: '/en/guide/contact',
          },
          {
            text: 'Sponsor',
            link: '/en/guide/sponsor',
          },
          {
            text: 'Playground',
            items: [
              {
                text: 'CRM Admin Dashboard (Standard)',
                link: 'https://codesandbox.io/p/github/vureact-js/example-crm-admin-backend/master',
              },
              {
                text: 'Customer Support Hub (Mixed)',
                link: 'https://codesandbox.io/p/github/vureact-js/example-customer-support-hub/master?import=true',
              },
            ],
          },
          {
            text: 'Guide',
            items: [
              { text: 'Introduction', link: '/guide/introduction' },
              { text: 'Changelog', link: '/guide/changelog' },
              { text: 'Tuts & Practices', link: '/guide/basic-tutorial' },
              { text: 'Configuration', link: '/guide/cli' },
              { text: 'FAQ', link: '/guide/faq' },
              { text: 'Specifications & Best Practices', link: '/guide/specification' },
              { text: 'Capability Matrix', link: '/en/guide/capabilities-overview' },
              { text: 'Conversion Guide', link: '/en/guide/conversion-overview' },
              { text: 'API', link: '/api/' },
            ],
          },
          {
            text: 'Ecosystem',
            items: [
              {
                text: 'Official Libraries',
                items: [
                  { text: 'VuReact Runtime 1.x', link: 'https://runtime.vureact.top/en' },
                  { text: 'VuReact Router 2.x', link: 'https://router.vureact.top/en' },
                ],
              },
            ],
          },
        ],
        sidebar: [
          {
            text: 'Introduction',
            items: [
              { text: 'Getting Started', link: '/en/guide/introduction' },
              { text: 'Philosophy', link: '/en/guide/philosophy' },
              { text: 'What is Semantics-Aware', link: '/en/guide/what-is-semantic-aware' },
              { text: 'Why Choose VuReact', link: '/en/guide/why' },
              { text: 'Change Log', link: '/en/guide/changelog' },
            ],
          },
          {
            text: 'Tuts & Practices',
            items: [
              {
                text: 'Basic Tutorials',
                items: [
                  { text: 'Counter Component', link: '/en/guide/basic-tutorial' },
                  {
                    text: 'Template Basic',
                    link: '/en/guide/beginner-template-stable',
                  },
                  {
                    text: 'Component Communication',
                    link: '/en/guide/beginner-component-communication',
                  },
                  {
                    text: 'Component References',
                    link: '/en/guide/beginner-component-references',
                  },
                  {
                    text: 'SFC Advanced Features',
                    link: '/en/guide/advanced-context-events-slots',
                  },
                  { text: 'Styles in Components', link: '/en/guide/advanced-style-pipeline' },
                  { text: 'Script Files', link: '/en/guide/advanced-script-only-pipeline' },
                  { text: 'Style Files', link: '/en/guide/advanced-style-only-pipeline' },
                ],
              },
              {
                text: 'Project Practice',
                items: [
                  {
                    text: 'CRM Admin Dashboard',
                    link: '/en/guide/crm-admin-backend',
                  },
                  {
                    text: 'Customer Support Hub',
                    link: '/en/guide/customer-support-hub',
                  },
                ],
              },
              {
                text: 'Mind Control',
                items: [
                  { text: 'Introduction', link: '/en/guide/mind-control-readme' },
                  {
                    text: 'Controlled Mixed Writing',
                    link: '/en/guide/mind-control-controlled-mixed',
                  },
                  {
                    text: 'Full Ecosystem Unleashed',
                    link: '/en/guide/mind-control-full-ecosystem',
                  },
                ],
              },
            ],
          },
          {
            text: 'Configuration',
            items: [
              { text: 'CLI', link: '/en/guide/cli' },
              { text: 'Plugin', link: '/en/guide/plugin' },
              { text: 'Router Adaptation', link: '/en/guide/router-adaptation' },
              { text: 'ESLint Rule Conflicts', link: '/en/guide/eslint-rule-conflicts' },
            ],
          },
          { text: 'FAQ', link: '/en/guide/faq' },
          {
            text: 'Specifications & Best Practices',
            items: [
              { text: 'Compilation Conventions', link: '/en/guide/specification' },
              { text: 'Best Practices', link: '/en/guide/best-practices' },
              { text: 'Router Adaptation', link: '/en/guide/router-adaptation' },
            ],
          },
          {
            text: 'Capability Matrix',
            items: [
              { text: 'Overview', link: '/en/guide/capabilities-overview' },
              { text: 'Template Capabilities', link: '/en/guide/capabilities-template' },
              { text: 'Script Capabilities', link: '/en/guide/capabilities-script' },
              { text: 'Style Capabilities', link: '/en/guide/capabilities-style' },
            ],
          },
          {
            text: 'Conversion Guide',
            items: [
              { text: 'Overview', link: '/en/guide/conversion-overview' },
              { text: 'Template Guide', link: '/en/guide/conversion-template' },
              { text: 'Script Guide', link: '/en/guide/conversion-script' },
              { text: 'Style Guide', link: '/en/guide/conversion-style' },
            ],
          },
          {
            text: 'API',
            items: [
              { text: 'Overview', link: '/en/api/' },
              { text: 'Config API', link: '/en/api/config' },
              { text: 'Compiler API', link: '/en/api/compiler' },
              { text: 'Pipeline API', link: '/en/api/pipeline' },
              { text: 'Plugin System API', link: '/en/api/plugin-system' },
              { text: 'Context API', link: '/en/api/compiler-context' },
              { text: 'Types & Results', link: '/en/api/types' },
              { text: 'Exports Manifest', link: '/en/api/exports' },
            ],
          },
          {
            text: 'Others',
            items: [
              { text: 'Sponsor', link: '/en/guide/sponsor' },
              { text: 'Contact', link: '/en/guide/contact' },
            ],
          },
        ],
      },
    },
  },
});
