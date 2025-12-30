# 命名路由

当创建一个路由时，我们可以选择给路由一个 `name`：

```jsx
const routes = [
  {
    path: '/user/:username',
    name: 'profile', 
    component: <User />
  }
]
```

然后我们可以使用  `name`  而不是  `path`  来传递  `to`  prop 给 `<RouterLink >`：

```jsx
<RouterLink to={{ name: 'profile', params: { username: 'apple' } }}>
  User profile
</RouterLink>
```

上述示例将创建一个指向 `/user/apple` 的链接。

使用 `name` 有很多优点：

- 没有硬编码的 URL。
- `params` 的自动编码/解码。
- 防止你在 URL 中出现打字错误。

所有路由的命名**都必须是唯一的**。
