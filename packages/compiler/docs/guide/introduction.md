# 开始

## 什么是 VuReact

VuReact（Vue + React 连读，发音 `/vjuːˈriːækt/`）是一个面向 Vue 3 -> React 的编译工具，专注于为新项目和可控迁移场景提供最佳体验。

它的目标不是"让任何 Vue 代码都自动变成 React 代码"，而是提供一个 **可预测、可分析、可维护** 的转换路径，让开发者可以在可控前提下推进跨框架开发。

另外，VuReact 不是单点的“只做代码改写”工具。它由 **编译时转换** 与 **[运行时适配](https://vureact-runtime.vercel.app/)** 两部分协同组成：

- 编译阶段负责把 Vue 风格输入转换为可分析、可维护的 React 产物，并自动添加运行时依赖；

- 运行时阶段提供必要的语义适配与行为兜底。两者配合，才能在工程可控的前提下，兼顾转换质量、运行稳定性与落地效率。

## 解决什么问题

在实际工程里，团队常见两类需求：

- 新项目想采用 React 生态，但团队已有 Vue 语法与组件习惯
- 旧系统希望渐进式迁移，而不是一次性重写
- 丰富跨框架开发领域

问题在于：一旦输入代码不可分析，编译器就无法稳定地产生符合 React Hook 规则的产物。

VuReact 的策略是：先定义约定，再在约定内尽可能高效转换。

## 项目定位

当前阶段定位为 **实验版**，优先服务：

- Vue 3 + Script Setup 语法
- 按 VuReact 约定编写的新项目
- 可控范围内的渐进式迁移（分目录、分模块推进）

不优先服务：

- 复杂旧项目的"零改动一键迁移"
- 大量历史混合写法且短期无法规整的工程

## 这是什么 / 这不是什么

这是：

- Vue SFC + `<script setup>` 的语法转换工具链
- 带约束的编译平台，而不是无边界脚本替换
- 能给出告警/报错并提示你修正输入的工程化工具

这不是：

- 万能迁移魔术师
- 对任何写法都兜底的运行时解释器
- 保证全量旧项目无改动迁移的承诺产品

## 核心特性

VuReact 提供了以下关键能力：

- **🔄 Script setup 深度支持**：完整支持 Vue 3 Composition API，提供最接近原生的开发体验
- **📝 TypeScript 支持**：完整保留 Vue SFC 中的类型定义，自动生成精确的 React 组件类型
- **⚡ 零运行时样式方案**：编译时完全处理 scoped 和 module 样式，生成生产就绪的静态 CSS
- **🌉 混合开发支持**：允许 Vue 和 React 代码在同一个项目中共存，实现渐进迁移
- **🔧 完整的工程化编译**：不仅仅是代码转换，而是完整的项目编译解决方案

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
└── vite.config.ts
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

  // 排除 Vue 入口文件，避免语义冲突
  exclude: ['src/main.ts'],

  output: {
    // 工作区目录，存放编译产物和缓存
    workspace: '.vureact',

    // 输出目录名
    outDir: 'dist',

    // 自动初始化 Vite React 环境
    bootstrapVite: true,
  },
});
```

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
│   ├── dist/           # 生成的 React 代码
│   │   └── src/
│   │       └── components/
│   │           ├── Counter.tsx
│   │           └── counter-[hash].css
│   └── cache/          # 编译缓存
├── src/                # 原始 Vue 代码
└── vureact.config.js   # 配置文件
```

### 6. 运行 React 应用

如果启用了 `bootstrapVite: true`，VuReact 会自动初始化一个标准的 Vite React 项目：

```bash
# 进入生成的 React 项目
cd .vureact/dist

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
import './counter-a1b2c3.css';

const Counter = memo(() => {
  const count = useVRef(0);

  const increment = useCallback(() => {
    count.value++;
  }, [count.value]);

  const reset = useCallback(() => {
    count.value = 0;
  }, [count.value]);

  return (
    <div className="counter" data-css-a1b2c3>
      <h2 data-css-a1b2c3>计数器示例</h2>
      <p data-css-a1b2c3>当前计数: {count.value}</p>
      <button onClick={increment} data-css-a1b2c3>
        增加
      </button>
      <button onClick={reset} data-css-a1b2c3>
        重置
      </button>
    </div>
  );
});

export default Counter;
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

### 5. **优化代码示例的注释**

在生成的 Counter.tsx 示例中增加注释，说明转换逻辑：

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

---

### 版本兼容性

- Vue 3
- React 18+
- Node.js 18+

### 性能表现

在基准测试中，转换后的 React 应用：

- 首屏加载时间：与原生 React 应用相当
- 运行时内存占用：增加 < 5%
- 构建产物大小：增加 < 10%

### 生态集成

- **[Vue 核心适配包](https://vureact-runtime.vercel.app/)**：提供 React 版的 Vue 常用内置组件、核心 Composition API 等
- **[路由适配包](https://router-vureact.vercel.app/)**：支持 Vue Router 4.x -> React Router DOM 7.9+ 转换
- **状态管理**：暂无
- **UI 库**：暂无

## 下一步建议

1. **阅读理念**：了解 [VuReact 的设计哲学](./philosophy)，理解"可控优先"的核心原则
2. **评估适用性**：查看 [为什么选 VuReact](./why)，确认项目是否适合使用
3. **学习规范**：在正式使用前，务必通读 [编译约定](./specification)
4. **尝试示例**：通过 [基础示例](./basic-tutorial) 学习更多转换模式
