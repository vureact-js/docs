# useUpdated

`useUpdated` corresponds to the `onUpdated` lifecycle hook in Vue 3.

It asynchronously executes a callback function after the DOM has been updated and the browser has finished painting, following a component re-render caused by changes in specified dependencies. It is used to respond to update behaviors triggered by specific dependency changes.

## Core Features

- **Dependency-driven updates**: A dependency array (`deps`) must be explicitly declared, and the callback is only triggered when dependencies change. This is an important compromise between Vue's `onUpdated` with automatic dependency tracking and React's explicit data flow, avoiding excessive triggers caused by unrelated state changes compared to the dependency-free version.
- **Skips initial mount**: Ensures the callback does not execute during the component's initial render, strictly matching Vue `onUpdated`'s semantics of "only triggering after updates".
- **Asynchronous execution**: Implemented based on `useEffect`, it is called asynchronously after the DOM is updated and the browser has completed painting, ensuring it does not block visual updates, making it suitable for responsive side effects.
- **Timing relationship with `useBeforeUpdate`**: This hook executes after `useBeforeUpdate`, with a complete browser painting cycle between them, forming an asynchronous closed loop of "before update → after update". `useBeforeUpdate` can access the updated but not yet displayed DOM, while `useUpdated` operates on the new DOM state that has been presented to the user.

## Usage

`useUpdated` accepts a parameterless callback function and a dependency array. The callback will execute after a component re-render (excluding the first render) caused by dependency changes.

### 1. Responding to specific state updates

Execute logic only after updates caused by changes in `count`, avoiding triggers from unrelated state changes:

```jsx
import { useUpdated } from 'react-vue3-hooks';
import { useState } from 'react';

const [count, setCount] = useState(0);

useUpdated(() => {
  // Executes only after component updates caused by count changes
  console.log('Count updated, DOM painted');
  analytics.track('count_changed', { newValue: count });
}, [count]); // Explicitly declare dependencies
```

### 2. Third-party library state synchronization

Synchronize updates to externally managed third-party library instances after specific data updates:

```jsx
const [markers, setMarkers] = useState([]);

useUpdated(() => {
  // After the markers array changes and the component updates, synchronize to the map instance
  mapInstance.setMarkers(markers);
}, [markers]); // Precisely control the trigger timing
```

### 3. Manipulating updated DOM

Perform operations that require the user to perceive new content after dependencies have been updated and visually rendered:

```jsx
import { useUpdated } from 'react-vue3-hooks';
import { useRef } from 'react';

const listRef = useRef();
const [items, setItems] = useState([]);

useUpdated(() => {
  // After items are updated and displayed, scroll to the newly added last element
  const lastElement = listRef.current?.lastElementChild;
  lastElement?.scrollIntoView({ behavior: 'smooth' });
}, [items.length]); // Trigger only when the list length changes
```

### 4. Asynchronous operations

Supports `async` functions to start asynchronous tasks after specific dependencies are updated:

```jsx
useUpdated(async () => {
  // Re-validate form state after formData changes
  const validation = await validateForm(formData);
  setValidationErrors(validation);
}, [formData]); // Avoid duplicate validation from unrelated state changes
```

## Differences from Vue

**Core difference**: This hook is not an exact reproduction of Vue's `onUpdated`, but a behavioral simulation under React's constraints.

| Feature | Vue `onUpdated` | `useUpdated` |
|---------|----------------|-------------|
| **Trigger condition** | Updates caused by **any reactive data change** | Updates caused by **changes in the dependency array only** (explicitly declared) |
| **Dependency tracking** | Automatically tracks all reactive references | **No tracking** (manual declaration required) |
| **Execution timing** | After DOM update, **synchronous** | After DOM update and **asynchronous after painting** |
| **DOM access** | **Can access new DOM** | **Can access new DOM** |
| **Performance impact** | Precisely triggered, no redundant calls | **Avoids excessive triggers** |

**Core difference**: Vue's `onUpdated` is precisely driven by the reactive system, triggering only when related data changes; while `useUpdated`'s trigger condition is "changes in the explicitly specified dependency array". This is more in line with React's philosophy of explicit data flow but requires developers to accurately declare dependencies.

## Notes

- **Dependency accuracy**: All dependencies must be accurately declared. Omissions will cause the callback not to trigger, while redundancies will lead to unnecessary executions. It is recommended to use the ESLint `react-hooks/exhaustive-deps` rule for assistance.
- **Choosing between `useBeforeUpdate` and `useUpdated`**: If operations need to be completed **before visual rendering** (such as calculating layouts, comparing differences between old and new DOM), prioritize `useBeforeUpdate`. This hook is suitable for post-rendering responses that **do not block painting** (such as logging, synchronizing external states).
- **SSR environment**: In server-side rendering, `useEffect` does not execute, so `useUpdated` will not trigger during SSR. Ensure the initial rendering results are consistent between the client and server to avoid hydration errors.
- **Performance optimization**: For frequently changing dependencies (such as mouse position), consider debouncing or throttling to avoid heavy computation in the callback.
