# Suspense Semantic Comparison

How does Vue's built-in `<Suspense>` component transform into React code after VuReact compilation?

## Prerequisites

To avoid redundancy in example code and ensure clear understanding, let's establish two conventions:

1. Vue/React code examples in this document are simplified core logic, omitting full component wrappers and unrelated configurations.
2. Readers are assumed to be familiar with the usage of the `<Suspense>` component in Vue 3.

## `Suspense` → React `Suspense` Adapter Component

`<Suspense>` is Vue's built-in component for handling asynchronous component loading, displaying fallback content while asynchronous dependencies are pending to enhance user experience.

- Vue code:

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
```

- VuReact compiled React code:

```tsx
import { Suspense } from '@vureact/runtime-core';

<Suspense fallback={<div>Loading...</div>}>
  <AsyncComponent />
</Suspense>;
```

As shown in the example: Vue's `<Suspense>` component is compiled into the [Suspense](https://runtime.vureact.top/en/guide/components/suspense.html) **adapter component** provided by VuReact Runtime, which can be understood as "Vue Suspense in React style."

Key characteristics of this compilation approach:

1. **Semantic consistency**: Fully mimics Vue `<Suspense>` behavior for handling asynchronous loading
2. **Fallback content**: Displays specified fallback content during asynchronous component loading
3. **React integration**: Implements Vue's Suspense semantics in React environment
4. **User experience**: Enhances user experience during asynchronous loading

## `timeout` → React `timeout` Property

The `timeout` property controls when fallback content is displayed, preventing flickering from short requests.

- Vue code:

```vue
<template>
  <Suspense :timeout="1000">
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Loading state shown after 1 second...</div>
    </template>
  </Suspense>
</template>
```

- VuReact compiled React code:

```tsx
<Suspense timeout={1000} fallback={<div>Loading state shown after 1 second...</div>}>
  <AsyncComponent />
</Suspense>
```

**timeout function**:

1. **Anti-flickering**: Prevents fallback content flickering during fast loading
2. **User experience**: Only shows loading state when loading takes longer
3. **Performance optimization**: Reduces unnecessary UI switching
4. **Flexible configuration**: Different timeout settings for different scenarios

## Nested Asynchronous Dependencies → React Multi-Component Synchronization

When a Suspense boundary contains multiple asynchronous components, it waits for all asynchronous dependencies to complete before switching to the content area.

- Vue code:

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponentA />
      <AsyncComponentB />
    </template>
    <template #fallback>
      <div>Synchronizing multiple async components...</div>
    </template>
  </Suspense>
</template>
```

- VuReact compiled React code:

```tsx
<Suspense fallback={<div>Synchronizing multiple async components...</div>}>
  <AsyncComponentA />
  <AsyncComponentB />
</Suspense>
```

**Synchronous loading**:

1. **Unified management**: Waits for all asynchronous components to load
2. **Avoid partial display**: Prevents layout jumps from partial component display
3. **Consistent experience**: Provides more consistent user experience
4. **Error handling**: Unified handling of loading errors

## Lifecycle Callbacks → React `props` Callbacks

Lifecycle callbacks can monitor different states of Suspense.

- Vue code:

```vue
<template>
  <Suspense @pending="onPending" @fallback="onFallback" @resolve="onResolve">
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
```

- VuReact compiled React code:

```tsx
<Suspense
  fallback={<div>Loading...</div>}
  onPending={onPending}
  onFallback={onFallback}
  onResolve={onResolve}
>
  <AsyncComponent />
</Suspense>
```

**Lifecycle events**:

1. **onPending**: Triggered when starting to wait for asynchronous dependencies
2. **onFallback**: Triggered when starting to display fallback content
3. **onResolve**: Triggered when all asynchronous dependencies complete
4. **State tracking**: Suitable for recording asynchronous boundary states

## Summary

VuReact's Suspense compilation strategy demonstrates **complete asynchronous loading transformation capability**:

1. **Direct component mapping**: Maps Vue `<Suspense>` directly to VuReact's `<Suspense>`
2. **Full property support**: Supports all properties including `fallback`, `timeout`, lifecycle callbacks
3. **Slot conversion**: Converts Vue's slot syntax to React's props syntax
4. **Asynchronous semantics preservation**: Fully preserves Vue's asynchronous loading semantics

VuReact's compilation strategy ensures smooth migration from Vue to React, eliminating the need for developers to manually implement asynchronous loading logic. The compiled code maintains both Vue's asynchronous loading semantics and user experience while adhering to React's component design patterns, preserving complete asynchronous loading capabilities in migrated applications.
