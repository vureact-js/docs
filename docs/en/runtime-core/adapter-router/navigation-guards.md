# Navigation Guards

Primarily used to guard navigation by either allowing the navigation to proceed or canceling it. There are several ways to implement routing navigation guards: global, per-route, or component-level.

The principle is to conditionally intercept or allow the navigation address and route component `outlet` of `react-router-dom` within the `<RouterView>` component.

## Global Before Guards

You can register a global before guard using `router.beforeEach`:

```js
const router = createRouter({ ... })

router.beforeEach((to, from) => {
  // ...
  // Return false to cancel the navigation
  return false
})
```

When a navigation is triggered, global before guards are called in the order they were created. Guards are resolved asynchronously, and the navigation remains in a **pending** state until all guards have resolved.

Each guard method receives two parameters:

- **`to`**: The target route that is about to be entered.
- **`from`**: The current route that is about to be left.

The possible return values are as follows:

- `false`: Cancel the current navigation. If the browser's URL has changed (possibly due to user manual input or the browser's back button), the URL will be reset to the address corresponding to the `from` route.

- A route address: Redirect to a different address via a route address, similar to calling `router.push()`, and can pass options such as `replace: true` or `name: 'home'`. It will abort the current navigation and create a new one with the same `from`.

```js
router.beforeEach(async (to, from) => {
  if (
    // Check if the user is logged in
    !isAuthenticated &&
    // ❗️ Avoid infinite redirects
    to.name !== 'Login'
  ) {
    // Redirect the user to the login page
    return { name: 'Login' }
  }
})
```

Returning `undefined` or `true` means the guard allows the navigation to proceed, and the next navigation guard will be called.

All the above work the same way with **`async` functions** and Promises:

```js
router.beforeEach(async (to, from) => {
  // canUserAccess() returns `true` or `false`
  const canAccess = await canUserAccess(to)
  if (!canAccess) return '/login'
})
```

### Optional Third Parameter `next`

You can pass a third parameter to any navigation guard. In this case, **make sure `next`** is **called exactly once** in any given navigation guard. It can appear more than once, but only if all logical paths are non-overlapping; otherwise, the hook will never resolve or will throw an error. Here's an **incorrect example** of redirecting to `/login` when the user is not authenticated:

```js
// BAD
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  // If the user is not authenticated, `next` will be called twice
  next()
})
```

Here's the correct version:

```js
// GOOD
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})
```

## Global Resolve Guards

You can register a global guard using `router.beforeResolve`. This is similar to `router.beforeEach` in that it triggers on **every navigation**, but the resolve guard is called right before the navigation is confirmed, **after all in-component guards and async route components have been resolved**. Here's an example that ensures the user has camera access based on the `requiresCamera` property in the route's [meta information](./meta):

```js
router.beforeResolve(async to => {
  if (to.meta.requiresCamera) {
    try {
      await askForCameraPermission()
    } catch (error) {
      if (error instanceof NotAllowedError) {
        // ... handle the error, then cancel the navigation
        return false
      } else {
        // Unexpected error, cancel the navigation and pass the error to the global handler
        throw error
      }
    }
  }
})
```

`router.beforeResolve` is the ideal place to fetch data or perform any other operations that you want to avoid if the user cannot enter the page.

## Global After Hooks

You can also register global after hooks, however, unlike guards, these hooks do not receive a `next` function and do not affect the navigation itself:

```js
router.afterEach((to, from) => {
  sendToAnalytics(to.fullPath)
})
```

They are useful for analytics, changing the page title, declaring the page, and many other auxiliary functions.

## Per-Route Guards

You can define `beforeEnter` guards directly in the route configuration:

```jsx
const routes = [
  {
    path: '/users/:id',
    component: <UserDetails />,
    beforeEnter: (to, from) => {
      // Reject the navigation
      return false
    },
  },
]
```

`beforeEnter` guards **only trigger when entering the route** and do not trigger when `params`, `query`, or `hash` change. For example, navigating from `/users/2` to `/users/3` or from `/users/2#info` to `/users/2#projects` will not trigger them. They are only triggered when navigating **from a different** route.

You can also pass an array of functions to `beforeEnter`, which is useful for reusing guards across different routes:

```jsx
function removeQueryParams(to) {
  if (Object.keys(to.query).length)
    return { path: to.path, query: {}, hash: to.hash }
}

function removeHash(to) {
  if (to.hash) return { path: to.path, query: to.query, hash: '' }
}

const routes = [
  {
    path: '/users/:id',
    component: <UserDetails />,
    beforeEnter: [removeQueryParams, removeHash],
  },
  {
    path: '/about',
    component: <UserDetails />,
    beforeEnter: [removeQueryParams],
  },
]
```

When used with [nested routes](./nested-routes.html), both parent and child routes can use `beforeEnter`. If placed on a parent route, it will not trigger when moving between child routes that share the same parent. For example:

```jsx
const routes = [
  {
    path: '/user',
    beforeEnter() {
      // ...
    },
    children: [
      { path: 'list', component: <UserList /> },
      { path: 'details', component: <UserDetails /> },
    ],
  },
]
```

The `beforeEnter` in the example will not be called when moving between `/user/list` and `/user/details` because they share the same parent route. If we place the `beforeEnter` guard directly on the `details` route, it will be called when moving between these two routes.

## In-Component Guards

You can directly define route navigation guard hooks within route components:

- `useBeforeRouteEnter`
- `useBeforeRouteUpdate`
- `useBeforeRouteLeave`

```js
import { useBeforeRouteLeave, useBeforeRouteUpdate } from 'react-vue3-components'

useBeforeRouteUpdate(async (to, from) => {
  // Called when the current route changes but the component is reused
  // For example, for a path with dynamic parameters like 
  // `/users/:id`, when navigating between `/users/1` and `/users/2`,
  // since the same `UserDetails` component will be rendered,
  // the component instance will be reused. This hook will be called in such cases.
})

useBeforeRouteLeave(async (to, from) => {
  // Called when navigating away from the route that renders this component
})
```

**Leave guards** are usually used to prevent the user from leaving suddenly before saving changes. The navigation can be canceled by returning `false`.

```js
useBeforeRouteLeave((to, from) {
  const answer = window.confirm('Do you really want to leave?')
  if (!answer) return false
})
```

## Complete Navigation Guard Execution Flow

1. A navigation is triggered.
2. The `useBeforeRouteLeave` guard is not called when entering a route component, only when leaving.
3. Call the global `beforeEach` guard.
4. Call the `useBeforeRouteUpdate` guard in the reused component; it is not called on first entry.
5. Call `beforeEnter` in the route configuration; if the immediate parent route also has this guard, they will be called in sequence.
6. Call the global `beforeResolve`.
7. The navigation is confirmed.
8. Call the global `afterEach` hook.
9. Trigger DOM updates.
