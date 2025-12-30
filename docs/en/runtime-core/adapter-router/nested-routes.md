# Nested Routes

Must follow the nested writing specifications of **react-router-dom**. When the `children` property exists in the route configuration, the parent route component must contain a `<RouterView />` component so that the child route components can be correctly rendered at the specified position of the parent component.

> The **`<RouterView />`** component functions the same as the **`<Outlet />`** component in **`react-router-dom`**.

## 1. Route Configuration Example

The following configuration defines a three-level nested route structure:

```jsx
const routes = [
    { 
      path: '/', 
      component: <App />, // Parent route component (first level)
      children: [
         { 
            path: 'user/:id', // Matches paths like /user/123
            component: <User />, // Child route component (second level)
            children: [
               { path: 'profile', component: <UserProfile /> }, // Matches paths like /user/123/profile
               { path: 'posts', component: <UserPosts /> }      // Matches paths like /user/123/posts
            ]
         },
         { path: 'about', component: <About /> }, // Matches paths like /about
      ] 
    }
]
```

## 2. Parent RouterView Example

The parent component (`App`) is responsible for rendering the outermost layout and uses `<RouterView />` to mount its direct child routes (such as `/user/:id` and `/about`).

```jsx
// App.jsx (corresponds to path: '/')
import { RouterLink, RouterView } from 'react-vue3-components'

function App() {
    return (
        <>
            <h3>Route Root Component</h3>
            <nav>
                {/* Navigate to first-level child routes */}
                <RouterLink to="/user/123">User Details</RouterLink>
                <RouterLink to="/about">About Us</RouterLink>
            </nav>
            <main>
                {/* Child route components (<User /> or <About />) will be rendered here
                    When accessing /about, <About /> will replace <RouterView /> here
                */}
                <RouterView />
            </main>
        </>
    )
}
```

## 3. Child RouterView Example

For a component that serves as a parent route (`User`), it not only renders its own content but can also use `<RouterView />` again to mount its grandchild routes (such as `/user/:id/profile` and `/user/:id/posts`).

```jsx
// User.jsx (corresponds to path: 'user/:id')
import { useRoute, RouterLink, RouterView } from 'react-vue3-components'

function User() {
    const route = useRoute();
    const userId = route.params.id; // Can use useRoute to access path parameters

    return (
        <div className="user-layout">
            <h2>Detail Page of User ID: {userId}</h2>
            <nav className="sub-nav">
                {/* Navigate to second-level child routes */}
                <RouterLink to={`/user/${userId}/profile`}>Personal Profile</RouterLink>
                <RouterLink to={`/user/${userId}/posts`}>User Posts</RouterLink>
            </nav>
            
            {/* Grandchild route components (<UserProfile /> or <UserPosts />) will be rendered here
              When accessing /user/123/profile, <UserProfile /> will replace <RouterView /> here
            */}
            <section className="nested-content">
                <RouterView />
            </section>
        </div>
    );
}
```