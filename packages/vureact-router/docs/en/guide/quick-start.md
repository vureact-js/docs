# Quick Start

This page gets a React 18+ app running with `@vureact/router`, including route config, provider setup, and basic navigation.

## Minimal Runnable Example

### 1. Install

```bash
npm install @vureact/router
# or
yarn add @vureact/router
# or
pnpm add @vureact/router
```

### Peer Dependencies

- React >= 18.2.0
- React DOM >= 18.2.0
- React Router DOM >= 7.9.0

### 2. Create Router

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

### 3. Mount App

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

## Key APIs

- `createWebHashHistory()` / `createWebHistory()` / `createMemoryHistory()`
  - History factories used by `createRouter({ history })`.
- `redirect`
  - Route-level redirect supports string/object/function.
- `RouterLink.to`
  - Supports both string and object `{ path/name, params, query, hash, state }`.

## Common Pitfalls

- Named navigation requires existing named route records.
- If both `path` and `params` are given, `params` is ignored.
- `memoryHistory` is for tests/non-browser environments.

## Vue Router Mapping

- Programmatic Navigation: <https://router.vuejs.org/guide/essentials/navigation.html>
- Named Routes: <https://router.vuejs.org/guide/essentials/named-routes.html>
- Redirect and Alias: <https://router.vuejs.org/guide/essentials/redirect-and-alias.html>

Next: [Basic Routing](./basic-routing.md).
