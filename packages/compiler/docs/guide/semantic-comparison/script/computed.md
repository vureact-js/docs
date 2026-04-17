# computed 语义对照

解析 Vue 中高频使用的 `computed()` ，经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 `computed` API 用法与核心行为。

## `computed()` → React `useComputed()`

`computed` 是 Vue 3 中用于声明计算属性的核心 API，依赖追踪让结果仅在相关响应式源发生变化时重新计算。VuReact 会将它编译为 `useComputed`，让 React 端也能获得同样的缓存与自动追踪能力。

- Vue 代码：

```ts
const state = reactive({
  count: 1,
  price: 99,
});

const totalPrice = computed(() => state.count * state.price);
```

- VuReact 编译后 React 代码：

```tsx
import { useReactive, useComputed } from '@vureact/runtime-core';

const state = useReactive({
  count: 1,
  price: 99,
});

const totalPrice = useComputed(() => state.count * state.price);
```

从示例可以看到：Vue 的 `computed()` 被直接编译为 React Hook——`useComputed`。VuReact 提供的 [useComputed](https://runtime.vureact.top/guide/hooks/computed.html) 是 **computed 的适配 API**，可理解为「React 版的 Vue computed」，**完全模拟 Vue computed 的依赖追踪与缓存行为**，例如只有当 `state.count` 或 `state.price` 改变时才重新计算，避免不必要的重复执行。

## 带 TypeScript 类型的场景

`computed` 在 TS 场景下同样保留类型信息，React 端的类型推断依然正常：

- Vue 代码：

```ts
const state = reactive({
  count: 1,
  price: 99,
});

const totalPrice = computed<number>(() => state.count * state.price);
```

- VuReact 编译后 React TS 代码：

```tsx
import { useReactive, useComputed } from '@vureact/runtime-core';

const state = useReactive({
  count: 1,
  price: 99,
});

const totalPrice = useComputed<number>(() => state.count * state.price);
```

无需手动适配 TS 类型，VuReact 会保留 `computed` 类型注解，让 React 端的类型安全性与 Vue 端保持一致。

## 可写 computed 与双向更新

Vue 支持可写`计算属性`，VuReact 的 `useComputed` 同样支持 `get` / `set` 形式，让**双向关联**变得自然而直观：

- Vue 代码：

```ts
const state = reactive({
  firstName: '张',
  lastName: '三',
});

const fullName = computed({
  get: () => `${state.firstName} ${state.lastName}`,
  set: (val: string) => {
    const [first, last] = val.split(' ');
    state.firstName = first || '';
    state.lastName = last || '';
  },
});
```

- VuReact 编译后 React 代码：

```tsx
const state = useReactive({
  firstName: '张',
  lastName: '三',
});

const fullName = useComputed({
  get: () => `${state.firstName} ${state.lastName}`,
  set: (val: string) => {
    const [first, last] = val.split(' ');
    state.firstName = first || '';
    state.lastName = last || '';
  },
});
```

VuReact 的 `useComputed` 也能完整适配 Vue 的可写计算属性语义，支持在 React 中通过 `fullName.value` 读取和写入，从而反向同步底层响应式状态。
