# Transition

这是适配 Vue `<Transition>` 的组件，用于为单个元素或组件的进入/离开过程添加过渡动画。

## 基本使用

最常见场景是根据状态切换显示与隐藏，并使用 `name` 对应 CSS 过渡类名。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FTransition%2FBasicTransition.tsx&initialpath=/components/transition/basic">
</iframe>

```tsx
const [show, setShow] = useState(true);

<Transition name="fade">{show ? <div>Box</div> : null}</Transition>;
```

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

请注意：

> 与 Vue 不同的是，在 `*-enter-active` 和 `*-leave-active` 的样式类中不能仅设置 `transition`，还必须有对应从进入到离开的过渡外观，否则将会生硬的切换。

上面的例子还可以通过配合动态切换 `key` 与 `style.display` 触发相同的过渡效果：

```tsx
<Transition name="fade">
  {/* 提供动态 key，触发节点重新渲染 */}
  <div key={show} style={{ display: show ? '' : 'none' }}>
    Box
  </div>
</Transition>
```

## 过渡模式

通过 `mode` 控制新旧内容切换顺序，常见值为 `out-in`（先离开后进入）。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FTransition%2FModeTransition.tsx&initialpath=/components/transition/mode">
</iframe>

```tsx
<Transition mode="out-in" name="slide-fade" duration={{ enter: 300, leave: 800 }}>
  {state ? <button key="on">开启</button> : <button key="off">关闭</button>}
</Transition>
```

```css
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
  transition: all 0.8s ease;
}
```

## 自定义过渡类名

除 `name` 方案外，也可以直接指定进入/离开的 class，方便接入第三方动画库。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FTransition%2FCustomClassTransition.tsx&initialpath=/components/transition/custom-class">
</iframe>

```tsx
<Transition
  {/* duration 用于设置对应 CSS 过渡效果的持续时间，默认是 500ms */}
  duration={800}
  enterActiveClass="animate__animated animate__tada"
  leaveActiveClass="animate__animated animate__bounceOut"
>
  {show ? <div>自定义类名动画</div> : null}
</Transition>
```

```css
/* 模拟 Animate.css 类 */
.animate__tada {
  animation: tada 0.8s;
}

.animate__bounceOut {
  animation: tada 0.8s reverse;
}

@keyframes tada {
  from {
    transform: scale3d(1, 1, 1);
  }
  10%,
  20% {
    transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
  }
  30%,
  50%,
  70%,
  90% {
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
  }
  40%,
  60%,
  80% {
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
  }
  to {
    transform: scale3d(1, 1, 1);
  }
}
```

## JavaScript 生命周期钩子

你可以使用过渡钩子在进入/离开阶段执行 JS 逻辑。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FTransition%2FHooksTransition.tsx&initialpath=/components/transition/hooks">
</iframe>

```tsx
<Transition
  name="bounce"
  onBeforeEnter={handleBeforeEnter}
  onEnter={handleEnter}
  onAfterEnter={handleAfterEnter}
  onLeave={handleLeave}
  onAfterLeave={handleAfterLeave}
>
  {show ? <div>使用 JS 钩子控制我</div> : null}
</Transition>
```

```css
.bounce-enter-from,
.bounce-leave-to {
  transform: scale(0);
}

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

## API

### Props

```ts
interface TransitionProps extends PropsWithChildren<CommonTransitionProps> {}

interface CommonTransitionProps {
  /**
   * 控制离开/进入过渡的时序。
   * 默认情况下是同时的。
   */
  mode?: 'in-out' | 'out-in';
  /**
   * 用于自动生成过渡 CSS class 名。
   * 例如 `name: 'fade'` 将自动扩展为 `.fade-enter`、
   * `.fade-enter-active` 等。
   */
  name?: string;
  /**
   * 是否应用 CSS 过渡 class。
   * 默认：true
   */
  css?: boolean;
  /**
   * 是否对初始渲染使用过渡。
   * 默认：false
   */
  appear?: boolean;
  /**
   * 显式指定过渡的持续时间。
   */
  duration?: number | { enter: number; leave: number };

  /**
   * 用于自定义过渡 class 的 prop。
   */
  enterFromClass?: string;
  enterActiveClass?: string;
  enterToClass?: string;
  appearFromClass?: string;
  appearActiveClass?: string;
  appearToClass?: string;
  leaveFromClass?: string;
  leaveActiveClass?: string;
  leaveToClass?: string;

  /**
   * 事件钩子
   */
  onBeforeEnter?: (el: HTMLElement) => void;
  onEnter?: (el: HTMLElement, done: () => void) => void;
  onAfterEnter?: (el: HTMLElement) => void;
  onBeforeAppear?: (el: HTMLElement) => void;
  onAppear?: (el: HTMLElement, done: () => void) => void;
  onAfterAppear?: (el: HTMLElement) => void;
  onBeforeLeave?: (el: HTMLElement) => void;
  onLeave?: (el: HTMLElement, done: () => void) => void;
  onAfterLeave?: (el: HTMLElement) => void;
  onEnterCancelled?: (el: HTMLElement) => void;
  onLeaveCancelled?: (el: HTMLElement) => void;
}
```

## 注意事项

- `<Transition>` 期望单个直接子节点，传入多个子节点会输出错误日志。
- 进行状态切换动画时，为切换节点设置稳定 `key`。
- `duration` 为对象时，`enter` 与 `leave` 会分别生效。
