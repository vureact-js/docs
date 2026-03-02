---
layout: home

title: VuReact | 下一代 Vue 3 -> React 编译工具

hero:
  name: 'VuReact'
  text: '下一代 Vue 3 -> React 智能编译工具'
  tagline: '可控渐进，约定驱动，适用于 Web 跨框架的方案。'

  actions:
    - theme: brand
      text: 开始使用 →
      link: /guide/introduction

    - theme: alt
      text: 快速上手
      link: /guide/introduction#快速开始

features:
  - icon: ⚖️
    title: 可控渐进式
    details: 支持从单个组件到整个项目的渐进迁移路径，规避爆炸式转换带来的技术债务和系统风险。

  - icon: 🧭
    title: 约定驱动
    details: 基于明确的语法约定而非启发式规则进行编译，确保转换行为的确定性、可分析性和可维护性。

  - icon: 🌀
    title: 跨框架编译桥
    details: 探索性的混合编译模式，允许 Vue 和 React 代码在编译层面共存，编译器作为桥梁连接两个生态，负责处理框架间的语法差异。

  - icon: 🏆
    title: 概念验证（实验性）
    details: 验证"Vue 到 React 完整编译"这一长期技术设想的可行性，通过创新的编译架构和运行时适配，实现前所未有的转换深度和工程完整性。

  - icon: 🔄
    title: 现代 Vue 语法优先
    details: 完整支持 Vue 3 script setup 语法与组合式 API，包括 watch、defineProps、defineEmits 等。

  - icon: 📋
    title: 模板到 JSX 智能转换
    details: 将 Vue 模板语法和指令等，智能转换为符合 React 习惯的 JSX 代码，保持逻辑清晰且符合 React 最佳实践。

  - icon: ⚛️
    title: Vue 核心特性适配
    details: 将响应式系统、生命周期、内置组件（Transition/KeepAlive）等核心特性完整适配到 React，保持开发心智模型一致。

  - icon: 🎨
    title: 零运行时样式方案
    details: 在编译阶段完全处理 SFC 的 scoped 和 module 样式，以及 Less 和 Sass，生成静态 CSS 文件，解决运行时样式性能开销。

  - icon: 🔬
    title: 细致的处理
    details: 从 import 路径修正到类型定义生成，从代码格式化到依赖分析，每一个编译细节都经过精心设计和优化。

  - icon: 📝
    title: TypeScript 无缝迁移
    details: 完整保留 TS 类型定义，自动推导并生成对应的 React 组件类型接口，支持 .vue 到 .tsx 的无缝类型转换。

  - icon: ⚡
    title: CLI 与实时编译
    details: 提供 build/watch 双模式 CLI，支持增量编译与文件监听，开发体验流畅。

  - icon: 📁
    title: 完整工程化
    details: 不仅仅是代码转换，而是完整的项目编译：保持目录、生成文件、拷贝资源、管理依赖。

  - icon: 🛠️
    title: Vite 环境集成
    details: 可选集成 Vite 官方脚手架，自动初始化标准 React 项目结构与配置。
---
