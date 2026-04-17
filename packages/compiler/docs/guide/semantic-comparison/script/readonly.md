# readonly 语义对照

解析 Vue 中高频使用的 `readonly()` 经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 `readonly` 的 API 用法与核心行为。

## `readonly()` → React `useReadonly()`

`readonly` 是 Vue 3 中用于创建深度只读副本的 API，它会返回一个不可被修改的响应式对象。VuReact 会将其编译为 `useReadonly`，让 React 中也能获得同样的只读保护能力。

- Vue 代码：

```ts
const original = reactive({
  count: 0,
  nested: { text: 'Hello' },
});

const readonlyCopy = readonly(original);
```

- VuReact 编译后 React 代码：

```tsx
import { useReactive, useReadonly } from '@vureact/runtime-core';

const original = useReactive({
  count: 0,
  nested: { text: 'Hello' },
});

const readonlyCopy = useReadonly(original);
```

VuReact 提供的 [useReadonly](https://runtime.vureact.top/guide/hooks/readonly.html) 是 **readonly 的适配 API**，可理解为「React 版的 Vue readonly」，**完全模拟 Vue readonly 的深度只读行为**——对副本的任何修改都会被阻止，开发模式下还会给出警告。

## `shallowReadonly()` → React `useShallowReadonly()`

`shallowReadonly` 是 Vue 3 中用于创建浅层只读对象的 API，它只禁止最外层属性修改，但允许内层对象继续可写。VuReact 会将其编译为 `useShallowReadonly`，让 React 中也能安全地控制只读层级。

- Vue 代码：

```ts
const state = reactive({
  user: { name: 'React', role: 'Admin' },
});

const shallowRead = shallowReadonly(state);
```

- VuReact 编译后 React 代码：

```tsx
import { useReactive, useShallowReadonly } from '@vureact/runtime-core';

const state = useReactive({
  user: { name: 'React', role: 'Admin' },
});

const shallowRead = useShallowReadonly(state);
```

VuReact 提供的 [useShallowReadonly](https://runtime.vureact.top/guide/hooks/readonly.html#浅只读) 是 **shallowReadonly 的适配 API**，可理解为「React 版的 Vue shallowReadonly」，**完全模拟 Vue shallowReadonly 的核心行为**——禁止最外层属性修改，但内部嵌套对象仍保持原始引用，内部属性依然可写。
