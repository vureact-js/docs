# Transition

我们提供了两个组件，可以帮助你制作基于状态变化的过渡和动画，与 Vue 的 `<Transition>` **几乎一致**。

- `<Transition>` 会在一个元素或组件进入和离开 DOM 时应用动画。本章节会介绍如何使用它。

- `<TransitionGroup>` 会在一个 JSX 遍历列表中的元素或组件被插入，移动，或移除时应用动画。我们将在<a href="./transition-group">下一章节</a>中介绍。

## 基本用法

通过 prop `if` 控制组件的进入或离开，`name` prop 来声明一个过渡效果名

```jsx
const [show, setShow] = useState(false);

<button onClick={() => setShow(!show)}>Toggle</button>
<Transition if={show} name="fade">
  <p>hello</p>
</Transition>
```

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>正在加载交互式示例...</p>
  </div>

  <iframe
     onload="this.parentElement.classList.remove('loading')"
     src="https://codesandbox.io/embed/w4c2h5?view=preview&module=%2Fsrc%2Fexamples%2FTransition%2FFade.tsx&initialpath=/examples/transition/fade"
     style="width:100%; height: 240px; border:0; border-radius: 4px; overflow:hidden;"
     title="intelligent-dawn-w4c2h5"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</div>

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?module=%2Fsrc%2Fexamples%2FTransition%2FFade.tsx&initialpath=/examples/transition/fade)

对于一个有名字的过渡效果，对它起作用的过渡 className 会以其名字前缀。比如，上方例子中被应用的 className 将会是 `fade-enter-active`。这个“fade”过渡的 className 应该是这样：

```css
.fade-enter-from,
.fade-leave-to {
  opacity: 0; /* 初始过渡外观 */
}
.fade-enter-active {
  opacity: 1; /* 激活时的过渡外观 */
  transition: opacity 0.5s ease;
}
.fade-leave-active {
  opacity: 0; /* 离开时的过渡外观 */
  transition: opacity 0.5s ease;
}
```

更多过渡效果请查看 <a href="../other/transition-css">Transition 样式表</a>。

## 过渡持续时间

`<Transition>` 控制的动画过渡持续时间默认为 **500 (ms)** ，这意味着如果 CSS 的 `transition-duration` 与其相同，则无需设置组件的 `duration` prop，否则必须对等设置 duration 才能使 CSS 过渡效果正确执行完。

```jsx
<Transition name="fade" duration={350}>
  <p>hello</p>
</Transition>
```

```css
.fade-enter-active {
  opacity: 1;
  transition: opacity 0.35s ease;
}

.fade-leave-active {
  opacity: 0;
  transition: opacity 0.35s ease;
}
```

当 `*-enter-active` 和 `*-leave-active` 的 **CSS 持续时间不同**，可以用对象的形式分开指定进入和离开所需的时间。

## 基于 CSS 的过渡效果

### 为过渡效果命名

#### CSS 过渡 className

一共有 6 个应用于进入与离开过渡效果的 CSS className。

1. ***-enter-from**：**进入动画的起始状态 (Start)**。 在组件首次挂载或重新进入 DOM 之前被添加。在组件挂载完成的下一帧移除。

2. ***-enter-active**：**进入动画的生效状态 (Active)**。 应用于整个进入动画阶段。在组件挂载之前添加，在过渡或动画完成之后移除。**用于定义持续时间、延迟与速度曲线类型 (Transition / Animation property)。**

3. ***-enter-to**：**进入动画的结束状态 (End)。** 在组件挂载完成的下一帧被添加 (即 `*-enter-from` 被移除的同时)，在过渡或动画完成之后移除。

4. ***-leave-from**：**离开动画的起始状态 (Start)。** 在离开过渡效果被触发时（组件卸载前）立即添加。在一帧后被移除。

5. ***-leave-active**：**离开动画的生效状态 (Active)**。 应用于整个离开动画阶段。在离开过渡效果被触发时立即添加，在过渡或动画完成之后移除。**用于定义持续时间、延迟与速度曲线类型 (Transition / Animation property)。**

6. ***-leave-to**：**离开动画的结束状态 (End)。** 在一个离开动画被触发后的下一帧被添加 (即 `*-leave-active` 被移除的同时)，在过渡或动画完成之后移除。

#### CSS 的 transition

`<Transition>` 一般都会搭配<a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Transitions/Using">原生 CSS 过</a>渡一起使用，正如你在上面的例子中所看到的那样。这个 transition CSS 属性是一个简写形式，使我们可以一次定义一个过渡的各个方面，包括需要执行动画的属性、持续时间和<a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function">速度曲线</a>。

下面是一个更高级的例子，它使用了不同的持续时间和速度曲线来过渡多个属性。

```jsx
<Transition if={show} name="slide-fade" duration={{ enter: 300, leave: 800 }}>
  <p>hello</p>
</Transition>
```

```css
/*
  进入和离开动画可以使用不同持续时间和速度曲线。
*/
/* 初始过渡外观 */
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
/* 激活时的过渡外观 */
.slide-fade-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.3s ease-out;
}
/* 离开时的过渡外观 */
.slide-fade-leave-active {
  opacity: 0;
  transform: translateX(20px);
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
```

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>正在加载交互式示例...</p>
  </div>

  <iframe
     onload="this.parentElement.classList.remove('loading')"
     src="https://codesandbox.io/embed/w4c2h5?view=preview&module=%2Fsrc%2Fexamples%2FTransition%2FFade.tsx&initialpath=/examples/transition/slide-fade"
     style="width:100%; height: 240px; border:0; border-radius: 4px; overflow:hidden;"
     title="intelligent-dawn-w4c2h5"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</div>

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?module=%2Fsrc%2Fexamples%2FTransition%2FFade.tsx&initialpath=/examples/transition/slide-fade)

#### CSS 的 animation

<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations" target="_blank">原生 CSS 动画</a>和 CSS transition 的应用方式基本上是相同的，只有一点不同，那就是 `*-enter-from` 不是在元素插入后立即移除，而是在一个 `animationend` 事件触发时被移除。

对于大多数的 CSS 动画，我们可以简单地在 `*-enter-active` 和 `*-leave-active` className 下声明它们。下面是一个示例：

```jsx
<Transition if={show} name="bounce">
  <p style={{ textAlign: 'center' }}>
    Hello here is some bouncy text!
  </p>
</Transition>
```

```css
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
```

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>正在加载交互式示例...</p>
  </div>

  <iframe
     onload="this.parentElement.classList.remove('loading')"
     src="https://codesandbox.io/embed/w4c2h5?view=preview&module=%2Fsrc%2Fexamples%2FTransition%2FBounce.tsx&initialpath=/examples/transition/bounce"
     style="width:100%; height: 240px; border:0; border-radius: 4px; overflow:hidden;"
     title="intelligent-dawn-w4c2h5"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</div>

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?module=%2Fsrc%2Fexamples%2FTransition%2FBounce.tsx&initialpath=/examples/transition/bounce)

#### 自定义过渡 className

你也可以向 `<Transition>` 传递以下的 props 来指定自定义的过渡 className：

- `enterFromClass`

- `enterActiveClass`

- `enterToClass`

- `leaveFromClass`

- `leaveActiveClass`

- `leaveToClass`

你传入的这些 className 会覆盖相应阶段的默认 className 名。这个功能在你想要在 React 的动画机制下集成其他的第三方 CSS 动画库时非常有用，比如 <a target="_blank" href="https://daneden.github.io/animate.css/">Animate.css</a>：

```jsx
{/* 假设你已经在页面中引入了 Animate.css */}
<Transition
  if={show}
  name="custom-classes"
  enterActiveClass="animate__animated animate__tada"
  leaveActiveClass="animate__animated animate__bounceOutRight"
>
  <p>hello</p>
</Transition>
```

## JavaScript 钩子

你可以通过监听 `<Transition>` 组件事件的方式在过渡过程中挂上钩子函数：

```jsx
<Transition
  onBeforeEnter={onBeforeEnter}
  onEnter={onEnter}
  onAfterEnter={onAfterEnter}
  onEnterCancelled={onEnterCancelled}
  onBeforeLeave={onBeforeLeave}
  onLeave={onLeave}
  onAfterLeave={onAfterLeave}
  onLeaveCancelled={onLeaveCancelled}
>
  ...
</Transition>
```

```jsx
// 在元素被插入到 DOM 之前被调用
// 用这个来设置元素的 "enter-from" 状态
const onBeforeEnter = (el) => {}

// 在元素被插入到 DOM 之后的下一帧被调用
// 用这个来开始进入动画
const onEnter = (el, done) => {
  // 调用回调函数 done 表示过渡结束
  // 如果与 CSS 结合使用，则这个回调是可选参数
  done()
}

// 当进入过渡完成时调用。
const onAfterEnter = (el) => {}

// 当进入过渡在完成之前被取消时调用
const onEnterCancelled = (el) => {}

// 在 leave 钩子之前调用
// 大多数时候，你应该只会用到 leave 钩子
const onBeforeLeave = (el) => {}

// 在离开过渡开始时调用
// 用这个来开始离开动画
const onLeave = (el, done) => {
  // 调用回调函数 done 表示过渡结束
  // 如果与 CSS 结合使用，则这个回调是可选参数
  done()
}

// 在离开过渡完成、
// 且元素已从 DOM 中移除时调用
const onAfterLeave = (el) => {}

// 当进入过渡在离开之前被取消时调用
const onLeaveCancelled = (el) => {}
```

这些钩子可以与 CSS 过渡或动画结合使用，也可以单独使用。

在使用仅由 JavaScript 执行的动画时，最好是添加一个 `css={false}` prop。禁止所有 CSS 过渡效果，还可以防止 CSS 规则意外地干扰过渡效果：

```jsx
<Transition css={false}>
  ...
</Transition>
```

在有了 `css={false}` 后，我们就自己全权负责控制什么时候过渡结束了。这种情况下对于 `onEnter` 和 `onLeave` 钩子来说，回调函数 `done` 就是必须的。否则，钩子将被同步调用，过渡将立即完成。

这里是使用 <a target="_blank" href="https://gsap.com/">GSAP 库</a>执行动画的一个示例，你也可以使用任何你想要的库，比如 <a target="_blank" href="https://animejs.com/">Anime.js</a> 或者 <a target="_blank" href="https://motion.dev/">Motion One</a>：

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>正在加载交互式示例...</p>
  </div>

  <iframe
     onload="this.parentElement.classList.remove('loading')"
     src="https://codesandbox.io/embed/w4c2h5?view=preview&module=%2Fsrc%2Fexamples%2FTransition%2FWithGSAP.tsx&initialpath=/examples/transition/with-gsap"
     style="width:100%; height: 240px; border:0; border-radius: 4px; overflow:hidden;"
     title="intelligent-dawn-w4c2h5"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</div>

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?module=%2Fsrc%2Fexamples%2FTransition%2FWithGSAP.tsx&initialpath=/examples/transition/with-gsap)

## 出现时过渡

如果你想在某个节点初次渲染时应用一个过渡效果，你可以添加 `appear` prop：

```jsx
<Transition appear>
  ...
</Transition>
```

## 元素间过渡

无法做到像 Vue 那样在 `<Transition>` 的子节点中只要确保任一时刻只会有一个元素被渲染的方案，因此使用以下降级方案：

```jsx
const [docState, setDocState] = useState("saved");

<Transition if={docState === "saved"} name="slide-up">
  <button onClick={() => setDocState("edited")}>
    Edit
  </button>
</Transition>
<Transition if={docState === "edited"} name="slide-up">
  <button onClick={() => setDocState("editing")}>
    Save
  </button>
</Transition>
<Transition if={docState === "editing"} name="slide-up">
  <button onClick={() => setDocState("saved")}>
    Cancel
  </button>
</Transition>
```

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>正在加载交互式示例...</p>
  </div>

  <iframe
     onload="this.parentElement.classList.remove('loading')"
     src="https://codesandbox.io/embed/w4c2h5?view=preview&module=%2Fsrc%2Fexamples%2FTransition%2FMoreToggle.tsx&initialpath=/examples/transition/more-toggle"
     style="width:100%; height: 240px; border:0; border-radius: 4px; overflow:hidden;"
     title="intelligent-dawn-w4c2h5"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</div>

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?module=%2Fsrc%2Fexamples%2FTransition%2FMoreToggle.tsx&initialpath=/examples/transition/more-toggle)

## 过渡模式

> `mode` 通过 <a target="_blank" href="https://reactcommunity.org/react-transition-group/switch-transition">`<SwitchTransition>`</a> 组件实现，**其核心任务是“内容切换”**，严格控制的是同一时刻，哪个子组件是激活状态。它不是一个单纯的“显示/隐藏”控制器，它的设计目标是：当 key 变化时，用动画将旧内容换成新内容。

在之前的例子中，进入和离开的元素都是在同时开始动画的，因此我们不得不将它们设为 `position: absolute` 以避免二者同时存在时出现的布局问题。

然而，很多情况下这可能并不符合需求。我们可能想要先执行离开动画，然后在其完成之后再执行元素的进入动画。手动编排这样的动画是非常复杂的，好在我们可以通过向 `<Transition>` 传入一个 `mode` prop 来实现这个行为：

```jsx
<Transition mode="out-in">
  ...
</Transition>
```

将之前的例子改为 `mode="out-in"` 后是这样：

```jsx
const handleClick = useCallback(() => {
  setShow(() => !show);
  setDocState(() =>
    docState === "saved"
      ? "edited"
      : docState === "edited"
      ? "editing"
      : "saved"
  );
}, [show, docState]);

<Transition if={show} mode="out-in" name="slide-up">
  <button onClick={handleClick}>
    {docState === "saved"
      ? "Edit"
      : docState === "edited"
      ? "Save"
      : "Cancel"}
  </button>
</Transition>
```

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>正在加载交互式示例...</p>
  </div>

  <iframe
     onload="this.parentElement.classList.remove('loading')"
     src="https://codesandbox.io/embed/w4c2h5?view=preview&module=%2Fsrc%2Fexamples%2FTransition%2FOutIn.tsx&initialpath=/examples/transition/out-in"
     style="width:100%; height: 240px; border:0; border-radius: 4px; overflow:hidden;"
     title="intelligent-dawn-w4c2h5"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</div>

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?module=%2Fsrc%2Fexamples%2FTransition%2FOutIn.tsx&initialpath=/examples/transition/out-in)

`<Transition>` 也支持 `mode="in-out"`，虽然这并不常用。

## 动态过渡

`<Transition>` 的 props (比如 `name`) 也可以是动态的，这让我们可以根据状态变化动态地应用不同类型的过渡：

```jsx
<Transition name={transitionName}>
  ...
</Transition>
```

这个特性的用处是可以提前定义好多组 CSS 过渡或动画的 className，然后在它们之间动态切换。

你也可以根据你的组件的当前状态在 JavaScript 过渡钩子中应用不同的行为。最后，创建动态过渡的终极方式还是创建**可复用的过渡组件**，并让这些组件根据动态的 props 来改变过渡的效果。

## 阻止过渡

当 CSS 过渡或动画启用时，在 `duration` prop 设定的时间内（默认 500 ms），可以通过快速切换 `show` prop 的状态强制阻止其行为，且会触发取消进入事件 `onEnterCancelled` 或者取消离开事件 `onLeaveCancelled`。

```jsx
<Transition
  if={show}
  name="fade"
  onEnterCancelled={(el) => {
    console.log("onEnterCancelled!", el);
  }}
  onLeaveCancelled={(el) => {
    console.log("onLeaveCancelled!", el);
  }}
>
  <p>I can revert the state</p>
</Transition>
```

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>正在加载交互式示例...</p>
  </div>

  <iframe
     onload="this.parentElement.classList.remove('loading')"
     src="https://codesandbox.io/embed/w4c2h5?view=preview&module=%2Fsrc%2Fexamples%2FTransition%2FCanceled.tsx&initialpath=/examples/transition/canceled"
     style="width:100%; height: 240px; border:0; border-radius: 4px; overflow:hidden;"
     title="intelligent-dawn-w4c2h5"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</div>

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?module=%2Fsrc%2Fexamples%2FTransition%2FCanceled.tsx&initialpath=/examples/transition/canceled)

## Props

| 属性名       | 类型                                       | 描述                                                         | 必填项 |
| ------------ | ------------------------------------------ | ------------------------------------------------------------ | ------ |
| if           | `Boolean`                                  | 控制组件的进入或离开，触发进入或退出状态                     | 否     |
| show         | `Boolean`                                  | 控制组件的进入或离开，触发进入或退出状态（不卸载组件）       | 否     |
| mode         | `'out-in' \| 'in-out'`                     | 控制进入/离开过渡的定时顺序                                  | 否     |
| css          | `Boolean`                                  | 启用或关闭所有 CSS 过渡效果                                  | 否     |
| appear       | `Boolean`                                  | 在组件初次渲染时应用过渡效果                                 | 否     |
| duration     | `Number \| {enter: Number, leave: Number}` | 定义进入和离开过渡所需的时间（单位 ms）                      | 否     |
| enterFromClass    | `String`                                   | 自定义进入过渡的**起始状态**（`-enter-from`）的 CSS 类名     | 否     |
| enterActiveClass  | `String`                                   | 自定义进入过渡的**生效状态**（`-enter-active`）的 CSS 类名   | 否     |
| enterToClass      | `String`                                   | 自定义进入过渡的**结束状态**（`-enter-to`）的 CSS 类名       | 否     |
| appearFrom   | `String`                                   | 自定义初次渲染过渡的**起始状态**（`-appear-from`）的 CSS 类名 | 否     |
| appearActive | `String`                                   | 自定义初次渲染过渡的**生效状态**（`-appear-active`）的 CSS 类名 | 否     |
| appearTo     | `String`                                   | 自定义初次渲染过渡的**结束状态**（`-appear-to`）的 CSS 类名  | 否     |
| leaveFromClass    | `String`                                   | 自定义离开过渡的**起始状态**（`-leave-from`）的 CSS 类名     | 否     |
| leaveActiveClass  | `String`                                   | 自定义离开过渡的**生效状态**（`-leave-active`）的 CSS 类名   | 否     |
| leaveToClass      | `String`                                   | 自定义离开过渡的**结束状态**（`-leave-to`）的 CSS 类名       | 否     |

## 事件

| 函数名           | 类型                                          | 描述                                                         |
| ---------------- | --------------------------------------------- | ------------------------------------------------------------ |
| onBeforeEnter    | `(el: HTMLElement) => void`                   | 在元素被插入到 DOM 之前被调用。用于设置元素的 `enter-from` 状态 |
| onEnter          | `(el: HTMLElement, done: () => void) => void` | 在元素被插入到 DOM 之后的下一帧被调用。用于开始进入动画。调用回调函数 `done` 表示过渡结束（与 CSS 结合使用时可选） |
| onAfterEnter     | `el: HTMLElement) => void`                    | 当进入过渡完成时调用                                         |
| onAppear         | `(el: HTMLElement, done: () => void) => void` | 在组件初次渲染时（当 `appear={true}`  时），元素被插入到 DOM 之后的下一帧被调用。用法与 `onEnter` 相同 |
| onAfterAppear    | `(el: HTMLElement) => void`                  | 当初次渲染过渡完成时调用 (当 `appear={true}`  时)。          |
| onBeforeLeave    | `(el: HTMLElement) => void`                   | 在 `onLeave` 钩子之前调用。                                  |
| onLeave          | `(el: HTMLElement, done: () => void) => void` | 在离开过渡开始时调用。用于开始离开动画。调用回调函数 `done` 表示过渡结束（与 CSS 结合使用时可选 |
| onAfterLeave     | `(el: HTMLElement) => void`                   | 在离开过渡完成、且元素已从 DOM 中移除时调用                  |
| onEnterCancelled | `(el: HTMLElement) => void`                   | 当进入过渡在完成之前被取消时调用                             |
| onLeaveCancelled | `(el: HTMLElement) => void`                   | 当进入过渡在离开之前被取消时调用                             |
