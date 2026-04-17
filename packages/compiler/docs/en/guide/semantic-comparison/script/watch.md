# watch Semantic Comparison

What does the frequently used `watch()` in Vue become after being compiled by VuReact into React code?

## Prerequisites

To avoid misunderstandings caused by redundant example code, let's first clarify two conventions:

1. The Vue/React code in this document is simplified core logic, omitting complete component wrappers, irrelevant configurations, etc.;
2. It is assumed that readers are already familiar with the API usage and core behavior of `watch` in Vue 3.

## `watch()` → React `useWatch()`

`watch` is a core API in Vue 3 used to monitor reactive source changes and execute side effects. VuReact will compile it to `useWatch`, and during the compilation phase **automatically analyzes dependencies within watch, performing precise deep tracking and dependency collection, eliminating the need for developers to manually manage dependencies**.

- Vue code:

```ts
const userId = ref(1);

watch(
  userId,
  async (newId, oldId, onCleanup) => {
    let cancelled = false;

    onCleanup(() => {
      cancelled = true;
    });

    const data = await fetchUser(newId);
    if (!cancelled) {
      userData.value = data;
    }
  },
  { immediate: true },
);
```

- React code after VuReact compilation:

```tsx
import { useVRef, useWatch } from '@vureact/runtime-core';

const userId = useVRef(1);

useWatch(
  userId,
  async (newId, oldId, onCleanup) => {
    let cancelled = false;

    onCleanup(() => {
      cancelled = true;
    });

    const data = await fetchUser(newId);
    if (!cancelled) {
      setUserData(data);
    }
  },
  { immediate: true },
);
```

From the example, we can see: Vue's `watch()` is directly compiled to `useWatch`. The [useWatch](https://runtime.vureact.top/en/guide/hooks/watch.html) provided by VuReact is an **adaptation API for watch**, which can be understood as "Vue watch for React", **completely simulating Vue watch's callback logic, cleanup mechanism, and immediate option**.

## watch `Deep and Multi-source Monitoring` → React useWatch `Deep and Array Sources`

When `watch` monitors internal object fields or multiple sources, VuReact similarly supports deep monitoring and multi-source monitoring, with precise dependency analysis.

- Vue code:

```ts
const state = reactive({
  info: { name: 'Vureact', version: '1.0' },
  count: 0,
});

watch(
  () => state.info,
  (newInfo) => {
    console.log('Object internal changes:', newInfo.name);
  },
  { deep: true },
);

watch([state.count, () => state.info.name], ([newCount, newName]) => {
  console.log('Count:', newCount, 'Name:', newName);
});
```

- React code after VuReact compilation:

```tsx
const state = useReactive({
  info: { name: 'Vureact', version: '1.0' },
  count: 0,
});

useWatch(
  () => state.info,
  (newInfo) => {
    console.log('Object internal changes:', newInfo.name);
  },
  { deep: true },
);

useWatch([state.count, () => state.info.name], ([newCount, newName]) => {
  console.log('Count:', newCount, 'Name:', newName);
});
```

VuReact performs static analysis of dependencies within `watch` during the compilation phase and generates precise tracking logic, ensuring both `deep` and array sources work as expected, while avoiding the need for developers to manually maintain dependency relationships.
