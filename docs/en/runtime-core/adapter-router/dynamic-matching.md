# Dynamic Route Matching with Parameters

The dynamic route matching syntax from `react-router-dom` is used. It's important to note that **it does not support any regular expression syntax** and only allows two wildcard patterns: `:param*` and `*`.

## Path Parameters

```jsx
const routes = [
  // Dynamic fields start with a colon
  { path: '/users/:id', component: <User /> },
]
```

You can set multiple *path parameters* in the same route, which will be mapped to corresponding fields in `$route.params`. For example:

| Matching Pattern               | Matched Path             | route.params                             |
| :----------------------------- | :----------------------- | :--------------------------------------- |
| /users/:username               | /users/eduardo           | `{ username: 'eduardo' }`                |
| /users/:username/posts/:postId | /users/eduardo/posts/123 | `{ username: 'eduardo', postId: '123' }` |

In addition to `route.params`, the `route` object also exposes other useful information such as `route.query` (if parameters exist in the URL) and `route.hash`.

## Reacting to Route Parameter Changes

To respond to parameter changes within the same component, you can use `useEffect` or the [`useWatch`](https://example.com) provided by `react-vue3-hooks` to watch any property on the `route` object. In this scenario, it's `route.params`:

```js
import { useWatch } from 'react-vue3-hooks'
import { useRoute } from 'react-vue3-components'

const route = useRoute()

useWatch(() => route.params.id, (newId, oldId) => {
  // Respond to route changes...
})
```

Alternatively, use the `useBeforeRouteUpdate` [navigation guard hook](./navigation-guards), which also allows you to cancel navigation:

```js
import { useBeforeRouteUpdate } from 'react-vue3-components'
// ...

useBeforeRouteUpdate(async (to, from) => {
  // Respond to route changes...
  userData.value = await fetchUser(to.params.id)
})
```

## Catch-All Routes or 404 Not Found Routes

Regular parameters only match characters between URL segments separated by `/`. If we want to match **any path**, we can use a **splat wildcard (*)** to match all subsequent segments:

```jsx
const routes = [
  // Will catch all remaining paths and put them in params.pathMatch
  { path: '/:pathMatch*', name: 'NotFound', component: <NotFound /> },
  // Matches everything starting with `/user-`
  // :afterUser* captures the entire remaining path as a parameter
  // and places it under `route.params.afterUser`
  { path: '/user-:afterUser*', component: <UserGeneric /> },
]
```

In this specific scenario, we use a global wildcard and place it in the `pathMatch` parameter. This allows us to navigate directly to the route by splitting the `path` into an array when needed:

```js
router.push({
  name: 'NotFound',
  // Keep the current path and remove the first character to avoid the target URL starting with `//`
  params: { pathMatch: route.path.substring(1).split('/') },
  // Keep existing query and hash values if any
  query: route.query,
  hash: route.hash,
})
```

If you are using [history mode](./history-mode), make sure to configure your server correctly as instructed.
