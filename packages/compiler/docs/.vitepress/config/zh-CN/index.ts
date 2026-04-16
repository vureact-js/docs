import { LocaleConfig } from 'vitepress';
import nav from './nav';
import sidebar from './sidebar';
import socialLinks from './socialLinks';

export default {
  root: {
    label: '简体中文',
    lang: 'zh-CN',
    link: '/',
    description: '一个让你用 Vue 3 语法编写 React 18+ 应用的编译器。',
    themeConfig: {
      socialLinks,
      nav,
      sidebar,
    },
  },
} as LocaleConfig;
