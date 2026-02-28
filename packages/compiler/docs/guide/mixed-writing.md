# 混合编写

> ⚠️ 混写是 VuReact 编译器的原生支持功能，但使用时需注意：
>
> 1. **Vue 工具链失效**：包含 React 代码的 `.vue` 文件将无法被 Vue 编译器、Volar、Vite Vue 插件等 Vue 生态工具正常处理
> 2. **仅限编译时**：混合代码仅在 VuReact 编译过程中被识别和处理，无法在 Vue 运行时环境中执行
> 3. **明确边界**：建议仅在渐进迁移的过渡阶段使用，并规划好向纯 React 代码的迁移路径

## 什么是混合编写

混合编写（Mixed Writing）是 VuReact 编译器的一项**原生能力**，允许你在 Vue 单文件组件（SFC）中直接编写 React 代码。

**核心原则**：编译器不会对 React 代码做特殊处理，而是**原封不动地**将其迁移到生成的 React 代码中。这意味着：

- 不需要特殊的类似 `<react>` 标签或 `defineReactComponent` API
- 不需要运行时桥接层或适配器
- 就像在真实的 `.jsx` 文件里写 React 代码一样

**唯一的要求**：开发者同时具备 Vue 和 React 的心智模型，理解两个框架的差异，随时切换思维，不被任何一方“**心灵控制**”。

## 工作原理

VuReact 编译器的工作原理非常简单直接：

1. **解析阶段**：编译器解析 Vue SFC，识别出 Vue 特有的语法（模板、指令、Vue Composition API 等）
2. **转换阶段**：将 Vue 语法转换为对应的 React 语法
3. **保留阶段**：对于非 Vue 特有的代码（纯 JavaScript/TypeScript、React 代码等），**原封不动地保留**
4. **生成阶段**：生成最终的 React 组件代码

**关键点**：编译器不会尝试理解或转换 React 代码，它只处理 Vue 特有的部分。

## 基础示例

### 示例 1：在 Vue SFC 中使用 React Hooks

```vue
<template>
  <div>
    <h2>混合编写示例</h2>
    <p>Vue 响应式数据: {{ count }}</p>
    <p>React 状态: {{ reactCount }}</p>
    <button @click="increment">Vue 增加</button>
    <button @click="incrementReact">React 增加</button>
  </div>
</template>

<script setup lang="ts">
// @vr-name: Component
import { ref } from 'vue';
import { useState, useCallbac } from 'react'; // 直接导入 React

// Vue 响应式数据
const count = ref(0);
const increment = () => {
  count.value++;
};

// React 状态（在 Vue SFC 中直接使用）
const [reactCount, setReactCount] = useState(0);
const incrementReact = useCallbac(() => {
  setReactCount(reactCount + 1);
}, [reactCount]);
</script>

<style scoped>
/* 样式会被编译为静态 CSS 并自动计算固定哈希值 */
div {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>
```

**编译后的 React 代码**：

```tsx
import { memo, useState, useCallback } from 'react';
import { useVRef } from '@vureact/runtime-core';
import './component-abc1234.css';

const Component = memo(() => {
  // Vue 的 ref() 被转换为 useVRef()
  const count = useVRef(0);

  // React 的 useState 原封不动保留
  const [reactCount, setReactCount] = useState(0);

  // Vue 方法被转换为 useCallback
  const increment = useCallback(() => {
    count.value++;
  }, [count.value]);

  // React 方法原封不动保留
  const incrementReact = useCallback(() => {
    setReactCount(reactCount + 1);
  }, [reactCount]);

  return (
    <div data-css-abc1234>
      <h2 data-css-abc1234>混合编写示例</h2>
      <p data-css-abc1234>Vue 响应式数据: {count.value}</p>
      <p data-css-abc1234>React 状态: {reactCount}</p>
      <button onClick={increment} data-css-abc1234>
        Vue 增加
      </button>
      <button onClick={incrementReact} data-css-abc1234>
        React 增加
      </button>
    </div>
  );
});

export default Component;
```

## 心智模型要求

使用混合编写需要开发者具备双重框架心智模型：

### Vue 心智模型（在 `.vue` 文件中）

- 使用 `<template>` 编写模板
- 使用 **&#123;&#123; state &#125;&#125;** 进行插值
- 使用 `@click`、`v-if`、`v-for` 等指令
- 使用 `ref()`、`reactive()`、`computed()` 等 Composition API

### React 心智模型（在 `<script setup>` 中）

- 使用 `useState`、`useEffect`、`useCallback` 等 Hooks
- 使用 JSX 语法（直接在模板中写即可）
- 了解 React 的渲染周期和状态更新机制
- 使用 React 生态的库和组件

### 关键区别

1. **响应式系统**：Vue 使用自动依赖追踪，React 需要手动声明依赖
2. **模板 vs JSX**：Vue 使用基于 HTML 的模板，React 使用 JSX
3. **生命周期**：Vue 有明确的生命周期钩子，React 使用 Effects
4. **状态更新**：Vue 状态是响应式的，React 状态更新触发重新渲染

## 注意事项

### 约束

1. **React 代码原样保留**：编译器不会修改 React 代码
2. **无法交叉引用**：Vue 响应式数据在 React 代码中需要通过 `.value` 访问
3. **抑制惯性思维**：时刻记住，实际上你在编写的是 React 代码，享受的是 Vue 心智优势

## 最佳实践

### 1. 明确代码边界

```vue
<script setup lang="ts">
// Vue 部分：处理视图逻辑、响应式数据
import { ref, computed } from 'vue';
const count = ref(0);
const double = computed(() => count.value * 2);

// React 部分：处理复杂状态、副作用、使用 React 生态库
import { useState, useEffect } from 'react';
import { useSomeReactHook } from 'some-react-library';

const [reactState, setReactState] = useState(null);
useEffect(() => {
  // React 副作用
}, []);
</script>
```

### 2. 渐进式迁移策略

1. **阶段一**：在 Vue 组件中引入简单的 React Hooks
2. **阶段二**：将复杂逻辑重写为 React 代码
3. **阶段三**：逐步替换 Vue 模板为 JSX
4. **阶段四**：最终转换为纯 React 组件

### 3. 代码组织建议

- 将 Vue 代码和 React 代码用空行分隔
- 添加注释说明哪些是 Vue 代码，哪些是 React 代码
- 为混合代码编写详细的文档
- 保持每个函数的单一职责

## 常见问题

### Q: 为什么我的 React 代码在 Vue 开发环境中报错？

A: 因为 Vue 的开发工具（Volar、Vite Vue 插件等）无法识别 React 语法。这是正常现象，只要 VuReact 编译器能正常编译即可，或者关闭 Typescript 检查。

### Q: 混合编写会影响性能吗？

A: 编译后的代码性能与纯 React 应用相当。混合编写本身不会引入运行时开销，因为 React 代码是原样保留的。

### Q: 如何调试混合代码？

A: 1. 先确保 Vue 部分能正常编译 2. 查看编译后的 React 代码 3. 在 React 环境中调试。可以使用 source map 追踪问题。

### Q: 是否支持 TypeScript？

A: 完全支持。Vue 的 `defineProps`、`defineEmits` 等类型会被转换为 React 的接口类型。React 代码中的 TypeScript 语法会原样保留。

## 总结

混合编写是 VuReact 提供的一种**高级用法**，它体现了编译器的核心理念：

> **在约定范围内给予最大自由**

通过混合编写，你可以：

- 在渐进迁移中保持灵活性
- 充分利用两个框架的生态优势
- 以可控的方式推进技术栈升级

**最后提醒**：混合编写需要开发者对 Vue 和 React 都有深入理解。如果你对任一框架不熟悉，建议先完成学习，或者采用更保守的迁移策略。

> 💡 **建议**：对于新项目，建议使用纯 Vue 写法；对于迁移项目，可以先从简单的混合开始，逐步增加 React 代码的比例，最终完成全量迁移。
