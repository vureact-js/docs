# Teleport

借助 `React.createPortal` API 实现 ，与 Vue 的 `<Teleport>` **几乎一致**。它可以将一个组件内部的一部分 JSX “传送”到该组件的 DOM 结构外层的位置去。

## 基本用法

`<Teleport>` 接收一个 `to` prop 来指定传送的目标。`to` 的值可以是一个 CSS 选择器字符串，也可以是一个 DOM 元素对象。这段代码的作用是“把以下的 JSX 片段传送到 body 标签下”

```jsx
<Teleport to="body">
  <Modal />
</Teleport>
```

你可以点击下面这个按钮，然后通过浏览器的开发者工具，在 `<iframe>` 的 `<body>` 标签下找到模态框元素：

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>正在加载交互式示例...</p>
  </div>
  
  <iframe
     onload="this.parentElement.classList.remove('loading')"
     src="https://codesandbox.io/embed/w4c2h5?view=preview&module=%2Fsrc%2Fexamples%2FTeleport.tsx&initialpath=/examples/teleport"
     style="width:100%; height: 240px; border:0; border-radius: 4px; overflow:hidden;"
     title="intelligent-dawn-w4c2h5"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</div>

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?module=%2Fsrc%2Fexamples%2FTeleport.tsx&initialpath=/examples/teleport)
