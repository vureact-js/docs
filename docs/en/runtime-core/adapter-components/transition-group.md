# TransitionGroup

Provides transition effects for multiple elements or components in a list, **almost identical** to Vue's `<transition-group>`.

## Differences from `<Transition>`

`<TransitionGroup>` supports almost the same props, CSS transition class names, and event listeners as `<Transition>`, but with the following differences:

- By default, it does not render any container element. However, you can specify an element to render as the container by passing the `tag` prop.

- `Transition modes` are not available here because we are no longer switching between mutually exclusive elements.

- Each element in the list must have a unique `key`.

- CSS transition class names are applied to the elements within the list, not the container element.

## Enter / Leave Animations

Here is an example of `<TransitionGroup>` adding enter/leave animations to a `Children.map` list:

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
    <p>Loading interactive example...</p>
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

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?view=editor+%2B+preview&module=%2Fsrc%2Fexamples%2FTransitionGroup%2FList.tsx&initialpath=/examples/transition-group/list)

## Move Animations

The above example has a noticeable flaw: when an item is inserted or removed, the surrounding elements "jump" immediately instead of moving smoothly. We can fix this by adding a couple of extra CSS rules:

```jsx
<TransitionGroup name="list" tag="ul" moveClass="list-move">
  ...
</TransitionGroup>
```

```css
/* Transition applied to moving elements */
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
  /* Ensure leaving elements are removed from the layout flow
  so that moving animations can be calculated correctly. */
  position: absolute;
  opacity: 0;
  transform: translateX(30px);
  transition: all 0.5s ease;
}
```

Now it looks much better, and even shuffling the entire list animates very smoothly:

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>Loading interactive example...</p>
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

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?view=editor+%2B+preview&module=%2Fsrc%2Fexamples%2FTransitionGroup%2FListWithFLIP.tsx&initialpath=/examples/transition-group/list-flip)

You can also specify a custom transition class for moving elements by passing the `moveClass` prop to `<TransitionGroup>`, similar to <a href="./transition#自定义过渡-classname">custom transition classes</a>.

## Required Configuration for Move Animations (FLIP)

`<TransitionGroup>` internally implements the "FLIP" list transition effect. To ensure it works smoothly without flickering, your CSS configuration must meet two key requirements:

- The `transition` property must be set for elements in the moving transition state and used in the `moveClass` prop.

```css
/* Transition applied to moving elements */
.list-move {
  transition: all 0.5s ease;
}
```

```jsx
<TransitionGroup name="list" moveClass="list-move">
...
</TransitionGroup>
```

- Elements in the leaving transition state must be set with `position: absolute`.

```css
.list-leave-active {
  /* Ensure leaving elements do not affect the layout of other elements */
  position: absolute;
  opacity: 0;
  transform: translateX(30px);
  transition: all 0.5s ease;
}
```

> ⚠️ If the above two CSS rules are not configured correctly, or the CSS corresponding to moveClass is missing, the list will most likely have animation calculation errors or obvious flickering.

## Staggered List Animations

By reading the element's data attribute in the event props provided by `<TransitionGroup>`, we can implement staggered list animations. First, we render the index of each element as a data attribute on that element:

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

Next, in the event props, we add a delay to the entry animation of the element based on its data attribute. Here's an animation example using the <a target="_blank" href="https://gsap.com/">GSAP library</a>:

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
    <p>Loading interactive example...</p>
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

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?view=editor+%2B+preview&module=%2Fsrc%2Fexamples%2FTransitionGroup%2FWithGSAP.tsx&initialpath=/examples/transition-group/list-gsap)

## Props

`<TransitionGroup>` has all the props of <a href="./transition#props">`<Transition>`</a> except `mode`.

| Prop name     | Type     | Description                                              | Required |
| ------------- | -------- | -------------------------------------------------------- | -------- |
| tag           | `String` | If not defined, no container is rendered by default      | No       |
| moveClass | `String` | Used to customize the CSS className applied during transition | No       |

## Events

`<TransitionGroup>` has all the same events as <a href="./transition#事件">`<Transition>`</a>.
