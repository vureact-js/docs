# Suspense

It is an extension based on the `React Suspense` component and is **almost identical** to Vue's `<Suspense>`. It is used to coordinate the handling of asynchronous dependencies in the component tree.

## Loading State

Use the `fallback` prop to customize the loading state.

```jsx
<Suspense fallback={<>Loading...</>}>
  {/* Components with asynchronous dependencies */} 
  <Dashboard />
</Suspense>
```

If no asynchronous dependencies are encountered during the initial rendering, `<Suspense>` will directly enter the completed state.

## Delayed Fallback

Configure via the `timeout` prop: `<Suspense>` will switch to displaying the fallback content after the time taken to wait for rendering new content exceeds the set timeout in milliseconds. If the timeout value is 0, it will cause the fallback content to be displayed immediately when replacing the default content.

```jsx
<Suspense timeout={500} fallback={<>Loading...</>}>
  ...
</Suspense>
```

## Events

The `<Suspense>` component triggers three events: onPending, onResolve, and onFallback. The onPending event is triggered when entering the pending state. The onResolve event is triggered when the component's children finish fetching new content. The onFallback event is triggered when the content of the fallback prop is displayed.

For example, these events can be used to display a loading indicator on top of the previous DOM when loading a new component.

```jsx
<Suspense 
  onPending={() => {
    // Triggered when entering the pending state
  }}
  onResolve={() => {
    // Triggered when the default content is resolved
  }}
  onFallback={() => {
    // Triggered when the loading state content is displayed
  }}
>
  <Component is={DynamicAsync} />
</Suspense>
```

## Pending State

`<Suspense>` is "suspensible" by default. You can specify the prop `suspensible: false` to indicate that it is not controlled by Suspense and that the component always controls its own loading state. This is useful in nested parent-child `<Suspense>` components, where the parent Suspense component can control the state.

```jsx
<Suspense fallback={<>Loading....</>}>
  <Suspense suspensible={false} fallback={<>This should not be displayed</>}>
    <div>Controlled by the parent component's Suspense state</div>
  </Suspense>
</Suspense>
```

## Props

| Property name | Type         | Description                                                                                   | Required |
|---------------|--------------|-----------------------------------------------------------------------------------------------|----------|
| timeout       | `Number`     | The fallback content will be displayed only after the time taken to wait for rendering new content exceeds the timeout in milliseconds | No       |
| suspensible   | `Boolean`    | Whether to allow suspension (default is true). When set to false, Suspense will directly render the default content. | No       |
| fallback      | `ReactNode`  | The content displayed in the loading state                                                   | Yes      |
| onPending     | `Function`   | Triggered when entering the pending state                                                     | No       |
| onResolve     | `Function`   | Triggered when the default content is resolved                                               | No       |
| onFallback    | `Function`   | Triggered when the loading state content is displayed                                         | No       |