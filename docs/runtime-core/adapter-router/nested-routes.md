# 嵌套路由

需遵循 **react-router-dom** 的嵌套写法规范。当路由配置中存在 `children` 属性时，父级路由组件必须包含一个 `<RouterView />` 组件，子级路由组件才能被正确地渲染到父组件的指定位置。

> **`<RouterView />`** 组件的作用等同于 **`react-router-dom`** 中的 **`<Outlet />`** 组件。

## 1\. 路由配置示例

以下配置定义了三层嵌套的路由结构：

```jsx
const routes = [
    { 
      path: '/', 
      component: <App />, // 父级路由组件（第一层）
      children: [
         { 
            path: 'user/:id', // 匹配路径如 /user/123
            component: <User />, // 子级路由组件（第二层）
            children: [
               { path: 'profile', component: <UserProfile /> }, // 匹配路径如 /user/123/profile
               { path: 'posts', component: <UserPosts /> }      // 匹配路径如 /user/123/posts
            ]
         },
         { path: 'about', component: <About /> }, // 匹配路径如 /about
      ] 
    }
]
```

## 2\. 父级 RouterView 示例

父级组件 (`App`) 负责渲染最外层布局，并通过 `<RouterView />` 来挂载其直接子路由（如 `/user/:id` 和 `/about`）。

```jsx
// App.jsx (对应 path: '/')
import { RouterLink, RouterView } from 'react-vue3-components'

function App() {
    return (
        <>
            <h3>路由根组件</h3>
            <nav>
                {/* 导航到第一层子路由 */}
                <RouterLink to="/user/123">用户详情</RouterLink>
                <RouterLink to="/about">关于我们</RouterLink>
            </nav>
            <main>
                {/* 子级路由组件（<User /> 或 <About />）将在此处渲染
                    当访问 /about 时，<About /> 将替换此处的 <RouterView />
                */}
                <RouterView />
            </main>
        </>
    )
}
```

## 3\. 子级 RouterView 示例

对于作为父路由的组件 (`User`)，它不仅会渲染自己的内容，而且也可以再次使用 `<RouterView />` 来挂载它的孙子路由（如 `/user/:id/profile` 和 `/user/:id/posts`）。

```jsx
// User.jsx (对应 path: 'user/:id')
import { useRoute, RouterLink, RouterView } from 'react-vue3-components'

function User() {
    const route = useRoute();
    const userId = route.params.id; // 可以使用 useRoute 访问路径参数

    return (
        <div className="user-layout">
            <h2>用户 ID: {userId} 的详情页</h2>
            <nav className="sub-nav">
                {/* 导航到第二层子路由 */}
                <RouterLink to={`/user/${userId}/profile`}>个人资料</RouterLink>
                <RouterLink to={`/user/${userId}/posts`}>用户帖子</RouterLink>
            </nav>
            
            {/* 孙级路由组件（<UserProfile /> 或 <UserPosts />）将在此处渲染
              当访问 /user/123/profile 时，<UserProfile /> 将替换此处的 <RouterView />
            */}
            <section className="nested-content">
                <RouterView />
            </section>
        </div>
    );
}
```