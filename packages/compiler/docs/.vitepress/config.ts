import { defineConfig } from 'vitepress';
import commonConfig from '../../../../config';

export default defineConfig({
  ...commonConfig,

  title: 'VuReact',

  description:
    'Next Vue to React intelligent compilation toolchain that compiles Vue 3 into runnable React 18+ code',

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
      description: '下一代 Vue -> React 智能编译工具链，将 Vue 3 编译为可运行的 React 18+ 代码',
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
            text: '在线演示',
            link: 'https://codesandbox.io/p/devbox/compiler-examples-n8yg68',
          },
          {
            text: '指南',
            items: [
              { text: '介绍', link: '/guide/introduction' },
              { text: '编译示例', link: '/guide/basic-tutorial' },
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
                  { text: 'VuReact Runtime', link: 'https://runtime.vureact.top' },
                  { text: 'VuReact Router', link: 'https://router.vureact.top' },
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
              { text: '更新日志', link: '/guide/changelog' },
            ],
          },
          {
            text: '编译示例',
            items: [
              {
                text: '入门',
                items: [
                  { text: '计数器组件', link: '/guide/basic-tutorial' },
                  { text: '模板基础', link: '/guide/beginner-template-stable' },
                  { text: '组件通信', link: '/guide/beginner-component-communication' },
                  { text: '组件引用', link: '/guide/beginner-component-references' },
                ],
              },
              {
                text: '进阶',
                items: [
                  {
                    text: 'SFC 高级特性',
                    link: '/guide/advanced-context-events-slots',
                  },
                  { text: '组件内样式', link: '/guide/advanced-style-pipeline' },
                  { text: '脚本文件', link: '/guide/advanced-script-only-pipeline' },
                  { text: '样式文件', link: '/guide/advanced-style-only-pipeline' },
                ],
              },
              {
                text: '掌握',
                items: [{ text: '演练场', link: '/guide/playground' }],
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
              { text: '上下文 API', link: '/api/compiler-context' },
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
            text: 'Sponsorship',
            link: 'https://afdian.com/a/vureact-js/plan',
          },
          {
            text: 'Playground',
            link: 'https://codesandbox.io/p/devbox/compiler-examples-n8yg68',
          },
          {
            text: 'Guide',
            items: [
              { text: 'Introduction', link: '/guide/introduction' },
              { text: 'Compilation Examples', link: '/guide/basic-tutorial' },
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
                  { text: 'VuReact Runtime', link: 'https://runtime.vureact.top/en' },
                  { text: 'VuReact Router', link: 'https://router.vureact.top/en' },
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
              { text: 'Why Choose VuReact', link: '/en/guide/why' },
              { text: 'Change Log', link: '/en/guide/changelog' },
            ],
          },
          {
            text: 'Compilation Examples',
            items: [
              {
                text: 'Beginner',
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
                ],
              },
              {
                text: 'Advanced',
                items: [
                  {
                    text: 'SFC Advanced Features',
                    link: '/guide/advanced-context-events-slots',
                  },
                  { text: 'Styles in Components', link: '/en/guide/advanced-style-pipeline' },
                  { text: 'Script Files', link: '/en/guide/advanced-script-only-pipeline' },
                  { text: 'Style Files', link: '/en/guide/advanced-style-only-pipeline' },
                ],
              },
              {
                text: 'Proficient',
                items: [{ text: 'playground', link: '/en/guide/playground' }],
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
        ],
      },
    },
  },
});
