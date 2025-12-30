# The useWatchEffect Series

`useWatchEffect`, `useWatchPostEffect`, and `useWatchSyncEffect` are **manual dependency** versions of immediate-watch Hooks, designed with reference to Vue 3's `watchEffect`, `watchPostEffect`, and `watchSyncEffect` APIs, **but they do not have automatic dependency tracking capabilities**.

They are used to execute side effects when the **manually specified dependency array** changes, and provide both asynchronous and synchronous modes based on different execution timings.

## Core Features

- **Manual Dependency Declaration**: You **must explicitly provide a `deps` array**; the Hook will not automatically track reactive values accessed inside the callback function. This is the fundamental difference from Vue's `watchEffect`, stemming from the inherent limitation of React's runtime lacking a reactive system.
- **Three Execution Timings**:
  - **`useWatchEffect` / `useWatchPostEffect`**: Use `useEffect` and execute asynchronously **after browser painting** (default, corresponding to Vue's `flush: 'post'`).
  - **`useWatchSyncEffect`**: Use `useLayoutEffect` and execute synchronously **before browser painting** (corresponding to Vue's `flush: 'sync'`).
- **Automatic Cleanup Management**: The callback can return a cleanup function, which will be automatically called during the next re-execution or when the component is unmounted, following the same cleanup pattern as `useWatch`.
- **Manual Stop Control**: All return a `WatchStopHandle` function, which can be called at any time to stop listening and clean up resources.

## Usage Methods

### 1. Basic Usage (deps must be provided)

```jsx
import { useWatchEffect } from 'react-vue3-hooks';
import { useState } from 'react';

const [count, setCount] = useState(0);
const [name, setName] = useState('Alice');

// Must explicitly declare deps, otherwise it won't trigger
useWatchEffect(() => {
  console.log(`Count: ${count}, Name: ${name}`);
}, [count, name]); // ⚠️ Manually provide the dependency array

// Will re-execute only when count or name changes
```

### 2. Immediate Watch without Dependencies

If you want the callback to execute only once when mounted, provide an empty array `[]`:

```jsx
useWatchEffect(() => {
  console.log('Component mounted');
}, []); // Executes only once when mounted
```

### 3. Synchronous Execution (useWatchSyncEffect)

Use in scenarios that require synchronous execution and blocking painting:

```jsx
import { useWatchSyncEffect } from 'react-vue3-hooks';

useWatchSyncEffect(() => {
  // Executes synchronously, completes before browser painting
  // Suitable for scenarios requiring precise layout measurement or avoiding flicker
  const height = elementRef.current?.offsetHeight;
  setLayoutHeight(height || 0);
}, [items.length]); // Must declare dependencies
```

### 4. Manually Stop Watching

The returned stop function can stop watching when any condition is met:

```jsx
const stop = useWatchEffect(() => {
  syncData();
}, [userId]);

// Stop data synchronization after user logs out
useEffect(() => {
  if (userLoggedOut) {
    stop();
  }
}, [userLoggedOut]);
```

## Essential Differences from Vue

**⚠️ Important Warning: No Automatic Dependency Tracking**

This is the essential difference between this series of Hooks and Vue's `watchEffect`:

| Feature | Vue `watchEffect` | `useWatchEffect` |
|---------|-------------------|------------------|
| **Dependency Declaration** | **No need to declare** (automatic tracking) | **Must manually provide `deps`** |
| **Tracking Mechanism** | **Proxy** (runtime hijacking) | **No tracking** (pure useEffect encapsulation) |
| **Usage** | `watchEffect(() => { ... })` | `useWatchEffect(() => { ... }, deps)` |
| **Common Pitfalls** | None | **Missing deps leading to no triggering** |
| **Development Experience** | **Declarative** | **Imperative** (needs manual maintenance) |

**React's Limitation**: React does not have a reactive system and cannot automatically track which states are accessed inside a function at runtime. Any React Hook that claims to "automatically track dependencies" is a false concept; in fact, it still requires manually providing a dependency array.

## Notes

- **Dependency Array is Mandatory**: If `deps` is omitted, the Hook will only execute once when mounted. Any state changes that need to be responded to **must be explicitly declared** in the deps array.
- **Dependency Stability**: Ensure that the values in the deps array maintain stable references throughout the component's lifecycle. Frequently creating new objects (such as inline objects/arrays) will cause unnecessary re-executions.
- **Choosing Between `useWatch` and This**:
  - `useWatch`: Use when you need to **precisely control the watched source** or **access old values**.
  - `useWatchEffect`: Use when you need a simple mode of **"execute when deps change"**.
- **Choosing Execution Timing**: By default, use `useWatchEffect` (post). Only use `useWatchSyncEffect` when you need to avoid flicker or perform precise layout measurements. Abusing the sync mode will block browser painting and affect performance.
- **SSR Compatibility**: During server-side rendering, neither `useEffect` nor `useLayoutEffect` will execute, so this series of Hooks is ineffective in the SSR phase.
