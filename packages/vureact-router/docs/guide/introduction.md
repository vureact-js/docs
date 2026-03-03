# 简介

## 问题背景

在 React 项目中直接使用 `react-router-dom` 足够灵活，但当团队来自 Vue Router 生态，或想要寻找适配方案时，常见痛点是：

- API 语义不统一（`RouterLink`/`RouterView`/守卫模型差异）
- 路由守卫需要重复封装
- 迁移时难以复用已有路由设计经验

`@vureact/router` 的目标是提供 **Vue Router 4.x 风格** 的 API，同时保持 React 生态兼容。其底层基于 `react-router-dom` Data Router。

## 最小可运行示例

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRouter, createWebHashHistory, RouterLink, RouterView } from '@vureact/router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: <RouterView />,
      children: [
        { path: 'home', name: 'home', component: <div>Home</div> },
        { path: 'about', name: 'about', component: <div>About</div> },
      ],
    },
  ],
});

function App() {
  return (
    <>
      <RouterLink to="/home">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterView />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <router.RouterProvider>
    <App />
  </router.RouterProvider>,
);
```

## 关键 API 解释

- `createRouter(options)`
  - 创建 `RouterInstance`，包含 `RouterProvider`、守卫注册方法与扩展 API（`addRoute/resolve` 等）。
- `RouterView`
  - 渲染当前匹配路由组件，也负责在内部串联守卫执行流程。
- `RouterLink`
  - 提供字符串和对象两种跳转方式，并支持 active class 与 `customRender`。
- `useRouter` / `useRoute`
  - 组合式 API：前者处理编程式导航，后者读取当前路由信息。

## 常见坑

- 必须在 `router.RouterProvider` 内使用 `RouterLink`、`RouterView`、`useRouter`、`useRoute`。
- `createRouter` 默认 history 是 `createWebHashHistory()`，不是 browser history。
- `RouteConfig.component` 既支持同步 `ReactNode`，也支持异步组件 loader（`() => import(...)`）。

## Vue Router 对照

- 入门: <https://router.vuejs.org/zh/guide/>
- 路由的匹配语法: <https://router.vuejs.org/zh/guide/essentials/route-matching-syntax.html>
- 嵌套路由: <https://router.vuejs.org/zh/guide/essentials/nested-routes.html>

下一步建议阅读：[快速上手](./quick-start.md)。
