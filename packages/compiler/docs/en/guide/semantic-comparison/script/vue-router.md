# Vue Router Semantic Comparison

We'll start with a macro comparison of Vue Router to see what Vue's routing components, APIs, and entry structures become after being compiled by VuReact into React routing code.

This article only shows some routing components and APIs; the complete adaptation actually includes more content such as `routing type interfaces`. For details, please refer to the [VuReact Router](https://router.vureact.top) documentation.

## Prerequisites

To avoid misunderstandings caused by redundant examples, let's first clarify two conventions:

1. The Vue/React code in this document is simplified core logic, omitting complete component wrappers, irrelevant configurations, etc.;
2. It is assumed that readers are already familiar with Vue Router API usage and core behavior.

## Router Components: `<router-link>` / `<router-view>`

Vue's routing components are mapped to adaptation components provided by `@vureact/router` in React.

- Vue code:

```vue
<template>
  <router-link to="/home">Home</router-link>
  <router-view />
</template>
```

- React code after VuReact compilation:

```tsx
import { RouterLink, RouterView } from '@vureact/router';

return (
  <>
    <RouterLink to="/home">Home</RouterLink>
    <RouterView />
  </>
);
```

`RouterLink` in React similarly supports Vue-style usage such as string `to`, object `to`, `activeClassName`, `customRender`, etc.; `RouterView` is responsible for rendering the currently matched route component, maintaining execution order for nested routes, route guards, and meta fields.

## Route Configuration: `createRouter` + history

Vue Router's creation method maintains semantic consistency in VuReact, but dependencies are replaced with `@vureact/router`.

- Vue code:

```ts
import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: Home }],
});
```

- React code after VuReact compilation:

```ts
import { createRouter, createWebHistory } from '@vureact/router';
import Home from './views/Home';

export default createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: Home }],
});
```

This demonstrates:

- API names like `createRouter` / `createWebHistory` remain unchanged;
- Only dependency paths are replaced with `@vureact/router`;
- Vue Router's route records, nested routes, `meta` fields can be directly preserved.

## Entry Injection: `RouterProvider`

If [automatic adaptation](#automatic-adaptation) is enabled, VuReact will automatically adjust the entry file after compilation, replacing the original `<App />` with the route instance's `RouterProvider`.

- Generated React entry file:

```tsx
import RouterInstance from './router/index';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterInstance.RouterProvider />
  </StrictMode>,
);
```

This entry structure reflects the macro changes in adapting Vue Router to React Router:

- Vue's route configuration file continues to serve as the route instance entry;
- React entry mounts the routing context via `RouterProvider`;
- Therefore, no manual rewriting of business routing logic is needed, only ensuring route definition standards.

## Runtime APIs: `useRouter` / `useRoute`

Vue's Composition API routing APIs retain the same semantics in React.

- Vue code:

```ts
const router = useRouter();
const route = useRoute();

const goHome = () => {
  router.push('/home');
};
```

- React code after VuReact compilation:

```tsx
import { useRouter, useRoute } from '@vureact/router';

const router = useRouter();
const route = useRoute();

const goHome = useCallback(() => {
  router.push('/home');
}, [router]);
```

`useRouter()` and `useRoute()` still support programmatic navigation, parameter reading, `meta` fields, etc., and their usage remains semantically consistent with Vue Router's Composition API.

## Automatic Adaptation

When the compiler detects Vue Router usage in a project, it automatically:

- Replaces `import ... from 'vue-router'` with `import ... from '@vureact/router'`;
- Changes the route configuration file output to `@vureact/router` route instance;
- Automatically rewrites the entry file to render with `RouterProvider`.

Configuration example:

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  router: {
    // Route entry file path (where createRouter() is called and default exported)
    configFile: 'src/router/index.ts',
  },
});
```

## Manual Adaptation

> The following approach is general advice; specific implementation details should be adjusted by developers according to actual project requirements.

When options `output.bootstrapVite` or `router.autoSetup` are `false`, automatic adaptation is unavailable and manual completion is required:

- Export the `createRouter()` instance from Vue Router;
- In the React entry file, replace the code that originally rendered `<App />` with the `<RouterProvider />` component provided by the `@vureact/router` route instance.

The key point is: preserve Vue Router's route definitions and nested route structures, export the route instance, and replace the React entry rendering method.
