# TransitionGroup

这是适配 Vue `<TransitionGroup>` 的组件，用于为列表项的插入、移除和重排提供过渡动画。

## 基本列表过渡

为列表项设置稳定 `key` 后，`<TransitionGroup>` 会自动处理进入与离开动画。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FTransitionGroup%2FListTransition.tsx&initialpath=/components/transition-group/list">
</iframe>

```tsx
<TransitionGroup name="list" tag="ul">
  {items.map((item) => (
    <li key={item}>项目 {item}</li>
  ))}
</TransitionGroup>
```

```css
.list-enter-from,
.list-leave-to {
  opacity: 0; /* 设置初始过渡外观（必需） */
  transform: translateX(30px);
}

.list-enter-active {
  transition: all 0.5s ease;
  /* 设置激活时的过渡外观（必需） */
  opacity: 1;
  transform: translateX(0);
}

.list-leave-active {
  transition: all 0.5s ease;
  /* 设置离开时的过渡外观（必需） */
  opacity: 0;
  transform: translateX(30px);
}
```

请注意：

> 与 Vue 不同的是，在 `*-enter-active` 和 `*-leave-active` 的样式类中不能仅设置 `transition`，还必须有对应从进入到离开的过渡外观，否则将会生硬的切换。

## 列表重排与移动动画

上面的示例有一些明显的缺陷：当某一项被插入或移除时，它周围的元素会立即发生“跳跃”而不是平稳地移动。我们可以通过添加一些额外的 CSS 规则来解决这个问题：

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
  opacity: 0;
  transform: translateX(30px);
  transition: all 0.5s ease;

  /* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
  position: absolute;
}
```

传入 `moveClass="list-move"` 后，组件会在重排时应用 FLIP 机制触发位移动画。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
 src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FTransitionGroup%2FShuffleTransition.tsx&initialpath=/components/transition-group/shuffle">
</iframe>

```tsx
<TransitionGroup name="list" tag="ul" moveClass="list-move">
  {items.map((item) => (
    <li key={item}>{item}</li>
  ))}
</TransitionGroup>
```

## API

### Props

```ts
interface TransitionGroupProps extends Omit<TransitionProps, 'mode'> {
  /**
   * 如果未定义，不会生成额外容器。
   */
  tag?: string;
  /**
   * 用于自定义过渡期间被应用的 CSS class。
   * 仅用于重排位移动画，不影响 enter/leave 过渡类名。
   */
  moveClass?: string;
  /**
   * 用于为DOM容器添加HTML属性
   */
  htmlProps?: HTMLAttributes<HTMLElement>;
}
```

## 注意事项

- 列表项必须提供稳定 `key`，否则会有警告且移动动画可能异常。
- 需要 DOM 容器时可显式传 `tag="div"`、`tag="ul"` 等。
