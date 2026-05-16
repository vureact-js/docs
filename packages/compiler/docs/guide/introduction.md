# 开始

## 什么是 VuReact

VuReact（发音 `/vjuːˈriːækt/`）是一个 **Vue 转 React** 编译工具，它会把 Vue 3 的 SFC、脚本和样式完整编译为可运行在 React 18+ 的代码（非运行时桥接），并覆盖 `<script setup>` 的常用特性。

它绝非简单替换语法，而是深入理解 Vue 的语义，输出符合 React 最佳实践、可读且易于维护的代码。我们的目标并非“一键将任意 Vue 代码转为 React”，而是提供一条清晰、可预测、便于分析与维护的迁移路径，帮助团队在可控范围内平稳推进跨框架演进。

VuReact 由三部分协同构成：编译时转换、[Runtime](https://runtime.vureact.top/)（运行时）和 [Router](https://router.vureact.top/)（路由适配）：

- **编译时转换**：将符合约定的 Vue 代码生成结构清晰、易于维护的 React 代码，并自动注入必要的运行时依赖；
- **运行时（Runtime）**：负责语义适配与行为兼容，确保转换后的组件在 React 环境中稳定运行；
- **路由适配（Router）**：在需要时提供 Vue Router 风格的路由支持，便于迁移路由逻辑。

三部分协同配合，既保证了转换质量，也提升了运行稳定性与工程落地效率。

---

<video controls preload="metadata" width="100%" style="border-radius: 4px; margin: 2rem 0;" >
  <source src="/static/vureact-showcase (3.7MB).mp4" type="video/mp4" />
  您的浏览器不支持视频播放。
</video>

<div style="text-align: center; color: #666; font-size: 0.9em;">
  <em>观看终端交互演示，快速了解 VuReact 的编译流程</em>
</div>

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

其核心价值不仅限于项目迁移，更在于将 Vue 的开发体验与 React 生态能力无缝结合，产出可维护、可演进、生产就绪的 React 代码。

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

## 快速上手

详细引导教程请参见：[快速开始](/guide/quick-start) 章节。

### 安装

在你的 Vue 3 项目下，选择任意方式安装：

```bash
npm i -D @vureact/compiler-core
```

### 创建配置文件

在项目根目录下，创建 `vureact.config.ts` 文件：

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
 input: '', // 输入路径，支持单文件或目录
 exclude: ['src/main.ts'], // 排除 Vue 入口与不参与编译的文件
 output: {
   workspace: '.vureact',
   outDir: 'react-app',
   bootstrapVite: true,
 },
 onSuccess: async () => {
   console.log('编译成功！');
   // 这里可以执行额外的操作，比如操作文件系统、调用其他工具等
 },  
});
```

> 💡 更多配置项详见： [配置 API](/api/config)

### 方式一：转换单个 Vue 组件

```ts
{
  // 单 SFC 试点，需使用 <script setup>
  input: './src/your-component.vue',
}
```

### 方式二：转换整个项目

```ts
{
  // 支持多级目录递归，输入任意目录即可
  // 注意：所有组件必须使用 <script setup>（否则会报错）
  input: './src', 
}
```

> 💡 若使用了 Vue Router，请查看 [路由适配指南](/guide/router-adaptation) 进行配置。

### 执行编译转换

```bash
npx vureact build
```

自动生成的 `.vureact/react-app` 目录里，包含了转换后的组件和相关依赖配置等。

项目结构大致示例：

```txt
vue-project/
├── .vureact/              # 工作区（编译生成）
│   ├── cache/             # 编译缓存
│   ├── react-app/         # 转换后的 React 工程
│   │   ├── src/           # 转换后的 React 代码
│   │   ├── package.json   # React 项目依赖
│   │   ├── vite.config.ts # Vite 配置
│   │
├── src/                   # 原始 Vue 代码
├── package.json           # 原始项目依赖
└── vureact.config.ts      # 配置文件
```

> 💡 若出现编译告警，请按提示修改。阅读 [编译约定](/guide/specification) | [最佳实践](/guide/best-practices) 有助于你写出更适合转换的 Vue 代码。

## CLI 命令

```bash
# 全量/增量编译
npx vureact build

# 开发模式，监听文件变化自动编译
npx vureact watch

# 查看版本
npx vureact -v

# 查看帮助
npx vureact --help
```

👉 build/watch 指南详见：[Build 增量编译](/guide/incremental-compilation) | [Watch 监听模式](/guide/watch-mode)

## 生态集成

- **[VuReact Runtime](https://runtime.vureact.top/)**：提供轻量级 React 版的 Vue 核心组件 & API
- **[VuReact Router](https://router.vureact.top/)**：基于 React Router DOM 的 Vue Router 风格适配层

> 可选 [☣️混合编写](/guide/mind-control-readme)，Vue 项目直接引入 React 生态能力。

## 反馈与交流

- 遇到问题？[查看 FAQ](/guide/faq) 或 [提交 Issue](https://github.com/vureact-js/core/issues)
- 路由适配有疑问？[查看路由适配指南](/guide/router-adaptation)
- 页面样式异常？[查看解决方案](/guide/faq#q35-页面样式异常或丢失如何解决)
- 使用感受？来 [Discussions](https://github.com/vureact-js/core/discussions) 聊聊
- 想支持我们？到 [Github](https://github.com/vureact-js/core) 点个 ⭐ 让更多人看到这个项目
