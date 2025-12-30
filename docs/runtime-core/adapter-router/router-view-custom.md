# 自定义渲染 RouterView

RouterView 组件提供了一个 prop `customRender`，其 component 参数表示当前要渲染的路由组件，可以用来自定义渲染路由组件：

```jsx
<RouterView customRender={(component) => component} />
```

## KeepAlive & Transition

当在处理 [KeepAlive](../components/keep-alive) 组件时，我们通常想要保持路由组件活跃，而不是 RouterView 本身。为了实现这个目的，我们可以将 KeepAlive 组件放置在 `customRender` 内：

```jsx
<RouterView
  customRender={(component) => (
    <KeepAlive>{component}</KeepAlive>
  )}
/>
```

我们也可以使用一个 [Transition](../components/transition)  组件来实现在路由组件之间切换时实现过渡效果：

```jsx
<RouterView
  customRender={(component) => (
    <Transition if appear>{component}</Transition>
  )}
/>
```

## Props

| **Prop 名称**  | **类型**                   | **描述**             | 必填项 |
| -------------- | -------------------------- | -------------------- | ------ |
| customRender | `(component) => ReactNode` | 自定义渲染组件的内容 | 否     |
