# computed Semantic Comparison

This section explains how Vue’s widely used `computed()` is compiled into React code by VuReact.

## Assumptions

To keep examples concise and focused:

1. Vue and React snippets only include core logic, omitting full component wrappers and unrelated configuration
2. Readers are expected to be familiar with the `computed` API and its core behavior in Vue 3

## `computed()` → React `useComputed()`

In Vue 3, `computed` is a core API for declaring derived state.
It tracks dependencies automatically and only recomputes when its reactive sources change.

VuReact compiles `computed` into `useComputed`, enabling the same behavior in React.

- Vue:

```ts
const state = reactive({
  count: 1,
  price: 99,
});

const totalPrice = computed(() => state.count * state.price);
```

- Compiled React (VuReact):

```tsx
import { useReactive, useComputed } from '@vureact/runtime-core';

const state = useReactive({
  count: 1,
  price: 99,
});

const totalPrice = useComputed(() => state.count * state.price);
```

As shown, Vue’s `computed()` is directly compiled into the React Hook `useComputed`.

VuReact provides `useComputed` as an **adaptation layer for Vue’s computed**, effectively acting as a “React version of computed.”
It preserves dependency tracking and caching behavior—for example, recomputing only when `state.count` or `state.price` changes, avoiding unnecessary executions.

## TypeScript Support

Type information defined on `computed` is preserved during compilation, and type inference works as expected in React.

- Vue:

```ts
const state = reactive({
  count: 1,
  price: 99,
});

const totalPrice = computed<number>(() => state.count * state.price);
```

- Compiled React (VuReact):

```tsx
import { useReactive, useComputed } from '@vureact/runtime-core';

const state = useReactive({
  count: 1,
  price: 99,
});

const totalPrice = useComputed<number>(() => state.count * state.price);
```

No manual TypeScript adaptation is required.
VuReact preserves the type annotations, ensuring type safety remains consistent between Vue and React.

## Writable Computed & Two-Way Updates

Vue supports writable computed properties via `get` / `set`.
VuReact’s `useComputed` fully supports this pattern as well, enabling intuitive two-way data flow in React.

- Vue:

```ts
const state = reactive({
  firstName: '张',
  lastName: '三',
});

const fullName = computed({
  get: () => `${state.firstName} ${state.lastName}`,
  set: (val: string) => {
    const [first, last] = val.split(' ');
    state.firstName = first || '';
    state.lastName = last || '';
  },
});
```

- Compiled React (VuReact):

```tsx
const state = useReactive({
  firstName: '张',
  lastName: '三',
});

const fullName = useComputed({
  get: () => `${state.firstName} ${state.lastName}`,
  set: (val: string) => {
    const [first, last] = val.split(' ');
    state.firstName = first || '';
    state.lastName = last || '';
  },
});
```

`useComputed` preserves the full semantics of Vue’s writable computed properties.
You can both read and write via `fullName.value`, with updates automatically syncing back to the underlying reactive state.
