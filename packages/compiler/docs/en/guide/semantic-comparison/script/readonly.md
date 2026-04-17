# readonly Semantic Comparison

What does the frequently used `readonly()` in Vue become after being compiled by VuReact into React code?

## Prerequisites

To avoid misunderstandings caused by redundant example code, let's first clarify two conventions:

1. The Vue/React code in this document is simplified core logic, omitting complete component wrappers, irrelevant configurations, etc.;
2. It is assumed that readers are already familiar with the API usage and core behavior of `readonly` in Vue 3.

## `readonly()` → React `useReadonly()`

`readonly` is an API in Vue 3 used to create deep read-only copies, returning a reactive object that cannot be modified. VuReact will compile it to `useReadonly`, allowing React to also gain the same read-only protection capabilities.

- Vue code:

```ts
const original = reactive({
  count: 0,
  nested: { text: 'Hello' },
});

const readonlyCopy = readonly(original);
```

- React code after VuReact compilation:

```tsx
import { useReactive, useReadonly } from '@vureact/runtime-core';

const original = useReactive({
  count: 0,
  nested: { text: 'Hello' },
});

const readonlyCopy = useReadonly(original);
```

The [useReadonly](https://runtime.vureact.top/en/guide/hooks/readonly.html) provided by VuReact is an **adaptation API for readonly**, which can be understood as "Vue readonly for React", **completely simulating Vue readonly's deep read-only behavior**—any modifications to the copy will be prevented, and warnings will be given in development mode.

## `shallowReadonly()` → React `useShallowReadonly()`

`shallowReadonly` is an API in Vue 3 used to create shallow read-only objects, which only prohibits modifications to the outermost properties but allows inner objects to remain writable. VuReact will compile it to `useShallowReadonly`, allowing React to also safely control read-only levels.

- Vue code:

```ts
const state = reactive({
  user: { name: 'React', role: 'Admin' },
});

const shallowRead = shallowReadonly(state);
```

- React code after VuReact compilation:

```tsx
import { useReactive, useShallowReadonly } from '@vureact/runtime-core';

const state = useReactive({
  user: { name: 'React', role: 'Admin' },
});

const shallowRead = useShallowReadonly(state);
```

The [useShallowReadonly](https://runtime.vureact.top/en/guide/hooks/readonly.html#浅只读) provided by VuReact is an **adaptation API for shallowReadonly**, which can be understood as "Vue shallowReadonly for React", **completely simulating Vue shallowReadonly's core behavior**—prohibiting modifications to outermost properties, but internal nested objects maintain their original references, and their properties remain writable.