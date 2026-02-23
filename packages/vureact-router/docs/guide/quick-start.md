# 快速上手

本节目标：在 React 18+ 项目中快速搭建一个可运行的 `@vureact/router` 应用，并覆盖最核心的导航流程。

## 最小可运行示例

### 1. 安装

```bash
npm install @vureact/router
# 或
yarn add @vureact/router
# 或
pnpm add @vureact/router
```

### 对等依赖

- React >= 18.2.0
- React DOM >= 18.2.0
- React Router DOM >= 7.9.0

### 2. 创建路由

```tsx
import { createRouter, createWebHashHistory, RouterView, type RouteConfig } from '@vureact/router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: <RouterView />,
    children: [
      { path: '', redirect: '/home' },
      { path: 'home', name: 'home', component: <div>Home Page</div> },
      { path: 'user/:id', name: 'user', component: <div>User Detail</div> },
      { path: '*', name: 'not-found', component: <div>404</div> },
    ],
  },
];

export const router = createRouter({
  routes,
  history: createWebHashHistory(),
});
```

### 3. 挂载应用

```tsx
import ReactDOM from 'react-dom/client';
import { RouterLink, RouterView } from '@vureact/router';
import { router } from './router';

function App() {
  return (
    <div>
      <nav>
        <RouterLink to="/home">Home</RouterLink>
        <RouterLink to={{ name: 'user', params: { id: '42' } }}>User 42</RouterLink>
      </nav>
      <RouterView />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <router.RouterProvider>
    <App />
  </router.RouterProvider>,
);
```

## 关键 API 解释

- `createWebHashHistory()` / `createWebHistory()` / `createMemoryHistory()`
  - 三种历史模式工厂，传给 `createRouter({ history })`。
- `redirect`
  - `RouteConfig` 中支持字符串、对象、函数三种重定向表达。
- `RouterLink` 的 `to`
  - 可为字符串，或 `{ path/name, params, query, hash, state }` 对象。

## 常见坑

- 使用 `{ name, params }` 时必须保证对应命名路由存在，否则会抛错。
- 同时传入 `path` 和 `params` 时，`params` 不生效（以 `path` 为准）。
- `memoryHistory` 适合测试/非浏览器环境，浏览器页面建议使用 hash 或 history。

## Vue Router 对照

- 编程式导航: <https://router.vuejs.org/zh/guide/essentials/navigation.html>
- 命名路由: <https://router.vuejs.org/zh/guide/essentials/named-routes.html>
- 重定向和别名: <https://router.vuejs.org/zh/guide/essentials/redirect-and-alias.html>

下一步建议阅读：[基础路由](./basic-routing.md)。
