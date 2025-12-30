# KeepAlive

与 Vue 的 `<keep-alive>` **几乎一致**，它能够缓存不活动的组件实例，从而在组件重新渲染时保留其内部状态。

对于表单组件、分页器或复杂状态的组件非常有用，可以提供更流畅的用户体验。

## 基本用法

在代码示例中，我们使用了 <a href="./dynamic-component">`<Component>`</a> 来动态渲染组件。

默认情况下，React 组件在被替换（卸载）后会被销毁，其内部所有已变更的状态都会丢失——当该组件再次被渲染时，会创建一个全新的实例，仅保留初始状态。

### 无缓存场景

假设有两个带状态的 React 组件：`A`（包含计数器状态）和 `B`（通过输入框同步展示文字内容）。当切换组件时，之前修改的状态会被重置：

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>正在加载交互式示例...</p>
  </div>
  
  <iframe
     onload="this.parentElement.classList.remove('loading')"
     src="https://codesandbox.io/embed/w4c2h5?view=preview&initialpath=/examples/keep-alive/without-cache&module=%2Fsrc%2Fexamples%2FKeepAlive%2FWithoutCache.tsx"
     style="width:100%; height: 240px; border:0; border-radius: 4px; overflow:hidden;"
     title="intelligent-dawn-w4c2h5"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</div>

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?initialpath=/examples/keep-alive/without-cache&module=%2Fsrc%2Fexamples%2FKeepAlive%2FWithoutCache.tsx)

### 有缓存场景

若希望组件切换时保留状态（如表单输入、分页位置、计数器数值等），只需用 `<KeepAlive>` 组件包裹动态切换的组件即可。

使用方式与 Vue 保持一致，你需要使用一个 `key` 来标识组件实例：

```jsx
// 省略其他实现，只展示主要代码

const comps = {
  A: CounterComponent,
  B: FormComponent,
};
const [current, setCurrent] = useState("A");

{/* KeepAlive 包裹后，组件切换时会缓存实例，保留状态 */}
<KeepAlive>
  <Component is={comps[current]} key={current} />
</KeepAlive>
```

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>正在加载交互式示例...</p>
  </div>
  
  <iframe
     onload="this.parentElement.classList.remove('loading')"
     src="https://codesandbox.io/embed/w4c2h5?view=preview&initialpath=/examples/keep-alive/cached&module=%2Fsrc%2Fexamples%2FKeepAlive%2FCached.tsx"
     style="width:100%; height: 240px; border:0; border-radius: 4px; overflow:hidden;"
     title="intelligent-dawn-w4c2h5"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</div>

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?initialpath=/examples/keep-alive/cached&module=%2Fsrc%2Fexamples%2FKeepAlive%2FCached.tsx)

## 包含/排除

`<KeepAlive>` 默认会缓存内部的所有组件实例，但我们可以通过 include 和 exclude prop 来定制该行为。这两个 prop 的值都可以是一个以英文逗号分隔的字符串、一个正则表达式，或是包含这两种类型的一个数组：

```jsx
{/* 以英文逗号分隔的字符串 */}
<KeepAlive include="a,b">
  <Component is={View} />
</KeepAlive>

{/* 正则表达式 */}
<KeepAlive include={/a|b/}>
  <Component is={View} />
</KeepAlive>

{/* 数组 */}
<KeepAlive include={['a', 'b']}>
  <Component is={View} />
</KeepAlive>
```

默认它会根据组件名进行匹配，所以组件如果想要条件性地被 KeepAlive 缓存，就必须使用一个 key 来标识组件实例。

## 最大缓存实例数

我们可以通过传入 max prop 来限制可被缓存的最大组件实例数。`<KeepAlive>` 的行为在指定了 max 后类似一个 LRU 缓存：如果缓存的实例数量即将超过指定的那个最大数量，则最久没有被访问的缓存实例将被销毁，以便为新的实例腾出空间。

```jsx
<KeepAlive max={10}>
  <Component is={activeComponent} />
</KeepAlive>
```

## 缓存实例的生命周期

一个持续存在的组件可以通过 `useActivated` 和 `useDeactivated` 注册相应的两个状态的生命周期钩子：

```jsx
useActivated(() => {
  // 调用时机为首次挂载
  // 以及每次从缓存中被重新插入时
})

useDeactivated(() => {
  // 在从 DOM 上移除、进入缓存
  // 以及组件卸载时调用
})
```

## Props

| 属性名   | 类型                         | 描述                                                               | 必填项                      |
|----------|-----------------------------|--------------------------------------------------------------------|--------------------------------------------------------------------|
| include  | `String \| RegExp \| Array` | 若指定，则仅缓存与 `include` 匹配的组件（基于组件 key，默认使用组件名） | 否 |
| exclude  | `String \| RegExp \| Array` | 任何与 `exclude` 匹配的组件都不会被缓存（匹配规则同上）                | 否 |
| max      | `Number \| String`          | 可缓存的组件实例的最大数量，默认为 10 个                              | 否         |

## 钩子函数

| 函数名         | 类型         | 描述                                         |
|----------------|-------------|----------------------------------------------|
| useActivated   | `Function`  | 调用时机为首次挂载，以及每次从缓存中被重新插入时 |
| useDeactivated | `Function`  | 在从 DOM 上移除、进入缓存，以及组件卸载时调用   |
