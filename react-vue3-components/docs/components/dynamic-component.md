# 动态组件

与 Vue 的 `<component>` 动态组件**几乎一致**。

## 基本用法

有些场景会需要在两个组件间来回切换，比如 Tab 界面：

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>正在加载交互式示例...</p>
  </div>
  
  <iframe
     onload="this.parentElement.classList.remove('loading')"
     src="https://codesandbox.io/embed/w4c2h5?view=preview&module=%2Fsrc%2Fexamples%2FComponent.tsx&initialpath=/examples/dynamic-component"
     style="width:100%; height: 240px; border:0; border-radius: 4px; overflow:hidden;"
     title="intelligent-dawn-w4c2h5"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</div>

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?module=%2Fsrc%2Fexamples%2FComponent.tsx&initialpath=/examples/dynamic-component)

上面的例子是通过 `<Component>` 元素和特殊的 `is` prop 实现的：

```jsx
{/* currentTab 改变时组件也改变 */}
<Component is={tabs[currentTab]} />
```

在上面的例子中，被传给 `is` 的值可以是以下几种：

- 普通 HTML 元素 (`<element />`)
- JSX 元素 (`<Demo />`)
- 组件函数 (`Demo`)
- 标签名，用来创建一般的 HTML 元素。

当使用 `<Component is={...} />` 在多个组件间作切换时，被切换掉的组件会被卸载。我们可以通过 <a href="./keep-alive">`<KeepAlive>`</a> 组件强制被切换掉的组件仍然保持“存活”的状态。

## Props

| 属性名  | 类型                                  | 描述                              | 必填项                               |
|---------|--------------------------------------|-----------------------------------|-----------------------------------|
| is      | `String \| ReactNode \| JSX.Element` | 可传递标签名、组件函数和 JSX 元素    | 是 |
