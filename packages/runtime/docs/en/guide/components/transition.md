# Transition

This is a component adapted to Vue `<Transition>`, used to add transition animations to the enter/leave process of a single element or component.

## Basic Usage

The most common scenario is switching display and hiding based on state, and using `name` to correspond to CSS transition class names.

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
  opacity: 0; /* Initial transition appearance */
}

.fade-enter-active {
  opacity: 1; /* Transition appearance when active */
  transition: opacity 0.5s ease;
}

.fade-leave-active {
  opacity: 0; /* Transition appearance when leaving */
  transition: opacity 0.5s ease;
}
```

Please note:

> Unlike Vue, you cannot only set `transition` in the `*-enter-active` and `*-leave-active` style classes, but also must have the corresponding transition appearance from enter to leave, otherwise there will be a harsh switch.

The above example can also trigger the same transition effect by dynamically switching `key` and `style.display`:

```tsx
<Transition name="fade">
  {/* Provide a dynamic key to trigger node re-rendering */}
  <div key={show} style={{ display: show ? '' : 'none' }}>
    Box
  </div>
</Transition>
```

## Transition Modes

Control the switching order of old and new content through `mode`, the common value is `out-in` (leave first, then enter).

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FTransition%2FModeTransition.tsx&initialpath=/components/transition/mode">
</iframe>

```tsx
<Transition mode="out-in" name="slide-fade" duration={{ enter: 300, leave: 800 }}>
  {state ? <button key="on">On</button> : <button key="off">Off</button>}
</Transition>
```

```css
/* Initial transition appearance */
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Transition appearance when active */
.slide-fade-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.3s ease-out;
}

/* Transition appearance when leaving */
.slide-fade-leave-active {
  opacity: 0;
  transform: translateX(20px);
  transition: all 0.8s ease;
}
```

## Custom Transition Class Names

In addition to the `name` scheme, you can also directly specify the enter/leave classes, which is convenient for connecting to third-party animation libraries.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FTransition%2FCustomClassTransition.tsx&initialpath=/components/transition/custom-class">
</iframe>

```tsx
<Transition
  {/* duration is used to set the duration of the corresponding CSS transition effect, the default is 500ms */}
  duration={800}
  enterActiveClass="animate__animated animate__tada"
  leaveActiveClass="animate__animated animate__bounceOut"
>
  {show ? <div>Custom Class Animation</div> : null}
</Transition>
```

```css
/* Simulate Animate.css classes */
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

## JavaScript Lifecycle Hooks

You can use transition hooks to execute JS logic during the enter/leave phases.

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
  {show ? <div>Control Me With JS Hooks</div> : null}
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
   * Controls the timing of leave/enter transitions.
   * By default, they happen simultaneously.
   */
  mode?: 'in-out' | 'out-in';
  /**
   * Used to automatically generate transition CSS class names.
   * For example, `name: 'fade'` will be automatically expanded to `.fade-enter`,
   * `.fade-enter-active`, etc.
   */
  name?: string;
  /**
   * Whether to apply CSS transition classes.
   * Default: true
   */
  css?: boolean;
  /**
   * Whether to use transition on initial render.
   * Default: false
   */
  appear?: boolean;
  /**
   * Explicitly specify the duration of the transition.
   */
  duration?: number | { enter: number; leave: number };

  /**
   * Props for custom transition classes.
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
   * Event hooks
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

  children: ReactNode;
}
```

## Notes

- `<Transition>` expects a single direct child node; passing multiple child nodes will output an error log.
- When performing state switch animations, set a stable `key` for the switching node.
- When `duration` is an object, `enter` and `leave` will take effect separately.
