import { defineConfig } from 'vitepress';
import commonConfig from '../../../../config';

export default defineConfig({
  ...commonConfig,

  title: 'VuReact Runtime Core',

  description:
    'Cross-Framework Core Adaptation Package: VuReact, the essential runtime for compiling Vue 3 to React.',

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
      description: '跨框架核心适配包， VuReact 将 Vue 3 编译为 React 后必需的运行时',
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
