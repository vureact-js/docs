import { defineConfig } from 'vitepress';
import commonConfig from '../../../../../config';
import enUS from './en-US';
import zhCN from './zh-CN';

export default defineConfig({
  ...commonConfig,
  title: 'VuReact',
  description: 'Write in Vue 3, compile to React 18+ code.',
  locales: {
    ...zhCN,
    ...enUS,
  },
});
