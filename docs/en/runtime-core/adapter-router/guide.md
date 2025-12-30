# Getting Started

Based on the secondary development of the **React Router DOM** routing library, it aims to simplify and simulate the common functions of **[Vue Router 4.x](https://router.vuejs.org/guide/)**. The `Router` component of this library can meet daily business development needs.

The documentation descriptions and examples are basically consistent with those of Vue Router, but there are some differences in usage and syntax that need attention, and the route matching syntax must follow the specifications of react-router-dom.

## Creating a Router

The following is an explanation of each part of creating a router. If you want to get started quickly, you can skip to the [Example](#example) section below.

### Router Options

Create a router instance by calling `createRouter({...})`, which includes the following options:

```jsx
import { createWebHistory, createRouter } from 'react-vue3-components'

const { router, RouterProvider } = createRouter({
    // Specify the history mode of the route
    history: createWebHistory(),
    // Route configuration
    routes: []
})
```

### Router Instance

After calling `createRouter()` to create a router, it returns an object instance containing the following 2 important members:

```js
/**
 * Router instance, react-router-dom's DataRouter,
 * used to manage all navigation and data loading / changing operations.
 */
router

/**
 * Renders the user interface (UI) for the given data route,
 * this component should usually be at the top level of the application element tree.
 */
RouterProvider

```

### Rendering the Router

Use the `<RouterProvider>` component in the React application entry file to render the entire data route, and there is no need to pass the `router` prop, as we have simplified and enhanced it internally in the component.

```jsx
import { createRoot } from "react-dom/client";

createRoot(document.getElementById('root')).render(
  <RouterProvider />
)
```

## Route Configuration Items

The `routes` option accepts an array of `RouteConfig` objects to define the routing structure of the application. These configuration items are extended based on the routing objects of **react-router-dom** and simulate some common features of **Vue Router**.

```ts
interface RouteConfig {
  path?: string;
  name?: string;
  state?: any;
  sensitive?: boolean;
  component?: ComponentType;
  children?: RouteConfig[];
  linkActiveClassName?: string;
  linkInActiveClassName?: string;
  linkExactActiveClassName?: string;
  redirect?: Redirect | RedirectFunc;
  loader?: NonIndexRouteObject['loader'];
  beforeEnter?: (guard: GuardWithNextFn) => void | Array<(guard: GuardWithNextFn) => void>;
  meta?: { [x: string]: any; loadingComponent?: ReactNode };
}
```

| Prop Name | Type | Description |
| :--- | :--- | :--- |
|  path  | `String` | The route matching path. Must follow the path specifications of `react-router-dom`. |
|  name  | `String` | The name of the route, which will be used as the `id` attribute of `react-router-dom`. |
|  component  | `ReactNode` | `ComponentLoader` | The component rendered to `<RouterView />` (i.e., `Outlet`). Supports passing a `ReactNode` or an asynchronous loading function (`ComponentLoader`). |
|  children  | `RouteConfig[]` | Nested array of sub-route configurations. |
|  redirect  | `String \| Object` | `RedirectOptions` | `RedirectFunc` | Defines route redirection. Can be a target path string, an object containing query parameters and state (`RedirectOptions`), or a function returning these values (`RedirectFunc`). |
|  loader  | `NonIndexRouteObject['loader']` | The data loading function of `react-router-dom`, used to fetch data before rendering the component. |
|  meta  | `Object` | Custom metadata object. Can be used to store additional route information, such as permissions or page titles. The `loadingComponent` can specify the loading state UI for asynchronous components. |
|  sensitive  | `Boolean` | Whether path matching is case-sensitive. |
|  state  | `Any` | Custom state data passed to the target route during navigation. |
|  beforeEnter  | `(guard) => void` | `Array<(guard) => void>` | Exclusive route guard (similar to Vue Router's `beforeEnter`). |
|  linkActiveClassName  | `String` | The class name applied to `<RouterLink>` when the link is not exactly matched. |
|  linkInActiveClassName  | `String` | The class name applied to `<RouterLink>` when the link is not matched. |
|  linkExactActiveClassName  | `String` | The class name applied to `<RouterLink>` when the link is exactly matched. |

## Example

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>Loading interactive example...</p>
  </div>
  <iframe src="https://codesandbox.io/embed/c2q9ck?view=preview&module=%2Fsrc%2FApp.tsx"
      style="width:100%; height: 400px; border:0; border-radius: 4px; overflow:hidden;"
      title="react-vue3-router"
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    ></iframe>
</div>

[![Edit react-vue3-router](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/react-vue3-router-c2q9ck)

Let's first look at the root component, `App.jsx`.

```jsx
import { useRoute, RouterLink, RouterView } from 'react-vue3-components'

function App() {
  const route = useRoute();
  return (
    <>
      <h1>Hello App!</h1>
      <p>
        <strong>Current route path:</strong> { route.fullPath }
      </p>
      <nav>
        <RouterLink to="/">Go to Home</RouterLink>
        <RouterLink to="/about">Go to About</RouterLink>
      </nav>
      <main>
        <RouterView />
      </main>
    </>
  )
}
```

In this example, two components provided by the Router are used: `RouterLink` and `RouterView`.

The above example also uses `{ route.fullPath }`. You need to use `useRoute` to access the current route object.

### Creating a Router Instance

The router instance is created by calling the `createRouter()` function, which is implemented based on **react-router-dom**'s `createRouterProvider`:

```jsx
// router.js
import { createMemoryHistory, createRouter } from 'react-vue3-components'

import App from "./App";
import HomeView from "./HomeView";
import AboutView from "./AboutView";

const routes = [
  {
    path: "/",
    component: <App />,
    redirect: "home",
    children: [
      { path: "home", component: <HomeView /> },
      { path: "about", component: <AboutView /> },
    ],
  },
]

const { RouterProvider } = createRouter({
  history: createMemoryHistory(),
  routes,
});

// Export the router instance
export { RouterProvider };

```

The `history` option controls how routes and URL paths are bidirectionally mapped. In the example, we use `createMemoryHistory()`, which completely ignores the browser's URL and uses its own internal URL. This works in the example, but may not be what you want to use in a real application. Usually, you should use `createWebHistory()` or `createWebHashHistory()`. We will detail this topic in the [Different History Modes](./history-mode) section.

### Using the Router Provider

Once the router instance is created, it returns an object instance. We need to use the `<RouterProvider>` component from it, which is implemented based on **react-router-dom**'s `RouterProvider`. We have simplified it, and there is no need to pass the `router` prop. Use it in React's entry file:

```jsx
import { createRoot } from "react-dom/client";
import { RouterProvider } from './router' // Example location of the router configuration file

createRoot(document.getElementById("root")).render(
  <RouterProvider />
);
```

### Accessing the Router and Current Route

You can access the router instance and the current route through `useRouter()` and `useRoute()`, which provide APIs.

```js
const router = useRouter()
const route = useRoute()

router.push('/about');
route.query.search
```