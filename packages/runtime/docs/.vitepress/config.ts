import { defineConfig } from 'vitepress';
import commonConfig from '../../../../config';

export default defineConfig({
  ...commonConfig,

  title: 'VuReact',

  description: `React adapter for Vue 3's built-in components, reactive APIs, and template directive utilities. Bring Vue's developer experience to React applications.`,

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
      description:
        'Vue 3 内置组件、响应式 API 与模板指令工具的 React 适配器。将 Vue 的优秀开发体验带入 React 应用。',
      themeConfig: {
        socialLinks: [
          {
            icon: 'gitee',
            link: 'https://gitee.com/vureact-js/core/tree/master/packages/runtime-core',
          },
          {
            icon: 'github',
            link: 'https://github.com/vureact-js/core/tree/master/packages/runtime-core',
          },
        ],
        nav: [
          {
            text: '在线示例',
            link: 'https://codesandbox.io/p/sandbox/examples-f5rlpk',
          },
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
                  { text: 'VuReact Compiler', link: 'https://vureact.vercel.app' },
                  { text: 'VuReact Router', link: 'https://router-vureact.vercel.app' },
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
            text: '适配组件',
            items: [
              { text: 'Transition', link: '/guide/components/transition' },
              { text: 'TransitionGroup', link: '/guide/components/transition-group' },
              { text: 'KeepAlive', link: '/guide/components/keep-alive' },
              { text: 'Teleport', link: '/guide/components/teleport' },
              { text: 'Suspense', link: '/guide/components/suspense' },
              { text: 'Component', link: '/guide/components/dynamic-components' },
              { text: 'Provider', link: '/guide/components/provider' },
            ],
          },
          {
            text: '适配钩子',
            items: [
              {
                text: '状态',
                items: [
                  { text: 'useComputed', link: '/guide/hooks/computed' },
                  { text: 'useReactive', link: '/guide/hooks/reactive' },
                  { text: 'useReadonly', link: '/guide/hooks/readonly' },
                  { text: 'useToRaw', link: '/guide/hooks/to-raw' },
                  { text: 'useToVRef', link: '/guide/hooks/to-v-ref' },
                  { text: 'useToVRefs', link: '/guide/hooks/to-v-refs' },
                  { text: 'useVRef', link: '/guide/hooks/v-ref' },
                ],
              },
              {
                text: '生命周期',
                items: [
                  { text: 'useBeforeMount', link: '/guide/hooks/before-mount' },
                  { text: 'useBeforeUnMount', link: '/guide/hooks/before-unmount' },
                  { text: 'useBeforeUpdate', link: '/guide/hooks/before-update' },
                  { text: 'useMounted', link: '/guide/hooks/mounted' },
                  { text: 'useUnmounted', link: '/guide/hooks/unmounted' },
                  { text: 'useUpdated', link: '/guide/hooks/updated' },
                ],
              },
              {
                text: '副作用',
                items: [
                  { text: 'useWatch', link: '/guide/hooks/watch' },
                  { text: 'useWatchEffect', link: '/guide/hooks/watch-effect' },
                ],
              },
            ],
          },
          {
            text: '适配工具',
            items: [
              { text: 'nextTick', link: '/guide/utils/next-tick' },
              { text: 'adapterUtils', link: '/guide/utils/adapter-utils' },
              { text: 'vOn', link: '/guide/utils/v-on' },
              { text: 'vCls', link: '/guide/utils/v-cls' },
              { text: 'vStyle', link: '/guide/utils/v-style' },
              { text: 'vKeyless', link: '/guide/utils/v-keyless' },
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
        "React adapter for Vue 3 built-in components, reactive APIs, and template directive utilities. Bring Vue's excellent development experience to React applications.",
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
            text: 'Online Demo',
            link: 'https://codesandbox.io/p/sandbox/examples-f5rlpk',
          },
          {
            text: 'Support',
            link: 'https://afdian.com/a/vureact-js/plan',
          },
          {
            text: 'Ecosystem',
            items: [
              {
                text: 'Official Libraries',
                items: [
                  { text: 'VuReact Compiler', link: 'https://vureact.vercel.app/en' },
                  { text: 'VuReact Router', link: 'https://router-vureact.vercel.app/en' },
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
            text: 'Adapter Components',
            items: [
              { text: 'Transition', link: '/en/guide/components/transition' },
              { text: 'TransitionGroup', link: '/en/guide/components/transition-group' },
              { text: 'KeepAlive', link: '/en/guide/components/keep-alive' },
              { text: 'Teleport', link: '/en/guide/components/teleport' },
              { text: 'Suspense', link: '/en/guide/components/suspense' },
              { text: 'Component', link: '/en/guide/components/dynamic-components' },
              { text: 'Provider', link: '/en/guide/components/provider' },
            ],
          },
          {
            text: 'Adapter Hooks',
            items: [
              {
                text: 'State',
                items: [
                  { text: 'useComputed', link: '/en/guide/hooks/computed' },
                  { text: 'useReactive', link: '/en/guide/hooks/reactive' },
                  { text: 'useReadonly', link: '/en/guide/hooks/readonly' },
                  { text: 'useToRaw', link: '/en/guide/hooks/to-raw' },
                  { text: 'useToVRef', link: '/en/guide/hooks/to-v-ref' },
                  { text: 'useToVRefs', link: '/en/guide/hooks/to-v-refs' },
                  { text: 'useVRef', link: '/en/guide/hooks/v-ref' },
                ],
              },
              {
                text: 'Lifecycle',
                items: [
                  { text: 'useBeforeMount', link: '/en/guide/hooks/before-mount' },
                  { text: 'useBeforeUnMount', link: '/en/guide/hooks/before-unmount' },
                  { text: 'useBeforeUpdate', link: '/en/guide/hooks/before-update' },
                  { text: 'useMounted', link: '/en/guide/hooks/mounted' },
                  { text: 'useUnmounted', link: '/en/guide/hooks/unmounted' },
                  { text: 'useUpdated', link: '/en/guide/hooks/updated' },
                ],
              },
              {
                text: 'Effects',
                items: [
                  { text: 'useWatch', link: '/en/guide/hooks/watch' },
                  { text: 'useWatchEffect', link: '/en/guide/hooks/watch-effect' },
                ],
              },
            ],
          },
          {
            text: 'Adapter Utils',
            items: [
              { text: 'nextTick', link: '/en/guide/utils/next-tick' },
              { text: 'adapterUtils', link: '/en/guide/utils/adapter-utils' },
              { text: 'vOn', link: '/en/guide/utils/v-on' },
              { text: 'vCls', link: '/en/guide/utils/v-cls' },
              { text: 'vStyle', link: '/en/guide/utils/v-style' },
              { text: 'vKeyless', link: '/en/guide/utils/v-keyless' },
            ],
          },
        ],
      },
    },
  },
});
