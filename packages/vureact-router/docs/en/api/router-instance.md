# Router

## Signature

```ts
interface Router extends GlobalGuards {
  router: DataRouter;
  RouterProvider: FunctionComponent;
  clearAll: () => void;
  getRoutes: () => Readonly<GlobalRouteRecordRaw>;
  addRoute: {
    (route: RouteRecordRaw): void;
    (parentName: string, route: RouteRecordRaw): void;
  };
  hasRoute: (name: string) => boolean;
  resolve: (to: RouteLocationRaw) => RouteLocation;
}
```

## Parameters

`Router` is returned by `createRouter(options)` and takes no direct parameters.

## Returns

Core members:

- `router`: underlying DataRouter (`navigate` etc.)
- `RouterProvider`: root provider component
- guard methods: `beforeEach/beforeResolve/afterEach/onError`
- extension methods: `addRoute/hasRoute/resolve/getRoutes/clearAll`

## Behavior Details

- Guard registration methods return unregister callbacks.
- `resolve()` returns full `RouteLocation` including `matched/meta/state`.
- `addRoute` supports top-level and parent-name insertion forms.

## Error / Failure Semantics

- Missing parent in `addRoute(parentName, route)` throws.
- Guard exceptions are forwarded to `onError`.
- `afterEach` receives optional `failure`, checkable by `isNavigationFailure`.

## Example

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
