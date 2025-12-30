# useMounted

`useMounted` corresponds to the `onMounted` lifecycle Hook in Vue 3.

It executes asynchronously once after a React component is first rendered to the DOM and the browser has finished painting. It is the most natural implementation of the "mounting completed" semantics in React.

## Core Features

- **Execution after browser painting**: Implemented based on `useEffect`, it is called asynchronously after the DOM is mounted and the browser completes the first painting, ensuring it does not block visual rendering. Suitable for non-urgent initialization tasks.
- **Executes only once**: The empty dependency array (`[]`) ensures the callback function runs only once throughout the component's lifecycle, precisely matching the "single execution after mounting" semantics of Vue's `onMounted`.
- **Friendly to asynchronous operations**: Supports passing `async` functions, but note that the synchronous part of the callback will execute immediately, while asynchronous operations will complete in subsequent event loops.
- **Essential difference from `useBeforeMount`**: `useBeforeMount` uses `useLayoutEffect` (executes synchronously before painting), while this Hook uses `useEffect` (executes asynchronously after painting). The two are separated by a browser painting cycle, forming a complete lifecycle of "before mounting → after mounting".

## Usage

`useMounted` accepts a synchronous or asynchronous callback function, which will execute after the component has completed its first rendering and been painted on the screen.

### 1. Asynchronous data fetching

Initiate an asynchronous data request immediately after the component is mounted to obtain initial data:

```jsx
import { useMounted } from 'react-vue3-hooks';
import { useState } from 'react';

const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useMounted(async () => {
  // Fetch initial data after component rendering to avoid blocking the first render
  const response = await fetch('/api/initial-data');
  const result = await response.json();
  setData(result);
  setLoading(false);
});
```

### 2. Third-party library initialization

Initialize third-party libraries that require DOM references (such as charts, maps) after the DOM is available and visual rendering is complete:

```jsx
import { useMounted } from 'react-vue3-hooks';
import { useRef } from 'react';
import Chart from 'some-charting-library';

const chartRef = useRef(null);

useMounted(() => {
  // DOM is stable, chart library can be safely initialized
  const chart = new Chart(chartRef.current);
  chart.render();
});
```

### 3. Non-blocking logging

Record component mounting events without affecting rendering performance:

```jsx
useMounted(() => {
  // Executes asynchronously, does not block the first render
  console.log('Component mounted');
  analytics.track('component_lifecycle', { event: 'mounted' });
});
```

## Difference from Vue

**Core difference**: There is a slight timing difference between this Hook and Vue's `onMounted`, but the behavior has no impact on most scenarios.

| Stage | Vue `onMounted` | `useMounted` |
|-------|----------------|-------------|
| DOM state | Mounted to document | Mounted to document |
| Execution timing | After mounting, **synchronously** | After mounting, **asynchronously after painting** (key difference) |
| DOM access | **Accessible** | **Accessible** |
| Blocking nature | Blocks subsequent initialization | **Does not block painting** (performance advantage) |

**Practical impact**: Vue's `onMounted` is synchronous. If time-consuming operations are performed in the callback, it will delay the time when the component finishes mounting. The asynchronous nature of `useMounted` ensures that the visual rendering of the component is not blocked, making it more suitable for modern web applications that need to maintain smooth interaction.

## Notes

- **Avoid DOM measurement**: Since it executes after browser painting, measuring the DOM at this time may cause brief flickering. If measurement or layout adjustment needs to be completed before painting, `useBeforeMount` should be used first.
- **SSR environment**: In server-side rendering, `useEffect` will not execute. It is necessary to ensure the consistency of the initial state between the server and the client to avoid hydration errors.
- **Choosing between `useBeforeMount` and `useMounted`**: If the operation needs to be completed **before visual rendering** (such as calculating layout, restoring scroll position), `useBeforeMount` is preferred. This Hook is suitable for post-initialization that **does not block painting** (such as data fetching, logging).
- **Risk management for asynchronous operations**: Although `async` functions are supported, the component may unmount before the asynchronous operation completes. It is recommended to use `AbortController` or cancellation token mechanisms to avoid memory leaks.
