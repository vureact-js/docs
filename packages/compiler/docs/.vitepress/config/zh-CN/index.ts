import { LocaleConfig } from 'vitepress';
import nav from './nav';
import sidebar from './sidebar';
import socialLinks from './socialLinks';

export default {
  root: {
    label: '简体中文',
    lang: 'zh-CN',
    link: '/',
    description:
      '一个面向 Vue 到 React 迁移、兼具 「用 Vue 写 React」 双重能力的编译工具链。将 Vue 3 SFCs・Scripts・Styles 完整转为原生 React 代码（非运行时桥接），覆盖 script setup 核心全特性，支持渐进式迁移和混合开发。',
    themeConfig: {
      socialLinks,
      nav,
      sidebar,
    },
  },
} as LocaleConfig;
