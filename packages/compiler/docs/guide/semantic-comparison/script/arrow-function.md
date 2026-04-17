# 箭头函数优化对照

解析 Vue 中的`顶层箭头函数`，在经过 VuReact 编译后会如何被自动优化成 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中顶层箭头函数和 React 依赖优化相关概念。

## 顶层箭头函数 → React `useCallback`

在 Vue `<script setup>` 中，顶层箭头函数通常用于定义事件处理函数、计算逻辑或辅助方法。VuReact 会在编译阶段自动分析这些顶层箭头函数的外部依赖，并将符合条件的函数编译为 `useCallback`。

- Vue 代码：

```vue
<script setup>
const inc = () => {
  count.value++;
};

const fn = () => {};

const fn2 = () => {
  const value = foo.value;
  const fn4 = () => {
    value + state.bar.c--;
  };

  fn();
};
</script>
```

- VuReact 编译后 React 代码：

```tsx
const inc = useCallback(() => {
  count.value++;
}, [count.value]);

// 忽略对无依赖的箭头函数优化
const fn = () => {};

const fn2 = useCallback(() => {
  // 对初始值进行溯源，并收集 foo.value
  const value = foo.value;

  // 忽略对局部箭头函数的优化
  const fn4 = () => {
    value + state.bar.c--;
  };

  fn();
}, [foo.value, state.bar.c]);
```

从示例可以看到：VuReact 会自动为顶层箭头函数补齐 `useCallback` 依赖数组，**无需开发者手动管理依赖**。

## 自动依赖分析的关键点

- **顶层箭头函数才会被考虑优化**：局部函数、嵌套函数不会被强制转换为 `useCallback`；
- **依赖收集基于 React 规则**：只分析函数外部可追踪的响应式值；
- **精确收集依赖**：若函数内部使用了 `foo.value`、`state.bar.c` 等响应式访问，依赖数组会补齐这些实际引用；
- **避免过度优化**：没有外部依赖的顶层箭头函数会保留为普通函数，避免不必要的 Hook 开销。
