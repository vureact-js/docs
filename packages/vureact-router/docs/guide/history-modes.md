# 历史模式

## 问题背景

不同运行环境对 URL 管理能力不同：

- 浏览器 hash 模式最通用
- HTML5 history 模式 URL 更干净
- memory 模式适合测试与非 DOM 环境

`@vureact/router` 用 `RouterMode` 统一这三种模式：`hash | history | memoryHistory`。

## 最小可运行示例

```tsx
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  createMemoryHistory,
} from '@vureact/router';

const hashRouter = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: '/home', component: <div>home</div> }],
});

const webRouter = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/home', component: <div>home</div> }],
});

const memoryRouter = createRouter({
  history: createMemoryHistory(),
  initialEntries: ['/home'],
  initialIndex: 0,
  routes: [{ path: '/home', component: <div>home</div> }],
});
```

## 关键 API 解释

- `createWebHashHistory()`
  - 返回 `hash`，URL 形如 `#/path`。
- `createWebHistory()`
  - 返回 `history`，URL 形如 `/path`。
- `createMemoryHistory()`
  - 返回 `memoryHistory`，使用内存栈。
- `createRouter` 默认值
  - 未传 `history` 时，默认 `createWebHashHistory()`。

## 常见坑

- history 模式通常需要服务端配置 fallback，否则刷新子路径会 404。
- memory 模式不会修改浏览器地址栏，适合测试用例和非浏览器容器。
- 切换模式只影响 URL 与历史记录行为，不改变 `RouteConfig` 写法。

## Vue Router 对照

- 不同的历史模式: <https://router.vuejs.org/zh/guide/essentials/history-mode.html>
- 编程式导航: <https://router.vuejs.org/zh/guide/essentials/navigation.html>

下一步建议阅读：[API 参考](../api/create-router.md)。
