# 动态路由

## 问题背景

后台菜单、插件系统、多租户模块等场景，通常需要在运行时注入路由，而不是在编译期一次性写死。

`@vureact/router` 通过 `addRoute`、`hasRoute`、`resolve` 提供动态路由能力。

## 最小可运行示例

```tsx
import { createRouter, createWebHashHistory, RouterView } from '@vureact/router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'root',
      component: <RouterView />,
      children: [{ path: 'home', name: 'home', component: <div>Home</div> }],
    },
  ],
});

if (!router.hasRoute('runtime-top')) {
  router.addRoute({
    path: '/runtime-top',
    name: 'runtime-top',
    component: <div>Runtime Top Page</div>,
  });
}

if (!router.hasRoute('runtime-child')) {
  router.addRoute('root', {
    path: 'runtime-child',
    name: 'runtime-child',
    component: <div>Runtime Child Page</div>,
  });
}

const target = router.resolve({
  name: 'runtime-child',
  query: { from: 'dynamic' },
  hash: 'panel',
});

console.log(target.fullPath);
```

## 关键 API 解释

- `addRoute(route)`
  - 添加顶层路由。
- `addRoute(parentName, route)`
  - 向指定父路由注入子路由。
- `hasRoute(name)`
  - 判断命名路由是否存在。
- `routerInstance.resolve(to)`
  - 返回 `RouteLocation`，用于在导航前拿到最终路径、meta、matched 等信息。

## 常见坑

- `addRoute(parentName, route)` 的父路由 `name` 必须存在，否则抛错。
- 新增路由若重复 `name` 会抛错。
- 路由注入后再导航更稳妥，避免首次命中前尚未注册。

## Vue Router 对照

- 动态路由: <https://router.vuejs.org/zh/guide/advanced/dynamic-routing.html>
- 命名路由: <https://router.vuejs.org/zh/guide/essentials/named-routes.html>
- 路由元信息: <https://router.vuejs.org/zh/guide/advanced/meta.html>

下一步建议阅读：[历史模式](./history-modes.md)。
