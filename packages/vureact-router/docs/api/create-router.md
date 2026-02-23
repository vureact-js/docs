# createRouter

## 签名

```ts
function createRouter(options: CreateRouterOptions): RouterInstance
```

## 参数

```ts
interface CreateRouterOptions {
  routes: RouteConfig[];
  history?: RouterMode;
  initialEntries?: string[];
  initialIndex?: number;
  linkActiveClass?: string;
  linkExactActiveClass?: string;
  parseQuery?: (search: string) => Record<string, any>;
  stringifyQuery?: (query: Record<string, any>) => string;
}

type RouterMode = 'hash' | 'history' | 'memoryHistory';
```

- `routes`: 路由配置数组。
- `history`: 历史模式，默认是 `createWebHashHistory()`。
- `initialEntries` / `initialIndex`: 仅 memory 模式有意义。
- `linkActiveClass` / `linkExactActiveClass`: `RouterLink` 全局激活 class 默认值。
- `parseQuery` / `stringifyQuery`: 自定义查询字符串解析与序列化。

## 返回值

返回 `RouterInstance`，包含：

- `router`（底层 DataRouter 实例）
- `RouterProvider`（应用根 Provider）
- 全局守卫注册方法
- 动态路由与解析能力

详见：[RouterInstance](./router-instance.md)。

## 行为细节

- `RouteConfig.component` 支持同步 `ReactNode` 或异步 loader `() => import(...)`。
- 调用时会注册运行时配置（active class、query parse/stringify）。
- 会把源路由与转换后的路由保存到内部容器，供 `resolve`/`hasRoute` 等 API 使用。

## 错误/失败语义

- 路由名冲突、缺失父路由等错误会抛出 `Error`。
- 守卫导致的失败不会由 `createRouter` 抛出，而会在 `afterEach` 的 `failure` 参数中体现。

## 示例

```tsx
import {
  createRouter,
  createWebHashHistory,
  RouterView,
  type RouteConfig,
} from '@vureact/router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: <RouterView />,
    children: [
      { path: 'home', name: 'home', component: <div>Home</div> },
      { path: 'about', name: 'about', component: <div>About</div> },
    ],
  },
];

export const router = createRouter({
  routes,
  history: createWebHashHistory(),
  linkActiveClass: 'is-active',
  linkExactActiveClass: 'is-exact-active',
});
```
