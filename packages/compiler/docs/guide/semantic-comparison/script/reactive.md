# reactive 语义对照

解析 Vue 中高频使用的 `reactive()` 和 `shallowReactive()`，经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 `reactive`、`shallowReactive` 的 API 用法与核心行为。

## `reactive()` → React `useReactive()`

`reactive` 是 Vue 3 中最常见的响应式数据入口之一，它将对象或数组包装成响应式代理。先看最基础的编译示例：

- Vue 代码：

```ts
const state = reactive({
  count: 0,
  title: 'VuReact',
});
```

- VuReact 编译后 React 代码：

```tsx
import { useReactive } from '@vureact/runtime-core';

// 编译为 useReactive，对齐 Vue reactive 的响应式行为
const state = useReactive({
  count: 0,
  title: 'VuReact',
});
```

从示例中可以看到：Vue 的 `reactive()` 被直接编译为 React Hook——`useReactive`。VuReact 提供的 [useReactive](https://runtime.vureact.top/guide/hooks/reactive.html) 是 **reactive 的适配 API**，可理解为「React 版的 Vue reactive」，**完全模拟 Vue reactive 的行为和语义**，比如对象属性变化自动触发视图更新、直接访问嵌套属性、以及与 React 组件生命周期协同工作。

## 带 TypeScript 类型的场景

实际开发中 TS 是标配，VuReact 会保留 `reactive` 的类型信息，React 端的类型提示不丢失：

- Vue 代码：

```ts
interface User {
  id: number;
  name: string;
}

const state = reactive<{
  loading: boolean;
  users: User[];
  config: Record<string, any>;
}>({
  loading: false,
  users: [],
  config: { theme: 'dark' },
});
```

- VuReact 编译后 React TS 代码：

```tsx
interface User {
  id: number;
  name: string;
}

const state = useReactive<{
  loading: boolean;
  users: User[];
  config: Record<string, any>;
}>({
  loading: false,
  users: [],
  config: { theme: 'dark' },
});
```

无需手动适配 TS 类型，VuReact 会原封不动保留类型注解，让 React 代码的类型安全性与 Vue 端保持一致。

## `shallowReactive()` → React `useShallowReactive()`

`shallowReactive` 是 Vue 3 中用于创建浅层响应式对象的 API，适用于只需监听最外层引用变化的场景。它的编译逻辑与 `reactive` 保持一致：

- Vue 代码：

```ts
const state = shallowReactive({
  nested: { count: 0 },
});
```

- VuReact 编译后 React 代码：

```tsx
import { useShallowReactive } from '@vureact/runtime-core';

const state = useShallowReactive({
  nested: { count: 0 },
});
```

VuReact 提供的 [useShallowReactive](https://runtime.vureact.top/guide/hooks/reactive.html#%E6%B5%85%E5%B1%82%E5%93%8D%E5%BA%94) 是 **shallowReactive 的适配 API**，可理解为「React 版的 Vue shallowReactive」，**完全模拟 shallowReactive 的核心行为**——仅监听最外层引用变化，内部嵌套对象的属性修改不会触发视图更新，适合大型对象、第三方数据或复杂数据结构的性能优化场景。
