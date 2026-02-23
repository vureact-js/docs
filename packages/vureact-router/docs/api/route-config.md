# RouteConfig

## 签名

```ts
interface RouteConfig extends ExclusiveGuards {
  path?: string;
  name?: string;
  state?: any;
  sensitive?: boolean;
  component?: ReactNode | ComponentLoader;
  children?: RouteConfig[];
  linkActiveClassName?: string;
  linkInActiveClassName?: string;
  linkExactActiveClassName?: string;
  redirect?: string | RouterOptions | ((to: RouteConfig) => string | RouterOptions);
  loader?: NonIndexRouteObject['loader'];
  meta?: { [x: string]: any; loadingComponent?: ReactNode };
}
```

## 参数

- `path`: 路由路径，支持动态参数（如 `user/:id`）。
- `name`: 命名路由标识，需全局唯一。
- `component`: 同步节点或异步组件 loader。
- `children`: 嵌套路由。
- `redirect`: 字符串、对象或函数形式重定向。
- `beforeEnter`: 来自 `ExclusiveGuards`，可单函数或函数数组。
- `meta`: 任意元信息，会在 `useRoute().meta` 中合并体现。

## 返回值

`RouteConfig` 本身是声明类型，不是函数调用结果。

## 行为细节

- `beforeEnter` 在同一路由记录仅参数/query/hash变化时不会触发。
- 当 `component` 是异步 loader 时，可通过 `meta.loadingComponent` 指定加载态。
- `children` 中相对路径会按父级路径拼接。

## 错误/失败语义

- 重复 `name` 会在运行时抛错。
- `redirect` 指向不存在的命名路由时会抛错。
- `beforeEnter` 返回 `false`/重定向对象时会触发导航失败或重定向流程。

## 示例

```tsx
import type { RouteConfig } from '@vureact/router';

export const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'layout',
    component: <Layout />,
    meta: { layout: 'main' },
    children: [
      { path: '', redirect: '/home' },
      { path: 'home', name: 'home', component: <HomePage /> },
      {
        path: 'user/:id',
        name: 'user',
        component: () => import('./UserPage'),
        meta: { requiresAuth: true, loadingComponent: <div>Loading...</div> },
        beforeEnter: (to, from, next) => {
          if (!isAuthed()) return next('/login');
          next();
        },
      },
    ],
  },
];
```
