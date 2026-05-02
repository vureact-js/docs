# 渐进式迁移指南

渐进式迁移的目标不是一次性把整个 Vue 项目“翻译”成 React，而是先建立一条稳定闭环，再按目录、页面、模块逐步扩大范围。

推荐思路只有一句话：**先跑通，再扩圈；先迁移业务闭环，再补边角细节。**

## 最小策略

对于一个典型的 Vue 3 + Vite 项目，建议先这样做：

1. 只编译 `src`
2. 排除 Vue 入口文件 `src/main.ts`
3. 如果项目使用 Vue Router，[声明路由入口](/guide/router-adaptation)
4. 先用 `watch` 跑通一个页面或一个目录
5. React 产物验证通过后，再继续扩展迁移范围

最小配置通常如下：

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: './src',
  exclude: ['src/main.ts'],
  router: {
    configFile: 'src/router/index.ts',
  },
});
```

## 推荐步骤

### 1. 先建立编译闭环

先不要急着改业务代码，先确认项目可以稳定执行：

```bash
npx vureact build
```

通过标准：

- 成功生成 `.vureact/react-app`
- 输出目录里存在 `src/main.tsx`
- 再次执行 `build` 时可以正常命中缓存

### 2. 再进入监听开发

当首次构建通过后，切到监听模式：

```bash
npx vureact watch
```

同时在产物目录启动 React 开发服务器：

```bash
cd .vureact/react-app
npm install
npm run dev
```

这样后续你只需要继续写 Vue，VuReact 会持续同步 React 产物。

> 如果你遇到了问题，可以先查阅 [常见问题](/guide/faq)。

### 3. 从小范围开始迁移

不要一上来全仓推进，优先选下面这类目标作为第一批：

- 一个独立页面
- 一个业务目录
- 一个低风险模块

不建议第一批就迁移：

- 全局入口
- 最复杂的权限流
- 大量历史兼容代码

### 4. 先验收主链路

每迁移一批内容，只验证最重要的业务链路即可，例如：

- 页面是否能正常渲染
- 路由跳转是否正常
- 表单、列表、按钮事件是否正常
- 状态变化是否能驱动 UI 更新

不要在第一轮就追求把所有视觉细节一次性打磨完。

## 迁移顺序建议

如果你不确定从哪里开始，推荐顺序如下：

1. 页面和普通组件
2. 样式文件
3. 状态与副作用逻辑
4. 路由与守卫
5. 边缘页面、复杂交互、历史遗留代码

这个顺序的核心原因是：越靠前的部分越容易快速建立信心，越靠后的部分越适合在闭环跑通后集中处理。

## 几个关键约定

为了让渐进迁移更稳定，建议始终遵守这几条：

- 保留原 Vue 目录结构，不要边迁移边大改目录
- Vue 入口文件先排除，不要让编译器接管 `createApp(...).mount(...)`
- 路由项目优先配置 `router.configFile`
- 持续使用 `watch`，不要每改一次都手动全量重编译
- 遇到问题时先缩小范围，确认是单文件问题还是整条链路问题

## 常见误区

### 一次性全仓迁移

这通常会把“编译问题、路由问题、样式问题、业务问题”混在一起，排查成本很高。

### 先改 React，再回头看 Vue

VuReact 的推荐方式是继续维护 Vue 源码，把 React 产物当作编译结果来验证，而不是把产物当作主源码修改。

### 把入口也一起编译

大多数渐进迁移项目都应该先排除 `src/main.ts`，否则容易和现有 Vue 挂载逻辑冲突。

## 一页检查清单

开始前确认：

- 已安装 `@vureact/compiler-core`
- 项目根目录存在 `vureact.config.ts`
- `exclude` 已排除 `src/main.ts`
- 路由项目已配置 `router.configFile`

执行中确认：

- `npx vureact build` 可以成功
- `npx vureact watch` 正在运行
- `.vureact/react-app` 能启动 `npm run dev`

验收时确认：

- 至少一个页面可正常访问
- 至少一条核心交互链路可跑通
- 修改 Vue 源文件后，React 页面能同步更新
