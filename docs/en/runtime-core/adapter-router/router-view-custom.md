# Custom Rendering RouterView

The RouterView component provides a prop `customRender`, whose `component` parameter represents the current route component to be rendered, which can be used to custom-render the route component:

```jsx
<RouterView customRender={(component) => component} />
```

## KeepAlive & Transition

When dealing with the [KeepAlive](../components/keep-alive) component, we usually want to keep the route component alive instead of the RouterView itself. To achieve this, we can place the KeepAlive component inside `customRender`:

```jsx
<RouterView
  customRender={(component) => (
    <KeepAlive>{component}</KeepAlive>
  )}
/>
```

We can also use a [Transition](../components/transition) component to achieve transition effects when switching between route components:

```jsx
<RouterView
  customRender={(component) => (
    <Transition if appear>{component}</Transition>
  )}
/>
```

## Props

| **Prop Name**  | **Type**                   | **Description**               | **Required** |
| -------------- | -------------------------- | ----------------------------- | ------------ |
| customRender | `(component) => ReactNode` | Customize the content of the rendered component | No           |
