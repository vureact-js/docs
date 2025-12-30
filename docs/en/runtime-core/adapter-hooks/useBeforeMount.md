# useBeforeMount

`useBeforeMount` corresponds to the `onBeforeMount` lifecycle hook in Vue 3.

It provides a React component hook that executes **closest** to the timing of Vue's `onBeforeMount`, running synchronously once after DOM mounting is complete but before the browser paints.

## Core Features

- **Closest Semantic Mapping**: Utilizes React's `useLayoutEffect` to simulate Vue's "before mount" phase, taking advantage of its execution timing after DOM updates but before browser painting. Note that in React, the DOM exists in memory but has not yet been rendered to the screen.
- **Synchronous Execution**: Blocks the browser's painting process, ensuring DOM measurements or state calculations are completed before visual updates to avoid layout flickering.
- **Single Execution**: An empty dependency array (`[]`) ensures the callback function runs only once during the entire component lifecycle.
- **Essential Difference from useMounted**: `useMounted` uses `useEffect` (asynchronously executes after painting), while `useBeforeMount` uses `useLayoutEffect` (synchronously executes before painting), with a browser painting cycle between them.

## Usage

`useBeforeMount` accepts a synchronous or asynchronous callback function, which will execute during the initial component rendering, after DOM mounting but before painting.

### 1. Synchronous DOM Measurement

Suitable for scenarios where reading DOM geometric properties before browser painting is needed to prevent users from seeing intermediate states:

```jsx
import { useBeforeMount } from 'react-vue3-hooks';

useBeforeMount(() => {
  const height = ref.current?.offsetHeight;
  // Calculate state based on DOM dimensions to ensure correctness on first render
  setComponentHeight(height || 0);
});
```

### 2. Asynchronous Initialization

Supports `async` functions, but note that the **synchronous blocking** feature still applies; the painting will be released only after the asynchronous operation is initiated:

```jsx
useBeforeMount(async () => {
  // Although the callback is async, the hook itself executes synchronously
  // Suitable for initiating critical data requests before painting
  const data = await fetchCriticalData();
  setInitialData(data);
});
```

### 3. Difference from Vue

**Important**: There is an inherent timing difference between React's `useLayoutEffect` and Vue's `onBeforeMount`:

| Stage | Vue `onBeforeMount` | `useBeforeMount` |
|-------|-------------------|------------------|
| DOM State | Not mounted to document | Mounted, not painted |
| Execution Timing | Before mounting, synchronous | After DOM update, before painting, synchronous |
| DOM Access | Not accessible | **Accessible** (key difference) |

Therefore, `useBeforeMount` is closer to Vue's **"DOM ready but not displayed"** phase rather than the strict "before mount" phase. In most scenarios (such as measurement after SSR hydration, initial layout setup), its behavior is consistent with Vue's expectations.

## Notes

- **Avoid Heavy Computation**: `useLayoutEffect` blocks painting, so the callback function should be lightweight to avoid long synchronous calculations.
- **SSR Environment**: `useLayoutEffect` does not execute in server-side rendering; handle hydration differences yourself.
- **Choosing Between `useMounted` and `useBeforeMount`**: Prefer `useMounted` for operations that do not need to block painting (such as logging, initializing external libraries).
