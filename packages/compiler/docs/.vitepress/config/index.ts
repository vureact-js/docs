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

  // 构建优化：通过 Vite 配置手动拆分大 chunk，避免 chunk 过大警告
  vite: {
    build: {
      chunkSizeWarningLimit: 1000,

      rollupOptions: {
        output: {
          manualChunks(id) {
            // 将 vitepress 核心代码拆分为一个独立 chunk
            if (id.includes('vitepress/dist')) {
              return 'vitepress-core';
            }
            // 将 node_modules 中的第三方依赖按包名拆分
            if (id.includes('node_modules')) {
              const match = id.match(/node_modules\/(?:@[^/]+\/[^/]+|[^/]+)/);
              if (match && match[0]) {
                // match[0] 例如 "node_modules/@miletorix/xxx" 或 "node_modules/vue"
                const pkgName = match[0].replace('node_modules/', '');
                return `vendor-${pkgName}`;
              }
            }
          },
        },
      },
    },
  },
});
