# Basic Routing

## Background

Most apps need three baseline routing patterns:

- Static page switching
- Nested route structure
- Fallback handling (404)

`RouteConfig` supports all of them.

## Minimal Runnable Example

```tsx
import { createRouter, createWebHistory, RouterView, type RouteConfig } from '@vureact/router';

const routes: RouteConfig[] = [
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
          { path: '*', component: <div>Docs child 404</div> },
        ],
      },
      { path: '*', name: 'not-found', component: <div>App 404</div> },
    ],
  },
];

export const router = createRouter({ routes, history: createWebHistory() });
```

## Key APIs

- `children`
  - Declares nested routes and renders via parent `RouterView`.
- `name`
  - Enables named navigation from links or router methods.
- `path: '*'`
  - Fallback route for app-level or section-level unmatched paths.

## Common Pitfalls

- Missing `RouterView` in parent route means children will not render.
- Relative child paths are resolved against parent path.
- Duplicate route names throw runtime errors.

## Vue Router Mapping

- Nested Routes: <https://router.vuejs.org/guide/essentials/nested-routes.html>
- Named Routes: <https://router.vuejs.org/guide/essentials/named-routes.html>
- Different History Modes: <https://router.vuejs.org/guide/essentials/history-mode.html>

Next: [RouterLink](./router-link.md).
