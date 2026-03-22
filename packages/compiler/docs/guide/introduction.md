# 开始

## 什么是 VuReact

VuReact（Vue + React 连读，发音 `/vjuːˈriːækt/`）是一个面向语义级代码迁移的智能 Vue 3 转 React 18+ 编译器，旨在为新项目与可控的渐进式迁移提供高效、可靠的开发体验。

它不仅执行语法层面的转换，更能深入理解 Vue 代码的语义，并生成遵循 React 最佳实践的优质代码。

VuReact 的核心目标并非“无条件地将任意 Vue 代码自动转换为 React 代码”，而是提供一条 **可预测、可分析、可维护** 的升级路径，使开发者能够在工程可控的前提下，平稳推进跨框架演进。

此外，VuReact 并非一个孤立的代码改写工具。它由 **编译时转换** 与 **[运行时适配](https://runtime.vureact.top/)** 两部分协同构成：

- **编译时** 负责将符合约定的 Vue 代码转换为结构清晰、易于维护的 React 代码，并自动注入必要的运行时依赖；
- **运行时** 则提供关键的语义适配与行为兼容层，确保转换后的组件在 React 环境中稳定运行。

两者紧密配合，共同保障了转换质量、运行稳定性与项目落地效率的平衡。

## 解决什么问题

VuReact 旨在解决以下典型场景中的开发痛点：

- **技术栈迁移**：团队希望采用 React 生态，但已积累 Vue 语法习惯与组件资产，期望平滑过渡而非彻底重学
- **渐进式重构**：旧有 Vue 系统需要逐步迁移至 React，避免高风险的一次性重写与业务中断
- **开发体验统一**：借助 Vue 的响应式心智模型编写 React 组件，同时免除手动管理依赖项与渲染优化的繁琐
- **生态扩展**：丰富跨框架的开发工具链，为多技术栈共存或迁移提供标准化方案

核心挑战在于：若输入代码的语义不可静态分析，编译器便无法稳定生成符合 React Hooks 规则的输出。
因此，VuReact 采取 **“约定优先”** 的策略：先通过明确的编译约定界定可转换的代码范围，再在该范围内实现高效、可靠的转换。

## 项目定位

当前阶段，VuReact 优先服务于以下场景：

- **新项目开发**：直接按照 VuReact 约定编写 Vue 风格的组件，并输出为 React 代码
- **现代语法支持**：专注于 Vue 3 Composition API 与 `<script setup>` 语法
- **可控渐进迁移**：支持按目录、模块逐步迁移，允许 Vue 与 React 组件在项目中并存

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

- **深度支持 `<script setup>`**：完整支持 Vue 3 Composition API，提供接近原生的开发体验
- **完整的 TypeScript 支持**：保留 Vue SFC 中的类型定义，自动生成精确的 React 组件类型
- **零运行时样式方案**：在编译时完全处理 `scoped` 和 `module` 样式，甚至 `Less` 和 `Sass`，生成生产就绪的静态 CSS
- **混合开发支持**：允许 Vue 和 React 代码在同一项目中并存，支持渐进式迁移
- **完整的工程化编译**：不仅是代码转换，更是完整的项目编译解决方案
- **智能编译**：涵盖语法转换、模板解析、样式处理、类型保留与工程优化

### 智能编译特性

- **语法智能转换**：将 Vue 3 组合式 API 智能映射为 React Hooks
- **模板智能解析**：将 Vue 模板指令智能转换为 JSX
- **样式智能处理**：将 Scoped CSS 等智能适配为 React 可运行 CSS 产物
- **类型智能保留**：智能迁移 TypeScript 类型系统
- **工程智能优化**：智能处理依赖分析、缓存机制与代码优化

## 快速开始

本节将引导你完成第一个 VuReact 项目的创建、编译和运行。

### 前提条件

- Node.js 18+ 或更高版本
- 包管理器（npm、yarn 或 pnpm）
- 基本的 Vue 3 和 React 知识

### 1. 安装

在你的 Vue 项目中安装 VuReact 编译器：

```bash
# 使用 npm
npm install -D @vureact/compiler-core

# 使用 yarn
yarn add -D @vureact/compiler-core

# 使用 pnpm
pnpm add -D @vureact/compiler-core
```

### 2. 创建示例项目

假设你有一个干净简单的 Vue 3 项目结构：

```txt
my-vue-app/
├── src/
│   ├── components/
│   │   └── Counter.vue
│   └── main.ts
├── package.json
└── vureact.config.js
```

创建一个简单的计数器组件 `src/components/Counter.vue`：

```vue
<template>
  <div class="counter">
    <h2>计数器示例</h2>
    <p>当前计数: {{ count }}</p>
    <button @click="increment">增加</button>
    <button @click="reset">重置</button>
  </div>
</template>

<script setup>
// @vr-name: Counter （注：这段注释用于告诉编译器生成的组件名）
import { ref } from 'vue';

const count = ref(0);

const increment = () => {
  count.value++;
};

const reset = () => {
  count.value = 0;
};
</script>

<style scoped>
.counter {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  max-width: 300px;
}
</style>
```

### 3. 配置编译器

在项目根目录（假设是 my-vue-app）创建 `vureact.config.js`：

```javascript
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  // 输入路径，包含要编译的 Vue 文件；允许输入单文件 'xxx.vue'
  input: 'src',

  // 启用编译缓存
  cache: true,

  // 排除 Vue 入口文件，避免语义冲突
  exclude: ['src/main.ts'],

  output: {
    // 工作区目录，存放编译产物和缓存
    workspace: '.vureact',

    // 输出目录名
    outDir: 'react-app',

    // 自动初始化 Vite React 环境
    bootstrapVite: true,
  },
});
```

实际上，除了 `exclude` 需要手动指定外，其他选项均采用示例配置中的默认值，无需额外配置。

### 4. 运行编译

在项目根目录执行编译命令：

```bash
# 一次性编译
npx vureact build

# 或使用监听模式（开发时推荐）
npx vureact watch
```

### 5. 查看输出

编译完成后，你将看到类似以下结构：

```txt
my-vue-app/
├── .vureact/           # 工作区
│   ├── react-app/      # 生成的 React 代码
│   │   └── src/
│   │       └── components/
│   │           ├── Counter.tsx
│   │           └── Counter-[hash].css
│   └── cache/          # 编译缓存
├── src/                # 原始 Vue 代码
└── vureact.config.js   # 配置文件
```

### 6. 运行 React 应用

如果启用了 `bootstrapVite: true`，VuReact 会自动初始化一个标准的 Vite React 项目：

```bash
# 进入生成的 React 项目
cd .vureact/react-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

现在你可以在浏览器中访问 `http://localhost:5173` 查看转换后的 React 应用。

### 编译结果示例

生成的 `Counter.tsx` 文件大致如下：

```tsx
import { memo, useCallback } from 'react';
import { useVRef } from '@vureact/runtime-core';
import './Counter-abc123.css';

const Counter = memo(() => {
  const count = useVRef(0);

  const increment = useCallback(() => {
    count.value++;
  }, [count.value]);

  const reset = useCallback(() => {
    count.value = 0;
  }, [count.value]);

  return (
    <div className="counter" data-css-abc123>
      <h2 data-css-abc123>计数器示例</h2>
      <p data-css-abc123>当前计数: {count.value}</p>
      <button onClick={increment} data-css-abc123>
        增加
      </button>
      <button onClick={reset} data-css-abc123>
        重置
      </button>
    </div>
  );
});

export default Counter;
```

生成附属的 counter.css 文件：

```css
.counter[data-css-abc123] {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  max-width: 300px;
}
```

## 迁移策略建议

### 渐进式迁移路径

1. **共存阶段**：在 Vue 项目中引入 VuReact，新组件使用 Vue 编写
2. **混合阶段**：逐步转换旧组件，Vue 和 React 组件共存
3. **统一阶段**：完成所有组件转换，移除 Vue 依赖

### 风险评估与规避

- **技术风险**：通过编译约定确保转换可控
- **团队风险**：保持开发体验一致，降低学习成本
- **时间风险**：支持按模块渐进迁移，避免一次性重写

### 代码示例的注释

可以自主选择在生成的 Counter.tsx 示例中增加注释，说明转换逻辑：

```tsx
// 自动从 Vue 的 ref() 转换为 @vureact/runtime-core 提供的适配 useVRef()
const count = useVRef(0);

// 自动从 @click 转换为 onClick，并智能分析依赖，添加 useCallback 优化
const increment = useCallback(() => {
  count.value++;
}, [count.value]);

// 自动添加 scoped 样式标记
<div className="counter" data-css-a1b2c3>
```

### 次要建议

### 版本兼容性

- Vue 3.x
- React 18+
- Node.js 18+

### 性能表现

在基准测试中，转换后的 React 应用：

- 首屏加载时间：与原生 React 应用相当
- 运行时内存占用：增加 < 5%
- 构建产物大小：增加 < 10%

### 生态集成

- **[Vue 核心适配包](https://runtime.vureact.top/)**：提供 React 版的 Vue 常用内置组件、核心 Composition API 等
- **[Vue 路由适配包](https://router.vureact.top/)**：支持 Vue Router 4.x -> React Router DOM 7.9+ 转换
- **状态管理**：暂无
- **UI 库**：暂无

如果确实需要，可以选择 [☣️混合编写](/guide/mind-control-readme)，以此直接使用 React 生态。

## 下一步建议

1. **阅读理念**：了解 [VuReact 的设计哲学](./philosophy)，理解"可控优先"的核心原则
2. **评估适用性**：查看 [为什么选 VuReact](./why)，确认项目是否适合使用
3. **尝试示例**：通过 [编译示例](./basic-tutorial) 了解更多转换模式
4. **学习规范**：在正式使用前，务必通读 [编译约定](./specification)
