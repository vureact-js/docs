# Teleport

Implemented using the `React.createPortal` API, it is **almost identical** to Vue's `<Teleport>`. It can "teleport" a part of the JSX inside a component to a location outside the component's DOM structure.

## Basic Usage

`<Teleport>` accepts a `to` prop to specify the target of the teleportation. The value of `to` can be a CSS selector string or a DOM element object. The function of this code is to "teleport the following JSX fragment to under the body tag"

```jsx
<Teleport to="body">
  <Modal />
</Teleport>
```

You can click the button below, and then use the browser's developer tools to find the modal element under the `<body>` tag of the `<iframe>`:

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>Loading interactive example...</p>
  </div>
  
  <iframe
     onload="this.parentElement.classList.remove('loading')"
     src="https://codesandbox.io/embed/w4c2h5?view=preview&module=%2Fsrc%2Fexamples%2FTeleport.tsx&initialpath=/examples/teleport"
     style="width:100%; height: 240px; border:0; border-radius: 4px; overflow:hidden;"
     title="intelligent-dawn-w4c2h5"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</div>

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?view=editor+%2B+preview&module=%2Fsrc%2Fexamples%2FTeleport.tsx&initialpath=/examples/teleport)

## Disabling Teleport

In some scenarios, you may need to disable `<Teleport>` depending on the situation. For example, we want to render a component as a floating layer on the desktop, but as an inline component on mobile. We can handle these two different situations by dynamically passing a `disabled` prop to `<Teleport>`:

```jsx
<Teleport disabled={isMobile}>
  ...
</Teleport>
```

Then we can dynamically update `isMobile`.

## Deferred Resolve Teleport

You can use the `defer` prop to delay the resolution of the Teleport's target until other parts of the app are mounted.

```jsx
<Teleport defer to="#late-div">...</Teleport>

{/* Appears later somewhere in the JSX */}
<div id="late-div"></div>
```

Note that the target element must be rendered in the same mount/update cycle as the Teleport. That is, if the `<div>` is mounted after one second, Teleport will still report an error. The principle of delayed Teleport is to delay mounting to the target by one cycle through a `Promise` microtask during the component mounting phase.

## Multiple Teleports Sharing a Target

A reusable `<Modal>` component may have multiple instances at the same time. For such scenarios, multiple `<Teleport>` components can mount their content on the same target element, and the order is simply sequential appending. The later mounted ones will be placed in a later position under the target element, but all within the target element.

For example, a use case like this:

```jsx
<Teleport to="#modals">
  <div>A</div>
</Teleport>
<Teleport to="#modals">
  <div>B</div>
</Teleport>
```

The rendered result is:

```html
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

## Props

| Property Name | Type                    | Description                                                  | Required |
| ------------- | ----------------------- | ------------------------------------------------------------ | -------- |
| to            | `String \| HTMLElement` | Specify the target container, which can be a selector or an actual element | Yes      |
| disabled      | `Boolean`               | When set to `true`, the content will remain in its original position instead of moving to the target container. This value supports dynamic modification | No       |
| defer         | `Boolean`               | Delay Teleport mounting to the target                        | No       |