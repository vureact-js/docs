# defineOptions Semantic Comparison

What does the Vue `defineOptions` macro compile into in VuReact, and how does it map to React code?

## Preface

To avoid confusion from verbose examples, we make two assumptions:

1. Vue and React code snippets only show the core logic; unrelated component wrappers and configuration are omitted.
2. The reader is already familiar with the Vue 3 `defineOptions` API and its core behavior.

## `defineOptions({ name })` → React component naming

`defineOptions` is a Vue 3 macro for extra component configuration, such as component name or inherited attribute behavior. VuReact compiles the `name` option into a React component naming hint, but in React the component name is usually determined by the export identifier. Therefore this option is treated as compile-time metadata rather than a runtime API.

- Vue code:

```ts
defineOptions({
  name: 'MyComponent',
});
```

- React code after VuReact compilation:

```tsx
const MyComponent = () => {
  return <></>;
};
```

This example shows that Vue's `defineOptions({ name })` is not compiled into a runtime API. Instead, it is used to generate the React component name or preserve the component definition semantics. VuReact aligns the `name` concept with React file/export naming, making the component's React-side identity closer to the Vue intent.

## `defineOptions` other options → ignored in React

`defineOptions` may also include options like `inheritAttrs` or `customOptions`. Since React and Vue differ in component props and lifecycle mechanisms, VuReact takes a conservative approach for these options:

- `inheritAttrs`: no direct React equivalent; usually ignored.
- other unrelated options: ignored.

- Vue code:

```ts
defineOptions({
  name: 'MyComponent',
  inheritAttrs: false,
  ...
});
```

- React code after VuReact compilation:

```tsx
const MyComponent = () => {
  return <></>;
};
// inheritAttrs has no direct React equivalent and is ignored
```

VuReact statically analyzes non-runtime `defineOptions` options and tries to preserve compatibility. For fields that cannot be directly mapped, the compiler typically ignores them to avoid introducing unnecessary runtime overhead on the React side.

---

### `defineOptions` and component naming recommendation

In React, component names are usually defined by the variable or export name. If you want to explicitly preserve Vue component name semantics in the compiled result, use a special comment:

```ts
// @vr-name: MyComponent
```

This allows VuReact to retain a clearer component naming hint when generating React components, avoiding loss of semantic meaning when `defineOptions({ name })` is ignored.
