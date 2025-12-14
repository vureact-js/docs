# TransitionGroup

为列表中的多个元素或组件提供过渡效果，与 Vue 的 `<transition-group>` **几乎一致**。

## 和 `<Transition>` 的区别

`<TransitionGroup>` 支持和 `<Transition>` 基本相同的 props、CSS 过渡 className 和事件监听器，但有以下几点区别：

- 默认情况下，它不会渲染任何容器元素。但你可以通过传入 `tag` prop 来指定一个元素作为容器元素来渲染。

- `过渡模式`在这里不可用，因为我们不再是在互斥的元素之间进行切换。

- 列表中的每个元素都必须有一个独一无二的 `key`。

- CSS 过渡 className 会被应用在列表内的元素上，而不是容器元素上。

## 进入 / 离开动画

这里是 `<TransitionGroup>` 对一个 `Children.map` 列表添加进入 / 离开动画的示例：

```jsx
<TransitionGroup name="list" tag="ul">
  {items.map((item) => (
    <li key={item}>{item}</li>
  ))}
</TransitionGroup>
```

```css
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.5s ease;
}
.list-leave-active {
  opacity: 0;
  transform: translateX(30px);
  transition: all 0.5s ease;
}
```

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>正在加载交互式示例...</p>
  </div>
  <iframe
     onload="this.parentElement.classList.remove('loading')"
     src="https://codesandbox.io/embed/w4c2h5?view=preview&module=%2Fsrc%2Fexamples%2FTransitionGroup%2FList.tsx&initialpath=/examples/transition-group/list"
     style="width:100%; height: 340px; border:0; border-radius: 4px; overflow:hidden;"
     title="intelligent-dawn-w4c2h5"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</div>

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?module=%2Fsrc%2Fexamples%2FTransitionGroup%2FList.tsx&initialpath=/examples/transition-group/list)

## 移动动画

上面的示例有一些明显的缺陷：当某一项被插入或移除时，它周围的元素会立即发生“跳跃”而不是平稳地移动。我们可以通过添加一些额外的 2 个 CSS 规则来解决这个问题：

```jsx
<TransitionGroup name="list" tag="ul" moveClass="list-move">
  ...
</TransitionGroup>
```

```css
/* 对移动中的元素应用的过渡 */
.list-move {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.5s ease;
}
.list-leave-active {
  /* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
  position: absolute;
  opacity: 0;
  transform: translateX(30px);
  transition: all 0.5s ease;
}
```

现在它看起来好多了，甚至对整个列表执行洗牌的动画也都非常流畅：

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>正在加载交互式示例...</p>
  </div>
  <iframe
     onload="this.parentElement.classList.remove('loading')"
     src="https://codesandbox.io/embed/w4c2h5?view=preview&module=%2Fsrc%2Fexamples%2FTransitionGroup%2FListWithFLIP.tsx&initialpath=/examples/transition-group/list-flip"
     style="width:100%; height: 340px; border:0; border-radius: 4px; overflow:hidden;"
     title="intelligent-dawn-w4c2h5"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</div>

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?module=%2Fsrc%2Fexamples%2FTransitionGroup%2FListWithFLIP.tsx&initialpath=/examples/transition-group/list-flip)

你还可以通过向 `<TransitionGroup>` 传递 `moveClass` prop 为移动元素指定自定义过渡 class，类似于<a href="./transition#自定义过渡-classname">自定义过渡 class</a>。

## 移动动画 (FLIP) 的必要配置

`<TransitionGroup>` 内部实现了“FLIP”列表过渡效果。为了确保其能够平滑、无闪烁地工作，您的 CSS 配置必须满足两个关键要求：

- 必须为移动过渡状态的元素设置 `transition` 属性并在 `moveClass` prop 使用。

```css
/* 对移动中的元素应用的过渡 */
.list-move {
  transition: all 0.5s ease;
}
```

```jsx
<TransitionGroup name="list" moveClass="list-move">
...
</TransitionGroup>
```

- 必须为离开过渡状态的元素设置 `position: absolute`。

```css
.list-leave-active {
  /* 确保离开的元素不会影响其他元素的布局 */
  position: absolute;
  opacity: 0;
  transform: translateX(30px);
  transition: all 0.5s ease;
}
```

> ⚠️ 如果未正确配置上述两个 CSS 规则，或缺少 moveClass 对应的 CSS，列表将大概率出现动画计算错误或明显的闪烁抖动。

## 渐进延迟列表动画

通过在 `<TransitionGroup>` 提供的事件 prop 中读取元素的 data attribute，我们可以实现带渐进延迟的列表动画。首先，我们把每一个元素的索引渲染为该元素上的一个 data attribute：

```jsx
<TransitionGroup
  tag="ul"
  css={false}
  duration={1000}
  onBeforeEnter={onBeforeEnter}
  onEnter={onEnter}
  onLeave={onLeave}
>
  {computedList.map((item, index) => (
    <li key={item.msg} data-index={index}>
      {item.msg}
    </li>
  ))}
</TransitionGroup>
```

接着，在事件 prop 中，我们基于当前元素的 data attribute 对该元素的进场动画添加一个延迟。以下是一个基于 <a target="_blank" href="https://gsap.com/">GSAP library</a> 的动画示例：

```jsx
const onEnter = useCallback((el, done) => {
  gsap.to(el, {
    opacity: 1,
    height: '1.6em',
    delay: el.dataset.index * 0.15,
    onComplete: done
  })
}, [])
```

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>正在加载交互式示例...</p>
  </div>
  <iframe
     onload="this.parentElement.classList.remove('loading')"
     src="https://codesandbox.io/embed/w4c2h5?view=preview&module=%2Fsrc%2Fexamples%2FTransitionGroup%2FWithGSAP.tsx&initialpath=/examples/transition-group/list-gsap"
     style="width:100%; height: 340px; border:0; border-radius: 4px; overflow:hidden;"
     title="intelligent-dawn-w4c2h5"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</div>

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?module=%2Fsrc%2Fexamples%2FTransitionGroup%2FWithGSAP.tsx&initialpath=/examples/transition-group/list-gsap)

## Props

`<TransitionGroup>` 拥有与 <a href="./transition#props">`<Transition>`</a> 除了 `mode` 以外所有的 props。

| 属性名        | 类型     | 描述                                     | 必填项 |
| ------------- | -------- | ---------------------------------------- | ------ |
| tag           | `String` | 如果未定义，默认不渲染容器               | 否     |
| moveClass | `String` | 用于自定义过渡期间被应用的 CSS className | 否     |

## 事件

`<TransitionGroup>` 拥有与 <a href="./transition#事件">`<Transition>`</a> 相同的所有事件。
