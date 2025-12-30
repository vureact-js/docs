# useBeforeUpdate

`useBeforeUpdate` corresponds to the `onBeforeUpdate` lifecycle hook in Vue 3.

It synchronously executes a callback function after DOM updates are completed but before the browser paints, when component re-rendering is caused by changes in specified dependencies. It is the closest simulation of Vue's "before update" phase in React.

## Core Features

- **Dependency-driven updates**: An explicit dependency array (`deps`) must be declared, and the callback is triggered only when dependencies change. This is fundamentally different from Vue's reactive system that automatically tracks dependencies, embodying React's philosophy of explicit data flow.
- **Skip initial mount**: Ensures the callback does not execute during the component's initial rendering, strictly matching the semantics of Vue's `onBeforeUpdate` which "triggers only during updates".
- **Synchronous execution**: Uses `useLayoutEffect` to execute synchronously before the browser paints, allowing reading of the updated DOM state (such as new layout dimensions) at this stage. However, be cautious to avoid long-term blocking.
- **Timing relationship with `useUpdated`**: Executes before `useUpdated`, with a browser paint cycle between them, forming a complete lifecycle closed loop of "before update → after update".

## Usage

`useBeforeUpdate` accepts a callback function and a dependency array. The callback will execute before component updates caused by changes in dependencies.

### 1. Preprocessing before reactive data update

Execute preprocessing logic (such as calculating derived states) before DOM updates caused by specific state changes:

```jsx
import { useBeforeUpdate } from 'react-vue3-hooks';

const [count, setCount] = useState(0);
const [derived, setDerived] = useState(0);

useBeforeUpdate(() => {
  // Synchronously calculate the derived value before re-rendering caused by count changes
  // Ensure the latest derived value is used directly when DOM updates
  setDerived(count * 2);
}, [count]);
```

### 2. Measurement before DOM update

Read the current DOM state for comparison or saving before layout changes caused by dependency changes:

```jsx
const [list, setList] = useState([]);
const scrollRef = useRef();

useBeforeUpdate(() => {
  // Record the current scroll position before list data changes
  // Can restore scroll based on this value after update
  scrollPosition.current = scrollRef.current?.scrollTop;
}, [list.length]);
```

### 3. Asynchronous operations

Supports `async` functions, but it is necessary to understand their synchronous initiation characteristic — asynchronous tasks execute after the callback returns:

```jsx
useBeforeUpdate(async () => {
  // Start asynchronous validation before DOM update
  // Although validation completes asynchronously, the synchronous part has logged/set markers
  const isValid = await validateForm(formData);
  setValidation(isValid);
}, [formData]);
```

## Difference from Vue

**Key difference**: It is not an exact replica of Vue's `onBeforeUpdate`, but the best practice mapping under React's constraints.

| Feature | Vue `onBeforeUpdate` | `useBeforeUpdate` |
|---------|---------------------|-------------------|
| **Trigger condition** | Updates caused by any reactive data change | **Only when the dependency array changes** (explicitly declared) |
| **Dependency tracking** | Automatically tracks all reactive references | **Must manually specify** `deps` |
| **Initial rendering** | Does not trigger | **Skips the first time** |
| **Execution timing** | Before DOM update, synchronous | After DOM update, before painting, synchronous |
| **Access DOM** | **Can access old DOM** (before changes) | Can access new DOM (updated, not displayed) |

**Core difference**: Vue's `onBeforeUpdate` executes **before** DOM changes, at which point the DOM state before changes can be read; while `useBeforeUpdate` executes **after** DOM changes, and actually accesses the updated DOM. This is a fundamental limitation of React's rendering mechanism.

## Notes

- **Explicit dependency requirement**: All dependencies must be accurately declared. Omissions will cause the callback not to trigger, and redundancies will lead to unnecessary executions. It is recommended to use the ESLint `react-hooks/exhaustive-deps` rule for auxiliary checks.
- **Blocking risk**: `useLayoutEffect` will block browser painting. Avoid complex calculations or synchronous API calls in the callback, otherwise, it will significantly reduce interaction fluency.
- **SSR compatibility**: `useLayoutEffect` does not execute during server-side rendering. It is necessary to ensure the consistency of initial states between the server and the client to avoid hydration errors.
- **Selection between `useUpdated`**: If the logic **does not depend on the existence of DOM** (such as logging, data synchronization), prefer `useUpdated`. Only use this hook in strong synchronization scenarios that need to "complete before visual updates" or when needing to read the updated DOM.
