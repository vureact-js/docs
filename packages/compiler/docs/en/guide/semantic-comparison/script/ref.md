# ref Semantic Comparison

What do the frequently used `ref()` and `shallowRef()` in Vue become after semantic compilation into React code?

## Prerequisites

To avoid misunderstandings caused by redundant example code, let's first clarify two conventions:

1. The Vue/React code in this document is simplified core logic, omitting complete component wrappers, irrelevant configurations, etc.;
2. It is assumed that readers are already familiar with the API usage and core behavior of `ref` and `shallowRef` in Vue 3.

## `ref()` → React `useVRef()`

`ref` is the most fundamental reactive API in Vue 3 and one of the most frequently used APIs in daily development. First, let's look at the most basic compilation example:

- Vue code:

```ts
// Define reactive data of basic types
const count = ref(0);
```

- React code after VuReact compilation:

```tsx
import { useVRef } from '@vureact/runtime-core';

// Compiled to a dedicated Hook, with semantics and behavior fully aligned with Vue ref
const count = useVRef(0);
```

From the example, we can clearly see: Vue's `ref()` is directly compiled to the React Hook—`useVRef`. The [useVRef](https://runtime.vureact.top/en/guide/hooks/v-ref.html) provided by VuReact is an **adaptation API for ref**, which can be understood as "Vue ref for React", **completely simulating Vue ref's behavior and semantics**, such as value updates triggering view re-rendering, .value access/modification rules (underlying logic already adapted to React features), etc.

## Scenarios with TypeScript Types

In actual development, TypeScript is standard. VuReact can perfectly preserve type information, ensuring type hints on the React side are not lost:

- Vue code:

```ts
// Different TS annotation scenarios
const title = ref<string>(''); // String type
const isLoading = ref<boolean>(false); // Boolean type
const userList = ref<Array<{ id: number; name: string }>>([]); // Array object type
const config = ref<Record<string, any>>({ theme: 'dark' }); // Arbitrary key-value pair type
```

- React TypeScript code after VuReact compilation:

```tsx
// Type annotations completely preserved, type hints work normally in React
const title = useVRef<string>('');
const isLoading = useVRef<boolean>(false);
const userList = useVRef<Array<{ id: number; name: string }>>([]);
const config = useVRef<Record<string, any>>({ theme: 'dark' });
```

No manual adaptation of TypeScript types is needed; VuReact preserves type annotations as-is, keeping the type safety of React code consistent with the Vue side.

## `shallowRef()` → React `useShallowVRef()`

`shallowRef`, as Vue 3's "shallow reactive" API, is suitable for complex object scenarios that don't require deep monitoring, effectively improving performance. Its compilation logic follows the same lineage as `ref`:

- Vue code:

```ts
// Shallow reactive: only monitors reference changes of .count, not internal nested properties
const count = shallowRef({ a: { b: 1, c: { d: 2 } } });
```

- React code after VuReact compilation:

```tsx
import { useShallowVRef } from '@vureact/runtime-core';

// Compiled to useShallowVRef, aligning with shallowRef's shallow reactive behavior
const count = useShallowVRef({ a: { b: 1, c: { d: 2 } } });
```

Same logic: Vue's `shallowRef()` is compiled to the `useShallowVRef` Hook. The [useShallowVRef](https://runtime.vureact.top/en/guide/hooks/v-ref.html#浅层-ref) provided by VuReact **is an adaptation API for shallowRef**, which can be understood as "Vue shallowRef for React", **completely simulating Vue shallowRef's core behavior**—only monitoring outermost reference changes, where property modifications of nested objects do not trigger view updates, perfectly adapting to React's update mechanism.
