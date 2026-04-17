# defineProps 语义对照

解析 Vue 中常见的 `defineProps` 宏经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 `defineProps` 的 API 用法与核心行为。

## `defineProps<{ ... }>()` → React `props` 类型 + 参数

`defineProps` 是 Vue 3 `<script setup>` 中用于声明组件输入属性的宏，它既允许类型参数声明，也支持运行时声明形式。VuReact 会将它编译为 React 中的 props 类型声明，并将组件参数改写为 `props`。

- Vue 代码：

```ts
const props = defineProps<{ id: string; enabled?: boolean }>();
```

- VuReact 编译后 React 代码：

```tsx
type ICompProps = {
  id: string;
  enabled?: boolean;
};

const Comp = (props: ICompProps) => {
  // ...
};
```

从示例可以看到：Vue 的 `defineProps` 并不会直接编译为某个运行时 Hook，而是转换为 React 中标准的 `props` 类型和组件参数。VuReact 会将 `defineProps` 中的类型信息提取为独立的 props 类型定义，**保持类型安全与 React 组件 Props 规范一致**。

## `defineProps(['foo', 'bar'])` / `defineProps({ ... })` → React `props` 推导

除了类型参数形式，`defineProps` 还支持数组和对象形式的运行时声明。VuReact 会对这些形式进行类型推导，并在可行的情况下将结果映射到 React 的 `props` 类型。

- Vue 代码：

```ts
const props = defineProps(['foo', 'bar']);
```

- React 输出（示意）：

```tsx
type ICompProps = {
  foo?: any;
  bar?: any;
};

const Comp = (props: ICompProps) => {
  // ...
};
```

若使用对象形式声明，编译器也会尽量保留类型推导。虽然这两种形式可用，但**推荐优先使用类型参数形式**，因为它在 React 端的类型提示更清晰、结果更可控。
