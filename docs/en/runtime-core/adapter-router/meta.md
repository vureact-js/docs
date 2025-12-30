# Route Meta Information

Sometimes, you may want to attach arbitrary information to routes, such as transition names, who can access the route, etc. This can be achieved through the `meta` property that accepts an attribute object, and it can be accessed both on the route address and in navigation guards. You can configure the `meta` field when defining a route like this:

```jsx
const routes = [
  {
    path: '/posts',
    component: <PostsLayout />,
    children: [
      {
        path: 'new',
        component: <PostsNew />,
        // Only authenticated users can create posts
        meta: { requiresAuth: true },
      },
      {
        path: ':id',
        component: PostsDetail
        // Anyone can read the article
        meta: { requiresAuth: false },
      }
    ]
  }
]
```

Then, it can be obtained in `useRoute` or the `to` and `from` parameters in any navigation guard.

```js
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !auth.isLoggedIn()) {
    // This route requires authorization, please check if you are logged in
    // If not, redirect to the login page
    return {
      path: '/login',
      // Save our current location so we can come back later
      query: { redirect: to.fullPath },
    }
  }
})
```
