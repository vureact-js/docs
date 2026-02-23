import { defineConfig } from 'vitepress';
import commonConfig from '../../../../config';

export default defineConfig({
  ...commonConfig,

  title: 'VuReact Router',

  description:
    'Vue Router 4.x style routing library for React 18+ with full TypeScript support, navigation guards, async components, and familiar API for Vue developers transitioning to React.',

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
      description:
        '适用于 React 18+、风格类似 Vue Router 4.x 的路由库，支持完整 TypeScript、路由守卫、异步组件，并为从 Vue 迁移至 React 的开发者提供熟悉的 API。',
      themeConfig: {
        socialLinks: [
          {
            icon: 'gitee',
            link: 'https://gitee.com/vureact-js/vureact-router.git',
          },
          {
            icon: 'github',
            link: 'https://github.com/vureact-js/vureact-router.git',
          },
        ],
        nav: [
          {
            text: '示例源码',
            link: 'https://gitee.com/vureact-js/vureact-router/tree/master/examples',
          },
          {
            text: '生态系统',
            items: [
              {
                text: '官方库',
                items: [
                  { text: 'VuReact Compiler', link: 'https://vureact.vercel.app' },
                  { text: 'VuReact Runtime', link: 'https://vureact-runtime.vercel.app' },
                ],
              },
            ],
          },
        ],
        sidebar: [
          {
            text: '开始',
            items: [
              { text: '简介', link: '/guide/introduction' },
              { text: '快速上手', link: '/guide/quick-start' },
            ],
          },
          {
            text: '教程',
            items: [
              { text: '基础路由', link: '/guide/basic-routing' },
              { text: 'RouterLink', link: '/guide/router-link' },
              { text: 'useRouter 与 useRoute', link: '/guide/use-router-and-use-route' },
              { text: '全局守卫与路由守卫', link: '/guide/global-and-route-guards' },
              { text: '组件守卫', link: '/guide/component-guards' },
              { text: '动态路由', link: '/guide/dynamic-routing' },
              { text: '历史模式', link: '/guide/history-modes' },
            ],
          },
          {
            text: 'API 参考',
            items: [
              { text: 'createRouter', link: '/api/create-router' },
              { text: 'RouteConfig', link: '/api/route-config' },
              { text: 'RouterInstance', link: '/api/router-instance' },
              { text: '路由组件', link: '/api/router-components' },
              { text: '路由 Hooks', link: '/api/router-hooks' },
              { text: 'Navigation Failure', link: '/api/navigation-failure' },
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
        'A Vue Router 4.x style routing library for React 18+ with TypeScript, navigation guards, and dynamic routing.',
      themeConfig: {
        socialLinks: [
          {
            icon: 'github',
            link: 'https://github.com/vureact-js/vureact-router.git',
          },
          {
            icon: 'gitee',
            link: 'https://gitee.com/vureact-js/vureact-router.git',
          },
        ],
        nav: [
          {
            text: 'Example Code',
            link: 'https://github.com/vureact-js/vureact-router/tree/master/examples',
          },
          {
            text: 'Ecosystem',
            items: [
              {
                text: 'Official Libraries',
                items: [
                  { text: 'VuReact Compiler', link: 'https://vureact.vercel.app' },
                  { text: 'VuReact Runtime', link: 'https://vureact-runtime.vercel.app' },
                ],
              },
            ],
          },
        ],
        sidebar: [
          {
            text: 'Getting Started',
            items: [
              { text: 'Introduction', link: '/en/guide/introduction' },
              { text: 'Quick Start', link: '/en/guide/quick-start' },
            ],
          },
          {
            text: 'Guide',
            items: [
              { text: 'Basic Routing', link: '/en/guide/basic-routing' },
              { text: 'RouterLink', link: '/en/guide/router-link' },
              { text: 'useRouter and useRoute', link: '/en/guide/use-router-and-use-route' },
              { text: 'Global and Route Guards', link: '/en/guide/global-and-route-guards' },
              { text: 'Component Guards', link: '/en/guide/component-guards' },
              { text: 'Dynamic Routing', link: '/en/guide/dynamic-routing' },
              { text: 'History Modes', link: '/en/guide/history-modes' },
            ],
          },
          {
            text: 'API Reference',
            items: [
              { text: 'createRouter', link: '/en/api/create-router' },
              { text: 'RouteConfig', link: '/en/api/route-config' },
              { text: 'RouterInstance', link: '/en/api/router-instance' },
              { text: 'Router Components', link: '/en/api/router-components' },
              { text: 'Router Hooks', link: '/en/api/router-hooks' },
              { text: 'Navigation Failure', link: '/en/api/navigation-failure' },
            ],
          },
        ],
      },
    },
  },
});
