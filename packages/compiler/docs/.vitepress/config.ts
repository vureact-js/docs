import { defineConfig } from 'vitepress';
import commonConfig from '../../../../config';

export default defineConfig({
  ...commonConfig,

  title: 'VuReact',

  description:
    'Compile Vue 3 code into React 18+ (JSX/TSX), supporting automated batch processing, precise logic migration, and core adapter packages to simplify component migration from Vue to React.',

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
      description:
        '将 Vue 3 代码编译为 React 18+（JSX/TSX），支持自动化批量处理、精确逻辑迁移与核心适配包，简化 Vue→React 的组件迁移。',
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
        nav: [{ text: '', link: '' }],
        sidebar: [{ text: '', link: '' }],
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
      },
    },
  },
});
