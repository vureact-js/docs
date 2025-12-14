# Transition

We provide two components to help you create state-change-based transitions and animations, which are **almost identical** to Vue's `<Transition>`.

- `<Transition>` applies animations when an element or component enters or leaves the DOM. This chapter will explain how to use it.

- `<TransitionGroup>` applies animations when elements or components in a JSX list are inserted, moved, or removed. We will introduce it in the <a href="./transition-group">next chapter</a>.

## Basic Usage

Control the entry or exit of a component through the `if` prop, and declare a transition effect name with the `name` prop.

```jsx
const [show, setShow] = useState(false);

<button onClick={() => setShow(!show)}>Toggle</button>
<Transition if={show} name="fade">
  <p>hello</p>
</Transition>
```

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>Loading interactive example...</p>
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

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?view=editor+%2B+preview&module=%2Fsrc%2Fexamples%2FTransition%2FFade.tsx&initialpath=/examples/transition/fade)

For a named transition effect, the transition class names that act on it will be prefixed with its name. For example, the class names applied in the above example will be `fade-enter-active`. The class names for this "fade" transition should look like this:

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

For more transition effects, please check <a href="../other/transition-css">Transition Stylesheet</a>.

## Transition Duration

The default animation transition duration controlled by `<Transition>` is **500 (ms)**. This means that if the CSS `transition-duration` is the same, there's no need to set the `duration` prop of the component; otherwise, the duration must be set equivalently to ensure the CSS transition effect completes correctly.

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

When the **CSS durations** of `*-enter-active` and `*-leave-active` are **different**, you can specify the durations for entry and exit separately using an object.

## CSS-Based Transition Effects

### Naming Transition Effects

#### CSS Transition Class Names

There are 6 CSS class names applied to enter and leave transition effects.

1. ***-enter-from**: **Start state of the enter animation**. Added before the component is first mounted or re-enters the DOM. Removed in the next frame after the component is mounted.

2. ***-enter-active**: **Active state of the enter animation**. Applied throughout the entire enter animation phase. Added before the component is mounted and removed after the transition or animation completes. **Used to define duration, delay, and timing function (Transition / Animation property).**

3. ***-enter-to**: **End state of the enter animation**. Added in the next frame after the component is mounted (i.e., at the same time `*-enter-from` is removed) and removed after the transition or animation completes.

4. ***-leave-from**: **Start state of the leave animation**. Added immediately when the leave transition is triggered (before the component is unmounted). Removed after one frame.

5. ***-leave-active**: **Active state of the leave animation**. Applied throughout the entire leave animation phase. Added immediately when the leave transition is triggered and removed after the transition or animation completes. **Used to define duration, delay, and timing function (Transition / Animation property).**

6. ***-leave-to**: **End state of the leave animation**. Added in the next frame after a leave animation is triggered (i.e., at the same time `*-leave-active` is removed) and removed after the transition or animation completes.

#### CSS Transitions

`<Transition>` is generally used with <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Transitions/Using">native CSS transitions</a> as you saw in the examples above. The transition CSS property is a shorthand that allows us to define various aspects of a transition at once, including the properties to animate, duration, and <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function">timing function</a>.

Here's a more advanced example that transitions multiple properties with different durations and timing functions.

```jsx
<Transition if={show} name="slide-fade" duration={{ enter: 300, leave: 800 }}>
  <p>hello</p>
</Transition>
```

```css
/*
  Enter and leave animations can have different durations and timing functions.
*/
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
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
```

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>Loading interactive example...</p>
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

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?view=editor+%2B+preview&module=%2Fsrc%2Fexamples%2FTransition%2FFade.tsx&initialpath=/examples/transition/slide-fade)

#### CSS Animations

<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations" target="_blank">Native CSS animations</a> are applied in basically the same way as CSS transitions, with one difference: `*-enter-from` is not removed immediately after the element is inserted, but when an `animationend` event is triggered.

For most CSS animations, we can simply declare them under the `*-enter-active` and `*-leave-active` class names. Here's an example:

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
    <p>Loading interactive example...</p>
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

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?view=editor+%2B+preview&module=%2Fsrc%2Fexamples%2FTransition%2FBounce.tsx&initialpath=/examples/transition/bounce)

#### Custom Transition Class Names

You can also pass the following props to `<Transition>` to specify custom transition class names:

- `enterFromClass`

- `enterActiveClass`

- `enterToClass`

- `leaveFromClass`

- `leaveActiveClass`

- `leaveToClass`

These class names you pass will override the default class names for the corresponding stages. This feature is useful when you want to integrate other third-party CSS animation libraries with React's animation mechanism, such as <a target="_blank" href="https://daneden.github.io/animate.css/">Animate.css</a>:

```jsx
{/* Assuming you have imported Animate.css in your page */}
<Transition
  if={show}
  name="custom-classes"
  enterActiveClass="animate__animated animate__tada"
  leaveActiveClass="animate__animated animate__bounceOutRight"
>
  <p>hello</p>
</Transition>
```

## JavaScript Hooks

You can hook into the transition process by listening to events of the `<Transition>` component:

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
// Called before the element is inserted into the DOM
// Use this to set the "enter-from" state of the element
const onBeforeEnter = (el) => {}

// Called in the next frame after the element is inserted into the DOM
// Use this to start the enter animation
const onEnter = (el, done) => {
  // Call the callback function done to indicate the end of the transition
  // This callback is optional if used with CSS
  done()
}

// Called when the enter transition completes.
const onAfterEnter = (el) => {}

// Called when the enter transition is cancelled before completion
const onEnterCancelled = (el) => {}

// Called before the leave hook
// Most of the time, you should only need the leave hook
const onBeforeLeave = (el) => {}

// Called when the leave transition starts
// Use this to start the leave animation
const onLeave = (el, done) => {
  // Call the callback function done to indicate the end of the transition
  // This callback is optional if used with CSS
  done()
}

// Called when the leave transition completes and
// the element has been removed from the DOM
const onAfterLeave = (el) => {}

// Called when the enter transition is cancelled before leaving
const onLeaveCancelled = (el) => {}
```

These hooks can be used in combination with CSS transitions or animations, or alone.

When using animations performed solely by JavaScript, it's best to add a `css={false}` prop. This disables all CSS transition effects and prevents CSS rules from accidentally interfering with the transition:

```jsx
<Transition css={false}>
  ...
</Transition>
```

With `css={false}`, we are fully responsible for controlling when the transition ends. In this case, the callback function `done` is mandatory for the `onEnter` and `onLeave` hooks. Otherwise, the hooks will be called synchronously, and the transition will complete immediately.

Here's an example of performing animations using the <a target="_blank" href="https://gsap.com/">GSAP library</a>. You can also use any library you want, such as <a target="_blank" href="https://animejs.com/">Anime.js</a> or <a target="_blank" href="https://motion.dev/">Motion One</a>:

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>Loading interactive example...</p>
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

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?view=editor+%2B+preview&module=%2Fsrc%2Fexamples%2FTransition%2FWithGSAP.tsx&initialpath=/examples/transition/with-gsap)

## Appear Transition

If you want to apply a transition effect when a node is first rendered, you can add the `appear` prop:

```jsx
<Transition appear>
  ...
</Transition>
```

## Transition Between Elements

It's not possible to have a solution like Vue where only one element is rendered at any time in the child nodes of `<Transition>`, so the following fallback solution is used:

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
    <p>Loading interactive example...</p>
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

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?view=editor+%2B+preview&module=%2Fsrc%2Fexamples%2FTransition%2FMoreToggle.tsx&initialpath=/examples/transition/more-toggle)

## Transition Modes

> `mode` is implemented via the <a target="_blank" href="https://reactcommunity.org/react-transition-group/switch-transition">`<SwitchTransition>`</a> component. **Its core task is "content switching"**, which strictly controls which child component is active at the same time. It is not a simple "show/hide" controller; its design goal is to animate the replacement of old content with new content when the key changes.

In the previous examples, the entering and leaving elements start animating at the same time, so we had to set them to `position: absolute` to avoid layout issues when both exist simultaneously.

However, in many cases, this may not be desirable. We may want to execute the leave animation first, and then execute the element's enter animation after it completes. Manually orchestrating such animations is very complex, but fortunately, we can achieve this behavior by passing a `mode` prop to `<Transition>`:

```jsx
<Transition mode="out-in">
  ...
</Transition>
```

Here's the previous example modified to use `mode="out-in"`:

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
    <p>Loading interactive example...</p>
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

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?view=editor+%2B+preview&module=%2Fsrc%2Fexamples%2FTransition%2FOutIn.tsx&initialpath=/examples/transition/out-in)

`<Transition>` also supports `mode="in-out"`, although it's not commonly used.

## Dynamic Transitions

Props of `<Transition>` (such as `name`) can also be dynamic, allowing us to dynamically apply different types of transitions based on state changes:

```jsx
<Transition name={transitionName}>
  ...
</Transition>
```

The usefulness of this feature is that you can predefine multiple sets of CSS transition or animation class names and then dynamically switch between them.

You can also apply different behaviors in JavaScript transition hooks based on the current state of your component. Finally, the ultimate way to create dynamic transitions is to create **reusable transition components** that change transition effects based on dynamic props.

## Canceling Transitions

When CSS transitions or animations are enabled, within the time set by the `duration` prop (default 500 ms), you can forcefully prevent their behavior by quickly toggling the state of the `show` prop, and it will trigger the enter cancellation event `onEnterCancelled` or the leave cancellation event `onLeaveCancelled`.

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
    <p>Loading interactive example...</p>
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

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?view=editor+%2B+preview&module=%2Fsrc%2Fexamples%2FTransition%2FCanceled.tsx&initialpath=/examples/transition/canceled)

## Props

| Property Name | Type | Description | Required |
|------------|------|-------------|----------|
| if | `Boolean` | Controls the entry or exit of the component, triggering enter or exit state | No |
| show | `Boolean` | Controls the entry or exit of the component, triggering enter or exit state (does not unmount the component) | No |
| mode | `'out-in' \| 'in-out'` | Controls the timing sequence of enter/leave transitions | No |
| css | `Boolean` | Enables or disables all CSS transition effects | No |
| appear | `Boolean` | Applies transition effect when the component is first rendered | No |
| duration | `Number \| {enter: Number, leave: Number}` | Defines the time required for enter and leave transitions (in ms) | No |
| enterFromClass | `String` | Custom CSS class name for the **start state** of the enter transition (`-enter-from`) | No |
| enterActiveClass | `String` | Custom CSS class name for the **active state** of the enter transition (`-enter-active`) | No |
| enterToClass | `String` | Custom CSS class name for the **end state** of the enter transition (`-enter-to`) | No |
| appearFrom | `String` | Custom CSS class name for the **start state** of the initial render transition (`-appear-from`) | No |
| appearActive | `String` | Custom CSS class name for the **active state** of the initial render transition (`-appear-active`) | No |
| appearTo | `String` | Custom CSS class name for the **end state** of the initial render transition (`-appear-to`) | No |
| leaveFromClass | `String` | Custom CSS class name for the **start state** of the leave transition (`-leave-from`) | No |
| leaveActiveClass | `String` | Custom CSS class name for the **active state** of the leave transition (`-leave-active`) | No |
| leaveToClass | `String` | Custom CSS class name for the **end state** of the leave transition (`-leave-to`) | No |

## Events

| Function Name | Type | Description |
|------------|------|-------------|
| onBeforeEnter | `(el: HTMLElement) => void` | Called before the element is inserted into the DOM. Used to set the `enter-from` state of the element |
| onEnter | `(el: HTMLElement, done: () => void) => void` | Called in the next frame after the element is inserted into the DOM. Used to start the enter animation. Call the callback function `done` to indicate the end of the transition (optional when used with CSS) |
| onAfterEnter | `el: HTMLElement) => void` | Called when the enter transition completes |
| onAppear | `(el: HTMLElement, done: () => void) => void` | Called in the next frame after the element is inserted into the DOM during the component's initial render (when `appear={true}`). Used the same way as `onEnter` |
| onAfterAppear | `(el: HTMLElement) => void` | Called when the initial render transition completes (when `appear={true}`). |
| onBeforeLeave | `(el: HTMLElement) => void` | Called before the `onLeave` hook. |
| onLeave | `(el: HTMLElement, done: () => void) => void` | Called when the leave transition starts. Used to start the leave animation. Call the callback function `done` to indicate the end of the transition (optional when used with CSS) |
| onAfterLeave | `(el: HTMLElement) => void` | Called when the leave transition completes and the element has been removed from the DOM |
| onEnterCancelled | `(el: HTMLElement) => void` | Called when the enter transition is cancelled before completion |
| onLeaveCancelled | `(el: HTMLElement) => void` | Called when the enter transition is cancelled before leaving |
