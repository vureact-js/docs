# useAttrs Semantic Comparison

What does the common `useAttrs` API in Vue become after being compiled by VuReact into React code?

## Prerequisites

To avoid misunderstandings caused by redundant example code, let's first clarify two conventions:

1. The Vue/React code in this document is simplified core logic, omitting complete component wrappers, irrelevant configurations, etc.;
2. It is assumed that readers are already familiar with the API usage and core behavior of `useAttrs` in Vue 3.

## `useAttrs()` → React `props` Reference

`useAttrs` is an API in Vue 3 used to obtain fallthrough attributes not declared in `defineProps`. In React, all properties are uniformly passed through `props`, so VuReact will compile `useAttrs()` into a reference to `props`.

Tip: If a component does not declare any `props`, VuReact will automatically supplement the component parameter `props` or `props: Record<string, unknown>`.

- Vue code:

```ts
const attrs = useAttrs();
```

- React code after VuReact compilation:

```tsx
const attrs = props as Record<string, unknown>;
```

From the example, we can see: Vue's `useAttrs()` is compiled into a direct reference to `props` in React. VuReact preserves the runtime meaning of `useAttrs` while naturally connecting it with React's Props mechanism.

## `useAttrs()` and TypeScript Type Handling

VuReact automatically supplements type information for `useAttrs()` based on the scenario, ensuring type hints work normally on the React side.

- Vue code:

```ts
interface Attrs {
  class?: string;
  style?: string;
  [key: string]: unknown;
}

const attrs = useAttrs();

const { style, class: cls } = useAttrs() as Attrs;

const typeAnnotation: Attrs = useAttrs();
```

- React code after VuReact compilation:

```tsx
interface Attrs {
  class?: string;
  style?: string;
  [key: string]: unknown;
}

const attrs = props as Record<string, unknown>;

const { style, class: cls } = props as Attrs;

const typeAnnotation = props as Attrs;
```

VuReact will add type assertions or preserve explicit annotations for `useAttrs()` when available, ensuring type-safe access to `attrs` in React.

## `useAttrs()` in Pure JavaScript Scenarios

In pure JavaScript environments, VuReact will directly replace `useAttrs()` with a reference to `props`.

- Vue code:

```ts
const attrs = useAttrs();
```

- React code after VuReact compilation:

```tsx
const attrs = props;
```

This means in JS scenarios, `attrs` is still the `props` object received by the React component, maintaining behavior consistent with Vue's fallthrough attribute access.
