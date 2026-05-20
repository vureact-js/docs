import { defineConfig } from 'vitepress';
import commonConfig from '../../../../../config';
import enUS from './en-US';
import zhCN from './zh-CN';

export default defineConfig({
  ...commonConfig,
  title: 'VuReact',
  description:
    'A compiler toolchain for migrating from Vue to React — and for writing React with Vue syntax. It converts Vue 3 SFCs, scripts, and styles into pure React without a runtime bridge, with full script setup support and progressive migration.',
  locales: {
    ...zhCN,
    ...enUS,
  },

  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
    },
  },
});
