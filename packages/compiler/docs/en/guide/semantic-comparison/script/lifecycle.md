# Lifecycle Semantic Comparison

What do common Vue `lifecycle` hooks become after being compiled by VuReact into React code?

## Prerequisites

To avoid misunderstandings caused by redundant example code, let's first clarify two conventions:

1. The Vue/React code in this document is simplified core logic, omitting complete component wrappers, irrelevant configurations, etc.;
2. It is assumed that readers are already familiar with the API usage and core behavior of Vue 3 lifecycle hooks such as `onMounted, onBeforeMount, onUpdated, onBeforeUpdate, onBeforeUnmount, onUnmounted`.

## `onMounted()` → React `useMounted()`

`onMounted` is a lifecycle hook in Vue 3 used to execute logic after the component's first mount, suitable for initialization requests, subscription setup, DOM-related preparations, etc. VuReact will compile it to `useMounted`, allowing the React side to also execute one-time side effects after component mounting.

- Vue code:

```ts
onMounted(() => {
  console.log('Component mounted');
});
```

- React code after VuReact compilation:

```ts
import { useMounted } from '@vureact/runtime-core';

useMounted(() => {
  console.log('Component mounted');
});
```

From the example, we can see: Vue's `onMounted()` is compiled to `useMounted`. The [useMounted](https://runtime.vureact.top/en/guide/hooks/mounted.html) provided by VuReact is an **adaptation API for onMounted**, **completely simulating Vue onMounted's execution timing after the first mount**.

## `onBeforeMount()` → React `useBeforeMount()`

`onBeforeMount` is a lifecycle hook in Vue 3 used to execute logic before component mounting, suitable for content that needs preparation before the layout phase. VuReact will compile it to `useBeforeMount`, executing before mounting based on React's layout effects.

- Vue code:

```ts
onBeforeMount(() => {
  console.log('Component about to mount');
});
```

- React code after VuReact compilation:

```ts
import { useBeforeMount } from '@vureact/runtime-core';

useBeforeMount(() => {
  console.log('Component about to mount');
});
```

The [useBeforeMount](https://runtime.vureact.top/en/guide/hooks/before-mount.html) provided by VuReact is an **adaptation API for onBeforeMount**, **completely simulating Vue onBeforeMount's timing before the first mount**.

## `onBeforeUpdate()` → React `useBeforeUpdate()`

`onBeforeUpdate` is a lifecycle hook in Vue 3 that skips the first mount and only executes before component updates, suitable for validation before changes, recording old values, early preparations, etc. VuReact will compile it to `useBeforeUpdate`, supporting dependency arrays to control trigger timing.

- Vue code:

```ts
const state = reactive({ count: 0 });

onBeforeUpdate(() => {
  console.log('Before update, current count:', state.count);
});
```

- React code after VuReact compilation:

```ts
import { useReactive, useBeforeUpdate } from '@vureact/runtime-core';

const state = useReactive({ count: 0 });

useBeforeUpdate(() => {
  console.log('Before update, current count:', state.count);
}, [state.count]);
```

From the example, we can see: Vue's `onBeforeUpdate()` is compiled to `useBeforeUpdate`. The [useBeforeUpdate](https://runtime.vureact.top/en/guide/hooks/before-update.html) provided by VuReact is an **adaptation API for onBeforeUpdate**, **completely simulating Vue onBeforeUpdate's trigger timing before updates**. When the corresponding React API requires dependency arrays, the `deps` array can be used to trigger only when specified values change. VuReact will automatically analyze dependencies during compilation and map them to corresponding dependency arrays, **avoiding manual dependency management by developers**.

## `onUpdated()` → React `useUpdated()`

`onUpdated` is a lifecycle hook in Vue 3 used to execute logic after component updates, suitable for reading the latest rendering results, performing subsequent synchronization, etc. VuReact will compile it to `useUpdated`, supporting optional dependency arrays to precisely control trigger conditions.

- Vue code:

```ts
const state = reactive({ count: 0 });

onUpdated(() => {
  console.log('After component update, count:', state.count);
});
```

- React code after VuReact compilation:

```ts
import { useReactive, useUpdated } from '@vureact/runtime-core';

const state = useReactive({ count: 0 });

useUpdated(() => {
  console.log('After component update, count:', state.count);
}, [state.count]);
```

The [useUpdated](https://runtime.vureact.top/en/guide/hooks/updated.html) provided by VuReact is an **adaptation API for onUpdated**, **completely simulating Vue onUpdated's execution timing after updates**. If the React API uses `deps` arrays, VuReact will automatically analyze dependencies and generate corresponding arrays, **no need for developers to manually maintain dependencies**.

## `onBeforeUnmount()` → React `useBeforeUnMount()`

`onBeforeUnmount` is a lifecycle hook in Vue 3 used to execute logic before component unmounting, suitable for animation stopping, resource unbinding, log reporting, and other pre-cleanup logic. VuReact will compile it to `useBeforeUnMount`, executing before unmounting.

- Vue code:

```ts
onBeforeUnmount(() => {
  console.log('Component about to unmount');
});
```

- React code after VuReact compilation:

```ts
import { useBeforeUnMount } from '@vureact/runtime-core';

useBeforeUnMount(() => {
  console.log('Component about to unmount');
});
```

The [useBeforeUnMount](https://runtime.vureact.top/en/guide/hooks/before-unmount.html) provided by VuReact is an **adaptation API for onBeforeUnmount**, **completely simulating Vue onBeforeUnmount's timing before unmounting**.

## `onUnmounted()` → React `useUnmounted()`

`onUnmounted` is a lifecycle hook in Vue 3 used to execute logic when a component unmounts, suitable for final resource release, async cancellation, log reporting, and other cleanup logic. VuReact will compile it to `useUnmounted`, executing when the component unmounts.

- Vue code:

```ts
onUnmounted(() => {
  console.log('Component unmounted');
});
```

- React code after VuReact compilation:

```ts
import { useUnmounted } from '@vureact/runtime-core';

useUnmounted(() => {
  console.log('Component unmounted');
});
```

The [useUnmounted](https://runtime.vureact.top/en/guide/hooks/unmounted.html) provided by VuReact is an **adaptation API for onUnmounted**, **completely simulating Vue onUnmounted's unmount timing**.
