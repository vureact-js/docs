# 基础路由

## 问题背景

基础路由通常包含三件事：

- 页面切换（静态路由）
- 页面层级（嵌套路由）
- 未匹配兜底（404）

`@vureact/router` 的 `RouteRecordRaw` 同时支持这三类能力。

## 最小可运行示例

```tsx
import { createRouter, createWebHistory, RouterView, type RouteRecordRaw } from '@vureact/router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    component: <RouterView />,
    children: [
      { path: '', redirect: '/home' },
      { path: 'home', name: 'home', component: <div>Home</div> },
      {
        path: 'docs',
        name: 'docs-layout',
        component: <RouterView />,
        children: [
          { path: 'intro', name: 'docs-intro', component: <div>Docs Intro</div> },
          { path: 'api', name: 'docs-api', component: <div>Docs API</div> },
          { path: '*', component: <div>Docs 子级 404</div> },
        ],
      },
      { path: '*', name: 'not-found', component: <div>App 404</div> },
    ],
  },
];

export const router = createRouter({ routes, history: createWebHistory() });
```

## 关键 API 解释

- `children`
  - 用于声明嵌套路由，父级组件通常放置 `RouterView` 作为子路由渲染出口。
- `name`
  - 命名路由可用于 `RouterLink` 或 `router.push({ name })`。
- `path: '*'`
  - 可用于全局兜底，也可用于某个子路由分组兜底。

## 常见坑

- 子路由使用相对路径（如 `intro`）时，会拼接父路径。
- 嵌套层级缺少 `RouterView` 时，子路由组件不会显示。
- 父、子命名路由必须唯一，重复会在运行时抛错。

## Vue Router 对照

- 嵌套路由: <https://router.vuejs.org/zh/guide/essentials/nested-routes.html>
- 命名路由: <https://router.vuejs.org/zh/guide/essentials/named-routes.html>
- 不同的历史模式: <https://router.vuejs.org/zh/guide/essentials/history-mode.html>

下一步建议阅读：[RouterLink](./router-link.md)。
