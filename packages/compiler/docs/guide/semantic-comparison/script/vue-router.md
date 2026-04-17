# Vue 路由语义对照

我们将从 Vue Router 宏观对照入手，看看 Vue 中的路由组件、API 与入口结构，经过 VuReact 编译后会变成什么样的 React 路由代码。

本文仅展示部分路由组件与 API，实际上完整适配还包括`路由类型接口`等更多内容，详情请查阅 [VuReact Router](https://router.vureact.top) 文档。

## 前置约定

为避免示例冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue Router API 用法与核心行为。

## `router` 组件：`<router-link>` / `<router-view>`

Vue 的路由组件在 React 中被映射为 `@vureact/router` 提供的适配组件。

- Vue 代码：

```vue
<template>
  <router-link to="/home">Home</router-link>
  <router-view />
</template>
```

- VuReact 编译后 React 代码：

```tsx
import { RouterLink, RouterView } from '@vureact/router';

return (
  <>
    <RouterLink to="/home">Home</RouterLink>
    <RouterView />
  </>
);
```

`RouterLink` 在 React 中同样支持字符串 `to`、对象 `to`、`activeClassName`、`customRender` 等 Vue 风格用法；`RouterView` 负责渲染当前匹配路由组件，并保持嵌套路由、路由守卫与元字段的执行顺序。

## 路由配置：`createRouter` + history

Vue Router 的创建方式在 VuReact 中保持语义一致，但依赖会替换为 `@vureact/router`。

- Vue 代码：

```ts
import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: Home }],
});
```

- VuReact 编译后 React 代码：

```ts
import { createRouter, createWebHistory } from '@vureact/router';
import Home from './views/Home';

export default createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: Home }],
});
```

这说明：

- `createRouter` / `createWebHistory` 等 API 名称保持不变；
- 仅依赖路径会被替换成 `@vureact/router`；
- Vue Router 的路由记录、嵌套路由、`meta` 字段可直接保留。

## 入口注入：`RouterProvider`

如果启用了[自动适配](#自动适配)，VuReact 会在编译后自动调整入口文件，将原 `<App />` 替换为路由实例的 `RouterProvider`。

- 生成后的 React 入口文件：

```tsx
import RouterInstance from './router/index';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterInstance.RouterProvider />
  </StrictMode>,
);
```

该入口结构体现了 Vue 路由到 React 路由适配的宏观变化：

- Vue 的路由配置文件继续作为路由实例入口；
- React 入口通过 `RouterProvider` 挂载路由上下文；
- 因此无需手动改写业务路由逻辑，只需保证路由定义规范。

## 运行时 API：`useRouter` / `useRoute`

Vue 的组合式路由 API 在 React 中仍保留相同语义。

- Vue 代码：

```ts
const router = useRouter();
const route = useRoute();

const goHome = () => {
  router.push('/home');
};
```

- VuReact 编译后 React 代码：

```tsx
import { useRouter, useRoute } from '@vureact/router';

const router = useRouter();
const route = useRoute();

const goHome = useCallback(() => {
  router.push('/home');
}, [router]);
```

`useRouter()` 与 `useRoute()` 仍然支持编程式导航、参数读取、`meta` 等字段，且使用方式与 Vue Router 组合式 API 语义保持一致。

## 自动适配

当编译器检测到项目中使用 Vue Router 时，会自动：

- 将 `import ... from 'vue-router'` 替换为 `import ... from '@vureact/router'`；
- 将路由配置文件产物变更为 `@vureact/router` 的路由实例；
- 将入口文件自动改写为 `RouterProvider` 渲染。

配置示例：

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  router: {
    // 路由入口文件路径（即调用并默认导出 createRouter() 的地方）
    configFile: 'src/router/index.ts',
  },
});
```

## 手动适配

> 以下方案为通用建议，具体实现细节请开发者根据实际项目需求进行调整。

当选项 `output.bootstrapVite` 或者 `router.autoSetup` 为 `false` 时，自动适配不可用，需要手动完成：

- 导出 Vue Router 的 `createRouter()` 实例；
- 在 React 入口文件中，将原本渲染 `<App />` 的代码替换为 `@vureact/router` 路由实例所提供的 `<RouterProvider />` 组件。

核心要点是：保留 Vue Router 的路由定义与嵌套路由结构，导出路由实例，并替换 React 入口渲染方式。
