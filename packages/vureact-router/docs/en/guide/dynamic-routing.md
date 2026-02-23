# Dynamic Routing

## Background

Scenarios like plugin systems and permission-driven menus often require routes to be injected at runtime.

`@vureact/router` supports this through `addRoute`, `hasRoute`, and `resolve`.

## Minimal Runnable Example

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

## Key APIs

- `addRoute(route)`
  - Add top-level route.
- `addRoute(parentName, route)`
  - Add nested route under an existing parent route name.
- `hasRoute(name)`
  - Checks existence of named route.
- `routerInstance.resolve(to)`
  - Returns full `RouteLocation` with matched/meta/state details.

## Common Pitfalls

- Parent name must exist before calling `addRoute(parentName, route)`.
- Route name collisions throw runtime errors.
- Inject first, then navigate.

## Vue Router Mapping

- Dynamic Routing: <https://router.vuejs.org/guide/advanced/dynamic-routing.html>
- Named Routes: <https://router.vuejs.org/guide/essentials/named-routes.html>
- Route Meta Fields: <https://router.vuejs.org/guide/advanced/meta.html>

Next: [History Modes](./history-modes.md).
