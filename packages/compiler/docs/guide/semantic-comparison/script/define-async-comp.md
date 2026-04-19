# defineAsyncComponent 语义对照

解析 Vue 中用于异步组件的 `defineAsyncComponent()` 经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 `defineAsyncComponent` 的 API 用法与核心行为。

## `defineAsyncComponent()` → React `defineAsyncComponent()`

`defineAsyncComponent` 是 Vue 3 中用于定义异步组件的 API，它允许你按需加载组件，优化应用性能。VuReact 会将其编译为同名的 `defineAsyncComponent`，让 React 中也能获得同样的异步组件能力。

- Vue 代码：

```vue
<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() => import('./components/AsyncComponent.vue'));
</script>

<template>
  <AsyncComponent />
</template>
```

- VuReact 编译后 React 代码：

```tsx
import { defineAsyncComponent } from '@vureact/runtime-core';

const AsyncComponent = defineAsyncComponent(() => import('./components/AsyncComponent'));

function MyComponent() {
  return <AsyncComponent />;
}
```

VuReact 提供的 [defineAsyncComponent](https://runtime.vureact.top/guide/components/async.html) 是 **Vue defineAsyncComponent 的适配 API**，可理解为「React 版的 Vue defineAsyncComponent」，**完全模拟 Vue defineAsyncComponent 的异步加载行为**——支持懒加载、加载状态处理、错误处理等完整功能。

## 高级用法

`defineAsyncComponent` 在 Vue 3 中支持多种配置选项，如加载状态组件、错误处理组件、超时设置等。VuReact 会将其编译为相应的 React 配置，保持功能一致性。

- Vue 代码：

```vue
<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent({
  loader: () => import('./components/HeavyComponent.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200,
  timeout: 3000,
  suspensible: true,
});
</script>
```

- VuReact 编译后 React 代码：

```tsx
import { defineAsyncComponent } from '@vureact/runtime-core';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';

const AsyncComponent = defineAsyncComponent({
  loader: () => import('./components/HeavyComponent'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200,
  timeout: 3000,
  suspensible: true,
});
```

VuReact 提供的 `defineAsyncComponent` 支持 **所有 Vue defineAsyncComponent 的配置选项**，包括 `loader`、`loadingComponent`、`errorComponent`、`delay`、`timeout`、`suspensible` 等，**完全模拟 Vue defineAsyncComponent 的高级功能**——在 React 中实现与 Vue 一致的异步组件体验。
