# 更新日志

`@vureact/runtime-core` 遵循 [Semantic Versioning 2.0.0](http://semver.org/lang/zh-CN/) 语义化版本规范，版本按时间倒序排列。

## v1.1.1（2026-04-26）

### 🐞 修复问题

- 修复 `useWatch` 回调参数 `source` 为未解包的 `Ref` 时，回调参数能自动推导为解包后的类型

## v1.1.0（2026-04-17）

### ✨ 新增功能

- 新增 `defineAsyncComponent` 异步组件适配器工具（含类型定义和测试用例）
- 重构 `Suspense` 组件为模块化结构，增加上下文支持
- 新增 `Suspense/Content.tsx` 和 `Suspense/Fallback.tsx` 子组件

## v1.0.1（2026-03-05）

### 🚀 优化改进

- 重构 README 文档结构，中文为主要语言、英文为备选
- 优化项目主页链接，移除语言后缀统一使用主域名

### 🐞 修复问题

- 修正 GitHub 仓库目录路径配置（repository.directory）

## v1.0.0（2026-03-04）

### 🚩 里程碑

首个正式版本，完成从 Beta 到生产就绪版本的升级。

### ⚡ 核心特性

- 响应式系统：适配 Vue 3 完整响应式 API（基于 Valtio 实现），提供 `useReactive`/`useVRef`/`useComputed` 等钩子
- 内置组件：适配 `<KeepAlive>`/`<Transition>`/`<Teleport>`/`<Suspense>` 等 Vue 风格组件
- 指令工具：提供 `vCls`/`vStyle`/`vOn`/`vKeyless` 等 Vue 风格绑定工具
- 模块化架构：拆分为主包、适配器组件/钩子/工具等模块

### 🚀 优化改进

- 版本号从 1.0.0-beta 升级至 1.0.0
- 优化依赖（使用 valtio 做响应式引擎、react-transition-group 支持动画）
- 规范 API 命名（如 `useRefState` → `useVRef`、`useCtx` → `useInject` 等）

### 🐞 修复问题

- 修复浅代理循环引用、代理元数据处理问题
- 完善所有响应式 API 类型定义

### 技术栈

- 核心依赖：valtio、react-transition-group
- 开发工具：TypeScript、Rollup、Jest
- 兼容：React 18+、TypeScript 4.9+，支持 ESM/CJS 双格式

> 1.0.0 完整细节参考：[runtime-core CHANGELOG.md](https://github.com/vureact-js/core/blob/master/packages/runtime-core/CHANGELOG.md)
