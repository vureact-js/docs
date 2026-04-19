# KeepAlive Semantic Comparison

How does Vue's built-in `<KeepAlive>` component transform into React code after VuReact compilation?

## Prerequisites

To avoid redundancy in example code and ensure clear understanding, let's establish two conventions:

1. Vue/React code examples in this document are simplified core logic, omitting full component wrappers and unrelated configurations.
2. Readers are assumed to be familiar with the usage of the `<KeepAlive>` component in Vue 3.

## `KeepAlive` → React `KeepAlive` Adapter Component

`<KeepAlive>` is Vue's built-in component for caching component instances, preserving component state during dynamic component switching to avoid re-rendering and data loss.

- Vue code:

```vue
<template>
  <KeepAlive>
    <component :is="currentView" />
  </KeepAlive>
</template>
```

- VuReact compiled React code:

```tsx
import { KeepAlive } from '@vureact/runtime-core';

<KeepAlive>
  <Component is={currentView} />
</KeepAlive>;
```

As shown in the example: Vue's `<KeepAlive>` component is compiled into the [KeepAlive](https://runtime.vureact.top/en/guide/components/keep-alive.html) **adapter component** provided by VuReact Runtime, which can be understood as "Vue KeepAlive in React style."

Key characteristics of this compilation approach:

1. **Semantic consistency**: Fully mimics Vue `<KeepAlive>` behavior for component instance caching
2. **State preservation**: Caches removed component instances to avoid state loss
3. **Performance optimization**: Reduces unnecessary component re-renders
4. **React adaptation**: Implements Vue's caching semantics in React environment

## With `key` → React `key` Property Passing

To ensure proper caching, it's recommended to provide stable `key` for dynamic components.

- Vue code:

```vue
<template>
  <KeepAlive>
    <component :is="currentComponent" :key="componentKey" />
  </KeepAlive>
</template>
```

- VuReact compiled React code:

```tsx
<KeepAlive>
  <Component is={currentComponent} key={componentKey} />
</KeepAlive>
```

**Importance of `key`**:

1. **Cache identification**: `key` is used to identify and match cache instances
2. **Stable switching**: Ensures correct cache hits during component switching
3. **Performance optimization**: Avoids unnecessary cache creation and destruction
4. **Best practice**: Always provide stable `key` for dynamic components

## `include` / `exclude` → React `include`/`exclude` Properties

`<KeepAlive>` supports precise control over which components to cache through `include` and `exclude` properties.

- Vue code:

```vue
<template>
  <KeepAlive :include="['ComponentA', 'ComponentB']">
    <component :is="currentView" />
  </KeepAlive>
</template>
```

- VuReact compiled React code:

```tsx
<KeepAlive include={['ComponentA', 'ComponentB']}>
  <Component is={currentView} />
</KeepAlive>
```

**Matching rules**:

1. **String matching**: Exact component name matching
2. **Regular expressions**: Matching component names that fit patterns
3. **Array combinations**: Supports arrays of strings and regular expressions
4. **Key matching**: Attempts to match both component names and cache keys

## `max` → React `max` Property Limitation

The `max` property can limit the maximum cache size to avoid excessive memory usage.

- Vue code:

```vue
<template>
  <KeepAlive :max="3">
    <component :is="currentTab" />
  </KeepAlive>
</template>
```

- VuReact compiled React code:

```tsx
<KeepAlive max={3}>
  <Component is={currentTab} />
</KeepAlive>
```

**Cache eviction strategy**:

1. **LRU algorithm**: Evicts least recently used cache instances
2. **Memory management**: Automatically cleans up caches exceeding limits
3. **Performance balance**: Balances between memory usage and performance
4. **Intelligent management**: Intelligently manages cache based on access frequency

## Cache Lifecycle → React `useActived`/`useDeactivated`

Components cached by `<KeepAlive>` have special lifecycle events that can be monitored through corresponding Hooks.

- Vue code:

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue';

onActivated(() => {
  console.log('Component activated');
});

onDeactivated(() => {
  console.log('Component deactivated');
});
</script>
```

- VuReact compiled React code:

```tsx
import { useActived, useDeactivated } from '@vureact/runtime-core';

function MyComponent() {
  useActived(() => {
    console.log('Component activated');
  });

  useDeactivated(() => {
    console.log('Component deactivated');
  });

  return <div>Component content</div>;
}
```

**Lifecycle events**:

1. **useActived**: Triggered when component is restored from cache
2. **useDeactivated**: Triggered when component is cached
3. **Initial render**: activated is also triggered on first render
4. **Final unmount**: deactivated is triggered when component is finally destroyed

## Summary

VuReact's KeepAlive compilation strategy demonstrates **complete component caching transformation capability**:

1. **Direct component mapping**: Maps Vue `<KeepAlive>` directly to VuReact's `<KeepAlive>`
2. **Full property support**: Supports all properties including `include`, `exclude`, `max`
3. **Lifecycle adaptation**: Converts Vue lifecycle Hooks to React Hooks
4. **Cache semantics preservation**: Fully preserves Vue's caching behavior and semantics

Important considerations:

1. **Single child node**: `<KeepAlive>` can only have one direct child node
2. **Component type**: Can only cache component elements, not regular elements
3. **Key requirement**: Falls back to non-cached rendering when stable key is missing

VuReact's compilation strategy ensures smooth migration from Vue to React, eliminating the need for developers to manually implement component caching logic. The compiled code maintains both Vue's caching semantics and performance advantages while adhering to React's component design patterns, preserving complete component caching capabilities in migrated applications.
