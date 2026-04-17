# watchEffect Semantic Comparison

What does the frequently used `watchEffect()` in Vue become after being compiled by VuReact into React code?

## Prerequisites

To avoid misunderstandings caused by redundant example code, let's first clarify two conventions:

1. The Vue/React code in this document is simplified core logic, omitting complete component wrappers, irrelevant configurations, etc.;
2. It is assumed that readers are already familiar with the API usage and core behavior of `watchEffect` in Vue 3.

## `watchEffect()` → React `useWatchEffect()`

`watchEffect` is an API in Vue 3 used to automatically respond to dependency changes and execute side effects, automatically collecting dependencies after the first run. VuReact will compile it to `useWatchEffect`, and during the compilation phase **automatically analyzes dependencies within watchEffect, performing precise deep tracking and collection, eliminating the need for developers to manually manage dependencies**.

- Vue code:

```ts
const count = ref(0);

watchEffect(() => {
  console.log(`Current count is: ${count.value}`);
});
```

- React code after VuReact compilation:

```tsx
import { useVRef, useWatchEffect } from '@vureact/runtime-core';

const count = useVRef(0);

watchEffect(() => {
  console.log(`Current count is: ${count.value}`);
}, [count.value]);
```

From the example, we can see: Vue's `watchEffect()` is compiled to `useWatchEffect`. The [useWatchEffect](https://runtime.vureact.top/en/guide/hooks/watch-effect.html) provided by VuReact is an **adaptation API for watchEffect**, **completely simulating Vue watchEffect's automatic dependency collection, cleanup mechanism, and stop control**.

## watchEffect + `flush` Option → React `useWatchPostEffect` / `useWatchSyncEffect`

When you need to execute side effects after React DOM updates, Vue's `watchEffect` can be compiled to corresponding React versions via `flush: 'post'` or `flush: 'sync'` options, maintaining consistency with rendering timing.

- Vue code:

```ts
const width = ref(0);
const elRef = ref(null);

watchEffect(
  () => {
    if (elRef.value) {
      width.value = elRef.value.offsetWidth;
    }
  },
  { flush: 'post' },
);

watchEffect(
  () => {
    // sync mode for React synchronous update scenarios
    console.log(elRef.value);
  },
  { flush: 'sync' },
);
```

- React code after VuReact compilation:

```tsx
import { useWatchPostEffect, useWatchSyncEffect } from '@vureact/runtime-core';

const width = useVRef(0);
const elRef = useVRef(null);

useWatchPostEffect(() => {
  if (elRef.value) {
    width.value = elRef.value.offsetWidth;
  }
}, [elRef.value, width.value, elRef.value.offsetWidth]);

useWatchSyncEffect(() => {
  // sync mode for React synchronous update scenarios
  console.log(elRef.value);
}, [elRef.value]);
```

VuReact automatically identifies dependencies within `watchEffect` during the compilation phase and generates corresponding React dependency arrays, ensuring `useWatchEffect` / `useWatchPostEffect` / `useWatchSyncEffect` behavior remains consistent with Vue.