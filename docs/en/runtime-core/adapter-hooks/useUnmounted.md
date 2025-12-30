# useUnmounted

`useUnmounted` corresponds to the `onUnmounted` lifecycle Hook in Vue 3.

It asynchronously executes cleanup logic once after the component is unmounted, DOM nodes are removed from the document, and the browser has finished rendering. It is the standard implementation of Vue's "after unmount" phase in React.

## Core Features

- **Final cleanup timing**: Implemented based on the `useEffect` cleanup function, it executes asynchronously after the DOM is unmounted and the browser has completed rendering. At this point, the component has completely disappeared from the view layer, making it suitable for performing final resource release that is not associated with the DOM.
- **Asynchronous execution**: It does not block the browser's rendering process. The visual feedback of unmounting is prioritized, and the cleanup logic is completed in the background event loop, ensuring a smooth user experience.
- **Essential difference from `useBeforeUnMount`**: `useBeforeUnMount` uses `useLayoutEffect` (executed synchronously before rendering), while this Hook uses `useEffect` (executed asynchronously after rendering). There is a complete browser rendering cycle between them, forming an asynchronous closed loop of "before unmount → after unmount". They are not interchangeable in scenarios that require precise control over the DOM lifecycle.
- **DOM inaccessibility**: When executing, the component's DOM nodes have not only been removed from the document tree but also the browser has completed layout calculations and rendering. Accessing any DOM references at this time will return `null` or trigger an error.

## Usage

`useUnmounted` accepts a synchronous or asynchronous callback function, which will be executed after the component is unmounted and the browser rendering is completed.

### 1. Asynchronous resource cleanup

Suitable for resource release that does not need to block the visual feedback of unmounting (such as canceling timers, cleaning up WebSocket connections):

```jsx
import { useUnmounted } from 'react-vue3-hooks';
import { useRef } from 'react';

const socketRef = useRef(null);

useUnmounted(() => {
  // Close the WebSocket after the component has completely disappeared without affecting the smoothness of the unmount animation
  socketRef.current?.close();
  
  // Clear all unfinished timers
  timers.forEach(clearTimeout);
});
```

### 2. Final log recording

Record performance metrics or user behavior data after the component's lifecycle has completely ended:

```jsx
useUnmounted(() => {
  // Asynchronously send buried points after the component is unmounted without blocking the main thread
  analytics.track('component_destroy', {
    duration: Date.now() - mountTime,
    finalState,
  });
});
```

### 3. Cross-component state cleanup

Clean up residual references in global or shared state after the parent component is unmounted:

```jsx
useUnmounted(() => {
  // Remove the registration of the current component from the global state manager
  store.unregister(componentId);
  
  // Clean up references saved in Context (if any)
  context.setActiveComponent(null);
});
```

### 4. Asynchronous operation support

Supports `async` functions to start asynchronous cleanup tasks after the component is unmounted:

```jsx
useUnmounted(async () => {
  // Asynchronously save unfinished drafts after the component disappears
  await saveDraftToServer(draftData);
  
  // Delay cleaning up temporary data in IndexedDB
  await cleanupTemporaryStorage();
});
```

## Explanation of differences from Vue

**Core difference**: There is a slight timing difference between this Hook and Vue's `onUnmounted`, but the behavior has no impact on most scenarios.

| Stage | Vue `onUnmounted` | `useUnmounted` |
|-------|-------------------|----------------|
| DOM state | Removed from document | Removed from document |
| Execution timing | After unmount, **synchronous** | After unmount, **asynchronous after rendering** |
| DOM access | **Inaccessible** | **Inaccessible** |
| Blocking | Blocks subsequent cleanup processes | **Non-blocking** (performance advantage) |

**Practical impact**: Vue's `onUnmounted` is synchronous. If time-consuming operations are performed in the callback, it will delay the time when the component is completely destroyed; while the asynchronous nature of `useUnmounted` ensures that the visual feedback of unmounting is completed first, and the cleanup logic is executed in the background, which is more suitable for modern Web applications that need to maintain smooth interaction.

## Guide for choosing between `useBeforeUnMount` and `useUnmounted`

| Scenario characteristics | `useBeforeUnMount` | `useUnmounted` |
|--------------------------|--------------------|----------------|
| **Need to "take one last look" at the DOM** | ✅ Executed before rendering, DOM just removed but not cleaned up | ❌ DOM has been completely recycled |
| **Cleanup must be completed before visual disappearance** | ✅ Synchronous blocking to ensure order | ❌ Asynchronous, cannot guarantee timing |
| **Resource release can be delayed** | ❌ Blocks rendering | ✅ Asynchronous execution, optimal performance |
| **Save DOM-related states** (such as scroll position) | ✅ Can read before cleanup | ❌ Reading DOM returns null |
| **Operations** | Remove global events, cancel animation frames | Close connections, clean up caches |

**Decision principle**: If the cleanup logic **depends on the existence of the DOM** or **must be completed before visual disappearance**, use `useBeforeUnMount`; if the cleanup logic is **pure resource release** and **can be delayed asynchronously**, use `useUnmounted` for better performance.

## Notes

- **Avoid DOM access**: When executing, the component's DOM has been completely removed. Accessing `ref.current` will return `null`, and any DOM operations will be invalid or report errors.
- **SSR environment**: In server-side rendering, `useEffect` and its cleanup will not be executed. It is necessary to ensure the consistency of the initial state between the server and the client to avoid hydration errors.
- **Risk management of asynchronous operations**: Although `async` functions are supported, the component may completely release memory before the asynchronous operation is completed. It is recommended to perform fault-tolerant processing on asynchronous cleanup operations and avoid initiating new state updates or side effects in `useUnmounted`.
- **Cleanup order**: In the same component, the callback of `useBeforeUnMount` will be executed before `useUnmounted`, forming the order of "synchronous cleanup → asynchronous cleanup". If there are resource dependencies, ensure the correct cleanup order.
