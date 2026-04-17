# watchEffect 语义对照

解析 Vue 中高频使用的 `watchEffect()` 经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 `watchEffect` 的 API 用法与核心行为。

## `watchEffect()` → React `useWatchEffect()`

`watchEffect` 是 Vue 3 中用于自动响应依赖变化并执行副作用的 API，它会在首次运行后自动收集依赖。VuReact 会将它编译为 `useWatchEffect`，并在编译阶段**自动分析 watchEffect 内的依赖，进行精准的深度追踪并收集，无需开发者手动管理依赖**。

- Vue 代码：

```ts
const count = ref(0);

watchEffect(() => {
  console.log(`当前计数是: ${count.value}`);
});
```

- VuReact 编译后 React 代码：

```tsx
import { useVRef, useWatchEffect } from '@vureact/runtime-core';

const count = useVRef(0);

watchEffect(() => {
  console.log(`当前计数是: ${count.value}`);
}, [count.value]);
```

从示例可以看到：Vue 的 `watchEffect()` 被编译为 `useWatchEffect`。VuReact 提供的 [useWatchEffect](https://runtime.vureact.top/guide/hooks/watch-effect.html) 是 **watchEffect 的适配 API**，**完全模拟 Vue watchEffect 的自动依赖收集、清理机制和停止控制**。

## watchEffect + `flush` 选项 → React `useWatchPostEffect` / `useWatchSyncEffect`

当你需要在 React DOM 更新后执行副作用时，Vue 中的 `watchEffect` 可以通过 `flush: 'post'` 或 `flush: 'sync'` 选项编译为对应的 React 版本，保持与渲染时机的一致性。

- Vue 代码：

```ts
const width = ref(0);
const elRef = ref(null);

watchEffect(
  () => {
    if (elRef.value) {
      width.value = elRef.value.offsetWidth;
    }
  },
  { flush: 'post' },
);

watchEffect(
  () => {
    // sync 模式用于 React 同步更新场景
    console.log(elRef.value);
  },
  { flush: 'sync' },
);
```

- VuReact 编译后 React 代码：

```tsx
import { useWatchPostEffect, useWatchSyncEffect } from '@vureact/runtime-core';

const width = useVRef(0);
const elRef = useVRef(null);

useWatchPostEffect(() => {
  if (elRef.value) {
    width.value = elRef.value.offsetWidth;
  }
}, [elRef.value, width.value, elRef.value.offsetWidth]);

useWatchSyncEffect(() => {
  // sync 模式用于 React 同步更新场景
  console.log(elRef.value);
}, [elRef.value]);
```

VuReact 在编译阶段会自动识别 `watchEffect` 中的依赖，并生成对应的 React 依赖数组，保证 `useWatchEffect` / `useWatchPostEffect` / `useWatchSyncEffect` 的行为与 Vue 一致。
