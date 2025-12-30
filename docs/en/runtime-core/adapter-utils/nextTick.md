# nextTick

In React, we don't need to wait for a DOM update queue controlled by the framework like in Vue. We just need to wait for the current synchronous code to finish executing, allowing React's scheduler to have a chance to run. The microtask timing provided by `Promise.resolve()` perfectly meets this requirement.

## Core Features

- **Wait for DOM Updates:** The main function is to ensure that when the callback is executed, the DOM has reflected the latest state changes.
- **Promise Support:** If no callback function is provided, `nextTick` will return a `Promise`, allowing the use of `async/await` syntax.
- **Precise Timing:** Internally, it gracefully degrades to use `Promise.resolve()`, `requestAnimationFrame`, `MutationObserver`, and finally falls back to `setTimeout(0)` to ensure the fastest asynchronous timing.

## Usage

### 1. Waiting for DOM Updates

Commonly used when after a state update, you need to immediately access or manipulate the updated DOM elements.

```jsx
import { $useState, nextTick } from 'react-vue3-hooks';

const [items, setItems] = useState$([]);
const listRef = useRef(null);

const addItem = async () => {
  // 1. Update state, trigger re-rendering
  setItems(draft => {
    draft.push('New Item');
  });
  // 2. Wait for DOM update to complete
  await nextTick(); 

  // 3. Manipulate elements after ensuring DOM is updated
  listRef.current.scrollTop = listRef.current.scrollHeight;
};
```

### 2. Using a Callback Function

You can also pass a callback function to be executed after the DOM update is completed.

```jsx
setItems(draft => {
  draft.push('New Item');
});

nextTick(() => {
  // The DOM has been updated at this point
  listRef.current.scrollTop = listRef.current.scrollHeight;
});
```
