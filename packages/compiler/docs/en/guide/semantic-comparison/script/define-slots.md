# defineSlots Semantic Comparison

What does the common `defineSlots` macro in Vue become after being compiled by VuReact into React code?

## Prerequisites

To avoid misunderstandings caused by redundant example code, let's first clarify two conventions:

1. The Vue/React code in this document is simplified core logic, omitting complete component wrappers, irrelevant configurations, etc.;
2. It is assumed that readers are already familiar with the API usage and core behavior of `defineSlots` in Vue 3.

## `defineSlots` → React `props` slot types

`defineSlots` is a macro in Vue 3 `<script setup>` used to declare component slot types. VuReact will compile it into corresponding slot function types in React component `props`, giving slots a callable props form on the React side.

- Vue code:

```ts
defineSlots<{
  default?(): any;
  footer(props: { count: number }): any;
}>();
```

- React code after VuReact compilation:

```tsx
type ICompProps = {
  children?: React.ReactNode;
  footer?: (props: { count: number }) => React.ReactNode;
};
```

From the example, we can see: Vue's `defineSlots` is not directly compiled into a runtime Hook, but rather transformed into slot callback declarations in React `props` types. VuReact maps the `default` slot to `children`, and named slots to corresponding functional props, **maintaining a natural correspondence between Vue slot semantics and React props composition**.
