# toRef/toRefs Semantic Comparison

What do the frequently used `toRef()` and `toRefs()` in Vue become after being compiled by VuReact into React code?

## Prerequisites

To avoid misunderstandings caused by redundant example code, let's first clarify two conventions:

1. The Vue/React code in this document is simplified core logic, omitting complete component wrappers, irrelevant configurations, etc.;
2. It is assumed that readers are already familiar with the API usage and core behavior of `toRef` and `toRefs` in Vue 3.

## `toRef()` → React `useToVRef()`

`toRef` is an API in Vue 3 used to convert a specific property of a reactive object into a Ref, suitable for scenarios where you want to maintain reactivity after destructuring. VuReact compiles it to `useToVRef`, allowing React to also gain the same "property reference conversion" capability.

- Vue code:

```ts
const state = reactive({
  count: 1,
  user: { name: 'Gemini' },
});

const countRef = toRef(state, 'count');
```

- React code after VuReact compilation:

```tsx
import { useReactive, useToVRef } from '@vureact/runtime-core';

const state = useReactive({
  count: 1,
  user: { name: 'Gemini' },
});

const countRef = useToVRef(state, 'count');
```

From the example, we can see: Vue's `toRef()` is directly compiled to `useToVRef`. The [useToVRef](https://runtime.vureact.top/en/guide/hooks/to-v-ref.html) provided by VuReact is an **adaptation API for toRef**, which can be understood as "Vue toRef for React", **completely simulating Vue toRef's behavior**—the extracted ref object `countRef.value` remains bidirectionally bound to the source object `state.count`.

## `toRefs()` → React `useToVRefs()`

`toRefs` is an API in Vue 3 used to convert all properties of an entire reactive object into a collection of Ref objects, which can avoid the risk of losing reactivity after destructuring. VuReact will compile it to `useToVRefs`, allowing React to also safely destructure object properties.

- Vue code:

```ts
const state = reactive({
  foo: 1,
  bar: 'Hello',
});

const { foo, bar } = toRefs(state);
```

- React code after VuReact compilation:

```tsx
import { useReactive, useToVRefs } from '@vureact/runtime-core';

const state = useReactive({
  foo: 1,
  bar: 'Hello',
});

const { foo, bar } = useToVRefs(state);
```

The [useToVRefs](https://runtime.vureact.top/en/guide/hooks/to-v-ref.html#torefs) provided by VuReact is an **adaptation API for toRefs**, which can be understood as "Vue toRefs for React", **completely simulating Vue toRefs' semantics**—the destructured `foo` and `bar` are both Ref objects, accessible and modifiable via `.value`, and remain synchronized with the original reactive object.
