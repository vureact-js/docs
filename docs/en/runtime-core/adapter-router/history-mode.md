# Different History Modes

When creating a router instance, the `history` configuration allows you to choose between different history modes.

## Hash Mode

The hash mode is created with `createWebHashHistory()`, which is based on `createHashRouter` from **react-router-dom**:

```js
import { createRouter, createWebHashHistory } from 'react-vue3-components'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    //...
  ],
})
```

## Memory Mode

It is created with `createMemoryHistory()`, based on `createMemoryRouter` from **react-router-dom**, and **you need to manually push to the initial navigation**.

```js
import { createRouter, createMemoryHistory } from 'react-vue3-components'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    //...
  ],
})
```

## HTML5 Mode

Create HTML5 mode with `createWebHistory()`, which is based on `createBrowserRouter` from **react-router-dom**:

```js
import { createRouter, createWebHistory } from 'react-vue3-components'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    //...
  ],
})
```

When using this history mode, the URL will look "normal", for example `https://example.com/user/id`.

However, a problem arises. Since our application is a single-page client-side application, if there is no proper server configuration, users will get a 404 error when accessing `https://example.com/user/id` directly in the browser.

To solve this problem, all you need to do is add a simple fallback route on your server. If the URL does not match any static resources, it should serve the same page as `index.html` in your application.

## Server Configuration Examples

Refer to [`VueRouter Server Configuration Examples`](https://router.vuejs.org/guide/essentials/history-mode.html#server-configuration-examples)

## Additional Notes

Here's a caveat. Your server will no longer report 404 errors because all not-found paths will now display your `index.html` file. To fix this, you should implement a catch-all route in your React application to display a 404 page.

```jsx
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '*', component: <NotFoundComponent /> }],
})
```