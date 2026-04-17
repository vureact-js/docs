# defineSlots 语义对照

解析 Vue 中常见的 `defineSlots` 宏经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 `defineSlots` 的 API 用法与核心行为。

## `defineSlots` → React `props` slot 类型

`defineSlots` 是 Vue 3 `<script setup>` 中用于声明组件插槽类型的宏。VuReact 会将它编译为 React 组件 `props` 中对应的插槽函数类型，使插槽在 React 端具有可调用 props 的形式。

- Vue 代码：

```ts
defineSlots<{
  default?(): any;
  footer(props: { count: number }): any;
}>();
```

- VuReact 编译后 React 代码：

```tsx
type ICompProps = {
  children?: React.ReactNode;
  footer?: (props: { count: number }) => React.ReactNode;
};
```

从示例可以看到：Vue 的 `defineSlots` 不会直接编译为运行时 Hook，而是转换为 React `props` 类型中的 slot 回调声明。VuReact 会将 `default` 插槽映射为 `children`，并将具名插槽映射为对应的函数式 props，**保持 Vue 插槽语义与 React props 组合之间的自然对应**。
