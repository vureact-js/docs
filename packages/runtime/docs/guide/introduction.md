# 简介

## 什么是 VuReact Runtime <Badge type='warning' text='beta' />

**VuReact Runtime** 是一个专为 React 设计的 Vue 3 特性适配层，它允许您在 React 应用中无缝使用 Vue 3 的核心特性，包括内置组件、响应式 API 和模板指令工具。

### 背景

VuReact Runtime 最初是为了解决 **[VuReact 编译器](https://vureact.vercel.app) 无法处理的运行时场景** 而衍生出来的产物。在 Vue 3 到 React 的编译转换过程中，有些特性无法在编译时完全处理，需要在运行时提供支持。而该库就是为这些场景量身定制的解决方案。

虽然它是为 VuReact 编译器定制的，但设计上完全独立，**可以单独使用**，无需依赖任何编译工具。

## 核心价值

### 1. 最佳开发体验

- **Vue 开发者的友好迁移**: 如果您熟悉 Vue 3，可以在 React 中继续使用熟悉的 API 和模式
- **React 项目的增强**: 为现有 React 项目引入 Vue 3 的优秀特性，如组件缓存、响应式状态管理等

### 2. 渐进式采用

- **零侵入性**: 无需重写现有代码，可以按需引入特定功能
- **模块化设计**: 每个功能都可以独立使用，支持 Tree Shaking

### 3. 生产就绪

- **响应式系统**: 使用成熟的方案 [Valtio](https://github.com/pmndrs/valtio) 作为响应式引擎，React 作为渲染层
- **动画过渡**: 使用 [React Transition Group](https://github.com/reactjs/react-transition-group#readme) 为 `<Transition>` 组件提供高性能过渡效果的支持
- **完整类型支持**: 100% TypeScript 编写，提供完整的类型定义
- **测试覆盖**: 完善的单元测试确保稳定性

## 与 VuReact 编译器的关系

```txt
┌─────────────────────────────────────────────┐
│            VuReact 生态系统                  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────┐  ┌─────────────────┐   │
│  │  编译器         │  │   运行时库       │   │
│  │  (Compiler)     │  │  (Runtime)      │   │
│  │                 │  │                 │   │
│  │ • Vue → React   │  │ • 运行时特性     │   │
│  │   代码转换      │  │ • 响应式系统      │   │
│  │ • 模板编译      │  │ • Vue 组件适配    │   │
│  │ • 静态分析      │  │ • 指令工具        │   │
│  └─────────────────┘  └───────────────── ┘   │
│                                              │
│  可以单独使用，也可以组合使用                  │
└──────────────────────────────────────────────┘
```

### 独立使用场景

- 您有一个纯 React 项目，想引入 Vue 3 的特定特性
- 您正在从 Vue 迁移到 React，需要过渡期的兼容方案
- 您喜欢 Vue 的开发模式，但项目技术栈要求使用 React

### 与编译器配合使用场景

VuReact 编译器已融合了对运行时库的支持，您无需手动引入或编写相关代码，包括依赖收集等

## 技术架构

VuReact Runtime 采用分层架构设计：

1. **适配层 (Adapter Layer)**
   - `adapter-components`: Vue 内置组件的 React 实现
   - `adapter-hooks`: Vue 响应式 API 的 React Hooks 封装
   - `adapter-utils`: Vue 模板指令的 JSX 工具函数

2. **响应式引擎 (Reactive Engine)**
   - 基于 Valtio 的高性能 Proxy 实现
   - 完整的响应式追踪和依赖收集
   - 支持深度响应式和浅层响应式

3. **React 集成层 (React Integration)**
   - 100% React Hooks API
   - 与 React 生命周期完美集成
   - 支持 Concurrent Features

## 开始使用

无论您是：

- 想为现有 React 项目添加 Vue 3 特性
- 正在从 Vue 迁移到 React 需要兼容方案
- 只是好奇如何将两个框架的优势结合

VuReact Runtime 都能为您提供优雅的解决方案。接下来，让我们开始 [快速上手](./quick-start.md) 吧！
