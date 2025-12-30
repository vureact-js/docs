# 过渡动效

想要在你的路径组件上使用转场，并对导航进行动画处理，你需要使用 [`<RouterView>` 自定义渲染](./router-view-custom)：

```jsx
<RouterView
  customRender={(component) => (
    {/* if 指定默认显示，appear 指定首次显示时应用过渡效果 */}
    <Transition if appear name="fade">{component}</Transition>
  )}
/>
```

## 单个路由的过渡

上面的用法会对所有的路由使用相同的过渡。如果你想让每个路由的组件有不同的过渡，你可以将[元信息](./meta)和动态的 `name` 结合在一起，放在`<Transition>` 上：

```jsx
const routes = [
  {
    path: '/custom-transition',
    component: <PanelLeft />,
    meta: { transition: 'slide-left' },
  },
  {
    path: '/other-transition',
    component: <PanelRight />,
    meta: { transition: 'slide-right' },
  },
]
```

```jsx
<RouterView
  customRender={(component, route) => (
    <Transition if appear name={route.meta.transition || 'fade'}>
      {component}
    </Transition>
  )}
/>
```

## 基于路由的动态过渡

也可以根据目标路由和当前路由之间的关系，动态地确定使用的过渡。使用和刚才非常相似的片段：

```jsx
<RouterView
  customRender={(component, route) => (
    <Transition if appear name={route.meta.transition}>
      {component}
    </Transition>
  )}
/>
```

我们可以添加一个 [after navigation hook](./navigation-guards#全局后置钩子)，根据路径的深度动态添加信息到 `meta` 字段。

```js
router.afterEach((to, from) => {
  const toDepth = to.path.split('/').length
  const fromDepth = from.path.split('/').length
  to.meta.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left'
})
```

