# ref 语义对照

解析 Vue 中高频使用的 `ref()` 和 `shallowRef()`，经过语义编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中Vue/React代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉Vue3中 `ref`、`shallowRef` 的 API 用法与核心行为。

## `ref()` → React `useVRef()`

`ref` 是 Vue3 中最基础的响应式 API，也是日常开发中使用频率最高的 API 之一。先看最基础的编译示例：

- Vue 代码：

```ts
// 定义基础类型响应式数据
const count = ref(0);
```

- VuReact 编译后 React 代码：

```tsx
import { useVRef } from '@vureact/runtime-core';

// 编译为专属 Hook，语义与行为完全对齐 Vue ref
const count = useVRef(0);
```

从示例能清晰看到：Vue的`ref()`被直接编译为React Hook——`useVRef`。VuReact 提供的 [useVRef](https://runtime.vureact.top/guide/hooks/v-ref.html) 是 **ref 的适配 API**，可理解为「React 版的 Vue ref」，**完全模拟 Vue ref 的行为和语义**，比如值的更新触发视图重新渲染、.value访问/修改规则（底层逻辑已适配React特性）等。

## 带 TypeScript 类型的场景

实际开发中 TS 是标配，VuReact 也能完美保留类型信息，确保 React 端的类型提示不丢失：

- Vue 代码：

```ts
// 不同类型的TS注解场景
const title = ref<string>(''); // 字符串类型
const isLoading = ref<boolean>(false); // 布尔类型
const userList = ref<Array<{ id: number; name: string }>>([]); // 数组对象类型
const config = ref<Record<string, any>>({ theme: 'dark' }); // 任意键值对类型
```

- VuReact 编译后 React TS 代码：

```tsx
// 类型注解完整保留，React中类型提示正常生效
const title = useVRef<string>('');
const isLoading = useVRef<boolean>(false);
const userList = useVRef<Array<{ id: number; name: string }>>([]);
const config = useVRef<Record<string, any>>({ theme: 'dark' });
```

无需手动适配 TS 类型，VuReact 会原封不动保留类型注解，让 React 代码的类型安全性与 Vue 端保持一致。

## `shallowRef()` → React `useShallowVRef()`

`shallowRef`作为Vue3的「浅层响应式」API，适用于不需要深层监听的复杂对象场景，能有效提升性能。它的编译逻辑与`ref`一脉相承：

- Vue 代码：

```ts
// 浅层响应式：仅监听.count的引用变化，不监听内部嵌套属性
const count = shallowRef({ a: { b: 1, c: { d: 2 } } });
```

- VuReact 编译后 React 代码：

```tsx
import { useShallowVRef } from '@vureact/runtime-core';

// 编译为 useShallowVRef，对齐 shallowRef 的浅层响应式行为
const count = useShallowVRef({ a: { b: 1, c: { d: 2 } } });
```

同样的逻辑：Vue 的 `shallowRef()` 被编译为 `useShallowVRef` Hook，VuReact 提供的 [useShallowVRef](https://runtime.vureact.top/guide/hooks/v-ref.html#浅层-ref) **是 shallowRef 的适配 API**，可理解为「React 版的 Vue shallowRef 」，**完全模拟 Vue shallowRef 的核心行为**——仅监听最外层引用的变化，嵌套对象的属性修改不会触发视图更新，完美适配 React 的更新机制。
