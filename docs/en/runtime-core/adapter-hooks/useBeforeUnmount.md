# useBeforeUnMount

`useBeforeUnMount` corresponds to the `onBeforeUnmount` lifecycle hook in Vue 3.

It synchronously executes cleanup logic once before a component is unmounted, after the DOM node has been removed from the document, and before the browser repaints. It is the implementation in React that most closely approximates the timing of Vue's `onBeforeUnmount`.

## Core Features

- **Precise Timing Control**: Utilizes the cleanup function of `useLayoutEffect` to execute synchronously after DOM changes but before the browser repaints. At this point, React has completed the DOM unmounting operation, but the browser has not yet rendered the changes to the screen, making it suitable for performing final cleanup related to the existence of the DOM.
- **Synchronous Execution**: Blocks the browser's painting process, ensuring that critical operations such as state saving and resource release are completed before visual updates, avoiding race conditions.
- **Essential Difference from `useUnmounted`**: `useUnmounted` uses `useEffect` (asynchronously executed after painting), while `useBeforeUnMount` uses `useLayoutEffect` (synchronously executed before painting). The two are separated by a browser painting cycle, which is crucial for scenarios requiring precise control over the DOM lifecycle boundaries.
- **DOM Existence**: When executed, the component's DOM has been removed from the document tree but has not yet been garbage collected by the browser. At this point, reading DOM dimensions or positions will return `null` or `0`.

## Usage

`useBeforeUnMount` accepts a synchronous or asynchronous callback function, which will be executed after the component is unmounted and the DOM is removed but before repainting.

### 1. Synchronous Resource Cleanup

Suitable for releasing resources that must be handled synchronously before component unmounting (such as removing event listeners, canceling animation frames):

```jsx
import { useBeforeUnMount } from 'react-vue3-hooks';

useBeforeUnMount(() => {
  // Cancel the animation before the browser paints to avoid residual animation of the unmounted component in the next frame
  cancelAnimationFrame(animationRef.current);
  
  // Remove the global event listener on the document
  document.removeEventListener('scroll', handleScroll);
});
```

### 2. Persistent State Saving

Before the component is completely destroyed, synchronously write the final state to local storage or send it to the server:

```jsx
useBeforeUnMount(() => {
  // Immediately save user input progress to localStorage before component unmounting
  localStorage.setItem('draft', JSON.stringify(formData));
  
  // Synchronously record buried points (needs to be completed before visual disappearance)
  analytics.track('component_unmount', { timestamp: Date.now() });
});
```

### 3. Asynchronous Cleanup Operations

Supports `async` functions, but it is necessary to understand its synchronous calling characteristics - the browser will continue painting after initiating the asynchronous task:

```jsx
useBeforeUnMount(async () => {
  // Start asynchronous data synchronization before the component disappears
  // Although the asynchronous operation is completed in the background, the synchronous part of the cleanup function has blocked painting
  await syncUnsavedChanges();
});
```

## Explanation of Differences from Vue

**Important**: There is an essential timing difference between React's `useLayoutEffect` cleanup and Vue's `onBeforeUnmount`:

| Stage | Vue `onBeforeUnmount` | `useBeforeUnMount` |
|-------|---------------------|-------------------|
| DOM State | Still exists in the document tree | **Already removed from the document** (key difference) |
| Execution Timing | Before unmounting, synchronous | After DOM removal, before painting, synchronous |
| Access to DOM | **Accessible** (measure, read final state) | Not accessible (reading returns `null`) |

Therefore, `useBeforeUnMount` is closer to Vue's **"DOM has been unmounted but not visually confirmed"** stage. For scenarios that require "one last look at the DOM" (such as recording the scroll position before unmounting), `useUnmounted` should be used together with `ref` to capture the state in advance.

## Notes

- **Avoid Heavy Computation**: `useLayoutEffect` will block painting, so the cleanup function should be lightweight and avoid synchronously executing time-consuming operations.
- **SSR Environment**: In server-side rendering, neither `useLayoutEffect` nor its cleanup will execute, and hydration differences need to be handled manually.
- **Choosing Between `useUnmounted` and This**: If the cleanup logic **does not depend on the existence of the DOM** (such as unsubscribing, clearing timers), prefer `useUnmounted` to avoid blocking painting. Use this hook only in strong synchronization scenarios that require "ensuring completion before visual disappearance".