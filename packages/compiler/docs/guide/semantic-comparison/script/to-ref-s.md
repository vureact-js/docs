# toRef/toRefs 语义对照

解析 Vue 中高频使用的 `toRef()` 和 `toRefs()`，经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 `toRef`、`toRefs` 的 API 用法与核心行为。

## `toRef()` → React `useToVRef()`

`toRef` 是 Vue 3 中用于把响应式对象的某个属性转换为 Ref 的 API，适合解构后仍然希望保持响应式的场景。VuReact 将它编译为 `useToVRef`，让 React 中也能获得同样的 “属性引用转换” 能力。

- Vue 代码：

```ts
const state = reactive({
  count: 1,
  user: { name: 'Gemini' },
});

const countRef = toRef(state, 'count');
```

- VuReact 编译后 React 代码：

```tsx
import { useReactive, useToVRef } from '@vureact/runtime-core';

const state = useReactive({
  count: 1,
  user: { name: 'Gemini' },
});

const countRef = useToVRef(state, 'count');
```

从示例可以看到：Vue 的 `toRef()` 被直接编译为 `useToVRef`。VuReact 提供的 [useToVRef](https://runtime.vureact.top/guide/hooks/to-v-ref.html) 是 **toRef 的适配 API**，可理解为「React 版的 Vue toRef」，**完全模拟 Vue toRef 的行为**——提取后的 ref 对象 `countRef.value` 仍与源对象 `state.count` 双向绑定。

## `toRefs()` → React `useToVRefs()`

`toRefs` 是 Vue 3 中用于将整个响应式对象的所有属性转换成 Ref 对象集合的 API，它可以避免解构后丢失响应式的风险。VuReact 会把它编译为 `useToVRefs`，让 React 中也能安全地对对象属性进行结构赋值。

- Vue 代码：

```ts
const state = reactive({
  foo: 1,
  bar: 'Hello',
});

const { foo, bar } = toRefs(state);
```

- VuReact 编译后 React 代码：

```tsx
import { useReactive, useToVRefs } from '@vureact/runtime-core';

const state = useReactive({
  foo: 1,
  bar: 'Hello',
});

const { foo, bar } = useToVRefs(state);
```

VuReact 提供的 [useToVRefs](https://runtime.vureact.top/guide/hooks/to-v-ref.html#torefs) 是 **toRefs 的适配 API**，可理解为「React 版的 Vue toRefs」，**完全模拟 Vue toRefs 的语义**——解构后的 `foo` 和 `bar` 都是 Ref 对象，可通过 `.value` 访问、修改，并与原始响应式对象保持同步。
