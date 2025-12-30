# Suspense

得益于 `React Suspense` 组件，并在其基础上进行的拓展，与 Vue 的 `<Suspense>` **几乎一致**。用来在组件树中协调对异步依赖的处理。

## 加载中状态

使用 `fallback` prop 自定义加载中状态。

```jsx
<Suspense fallback={<>Loading...</>}>
  {/* 具有异步依赖的组件 */} 
  <Dashboard />
</Suspense>
```

如果在初次渲染时没有遇到异步依赖，`<Suspense>` 会直接进入完成状态。

## 延迟 Fallback

通过 `timeout` prop 进行配置：在等待渲染新内容耗时超过 timeout 毫秒之后，`<Suspense>` 将会切换为展示后备内容。若 timeout 值为 0 将导致在替换默认内容时立即显示后备内容。

```jsx
<Suspense timeout={500} fallback={<>Loading...</>}>
  ...
</Suspense>
```

## 事件

`<Suspense>` 组件会触发三个事件：onPending、onResolve 和 onFallback。onPending 事件是在进入挂起状态时触发。onResolve 事件是在组件 children 完成获取新内容时触发。onFallback 事件则是在 fallback prop 的内容显示时触发。

例如，可以使用这些事件在加载新组件时在之前的 DOM 最上层显示一个加载指示器。

```jsx
<Suspense 
  onPending={() => {
    // 进入挂起状态时触发
  }}
  onResolve={() => {
    // 默认内容解析完成时触发
  }}
  onFallback={() => {
    // 加载状态的内容显示时触发
  }}
>
  <Component is={DynamicAsync} />
</Suspense>
```

## 挂起状态

`<Suspense>` 默认就是 “suspensible” 的。可以通过中指定 prop `suspensible: false` 表明不用 Suspense 控制，并让组件始终自己控制其加载状态。这在嵌套的父子 `<Suspense>` 组件中可以由父 Suspense 组件控制状态。

```jsx
<Suspense fallback={<>Loding....</>}>
  <Suspense suspensible={false} fallback={<>这个不应该显示</>}>
    <div>由父组件控制Suspense状态</div>
  </Suspense>
</Suspense>
```

## Props

| 属性名      | 类型         | 描述                                                                         | 必填项      |
|-------------|-------------|------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| timeout     | `Number`    | 在等待渲染新内容耗时超过 timeout 毫秒之后，才显示后备内容                        | 否   |
| suspensible | `Boolean`   | 是否允许挂起（默认值为 true）。当设置为 false 时，Suspense 会直接渲染默认内容。   | 否  |
| fallback    | `ReactNode` | 加载状态下显示的内容                                                           | 是 |
| onPending   | `Function`  | 默认内容解析完成时触发                                                         | 否 |
| onResolve   | `Function`  | 进入挂起状态时触发                                                             | 否 |
| onFallback  | `Function`  | 加载状态的内容显示时触发                                                       | 否 |
