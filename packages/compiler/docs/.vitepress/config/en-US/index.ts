import { LocaleConfig } from 'vitepress';
import nav from './nav';
import sidebar from './sidebar';
import socialLinks from './socialLinks';

export default {
  en: {
    label: 'English',
    lang: 'en-US',
    link: '/en/',
    themeConfig: {
      socialLinks,
      nav,
      sidebar,
    },
  },
} as LocaleConfig;
