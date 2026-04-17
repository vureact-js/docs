# defineProps Semantic Comparison

What does the common `defineProps` macro in Vue become after being compiled by VuReact into React code?

## Prerequisites

To avoid misunderstandings caused by redundant example code, let's first clarify two conventions:

1. The Vue/React code in this document is simplified core logic, omitting complete component wrappers, irrelevant configurations, etc.;
2. It is assumed that readers are already familiar with the API usage and core behavior of `defineProps` in Vue 3.

## `defineProps<{ ... }>()` → React `props` type + parameters

`defineProps` is a macro in Vue 3 `<script setup>` used to declare component input properties. It allows both type parameter declarations and runtime declaration forms. VuReact will compile it into React's props type declaration and rewrite component parameters as `props`.

- Vue code:

```ts
const props = defineProps<{ id: string; enabled?: boolean }>();
```

- React code after VuReact compilation:

```tsx
type ICompProps = {
  id: string;
  enabled?: boolean;
};

const Comp = (props: ICompProps) => {
  // ...
};
```

From the example, we can see: Vue's `defineProps` is not directly compiled into a runtime Hook, but rather transformed into standard React `props` types and component parameters. VuReact extracts the type information from `defineProps` into independent props type definitions, **maintaining type safety and consistency with React component Props specifications**.

## `defineProps(['foo', 'bar'])` / `defineProps({ ... })` → React `props` inference

In addition to the type parameter form, `defineProps` also supports runtime declarations in array and object forms. VuReact performs type inference on these forms and maps the results to React's `props` type where feasible.

- Vue code:

```ts
const props = defineProps(['foo', 'bar']);
```

- React output (illustrative):

```tsx
type ICompProps = {
  foo?: any;
  bar?: any;
};

const Comp = (props: ICompProps) => {
  // ...
};
```

If using the object form for declaration, the compiler will also try to preserve type inference. Although these two forms are usable, **it is recommended to prioritize the type parameter form**, as it provides clearer type hints and more controllable results on the React side.
