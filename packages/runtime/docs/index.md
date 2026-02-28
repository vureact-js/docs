---
layout: home

title: VuReact Runtime - Vue 3 内置组件、响应式 API 与模板指令工具的 React 适配器。将 Vue 的优秀开发体验带入 React 应用。

hero:
  name: 'VuReact Runtime'
  tagline: '运行时适配库，将 Vue 3 的优秀组件和响应式系统无缝集成到 React 中'
  actions:
    - theme: brand
      text: 快速上手 →
      link: /guide/introduction
    - theme: alt
      text: 安装
      link: /guide/quick-start

features:
  - icon: 🔄
    title: Vue 内置组件支持
    details: 在 React 中使用 Vue 3 的核心组件，包括 KeepAlive（组件缓存）、Transition（过渡动画）、Teleport（传送门）和 Suspense（异步加载）。

  - icon: ⚡
    title: 完整的响应式系统
    details: 基于 Valtio 的响应式状态管理，提供 useReactive、useVRef、useComputed 等 Vue 风格 API，支持深度响应式和浅层响应式。

  - icon: 👁️
    title: Vue 风格侦听器
    details: 完整的 watch API 支持，包括 useWatch、useWatchEffect、useWatchPostEffect，提供 Vue 风格的响应式侦听体验。

  - icon: 🎯
    title: 模板指令工具集
    details: 内置 vCls、vStyle、vOn、vKeyless 等工具函数，在 JSX 中实现 Vue 模板指令的便捷语法。

  - icon: 🔄
    title: 完整生命周期
    details: 提供 useMounted、useUpdated、useBeforeUnmount 等生命周期 Hook，与 Vue 生命周期完美对应。

  - icon: 🔗
    title: Ref 工具集
    details: 提供 useToVRef、useToVRefs、useToRaw 等工具函数，支持响应式对象与 Ref 之间的转换和操作。

  - icon: 🛡️
    title: TypeScript 就绪
    details: 完整的类型定义，开箱即用的 IntelliSense 支持，提供优秀的开发体验。

  - icon: ⚙️
    title: 渐进式采用
    details: 可按需导入，无需重写现有代码，可逐步在 React 项目中引入 Vue 的优秀模式。
---
