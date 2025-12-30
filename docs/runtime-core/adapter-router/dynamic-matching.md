# 带参数的动态路由匹配

使用的是 `react-router-dom` 的动态路由匹配语法。需要注意的是，它**不支持任何正则表达式语法**，写法只停留在 `:param*` 与 `*` 这两种通配符模式

## 路径参数

```jsx
const routes = [
  // 动态字段以冒号开始
  { path: '/users/:id', component: <User /> },
]
```

可以在同一个路由中设置有多个 *路径参数*，它们会映射到 `$route.params` 上的相应字段。例如：

| 匹配模式                       | 匹配路径                 | route.params                             |
| :----------------------------- | :----------------------- | :--------------------------------------- |
| /users/:username               | /users/eduardo           | `{ username: 'eduardo' }`                |
| /users/:username/posts/:postId | /users/eduardo/posts/123 | `{ username: 'eduardo', postId: '123' }` |

除了 `route.params` 之外，`route` 对象还公开了其他有用的信息，如 `route.query`（如果 URL 中存在参数）、`route.hash` 等。

## 响应路由参数的变化

要对同一个组件中参数的变化做出响应的话，你可以使用 `useEffect` 或者 `react-vue3-hooks` 提供的 [`useWatch`](https://example.com) 监听 `route` 对象上的任意属性，在这个场景中，就是 `route.params` ：

```js
import { useWatch } from 'react-vue3-hooks'
import { useRoute } from 'react-vue3-components'

const route = useRoute()

useWatch(() => route.params.id, (newId, oldId) => {
  // 对路由变化做出响应...
})
```

或者，使用 `useBeforeRouteUpdate` [导航守卫钩子](./navigation-guards)，它还允许你取消导航：

```js
import { useBeforeRouteUpdate } from 'react-vue3-components'
// ...

useBeforeRouteUpdate(async (to, from) => {
  // 对路由变化做出响应...
  userData.value = await fetchUser(to.params.id)
})
```

## 捕获所有路由或 404 Not found 路由

常规参数只匹配 url 片段之间的字符，用 `/` 分隔。如果我们想匹配**任意路径**，我们可以使用 **splat 通配符（*）** 匹配后续所有片段:

```jsx
const routes = [
  // 会捕获所有剩余路径，并放到 params.pathMatch 里
  { path: '/:pathMatch*', name: 'NotFound', component: <NotFound /> },
  // 匹配以 `/user-` 开头的所有内容，
  // :afterUser* 会把整个剩余路径捕获为一个参数，
  // 并将其放在 `route.params.afterUser` 下
  { path: '/user-:afterUser*', component: <UserGeneric /> },
]
```

在这个特定的场景中，我们使用了全局通配符，并将其放在 `pathMatch` 参数里。这样做是为了让我们在需要的时候，可以通过将 `path` 拆分成一个数组，直接导航到路由：

```js
router.push({
  name: 'NotFound',
  // 保留当前路径并删除第一个字符，以避免目标 URL 以 `//` 开头。
  params: { pathMatch: route.path.substring(1).split('/') },
  // 保留现有的查询和 hash 值，如果有的话
  query: route.query,
  hash: route.hash,
})
```

如果你正在使用[历史模式](./history-mode)，请务必按照说明正确配置你的服务器。
