import { defineConfig } from 'vitepress';
import commonConfig from '../../../../config';

export default defineConfig({
  ...commonConfig,

  title: 'VuReact Router',

  description: 'Vue Router 4.x Adapter for React 18+ (Encapsulated on React Router DOM 7.9+)',

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
      description: '适用于 React18+ 的 Vue Router 4.x 适配包，基于 React Router DOM 7.9+ 二次封装',
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
            link: 'https://github.com/vureact-js/vureact-router.git',
          },
          {
            icon: 'gitee',
            link: 'https://gitee.com/vureact-js/vureact-router.git',
          },
        ],
      },
    },
  },
});
