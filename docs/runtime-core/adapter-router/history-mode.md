# 不同的历史模式

在创建路由器实例时，history 配置允许我们在不同的历史模式中进行选择。

## Hash 模式

hash 模式是用 `createWebHashHistory()` 创建的，它基于 **react-router-dom** 的 `createHashRouter`：

```js
import { createRouter, createWebHashHistory } from 'react-vue3-components'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    //...
  ],
})
```

## Memory 模式

它是用 `createMemoryHistory()` 创建的，基于 **react-router-dom** 的 `createMemoryRouter`，并且**你需要手动 push 到初始导航**。

```js
import { createRouter, createMemoryHistory } from 'react-vue3-components'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    //...
  ],
})
```

## HTML5 模式

用 `createWebHistory()` 创建 HTML5 模式，它基于 **react-router-dom** 的 `createBrowserRouter`：

```js
import { createRouter, createWebHistory } from 'react-vue3-components'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    //...
  ],
})
```

当使用这种历史模式时，URL 会看起来很 "正常"，例如 `https://example.com/user/id`。

不过，问题来了。由于我们的应用是一个单页的客户端应用，如果没有适当的服务器配置，用户在浏览器中直接访问 `https://example.com/user/id`，就会得到一个 404 错误。

要解决这个问题，你需要做的就是在你的服务器上添加一个简单的回退路由。如果 URL 不匹配任何静态资源，它应提供与你的应用程序中的 `index.html` 相同的页面。

## 服务器配置示例

参考 [`VueRouter 服务器配置示例`](https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%85%8D%E7%BD%AE%E7%A4%BA%E4%BE%8B)

## 附加说明

这有一个注意事项。你的服务器将不再报告 404 错误，因为现在所有未找到的路径都会显示你的 `index.html` 文件。为了解决这个问题，你应该在你的 React 应用程序中实现一个万能的路由来显示 404 页面。

```jsx
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '*', component: <NotFoundComponent /> }],
})
```
