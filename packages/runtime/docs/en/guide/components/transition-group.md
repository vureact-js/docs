# TransitionGroup

This is a component adapted for Vue's `<TransitionGroup>`, designed to provide transition animations for the insertion, removal, and reordering of list items.

## Basic List Transitions

After setting stable `key` for list items, `<TransitionGroup>` will automatically handle enter and leave animations.

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
    <li key={item}>Item {item}</li>
  ))}
</TransitionGroup>
```

```css
.list-enter-from,
.list-leave-to {
  opacity: 0; /* Set initial transition appearance (required) */
  transform: translateX(30px);
}

.list-enter-active {
  transition: all 0.5s ease;
  /* Set transition appearance when active (required) */
  opacity: 1;
  transform: translateX(0);
}

.list-leave-active {
  transition: all 0.5s ease;
  /* Set transition appearance when leaving (required) */
  opacity: 0;
  transform: translateX(30px);
}
```

Note:

> Unlike Vue, in the `*-enter-active` and `*-leave-active` style classes, you cannot only set `transition`; you must also have the corresponding transition appearance from enter to leave, otherwise the switch will be abrupt.

## List Reordering and Move Animations

The above example has some obvious flaws: when an item is inserted or removed, the elements around it will "jump" immediately instead of moving smoothly. We can fix this by adding some additional CSS rules:

```css
/* Transition applied to elements being moved */
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

  /* Ensure the leaving element is removed from the layout flow
  so that the movement animation can be calculated correctly. */
  position: absolute;
}
```

After passing `moveClass="list-move"`, the component will trigger position animation using the FLIP mechanism during reordering.

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
   * If undefined, no additional container will be generated.
   */
  tag?: string;
  /**
   * Used to customize the CSS class applied during transitions.
   * Only for reordering move animations, does not affect enter/leave transition class names.
   */
  moveClass?: string;
  /**
   * Used to add HTML attributes to the DOM container
   */
  htmlProps?: HTMLAttributes<HTMLElement>;
}
```

## Notes

- List items must provide a stable `key`, otherwise a warning will be issued and the move animation may behave abnormally.
- When a DOM container is needed, you can explicitly pass `tag="div"`, `tag="ul"`, etc.
