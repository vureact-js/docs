# Route Lazy Loading

We internally use the React Suspense component to wrap components imported via dynamic `import`, and then load the corresponding components only when the route is accessed, which makes it more efficient.

This means you can use dynamic imports instead of static imports:

```js
const UserDetails = () => import('./views/UserDetails.jsx')

const router = createRouter({
  // ...
  routes: [
    { path: '/users/:id', component: UserDetails }
    // or use it directly in the route definition
    { path: '/users/:id', component: () => import('./views/UserDetails.jsx') },
  ],
})
```

Please note: Dynamically imported components cannot be used directly like `<UserDetails />`; instead, you pass a function that returns a Promise component.

## Custom Loading State

We can provide a fallback loading component through the `loadingComponent` option preset in the `meta` field.

```jsx
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    meta: {
      loadingComponent: <div>Custom Loading...</div>,
    },
  },
]
```