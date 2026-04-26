# 开始

## 什么是 VuReact

VuReact（发音 `/vjuːˈriːækt/`）是一个让你用 Vue 3 语法编写 React 18+ 应用的编译器。其核心价值不仅限于项目迁移，更在于将 Vue 的开发体验与 React 生态能力无缝结合，产出可维护、可演进、生产就绪的 React 代码。

它不仅执行语法层面的转换，更能深入理解 Vue 代码的语义，并生成遵循 React 最佳实践的优质代码。

VuReact 的核心目标并非“无条件地将任意 Vue 代码自动转换为 React 代码”，而是提供一条 **可预测、可分析、可维护** 的升级路径，使开发者能够在工程可控的前提下，平稳推进跨框架演进。

此外，VuReact 并非一个孤立的代码改写工具。它由 **编译时转换** 与 **[运行时适配](https://runtime.vureact.top/)** 两部分协同构成：

- **编译时** 负责将符合约定的 Vue 代码转换为结构清晰、易于维护的 React 代码，并自动注入必要的运行时依赖；
- **运行时** 则提供关键的语义适配与行为兼容层，确保转换后的组件在 React 环境中稳定运行。

两者紧密配合，共同保障了转换质量、运行稳定性与项目落地效率的平衡。

<video controls preload="metadata" width="100%" style="border-radius: 4px; margin: 2rem 0;">
  <source src="/static/hero_demo_3MB.mp4" type="video/mp4" />
  您的浏览器不支持视频播放。
</video>

<p style="text-align: center; color: #666; font-size: 0.9em; margin-top: 0.5rem;">
  <em>观看30秒演示，快速了解 VuReact 的编译流程</em>
</p>

## 解决什么问题

VuReact 旨在解决以下典型场景中的开发痛点：

- **技术栈迁移**：团队希望采用 React 生态，但已积累 Vue 语法习惯与组件资产，期望平滑过渡而非彻底重学
- **渐进式重构**：旧有 Vue 系统需要逐步迁移至 React，避免高风险的一次性重写与业务中断
- **开发体验统一**：借助 Vue 的响应式心智模型编写 React 组件，同时免除手动管理依赖项与渲染优化的繁琐
- **生态扩展**：丰富跨框架的开发工具链，为多技术栈共存或迁移提供标准化方案

核心挑战在于：若输入代码的语义不可静态分析，编译器便无法稳定生成符合 React Hooks 规则的输出。
因此，VuReact 采取 **“约定优先”** 的策略：先通过明确的 [编译约定](/guide/specification) 界定可转换的代码范围，再在该范围内实现高效、可靠的转换。

## 项目定位

VuReact 精准服务于以下场景：

- **新项目开发**：按照 VuReact 约定编写 Vue 组件（包括脚本文件等），并输出为 React 代码
- **现代语法支持**：专注于 Vue 3 Composition API 与 `<script setup>` 语法
- **可控渐进迁移**：支持按目录、模块逐步迁移，允许 Vue 与 React 组件在项目中并存
- **开发体验优化**：为希望享受 Vue 优秀心智模型并编写 React，或进行跨框架混合开发的团队提供高效方案

暂不优先支持：

- **复杂遗留项目**：期望“零改动一键迁移”的历史代码库
- **混合历史写法**：包含大量短期内难以统一的传统选项式 API 或非标准模式的工程

## 这是什么 / 这不是什么

**这是**：

- 一套将 Vue 单文件组件（SFC）及 `<script setup>` 语法转换为 React 代码的编译工具链
- 一个 **带约束的编译平台**，通过明确的约定保障转换质量与可维护性
- 具备工程化能力的开发工具，能够对不符合约定的输入给出清晰的告警或错误提示，并引导修正

**这不是**：

- 可处理任意历史代码的“万能迁移魔术师”
- 对非约定写法进行运行时兜底的解释器
- 承诺无需任何调整即可全量迁移旧项目的商业化产品

## 核心特性

VuReact 提供以下关键能力：

**🧠 语义感知**：深度理解Vue语法的完整语义结构，包括模板指令、script setup逻辑、组合式API和TypeScript类型等，智能生成符合React最佳实践的代码

**⚖️ 渐进迁移**：支持从单文件到整个项目的可控渐进迁移，规避一次性大规模转换带来的技术债务和系统风险

**🧭 约定驱动**：基于明确的语法约定而非启发式规则进行编译，确保转换行为的确定性、可分析性和可维护性，完整支持现代Vue语法

**⚛️ 完整特性适配**：将响应式 API、生命周期、内置组件、路由等Vue核心特性完整适配到React，编译阶段完全处理scoped、module和样式语言等，实现零运行时开销

**⚡ 优秀的开发体验**：延续 Vue 心智模型实现无感开发 React；提供 build/watch 双模式 CLI，支持极速增量编译与文件监听，让跨框架开发效率与体验达到原生级别

**🌀 创新探索**：探索跨框架编译桥模式，允许Vue和React代码在编译层面共存，验证"Vue到React完整编译"的技术可行性

**👽 智能编译**：涵盖语法转换、模板解析、样式处理、类型保留与工程优化

### 智能编译特性

- **语法智能转换**：将 Vue 3 组合式 API 智能映射为 React Hooks
- **模板智能解析**：将 Vue 模板指令智能转换为 JSX
- **样式智能处理**：将 Scoped CSS 等智能适配为 React 可运行 CSS 产物
- **类型智能保留**：智能迁移 TypeScript 类型系统
- **工程智能优化**：智能处理依赖分析、缓存机制与代码优化

## 快速开始

详细引导教程请参见：[快速开始](/guide/quick-start) 章节。

### 配置示例

`vureact.config.ts`

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: './src',
  exclude: ['src/main.ts'],
  output: {
    workspace: '.vureact',
    outDir: 'react-app',
    bootstrapVite: true,
  },
});
```

### 编译命令

```bash
npx vureact build      # 编译项目
npx vureact watch      # 监听模式
```

## 生态集成

- **[VuReact Runtime](https://runtime.vureact.top/)**：提供 React 版的 Vue 常用内置组件、核心 Composition API 等
- **[VuReact Router](https://router.vureact.top/)**：支持 Vue Router 4.x -> React Router DOM 7.9+ 转换

如果需要，可以选择 [☣️混合编写](/guide/mind-control-readme)，直接在 Vue 项目中引入 React 生态能力。

## 常见问题

请移步 [常见问题](https://vureact.top/guide/faq.html) 章节。
