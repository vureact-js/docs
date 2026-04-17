# watch 语义对照

解析 Vue 中高频使用的 `watch()` 经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 `watch` 的 API 用法与核心行为。

## `watch()` → React `useWatch()`

`watch` 是 Vue 3 中用于监听响应式来源变化并执行副作用的核心 API。VuReact 会将它编译为 `useWatch`，并在编译阶段**自动分析 watch 中的依赖，进行精准的深度追踪和依赖收集，无需开发者手动管理依赖**。

- Vue 代码：

```ts
const userId = ref(1);

watch(
  userId,
  async (newId, oldId, onCleanup) => {
    let cancelled = false;

    onCleanup(() => {
      cancelled = true;
    });

    const data = await fetchUser(newId);
    if (!cancelled) {
      userData.value = data;
    }
  },
  { immediate: true },
);
```

- VuReact 编译后 React 代码：

```tsx
import { useVRef, useWatch } from '@vureact/runtime-core';

const userId = useVRef(1);

useWatch(
  userId,
  async (newId, oldId, onCleanup) => {
    let cancelled = false;

    onCleanup(() => {
      cancelled = true;
    });

    const data = await fetchUser(newId);
    if (!cancelled) {
      setUserData(data);
    }
  },
  { immediate: true },
);
```

从示例可以看到：Vue 的 `watch()` 被直接编译为 `useWatch`。VuReact 提供的 [useWatch](https://runtime.vureact.top/guide/hooks/watch.html) 是 **watch 的适配 API**，可理解为「React 版的 Vue watch」，**完全模拟 Vue watch 的回调逻辑、cleanup 机制和 immediate 选项**。

## watch `深度与多源监听` → React useWatch `深度与数组来源`

当 `watch` 监听对象内部字段或多个来源时，VuReact 同样支持深度监听和多源监听，并对依赖进行精准分析。

- Vue 代码：

```ts
const state = reactive({
  info: { name: 'Vureact', version: '1.0' },
  count: 0,
});

watch(
  () => state.info,
  (newInfo) => {
    console.log('对象内部变化:', newInfo.name);
  },
  { deep: true },
);

watch([state.count, () => state.info.name], ([newCount, newName]) => {
  console.log('计数:', newCount, '名称:', newName);
});
```

- VuReact 编译后 React 代码：

```tsx
const state = useReactive({
  info: { name: 'Vureact', version: '1.0' },
  count: 0,
});

useWatch(
  () => state.info,
  (newInfo) => {
    console.log('对象内部变化:', newInfo.name);
  },
  { deep: true },
);

useWatch([state.count, () => state.info.name], ([newCount, newName]) => {
  console.log('计数:', newCount, '名称:', newName);
});
```

VuReact 会在编译阶段对 `watch` 中的依赖进行静态分析，并生成精准的追踪逻辑，保证 `deep` 和数组来源都按预期工作，同时避免开发者手动维护依赖关系。
