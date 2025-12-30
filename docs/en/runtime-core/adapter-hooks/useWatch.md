# useWatch

`useWatch` corresponds to the `watch` API in Vue 3, which is used to monitor reactive data sources and execute side effects when changes occur.

It provides the core functionality of Vue's `watch`, including monitoring single/multiple sources, deep monitoring, immediate execution, one-time monitoring, etc., and returns a manual stop handle.

## Core Features

- **Flexible monitoring sources**: Supports directly monitoring values, return values of getter functions, and arrays (multi-source monitoring). It automatically identifies the source type and extracts dependencies.
- **Deep monitoring**: Use the `deep: true` option to perform deep comparison on non-primitive values (objects, arrays) and detect changes in deeply nested properties. It automatically selects a deep comparison strategy internally to avoid unnecessary re-renders.
- **Immediate execution**: `immediate: true` makes the callback execute immediately once when the component is mounted, simulating Vue's immediate triggering behavior.
- **One-time monitoring**: `once: true` makes the callback execute only once and then automatically stop monitoring, which is suitable for scenarios where only the first change needs to be responded to.
- **Automatic cleanup management**: Supports the callback to return a cleanup function (synchronous or asynchronous), which is automatically called when triggered next time or when the component is unmounted to avoid memory leaks.
- **Manual stop of monitoring**: Returns a `WatchStopHandle` function that can be called at any time to stop monitoring and clean up resources.

## Usage Methods

### 1. Monitoring a single reactive value

Monitor basic types or object references, and execute the callback when the value changes:

```jsx
import { useWatch } from 'react-vue3-hooks';
import { useState } from 'react';

const [count, setCount] = useState(0);

// Monitor a single value
const stop = useWatch(count, (newVal, oldVal) => {
  console.log(`Count changed: ${oldVal} → ${newVal}`);
  // Return an optional cleanup function
  return () => {
    console.log('Cleanup from last effect');
  };
});

// Manually stop monitoring
// stop();
```

### 2. Monitoring getter functions

Monitor calculated values or specific properties through a function to achieve more precise dependency control:

```jsx
const [state, setState] = useState({ nested: { value: 1 } });

// Only monitor deep properties
useWatch(
  () => state.nested.value,
  (newVal, oldVal) => {
    console.log('Nested value changed');
  }
);
```

### 3. Monitoring multiple sources

Pass an array to monitor multiple values at the same time; any change will trigger the callback:

```jsx
const [foo, setFoo] = useState(1);
const [bar, setBar] = useState(2);

useWatch([foo, bar], ([newFoo, newBar], [oldFoo, oldBar]) => {
  console.log('Multi-source change detected');
});
```

### 4. Deep monitoring of objects

Monitor deep changes of objects, and use `deep: true` to detect changes in nested properties:

```jsx
const [user, setUser] = useState({ name: 'Alice', profile: { age: 25 } });

useWatch(
  user,
  (newUser) => {
    console.log('User object changed deeply');
  },
  { deep: true }
);

// Deep updates will trigger
setUser(prev => ({ ...prev, profile: { age: 26 } }));
```

### 5. Immediate execution and one-time monitoring

`immediate` makes the callback execute immediately once when mounted, and `once` makes it trigger only once:

```jsx
// Get initial data immediately when mounted
useWatch(
  userId,
  (id) => {
    fetchUserData(id);
  },
  { immediate: true }
);

// Only respond to the first change
useWatch(
  config,
  () => {
    console.log('Config changed for the first time');
  },
  { once: true }
);
```

### 6. Manually stop monitoring

The returned stop function can stop monitoring at any time:

```jsx
const stopWatch = useWatch(value, callback);

// Conditionally stop monitoring (such as stopping synchronization after the user logs out)
useEffect(() => {
  if (userLoggedOut) {
    stopWatch();
  }
}, [userLoggedOut]);
```

## Difference from Vue

**Core differences**: This Hook implements the API form of Vue's `watch` under the constraints of the React runtime, but the underlying mechanism is fundamentally different.

| Feature | Vue `watch` | `useWatch` |
|---------|------------|-----------|
| **Dependency tracking** | **Automatically tracks reactive references** | **Manually declares sources** (functions/values/arrays) |
| **Execution timing** | **Synchronous** (triggers immediately when reactive changes) | **Asynchronous** (scheduled by `useEffect`) |
| **Deep monitoring** | **Deep recursion** (Proxy agent) | **Deep comparison** (serialization comparison) |
| **Cleanup function** | Called before the next trigger | Called **both before the next trigger and when unmounted** |
| **Stop monitoring** | `stop()` stops immediately | `stop()` takes effect after the next scheduling |
| **Old value acquisition** | **Accurately captured** (internally tracked) | **Stale reference** (React closure limitation) |

**Key limitations**:

1. **Accuracy of old values**: Due to the closure nature of React function components, `oldValue` may be stale during asynchronous execution. For object types, what is obtained is a reference from the previous render, not a precise snapshot like in Vue.
2. **Performance of deep monitoring**: `deep: true` relies on deep serialization comparison, which may cause performance overhead for large objects or deeply nested structures. Vue's Proxy agent is more performant.
3. **Stop timing**: After calling `stop()`, the currently scheduled effect will still execute once, and it will really stop in the next rendering cycle. Vue's `stop()` takes effect synchronously and immediately.

## Notes

- **Stability of dependency sources**: When monitoring arrays or objects, ensure that the source reference remains stable when the callback does not need to be triggered. Frequent creation of new references (such as inline objects) will cause unexpected triggers.
- **Necessity of cleanup functions**: If global events, timers, etc., are registered in the callback, a cleanup function must be returned to avoid memory leaks. The cleanup function will be automatically called when triggered next time or when the component is unmounted.
- **Use deep monitoring with caution**: Using `deep: true` on frequently changing deep objects may cause performance issues. Consider refining the monitoring granularity to specific leaf nodes or using `useMemo` to manually calculate comparable values.
- **SSR compatibility**: `useLayoutEffect` will not execute during server-side rendering, so the `immediate` option is invalid in the SSR phase. It is necessary to ensure the consistency of the state after client hydration.
- **Choice between `useEffect`**: If only simple dependency responses are needed, prefer the native `useEffect`. The value of this Hook lies in providing a Vue-style API and advanced options (`deep`, `once`, `stop`).