# Transition Effects

To use transitions on your route components and animate navigation, you need to use the [`<RouterView>` custom rendering](./router-view-custom):

```jsx
<RouterView
  customRender={(component) => (
    {/* 'if' specifies default display, 'appear' specifies applying transition effect on first display */}
    <Transition if appear name="fade">{component}</Transition>
  )}
/>
```

## Transition for a Single Route

The above usage applies the same transition to all routes. If you want each route's component to have a different transition, you can combine [meta information](./meta) with a dynamic `name` on the `<Transition>`:

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

## Dynamic Transition Based on Routes

You can also dynamically determine the transition to use based on the relationship between the target route and the current route. Using a snippet very similar to the previous one:

```jsx
<RouterView
  customRender={(component, route) => (
    <Transition if appear name={route.meta.transition}>
      {component}
    </Transition>
  )}
/>
```

We can add an [after navigation hook](./navigation-guards#global-after-hooks) to dynamically add information to the `meta` field based on the depth of the path.

```js
router.afterEach((to, from) => {
  const toDepth = to.path.split('/').length
  const fromDepth = from.path.split('/').length
  to.meta.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left'
})
```
