# Introduction

## Background

`react-router-dom` is powerful in React projects, but teams migrating from Vue Router often face these frictions:

- Different mental model for links/views/guards
- Repeated guard plumbing across projects
- Harder migration for existing route design conventions

`@vureact/router` provides a **Vue Router 4.x style API** on top of React Router Data Router.

## Minimal Runnable Example

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createRouter,
  createWebHashHistory,
  RouterLink,
  RouterView,
} from '@vureact/router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: <RouterView />,
      children: [
        { path: 'home', name: 'home', component: <div>Home</div> },
        { path: 'about', name: 'about', component: <div>About</div> },
      ],
    },
  ],
});

function App() {
  return (
    <>
      <RouterLink to="/home">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterView />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <router.RouterProvider>
    <App />
  </router.RouterProvider>,
);
```

## Key APIs

- `createRouter(options)`
  - Creates a `RouterInstance` with `RouterProvider`, guards, and route extension APIs.
- `RouterView`
  - Renders matched route components and coordinates guard execution.
- `RouterLink`
  - Supports string/object targets, active classes, and `customRender`.
- `useRouter` / `useRoute`
  - Composition APIs for navigation and route state access.

## Common Pitfalls

- Always use `RouterLink`, `RouterView`, `useRouter`, and `useRoute` inside `router.RouterProvider`.
- `createRouter` defaults to `createWebHashHistory()` if `history` is omitted.
- `RouteConfig.component` supports both sync `ReactNode` and async component loader.

## Vue Router Mapping

- Getting Started: <https://router.vuejs.org/guide/>
- Route Matching Syntax: <https://router.vuejs.org/guide/essentials/route-matching-syntax.html>
- Nested Routes: <https://router.vuejs.org/guide/essentials/nested-routes.html>

Next: [Quick Start](./quick-start.md).
