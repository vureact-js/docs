# KeepAlive

**Almost identical** to Vue's `<keep-alive>`, it can cache inactive component instances, thereby preserving their internal state when the components are re-rendered.

It is very useful for form components, paginators, or components with complex states, providing a smoother user experience.

## Basic Usage

In the code examples, we use <a href="./dynamic-component">`<Component>`</a> for dynamic component rendering.

By default, React components are destroyed after being replaced (unmounted), and all their changed internal states are lost — when the component is rendered again, a brand-new instance is created, retaining only the initial state.

### Without Caching

Suppose there are two stateful React components: `A` (containing a counter state) and `B` (synchronously displaying text content through an input box). When switching components, the previously modified states will be reset:

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>Loading interactive example...</p>
  </div>
  <iframe
     onload="this.parentElement.classList.remove('loading')"
     src="https://codesandbox.io/embed/w4c2h5?view=preview&initialpath=/examples/keep-alive/without-cache&module=%2Fsrc%2Fexamples%2FKeepAlive%2FWithoutCache.tsx"
     style="width:100%; height: 240px; border:0; border-radius: 4px; overflow:hidden;"
     title="intelligent-dawn-w4c2h5"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</div>

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?view=editor+%2B+preview&initialpath=/examples/keep-alive/without-cache&module=%2Fsrc%2Fexamples%2FKeepAlive%2FWithoutCache.tsx)
### With Caching

If you want to preserve the state when switching components (such as form inputs, pagination positions, counter values, etc.), simply wrap the dynamically switched component with the `<KeepAlive>` component.

The usage is consistent with Vue; you need to use a `key` to identify the component instance:

```jsx
// Other implementations are omitted, only the main code is shown

const comps = {
  A: CounterComponent,
  B: FormComponent,
};
const [current, setCurrent] = useState("A");

{/* After wrapping with KeepAlive, component instances will be cached when switching, preserving the state */}
<KeepAlive>
  <Component is={comps[current]} key={current} />
</KeepAlive>
```

<div class="iframe-container loading">
  <div class="fallback-content">
    <p>Loading interactive example...</p>
  </div>
  <iframe
     onload="this.parentElement.classList.remove('loading')"
     src="https://codesandbox.io/embed/w4c2h5?view=preview&initialpath=/examples/keep-alive/cached&module=%2Fsrc%2Fexamples%2FKeepAlive%2FCached.tsx"
     style="width:100%; height: 240px; border:0; border-radius: 4px; overflow:hidden;"
     title="intelligent-dawn-w4c2h5"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</div>

[![Edit react-vue3-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/w4c2h5?view=editor+%2B+preview&initialpath=/examples/keep-alive/cached&module=%2Fsrc%2Fexamples%2FKeepAlive%2FCached.tsx)

## Include/Exclude

`<KeepAlive>` caches all internal component instances by default, but we can customize this behavior through the `include` and `exclude` props. Both props can take a comma-separated string, a regular expression, or an array containing these types:

```jsx
{/* Comma-separated string */}
<KeepAlive include="a,b">
  <Component is={View} />
</KeepAlive>

{/* Regular expression */}
<KeepAlive include={/a|b/}>
  <Component is={View} />
</KeepAlive>

{/* Array */}
<KeepAlive include={['a', 'b']}>
  <Component is={View} />
</KeepAlive>
```

By default, it matches based on component names. Therefore, if a component wants to be conditionally cached by KeepAlive, it must use a key to identify the component instance.

## Maximum Number of Cached Instances

We can limit the maximum number of component instances that can be cached by passing the `max` prop. The behavior of `<KeepAlive>` with `max` specified is similar to an LRU cache: if the number of cached instances is about to exceed the specified maximum, the least recently accessed cached instance will be destroyed to make space for new instances.

```jsx
<KeepAlive max={10}>
  <Component is={activeComponent} />
</KeepAlive>
```

## Lifecycle of Cached Instances

A persistent component can register lifecycle hooks for the two states through `useActivated` and `useDeactivated`:

```jsx
useActivated(() => {
  // Called when first mounted
  // and every time it is reinserted from the cache
})

useDeactivated(() => {
  // Called when removed from the DOM, entering the cache
  // and when the component is unmounted
})
```

## Props

| Prop Name | Type                         | Description                                                                 | Required |
|-----------|------------------------------|-----------------------------------------------------------------------------|----------|
| include   | `String \| RegExp \| Array`  | If specified, only components matching `include` will be cached (based on component key, default uses component name) | No       |
| exclude   | `String \| RegExp \| Array`  | Any component matching `exclude` will not be cached (matching rules same as above) | No       |
| max       | `Number \| String`           | The maximum number of component instances that can be cached, default is 10 | No       |

## Hook Functions

| Function Name   | Type         | Description                                                               |
|-----------------|--------------|---------------------------------------------------------------------------|
| useActivated    | `Function`   | Called when first mounted and every time it is reinserted from the cache  |
| useDeactivated  | `Function`   | Called when removed from the DOM, entering the cache, and when unmounted  |
