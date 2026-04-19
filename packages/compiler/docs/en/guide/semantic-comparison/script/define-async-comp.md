# defineAsyncComponent Semantic Comparison

How does Vue's `defineAsyncComponent()` for async components transform into React code after VuReact compilation?

## Prerequisites

To avoid redundancy in example code and ensure clear understanding, let's establish two conventions:

1. Vue/React code examples in this document are simplified core logic, omitting full component wrappers and unrelated configurations.
2. Readers are assumed to be familiar with the API usage and core behavior of `defineAsyncComponent` in Vue 3.

## `defineAsyncComponent()` → React `defineAsyncComponent()`

`defineAsyncComponent` is Vue 3's API for defining async components, allowing you to load components on-demand to optimize application performance. VuReact compiles it to the same-named `defineAsyncComponent`, providing the same async component capabilities in React.

- Vue code:

```vue
<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() => import('./components/AsyncComponent.vue'));
</script>

<template>
  <AsyncComponent />
</template>
```

- VuReact compiled React code:

```tsx
import { defineAsyncComponent } from '@vureact/runtime-core';

const AsyncComponent = defineAsyncComponent(() => import('./components/AsyncComponent'));

function MyComponent() {
  return <AsyncComponent />;
}
```

VuReact's provided [defineAsyncComponent](https://runtime.vureact.top/guide/components/async.html) is **Vue defineAsyncComponent's adapter API**, which can be understood as "Vue defineAsyncComponent in React style", **fully mimicking Vue defineAsyncComponent's async loading behavior**—supporting complete features like lazy loading, loading state handling, error handling, etc.

## Advanced Usage

`defineAsyncComponent` in Vue 3 supports various configuration options like loading state components, error handling components, timeout settings, etc. VuReact compiles these to corresponding React configurations, maintaining functional consistency.

- Vue code:

```vue
<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent({
  loader: () => import('./components/HeavyComponent.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200,
  timeout: 3000,
  suspensible: true,
});
</script>
```

- VuReact compiled React code:

```tsx
import { defineAsyncComponent } from '@vureact/runtime-core';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';

const AsyncComponent = defineAsyncComponent({
  loader: () => import('./components/HeavyComponent'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200,
  timeout: 3000,
  suspensible: true,
});
```

VuReact's provided `defineAsyncComponent` supports **all Vue defineAsyncComponent configuration options**, including `loader`, `loadingComponent`, `errorComponent`, `delay`, `timeout`, `suspensible`, etc., **fully mimicking Vue defineAsyncComponent's advanced features**—achieving consistent async component experience in React as in Vue.
