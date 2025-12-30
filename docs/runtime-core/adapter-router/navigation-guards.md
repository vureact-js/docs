# 导航守卫

主要用来通过跳转或取消的方式守卫导航。这里有很多方式植入路由导航中：全局的，单个路由独享的，或者组件级的。

它的原理是通过在 `<RouterView>` 组件中，进行条件性的拦截或放行  `react-router-dom` 的导航地址和路由组件  `outlet`

## 全局前置守卫

你可以使用 `router.beforeEach` 注册一个全局前置守卫：

```js
const router = createRouter({ ... })

router.beforeEach((to, from) => {
  // ...
  // 返回 false 以取消导航
  return false
})
```

当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于**等待中**。

每个守卫方法接收两个参数：

- **`to`**: 即将要进入的目标

- **`from`**: 当前导航正要离开的路由

可以返回的值如下:

- `false`: 取消当前的导航。如果浏览器的 URL 改变了(可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 `from` 路由对应的地址。

- 一个路由地址: 通过一个路由地址重定向到一个不同的地址，如同调用 `router.push()`，且可以传入诸如 `replace: true` 或 `name: 'home'` 之类的选项。它会中断当前的导航，同时用相同的 `from` 创建一个新导航。

```js
 router.beforeEach(async (to, from) => {
   if (
     // 检查用户是否已登录
     !isAuthenticated &&
     // ❗️ 避免无限重定向
     to.name !== 'Login'
   ) {
     // 将用户重定向到登录页面
     return { name: 'Login' }
   }
 })
```

返回`undefined` 或 `true` 则代表守卫通过，并调用下一个导航守卫。

以上所有都同 **`async` 函数** 和 Promise 工作方式一样：

```js
router.beforeEach(async (to, from) => {
  // canUserAccess() 返回 `true` 或 `false`
  const canAccess = await canUserAccess(to)
  if (!canAccess) return '/login'
})
```

### 可选的第三个参数 `next`

你可以向任何导航守卫传递第三个参数。在这种情况下，**确保 `next`** 在任何给定的导航守卫中都被**严格调用一次**。它可以出现多于一次，但是只能在所有的逻辑路径都不重叠的情况下，否则钩子永远都不会被解析或报错。这里有一个在用户未能验证身份时重定向到`/login`的**错误用例**：

```js
// BAD
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  // 如果用户未能验证身份，则 `next` 会被调用两次
  next()
})
```

下面是正确的版本:

```js
// GOOD
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})
```

## 全局解析守卫

你可以用 `router.beforeResolve` 注册一个全局守卫。这和 `router.beforeEach` 类似，因为它在**每次导航**时都会触发，不同的是，解析守卫刚好会在导航被确认之前、**所有组件内守卫和异步路由组件被解析之后**调用。这里有一个例子，根据路由在[元信息](./meta)中的 `requiresCamera` 属性确保用户访问摄像头的权限：

```js
router.beforeResolve(async to => {
  if (to.meta.requiresCamera) {
    try {
      await askForCameraPermission()
    } catch (error) {
      if (error instanceof NotAllowedError) {
        // ... 处理错误，然后取消导航
        return false
      } else {
        // 意料之外的错误，取消导航并把错误传给全局处理器
        throw error
      }
    }
  }
})
```

`router.beforeResolve` 是获取数据或执行任何其他操作（如果用户无法进入页面时你希望避免执行的操作）的理想位置。

## 全局后置钩子

你也可以注册全局后置钩子，然而和守卫不同的是，这些钩子不会接受 `next` 函数也不会改变导航本身：

```js
router.afterEach((to, from) => {
  sendToAnalytics(to.fullPath)
})
```

它们对于分析、更改页面标题、声明页面等辅助功能以及许多其他事情都很有用。

## 路由独享的守卫

你可以直接在路由配置上定义 `beforeEnter` 守卫：

```jsx
const routes = [
  {
    path: '/users/:id',
    component: <UserDetails />,
    beforeEnter: (to, from) => {
      // reject the navigation
      return false
    },
  },
]
```

`beforeEnter` 守卫 **只在进入路由时触发**，不会在 `params`、`query` 或 `hash` 改变时触发。例如，从 `/users/2` 进入到 `/users/3` 或者从 `/users/2#info` 进入到 `/users/2#projects`。它们只有在 **从一个不同的** 路由导航时，才会被触发。

你也可以将一个函数数组传递给 `beforeEnter`，这在为不同的路由重用守卫时很有用：

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

当配合[嵌套路由](./nested-routes.html)使用时，父路由和子路由都可以使用 `beforeEnter`。如果放在父级路由上，路由在具有相同父级的子路由之间移动时，它不会被触发。例如：

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

示例中的 `beforeEnter` 在 `/user/list` 和 `/user/details` 之间移动时不会被调用，因为它们共享相同的父级路由。如果我们直接将 `beforeEnter` 守卫放在 `details` 路由上，那么在这两个路由之间移动时就会被调用。

## 组件内的守卫

你可以在路由组件内直接定义路由导航守卫钩子

- `useBeforeRouteEnter`
- `useBeforeRouteUpdate`
- `useBeforeRouteLeave`

```js
import { useBeforeRouteLeave, useBeforeRouteUpdate } from 'react-vue3-components'

useBeforeRouteUpdate(async (to, from) => {
  // 在当前路由改变，但是该组件被复用时调用
  // 举例来说，对于一个带有动态参数的路径 
  // `/users/:id`，在 `/users/1` 和 `/users/2` 之间跳转的时候，
  // 由于会渲染同样的 `UserDetails` 组件，
  // 因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
})

useBeforeRouteLeave(async (to, from) => {
   // 在导航离开渲染该组件的对应路由时调用
})
```

**离开守卫** 通常用来预防用户在还未保存修改前突然离开。该导航可以通过返回 `false` 来取消。

```js
useBeforeRouteLeave((to, from) {
  const answer = window.confirm('Do you really want to leave?')
  if (!answer) return false
})
```

## 完整的导航守卫执行流程

1. 导航被触发。
2. 进入路由组件时 `useBeforeRouteLeave` 守卫不调用，在离开时才会调用。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `useBeforeRouteUpdate` 守卫，首次进入时不调用。
5. 调用路由配置中的 `beforeEnter`，如果其直系父路由也存在该守卫，则会依次调用。
6. 调用全局的 `beforeResolve`。
7. 导航被确认。
8. 调用全局的 `afterEach` 钩子。
9. 触发 DOM 更新。