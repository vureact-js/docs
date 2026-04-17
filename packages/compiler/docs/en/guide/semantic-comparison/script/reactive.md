# reactive Semantic Comparison

What do the frequently used `reactive()` and `shallowReactive()` in Vue become after being compiled by VuReact into React code?

## Prerequisites

To avoid misunderstandings caused by redundant example code, let's first clarify two conventions:

1. The Vue/React code in this document is simplified core logic, omitting complete component wrappers, irrelevant configurations, etc.;
2. It is assumed that readers are already familiar with the API usage and core behavior of `reactive` and `shallowReactive` in Vue 3.

## `reactive()` → React `useReactive()`

`reactive` is one of the most common reactive data entry points in Vue 3, wrapping objects or arrays into reactive proxies. First, let's look at the most basic compilation example:

- Vue code:

```ts
const state = reactive({
  count: 0,
  title: 'VuReact',
});
```

- React code after VuReact compilation:

```tsx
import { useReactive } from '@vureact/runtime-core';

// Compiled to useReactive, aligning with Vue reactive's reactive behavior
const state = useReactive({
  count: 0,
  title: 'VuReact',
});
```

From the example, we can see: Vue's `reactive()` is directly compiled to the React Hook—`useReactive`. The [useReactive](https://runtime.vureact.top/en/guide/hooks/reactive.html) provided by VuReact is an **adaptation API for reactive**, which can be understood as "Vue reactive for React", **completely simulating Vue reactive's behavior and semantics**, such as automatic view updates when object properties change, direct access to nested properties, and coordination with React component lifecycle.

## Scenarios with TypeScript Types

In actual development, TypeScript is standard. VuReact preserves the type information of `reactive`, and type hints on the React side are not lost:

- Vue code:

```ts
interface User {
  id: number;
  name: string;
}

const state = reactive<{
  loading: boolean;
  users: User[];
  config: Record<string, any>;
}>({
  loading: false,
  users: [],
  config: { theme: 'dark' },
});
```

- React TypeScript code after VuReact compilation:

```tsx
interface User {
  id: number;
  name: string;
}

const state = useReactive<{
  loading: boolean;
  users: User[];
  config: Record<string, any>;
}>({
  loading: false,
  users: [],
  config: { theme: 'dark' },
});
```

No manual adaptation of TypeScript types is needed; VuReact preserves type annotations as-is, keeping the type safety of React code consistent with the Vue side.

## `shallowReactive()` → React `useShallowReactive()`

`shallowReactive` is an API in Vue 3 for creating shallow reactive objects, suitable for scenarios where only outermost reference changes need to be monitored. Its compilation logic remains consistent with `reactive`:

- Vue code:

```ts
const state = shallowReactive({
  nested: { count: 0 },
});
```

- React code after VuReact compilation:

```tsx
import { useShallowReactive } from '@vureact/runtime-core';

const state = useShallowReactive({
  nested: { count: 0 },
});
```

The [useShallowReactive](https://runtime.vureact.top/en/guide/hooks/reactive.html#%E6%B5%85%E5%B1%82%E5%93%8D%E5%BA%94) provided by VuReact is an **adaptation API for shallowReactive**, which can be understood as "Vue shallowReactive for React", **completely simulating shallowReactive's core behavior**—only monitoring outermost reference changes, where property modifications of internal nested objects do not trigger view updates. This is suitable for performance optimization scenarios with large objects, third-party data, or complex data structures.
