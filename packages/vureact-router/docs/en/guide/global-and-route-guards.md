# Global and Route Guards

## Background

When routing is used for auth, auditing, and analytics, you need deterministic control points in navigation lifecycle:

- auth check and redirects
- route-level entry constraints
- success/failure tracking

`@vureact/router` exposes global guards on `Router` and route-level `beforeEnter` on `RouteRecordRaw`.

## Minimal Runnable Example

```tsx
import { createRouter, createWebHistory, RouterView, isNavigationFailure } from '@vureact/router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: <RouterView />,
      children: [
        { path: 'public', component: <div>Public</div> },
        {
          path: 'protected',
          component: <div>Protected</div>,
          meta: { requiresAuth: true },
          beforeEnter: (to, from, next) => {
            if (to.query.block === '1') {
              next(false);
              return;
            }
            next();
          },
        },
        { path: 'login', name: 'login', component: <div>Login</div> },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    next('/login');
    return;
  }
  next();
});

router.beforeResolve((to, from, next) => {
  console.log('beforeResolve', to.fullPath);
  next();
});

router.afterEach((to, from, failure) => {
  if (failure && isNavigationFailure(failure)) {
    console.log('navigation failure', failure.type);
  }
});

router.onError((error) => {
  console.error('[router error]', error);
});
```

## Key APIs

- `beforeEach` / `beforeResolve`
  - Support `next`, and can abort/redirect via return values.
- `afterEach`
  - Third argument is optional `failure`, check with `isNavigationFailure`.
- `beforeEnter`
  - Supports single guard or guard array at route level.

## Common Pitfalls

- `beforeEnter` does not re-run when only params/query/hash changes inside the same route record.
- In nested routes, parent `beforeEnter` does not re-run for sibling child switches under same parent.
- Keep the unregister function returned by guard registration to avoid duplicate handlers.

## Vue Router Mapping

- Navigation Guards: <https://router.vuejs.org/guide/advanced/navigation-guards.html>
- Route Meta Fields: <https://router.vuejs.org/guide/advanced/meta.html>
- Navigation Failures: <https://router.vuejs.org/guide/advanced/navigation-failures.html>

Next: [Component Guards](./component-guards.md).
