# 路由懒加载

我们在内部对动态 `import` 导入的组件使用了 React Suspense 组件进行包装，然后当路由被访问的时候才加载对应组件，这样就会更加高效 。

这意味着你可以用动态导入代替静态导入：

```js
const UserDetails = () => import('./views/UserDetails.jsx')

const router = createRouter({
  // ...
  routes: [
    { path: '/users/:id', component: UserDetails }
    // 或在路由定义里直接使用它
    { path: '/users/:id', component: () => import('./views/UserDetails.jsx') },
  ],
})
```

请注意：动态导入的组件不能直接像这样使用  `<UserDetails />` ，而是传入一个返回 Promise 组件的函数。

## 自定义加载中

我们可以通过 `meta` 字段预设的 `loadingComponent` 选项提供 fallback 加载组件。

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
