# Transition

We provide two components to help you create state-change-based transitions and animations, which are **almost identical** to Vue's `<Transition>`.

- `<Transition>` applies animations when an element or component enters and leaves the DOM. This chapter will introduce how to use it.

- `<TransitionGroup>` applies animations when elements or components in a JSX list are inserted, moved, or removed. We will introduce it in the <a href="./transition-group">next chapter</a>.

## Basic Usage

Control the display or hiding through the child node itself, without explicit manipulation by `<Transition>`.

```jsx
const [show, setShow] = useState(false);

<button onClick={() => setShow(!show)}>Toggle</button>
<Transition name="fade">
  {show && <p>hello</p>}
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

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?module=%2Fsrc%2Fexamples%2FTransition%2FFade.tsx&initialpath=/examples/transition/fade)

For a named transition effect, the effective transition class names will be prefixed with its name. For example, the class names applied in the above example will be `fade-enter-active`. The class names for this "fade" transition should be like this:

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

The default animation transition duration controlled by `<Transition>` is **500 (ms)**. This means that if the CSS `transition-duration` is the same as it, there is no need to set the `duration` prop of the component; otherwise, the duration must be set equally to ensure that the CSS transition effect is executed correctly.

```jsx
<Transition name="fade" duration={350}>
  ...
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

When the **CSS durations** of `*-enter-active` and `*-leave-active` are **different**, you can specify the time required for entering and leaving separately in the form of an object.

## CSS-based Transition Effects

### Naming Transition Effects

#### CSS Transition Class Names

There are a total of 6 CSS class names applied to enter and leave transition effects.

1. ***-enter-from**: **Start state of the enter animation**. Added before the component is first mounted or re-enters the DOM. Removed in the next frame after the component is mounted.

2. ***-enter-active**: **Active state of the enter animation**. Applied throughout the entire enter animation phase. Added before the component is mounted and removed after the transition or animation is completed. **Used to define duration, delay, and speed curve type (Transition / Animation property).**

3. ***-enter-to**: **End state of the enter animation**. Added in the next frame after the component is mounted (i.e., at the same time as `*-enter-from` is removed) and removed after the transition or animation is completed.

4. ***-leave-from**: **Start state of the leave animation**. Added immediately when the leave transition effect is triggered (before the component is unmounted). Removed after one frame.

5. ***-leave-active**: **Active state of the leave animation**. Applied throughout the entire leave animation phase. Added immediately when the leave transition effect is triggered and removed after the transition or animation is completed. **Used to define duration, delay, and speed curve type (Transition / Animation property).**

6. ***-leave-to**: **End state of the leave animation**. Added in the next frame after a leave animation is triggered (i.e., at the same time as `*-leave-active` is removed) and removed after the transition or animation is completed.

#### CSS transition

`<Transition>` is generally used together with <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Transitions/Using">native CSS transitions</a>, as you can see in the example above. The transition CSS property is a shorthand that allows us to define various aspects of a transition at once, including the properties to be animated, duration, and <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function">timing function</a>.

Here is a more advanced example that uses different durations and timing functions to transition multiple properties.

```jsx
<Transition name="slide-fade" duration={{ enter: 300, leave: 800 }}>
  {show && <p>hello</p>}
</Transition>
```

```css
/*
  Enter and leave animations can use different durations and timing functions.
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

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?module=%2Fsrc%2Fexamples%2FTransition%2FFade.tsx&initialpath=/examples/transition/slide-fade)

#### CSS animation

<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations" target="_blank">Native CSS animations</a> are applied in basically the same way as CSS transitions, with one difference: `*-enter-from` is not removed immediately after the element is inserted, but when an `animationend` event is triggered.

For most CSS animations, we can simply declare them under the `*-enter-active` and `*-leave-active` class names. Here is an example:

```jsx
<Transition name="bounce">
  {show && <p style={{ textAlign: 'center' }}>Hello here is some bouncy text!</p>}
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

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?module=%2Fsrc%2Fexamples%2FTransition%2FBounce.tsx&initialpath=/examples/transition/bounce)

#### Custom Transition Class Names

You can also pass the following props to `<Transition>` to specify custom transition class names:

- `enterFromClass`

- `enterActiveClass`

- `enterToClass`

- `leaveFromClass`

- `leaveActiveClass`

- `leaveToClass`

These class names you pass will override the default class names for the corresponding stages. This feature is very useful when you want to integrate other third-party CSS animation libraries under React's animation mechanism, such as <a target="_blank" href="https://daneden.github.io/animate.css/">Animate.css</a>:

```jsx
{/* Assuming you have imported Animate.css in the page */}
<Transition
  name="custom-classes"
  enterActiveClass="animate__animated animate__tada"
  leaveActiveClass="animate__animated animate__bounceOutRight"
>
  {show && <p>hello</p>}
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
  // This callback is optional if used in conjunction with CSS
  done()
}

// Called when the enter transition is completed.
const onAfterEnter = (el) => {}

// Called when the enter transition is cancelled before completion
const onEnterCancelled = (el) => {}

// Called before the leave hook
// Most of the time, you should only use the leave hook
const onBeforeLeave = (el) => {}

// Called when the leave transition starts
// Use this to start the leave animation
const onLeave = (el, done) => {
  // Call the callback function done to indicate the end of the transition
  // This callback is optional if used in conjunction with CSS
  done()
}

// Called when the leave transition is completed and
// the element has been removed from the DOM
const onAfterLeave = (el) => {}

// Called when the enter transition is cancelled before leaving
const onLeaveCancelled = (el) => {}
```

These hooks can be used in combination with CSS transitions or animations, or alone.

When using animations executed only by JavaScript, it is best to add a `css={false}` prop. Disabling all CSS transition effects can also prevent CSS rules from accidentally interfering with the transition effects:

```jsx
<Transition css={false}>
  ...
</Transition>
```

With `css={false}`, we are fully responsible for controlling when the transition ends. In this case, the callback function `done` is mandatory for the `onEnter` and `onLeave` hooks. Otherwise, the hooks will be called synchronously, and the transition will complete immediately.

Here is an example of performing animations using the <a target="_blank" href="https://gsap.com/">GSAP library</a>. You can also use any library you want, such as <a target="_blank" href="https://animejs.com/">Anime.js</a> or <a target="_blank" href="https://motion.dev/">Motion One</a>:

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

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?module=%2Fsrc%2Fexamples%2FTransition%2FWithGSAP.tsx&initialpath=/examples/transition/with-gsap)

## Transition on Appear

If you want to apply a transition effect when a node is first rendered, you can add the `appear` prop:

```jsx
<Transition appear>
  ...
</Transition>
```

## Transition Between Elements

In the child nodes of `<Transition>`, ensure that only one element is rendered at any time, and it must have a `key`:

```jsx
const [docState, setDocState] = useState("saved");

<Transition name="slide-up">
  {docState === 'saved' ? (
    <button key="b1" onClick={() => setDocState('edited')}>
      Edit
    </button>
  ) : docState === 'edited' ? (
    <button key="b2" onClick={() => setDocState('editing')}>
      Save
    </button>
  ) : (
    <button key="b3" onClick={() => setDocState('saved')}>
      Cancel
    </button>
  )}
</Transition>;
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

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?module=%2Fsrc%2Fexamples%2FTransition%2FMoreToggle.tsx&initialpath=/examples/transition/more-toggle)

## Transition Mode

> `mode` is implemented through the <a target="_blank" href="https://reactcommunity.org/react-transition-group/switch-transition">`<SwitchTransition>`</a> component. **Its core task is "content switching"**, which strictly controls which child component is active at the same time. It is not a simple "show/hide" controller. Its design goal is to animate the replacement of old content with new content when the key changes.

In the previous examples, the entering and leaving elements start animating at the same time, so we have to set them to `position: absolute` to avoid layout issues when both exist at the same time.

However, in many cases, this may not meet the requirements. We may want to execute the leave animation first, and then execute the element's enter animation after it is completed. Manually orchestrating such animations is very complex, but fortunately, we can achieve this behavior by passing a `mode` prop to `<Transition>`:

```jsx
<Transition mode="out-in">
  ...
</Transition>
```

Changing the previous example to `mode="out-in"` looks like this:

```jsx
<Transition mode="out-in" name="slide-up">
  ...
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

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?module=%2Fsrc%2Fexamples%2FTransition%2FOutIn.tsx&initialpath=/examples/transition/out-in)

`<Transition>` also supports `mode="in-out"`, although it is not commonly used.

## Dynamic Transitions

The props of `<Transition>` (such as `name`) can also be dynamic, which allows us to dynamically apply different types of transitions based on state changes:

```jsx
<Transition name={transitionName}>
  ...
</Transition>
```

The use of this feature is that you can predefine multiple sets of CSS transition or animation class names and then switch between them dynamically.

You can also apply different behaviors in JavaScript transition hooks based on the current state of your component. Finally, the ultimate way to create dynamic transitions is to create **reusable transition components** and let these components change transition effects based on dynamic props.

## Preventing Transitions

When CSS transitions or animations are enabled, within the time set by the `duration` prop (default 500 ms), their behavior can be forced to stop by quickly switching, and the enter cancellation event `onEnterCancelled` or leave cancellation event `onLeaveCancelled` will be triggered.

```jsx
<Transition
  name="fade"
  onEnterCancelled={(el) => {
    console.log("onEnterCancelled!", el);
  }}
  onLeaveCancelled={(el) => {
    console.log("onLeaveCancelled!", el);
  }}
>
  {show && <p>I can revert the state</p>}
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

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?module=%2Fsrc%2Fexamples%2FTransition%2FCanceled.tsx&initialpath=/examples/transition/canceled)

## Props

| Property Name       | Type                                       | Description                                                  | Required |
| ------------ | ------------------------------------------ | ------------------------------------------------------------ | ------ |
| mode         | `'out-in' \| 'in-out'`                     | Controls the timing sequence of enter/leave transitions       | No     |
| css          | `Boolean`                                  | Enables or disables all CSS transition effects                | No     |
| appear       | `Boolean`                                  | Applies transition effect when the component is first rendered | No     |
| duration     | `Number \| {enter: Number, leave: Number}` | Defines the time required for enter and leave transitions (in ms) | No     |
| enterFromClass    | `String`                                   | Custom CSS class name for the **start state** (`-enter-from`) of the enter transition | No     |
| enterActiveClass  | `String`                                   | Custom CSS class name for the **active state** (`-enter-active`) of the enter transition | No     |
| enterToClass      | `String`                                   | Custom CSS class name for the **end state** (`-enter-to`) of the enter transition | No     |
| appearFromClass   | `String`                                   | Custom CSS class name for the **start state** (`-appear-from`) of the initial render transition | No     |
| appearActiveClass | `String`                                   | Custom CSS class name for the **active state** (`-appear-active`) of the initial render transition | No     |
| appearToClass     | `String`                                   | Custom CSS class name for the **end state** (`-appear-to`) of the initial render transition | No     |
| leaveFromClass    | `String`                                   | Custom CSS class name for the **start state** (`-leave-from`) of the leave transition | No     |
| leaveActiveClass  | `String`                                   | Custom CSS class name for the **active state** (`-leave-active`) of the leave transition | No     |
| leaveToClass      | `String`                                   | Custom CSS class name for the **end state** (`-leave-to`) of the leave transition | No     |

## Events

| Function Name           | Type                                          | Description                                                  |
| ---------------- | --------------------------------------------- | ------------------------------------------------------------ |
| onBeforeEnter    | `(el: HTMLElement) => void`                   | Called before the element is inserted into the DOM.          |
| onEnter          | `(el: HTMLElement, done: () => void) => void` | Called in the next frame after the element is inserted into the DOM. Used to start the enter animation. Call the callback function `done` to indicate the end of the transition (optional when used with CSS) |
| onAfterEnter     | `el: HTMLElement) => void`                    | Called when the enter transition is completed                |
| onBeforeAppear   | (el: HTMLElement) => void                     | Called before the element is inserted into the DOM during the initial render of the component (when `appear={true}`). |
| onAppear         | `(el: HTMLElement, done: () => void) => void` | Called in the next frame after the element is inserted into the DOM during the initial render of the component (when `appear={true}`). |
| onAfterAppear    | `(el: HTMLElement) => void`                   | Called when the initial render transition is completed (when `appear={true}`). |
| onBeforeLeave    | `(el: HTMLElement) => void`                   | Called before the `onLeave` hook.                            |
| onLeave          | `(el: HTMLElement, done: () => void) => void` | Called when the leave transition starts. Used to start the leave animation. Call the callback function `done` to indicate the end of the transition (optional when used with CSS) |
| onAfterLeave     | `(el: HTMLElement) => void`                   | Called when the leave transition is completed and the element has been removed from the DOM |
| onEnterCancelled | `(el: HTMLElement) => void`                   | Called when the enter transition is cancelled before completion |
| onLeaveCancelled | `(el: HTMLElement) => void`                   | Called when the enter transition is cancelled before leaving |
