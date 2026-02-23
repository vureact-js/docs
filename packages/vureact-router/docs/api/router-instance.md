# RouterInstance

## 签名

```ts
interface RouterInstance extends GlobalGuards {
  router: DataRouter;
  RouterProvider: FunctionComponent;
  clearAll: () => void;
  getRoutes: () => Readonly<GlobalRouteConfig>;
  addRoute: {
    (route: RouteConfig): void;
    (parentName: string, route: RouteConfig): void;
  };
  hasRoute: (name: string) => boolean;
  resolve: (to: string | RouterOptions) => RouteLocation;
}
```

## 参数

`RouterInstance` 来自 `createRouter(options)` 的返回值，本身不直接接收参数。

## 返回值

核心成员：

- `router`: 底层 DataRouter，保留 `navigate` 等能力。
- `RouterProvider`: 根组件 Provider。
- 守卫注册：`beforeEach/beforeResolve/afterEach/onError`。
- 扩展方法：`addRoute/hasRoute/resolve/getRoutes/clearAll`。

## 行为细节

- 守卫注册方法返回“注销函数”，用于移除对应守卫。
- `resolve()` 返回完整 `RouteLocation`，包含 `matched/meta/state`。
- `addRoute` 支持顶层与按父路由名插入两种形式。

## 错误/失败语义

- `addRoute(parentName, route)` 中 `parentName` 不存在会抛错。
- 注册守卫抛出的异常会进入 `onError`。
- `afterEach(to, from, failure)` 的 `failure` 可通过 `isNavigationFailure` 判断类型。

## 示例

```tsx
const router = createRouter({ routes, history: createWebHistory() });

const offBeforeEach = router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthed()) {
    next('/login');
    return;
  }
  next();
});

router.afterEach((to, from, failure) => {
  if (failure) {
    console.log('failure', failure.type);
  }
});

if (!router.hasRoute('runtime')) {
  router.addRoute({ path: '/runtime', name: 'runtime', component: <RuntimePage /> });
}

const location = router.resolve({ name: 'runtime', query: { from: 'menu' } });
console.log(location.fullPath);

offBeforeEach();
```
