# Dynamic Components

Almost identical to Vue's `<component>` dynamic component.

## Basic Usage

There are scenarios where you need to switch between two components, such as a Tab interface:

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>Loading interactive example...</p>
  </div>
  <iframe
     onload="this.parentElement.classList.remove('loading')"
     src="https://codesandbox.io/embed/w4c2h5?view=preview&module=%2Fsrc%2Fexamples%2FComponent.tsx&initialpath=/examples/dynamic-component"
     style="width:100%; height: 240px; border:0; border-radius: 4px; overflow:hidden;"
     title="intelligent-dawn-w4c2h5"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</div>

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?view=editor+%2B+preview&module=%2Fsrc%2Fexamples%2FComponent.tsx&initialpath=/examples/dynamic-component)

The example above is implemented using the `<Component>` element and the special `is` prop:

```jsx
{/* The component changes when currentTab changes */}
<Component is={tabs[currentTab]} />
```

In the example above, the value passed to `is` can be one of the following:

- A normal HTML element (`<element />`)
- A JSX element (`<Demo />`)
- A component function (`Demo`)
- A tag name, used to create a general HTML element.

When using `<Component is={...} />` to switch between multiple components, the switched-out component will be unmounted. We can force the switched-out component to remain in a "alive" state through the <a href="./keep-alive">`<KeepAlive>`</a> component.

## Props

| Property Name | Type                                  | Description                                   | Required |
|---------------|---------------------------------------|-----------------------------------------------|----------|
| is            | `String \| ReactNode \| JSX.Element` | Can pass tag names, component functions, and JSX elements | Yes      |
| props         | `Object`                              | Props to be passed to the element             | No       |