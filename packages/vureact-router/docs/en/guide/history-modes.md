# History Modes

## Background

Different runtimes need different URL/history behavior:

- hash mode for broad deployment compatibility
- browser history mode for clean URLs
- memory mode for tests and non-DOM environments

`@vureact/router` uses `RouterMode`: `hash | history | memoryHistory`.

## Minimal Runnable Example

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

## Key APIs

- `createWebHashHistory()` returns `hash` mode (`#/path`).
- `createWebHistory()` returns `history` mode (`/path`).
- `createMemoryHistory()` returns `memoryHistory` mode.
- `createRouter` default history is `createWebHashHistory()`.

## Common Pitfalls

- Browser history mode usually requires server fallback for deep links.
- Memory mode does not update browser URL.
- Changing history mode does not change `RouteConfig` shape.

## Vue Router Mapping

- Different History Modes: <https://router.vuejs.org/guide/essentials/history-mode.html>
- HTML5 Mode Caveat: <https://router.vuejs.org/guide/essentials/history-mode.html#html5-mode>
- Programmatic Navigation: <https://router.vuejs.org/guide/essentials/navigation.html>

Next: [API Reference](../api/create-router.md).
