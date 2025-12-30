# 入门

基于 **React Router DOM** 路由库的二次开发，旨在精简模拟 **[Vue Router 4.x](https://router.vuejs.org/zh/guide/)** 的常用功能。本库的 `Router` 组件能够满足日常的业务开发。

文档描述与示例基本和 Vue Router 的一致，但使用形式和语法仍有一些不同之处需要注意，且路由匹配语法务必遵循 react-router-dom 的规范。

## 创建路由器

以下是关于创建路由器的各部分讲解，如果你想快速上手，可以直接跳到下面的 [示例](#示例) 部分进行查看。

### 路由器选项

通过调用 `createRouter({...})` 创建路由器实例，其包含以下选项：

```jsx
import { createWebHistory, createRouter } from 'react-vue3-components'

const { router, RouterProvider } = createRouter({
    // 指定路由的历史模式
    history: createWebHistory(),
    // 路由配置
    routes: []
})
```

### 路由器实例

在调用 `createRouter()` 创建路由器后，它会返回一个对象实例并包含了其中以下 2 个重要成员：

```js
/**
 * 路由器实例，react-router-dom 的 DataRouter，
 * 用于管理所有导航及数据加载 / 变更操作。
 */
router

/**
 * 为给定的数据路由渲染用户界面（UI），
 * 该组件通常应位于应用元素树的顶层。
 */
RouterProvider

```

### 渲染路由器

在 React 应用程序入口文件中使用 `<RouterProvider>` 组件来渲染整个数据路由，并且无需传入 `router` prop，我们在组件内部进行了简化处理和增强。

```jsx
import { createRoot } from "react-dom/client";

createRoot(document.getElementById('root')).render(
  <RouterProvider />
)
```

## 路由配置项

`routes` 选项接受一个 `RouteConfig` 对象的数组，用于定义应用程序的路由结构。这些配置项是基于 **react-router-dom** 的路由对象扩展，并模拟了 **Vue Router** 的一些常用特性。

```ts
interface RouteConfig {
  path?: string;
  name?: string;
  state?: any;
  sensitive?: boolean;
  component?: ComponentType;
  children?: RouteConfig[];
  linkActiveClassName?: string;
  linkInActiveClassName?: string;
  linkExactActiveClassName?: string;
  redirect?: Redirect | RedirectFunc;
  loader?: NonIndexRouteObject['loader'];
  beforeEnter?: (guard: GuardWithNextFn) => void | Array<(guard: GuardWithNextFn) => void>;
  meta?: { [x: string]: any; loadingComponent?: ReactNode };
}
```

| Prop 名称 | 类型 | 描述 |
| :--- | :--- | :--- |
|  path  | `String` | 路由匹配路径。务必遵循 `react-router-dom` 的路径规范。 |
|  name  | `String` | 路由的名称，将作为 `react-router-dom` 的 `id` 属性。 |
|  component  | `ReactNode` | `ComponentLoader` | 渲染到 `<RouterView />` (即 `Outlet`) 的组件。支持传入 `ReactNode` 或异步加载函数 (`ComponentLoader`)。 |
|  children  | `RouteConfig[]` | 嵌套的子路由配置数组。 |
|  redirect  | `String \| Object` | `RedirectOptions` | `RedirectFunc` | 定义路由重定向。可以是目标路径字符串、包含查询参数和状态的对象 (`RedirectOptions`)，或返回这些值的函数 (`RedirectFunc`)。 |
|  loader  | `NonIndexRouteObject['loader']` | `react-router-dom` 的数据加载函数，用于在渲染组件前获取数据。 |
|  meta  | `Object` | 自定义元数据对象。可用于存储路由额外信息，如权限或页面标题。其中 `loadingComponent` 可为异步组件指定加载中状态的 UI。 |
|  sensitive  | `Boolean` | 路径匹配是否区分大小写。 |
|  state  | `Any` | 导航时传递给目标路由的自定义状态数据。 |
|  beforeEnter  | `(guard) => void` | `Array<(guard) => void>` | 独享的路由守卫（类似于 Vue Router 的 `beforeEnter`）。 |
|  linkActiveClassName  | `String` | 链接非精确匹配时，`<RouterLink>` 应用的类名。 |
|  linkInActiveClassName  | `String` | 链接不匹配时，`<RouterLink>` 应用的类名。 |
|  linkExactActiveClassName  | `String` | 链接精确匹配时，`<RouterLink>` 应用的类名。 |

## 示例

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>正在加载交互式示例...</p>
  </div>
  <iframe src="https://codesandbox.io/embed/c2q9ck?view=preview&module=%2Fsrc%2FApp.tsx"
      style="width:100%; height: 400px; border:0; border-radius: 4px; overflow:hidden;"
      title="react-vue3-router"
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    ></iframe>
</div>

[![Edit react-vue3-router](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/react-vue3-router-c2q9ck)

让我们首先来看根组件, `App.jsx`。

```jsx
import { useRoute, RouterLink, RouterView } from 'react-vue3-components'

function App() {
  const route = useRoute();
  return (
    <>
      <h1>Hello App!</h1>
      <p>
        <strong>Current route path:</strong> { route.fullPath }
      </p>
      <nav>
        <RouterLink to="/">Go to Home</RouterLink>
        <RouterLink to="/about">Go to About</RouterLink>
      </nav>
      <main>
        <RouterView />
      </main>
    </>
  )
}
```

在这个示例中使用了两个由 Router 提供的组件: `RouterLink` 和 `RouterView`。

上述示例还使用了 `{ route.fullPath }` 。你需要使用 `useRoute` 来访问当前的路由对象。

### 创建路由器实例

路由器实例是通过调用 `createRouter()` 函数创建的，它基于 **react-router-dom** 的 `createRouterProvider` 实现:

```jsx
// router.js
import { createMemoryHistory, createRouter } from 'react-vue3-components'

import App from "./App";
import HomeView from "./HomeView";
import AboutView from "./AboutView";

const routes = [
  {
    path: "/",
    component: <App />,
    redirect: "home",
    children: [
      { path: "home", component: <HomeView /> },
      { path: "about", component: <AboutView /> },
    ],
  },
]

const { RouterProvider } = createRouter({
  history: createMemoryHistory(),
  routes,
});

// 导出路由器实例
export { RouterProvider };

```

这里的 `history` 选项控制了路由和 URL 路径是如何双向映射的。在示例里，我们使用了 `createMemoryHistory()`，它会完全忽略浏览器的 URL 而使用其自己内部的 URL。 这在示例中可以正常工作，但是未必是你想要在实际应用中使用的。通常，你应该使用 `createWebHistory()` 或 `createWebHashHistory()`。我们将在[不同的历史记录模式](./history-mode)的部分详细介绍这个主题。

### 使用路由器 Provider

一旦路由器实例创建之后，它会返回一个对象实例，我们需要用到其中的 `<RouterProvider>` 组件，它基于 **react-router-dom**  的 `RouterProvider` 实现，我们对其进行了简化处理，且无需传递 `router` prop。在 React 的入口文件中使用：

```jsx
import { createRoot } from "react-dom/client";
import { RouterProvider } from './router' // router 配置文件的位置示例

createRoot(document.getElementById("root")).render(
  <RouterProvider />
);
```

### 访问路由器和当前路由

可以通过 `useRouter()` 和 `useRoute()` 来访问路由器实例和当前路由，其提供的 api 。

```js
const router = useRouter()
const route = useRoute()

router.push('/about');
route.query.search
```
