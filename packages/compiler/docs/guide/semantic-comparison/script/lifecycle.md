# 生命周期语义对照

解析 Vue 中常见的`生命周期`钩子经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中生命周期钩子例如 `onMounted、onBeforeMount、onUpdated、onBeforeUpdate、onBeforeUnmount、onUnmounted` 的 API 用法与核心行为。

## `onMounted()` → React `useMounted()`

`onMounted` 是 Vue 3 中用于组件首次挂载后执行逻辑的生命周期钩子，适合放初始化请求、订阅启动、DOM 相关准备等操作。VuReact 会将它编译为 `useMounted`，让 React 端也能在组件挂载后执行一次性副作用。

- Vue 代码：

```ts
onMounted(() => {
  console.log('组件已挂载');
});
```

- VuReact 编译后 React 代码：

```ts
import { useMounted } from '@vureact/runtime-core';

useMounted(() => {
  console.log('组件已挂载');
});
```

从示例可以看到：Vue 的 `onMounted()` 被编译为 `useMounted`。VuReact 提供的 [useMounted](https://runtime.vureact.top/guide/hooks/mounted.html) 是 **onMounted 的适配 API**，**完全模拟 Vue onMounted 的首次挂载后执行时机**。

## `onBeforeMount()` → React `useBeforeMount()`

`onBeforeMount` 是 Vue 3 中用于组件挂载前执行逻辑的钩子，适合放需要在布局阶段之前准备的内容。VuReact 会将它编译为 `useBeforeMount`，基于 React 的布局效果在挂载前执行。

- Vue 代码：

```ts
onBeforeMount(() => {
  console.log('组件即将挂载');
});
```

- VuReact 编译后 React 代码：

```ts
import { useBeforeMount } from '@vureact/runtime-core';

useBeforeMount(() => {
  console.log('组件即将挂载');
});
```

VuReact 提供的 [useBeforeMount](https://runtime.vureact.top/guide/hooks/before-mount.html) 是 **onBeforeMount 的适配 API**，**完全模拟 Vue onBeforeMount 的首次挂载前时机**。

## `onBeforeUpdate()` → React `useBeforeUpdate()`

`onBeforeUpdate` 是 Vue 3 中用于跳过首次挂载，仅在组件更新前执行的钩子，适合放变更前校验、记录旧值、提前准备等逻辑。VuReact 会将它编译为 `useBeforeUpdate`，并支持依赖数组以控制触发时机。

- Vue 代码：

```ts
const state = reactive({ count: 0 });

onBeforeUpdate(() => {
  console.log('更新前，当前 count:', state.count);
});
```

- VuReact 编译后 React 代码：

```ts
import { useReactive, useBeforeUpdate } from '@vureact/runtime-core';

const state = useReactive({ count: 0 });

useBeforeUpdate(() => {
  console.log('更新前，当前 count:', state.count);
}, [state.count]);
```

从示例可以看到：Vue 的 `onBeforeUpdate()` 被编译为 `useBeforeUpdate`。VuReact 提供的 [useBeforeUpdate](https://runtime.vureact.top/guide/hooks/before-update.html) 是 **onBeforeUpdate 的适配 API**，**完全模拟 Vue onBeforeUpdate 的更新前触发时机**。当 React 对应 API 需要依赖数组时，`deps` 数组可用于只在指定值变化时触发，VuReact 会在编译阶段自动分析依赖并映射到对应依赖数组，**避免开发者手动管理依赖**。

## `onUpdated()` → React `useUpdated()`

`onUpdated` 是 Vue 3 中用于组件更新后执行逻辑的钩子，适合放读取最新渲染结果、执行后续同步等操作。VuReact 会将它编译为 `useUpdated`，并支持可选依赖数组来精确控制触发条件。

- Vue 代码：

```ts
const state = reactive({ count: 0 });

onUpdated(() => {
  console.log('组件更新后，count:', state.count);
});
```

- VuReact 编译后 React 代码：

```ts
import { useReactive, useUpdated } from '@vureact/runtime-core';

const state = useReactive({ count: 0 });

useUpdated(() => {
  console.log('组件更新后，count:', state.count);
}, [state.count]);
```

VuReact 提供的 [useUpdated](https://runtime.vureact.top/guide/hooks/updated.html) 是 **onUpdated 的适配 API**，**完全模拟 Vue onUpdated 的更新后执行时机**。如果 React API 使用 `deps` 数组，VuReact 会自动分析依赖并生成对应的数组，**无需开发者手动维护依赖**。

## `onBeforeUnmount()` → React `useBeforeUnMount()`

`onBeforeUnmount` 是 Vue 3 中用于组件卸载前执行的钩子，适合放动画停止、资源解绑、日志上报等清理前逻辑。VuReact 会将它编译为 `useBeforeUnMount`，在卸载前执行。

- Vue 代码：

```ts
onBeforeUnmount(() => {
  console.log('组件即将卸载');
});
```

- VuReact 编译后 React 代码：

```ts
import { useBeforeUnMount } from '@vureact/runtime-core';

useBeforeUnMount(() => {
  console.log('组件即将卸载');
});
```

VuReact 提供的 [useBeforeUnMount](https://runtime.vureact.top/guide/hooks/before-unmount.html) 是 **onBeforeUnmount 的适配 API**，**完全模拟 Vue onBeforeUnmount 的卸载前时机**。

## `onUnmounted()` → React `useUnmounted()`

`onUnmounted` 是 Vue 3 中用于组件卸载时执行逻辑的钩子，适合放最终资源释放、异步取消、上报日志等收尾逻辑。VuReact 会将它编译为 `useUnmounted`，在组件卸载时执行。

- Vue 代码：

```ts
onUnmounted(() => {
  console.log('组件已卸载');
});
```

- VuReact 编译后 React 代码：

```ts
import { useUnmounted } from '@vureact/runtime-core';

useUnmounted(() => {
  console.log('组件已卸载');
});
```

VuReact 提供的 [useUnmounted](https://runtime.vureact.top/guide/hooks/unmounted.html) 是 **onUnmounted 的适配 API**，**完全模拟 Vue onUnmounted 的卸载时机**。
