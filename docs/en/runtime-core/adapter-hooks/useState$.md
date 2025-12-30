# useState$

`useState$` corresponds to Vue 3's `ref` and `reactive` APIs, used to create reactive states.

It **intelligently selects** `useState` (for handling primitive values) or `useImmer` (for handling complex objects) based on the type of the initial value, simulating Vue's reactive semantics in React and supporting mutable updates through Draft mode.

## Core Features

- **Intelligent Type Selection**: Automatically detects the type of the initial value. Primitive values (`string`, `number`, `boolean`, `null`, `undefined`) use `useState`, while objects/arrays use `useImmer`, eliminating the need for manual judgment.
- **Immer Draft Mode**: For complex objects, it returns the `[state, update]` tuple from `useImmer`, supporting direct modification of nested properties via `draft` in the `update` callback, simulating Vue's mutable update experience.
- **Factory Function Support**: Accepts a function as the initial value, which is executed only once when the component mounts, avoiding repeated creation of complex initial states on each render.
- **Shallow Mode**: Force the use of `useState` with `shallow: true`, treating objects as a whole for replacement even if they are objects. Suitable for scenarios where deep mutable updates are not needed, with better performance.
- **Collection Type Support**: Enables Immer's `enableMapSet` plugin, natively supporting Draft mode updates for `Map` and `Set`.

## Usage

### 1. Primitive Value States (corresponding to Vue `ref`)

Basic types such as strings and numbers automatically use `useState`, returning a standard tuple:

```jsx
import { useState$ } from 'react-vue3-hooks';

const [count, setCount] = useState$(0); // Primitive value → useState
const [name, setName] = useState$('Alice');
const [visible, setVisible] = useState$(false);

// Usage is exactly the same as useState
setCount(prev => prev + 1);
setName('Bob');
```

### 2. Complex Object States (corresponding to Vue `reactive`)

Objects or arrays automatically use `useImmer`, with mutable updates via Draft:

```jsx
const [user, updateUser] = useState$({
  name: 'Alice',
  info: { age: 30, city: 'London' }
}); // Complex object → useImmer

// Directly modify nested properties via draft (no need for manual spreading)
updateUser(draft => {
  draft.info.city = 'Paris';        // ✅ Direct assignment
  draft.info.age = 31;              // ✅ Modify deep properties
  draft.tags.push('developer');     // ✅ Array mutation
});

// Note: Directly overwriting the entire object will lose nested reactivity
updateUser({ name: 'Bob' }); // ❌ Incorrect usage, replaces the entire state
```

### 3. Initialization with Factory Functions

When the initial state requires complex calculations, pass a function to avoid repeated execution:

```jsx
const [state, updateState] = useState$(() => {
  // Executed only once on mount
  const data = generateComplexInitialData();
  return deepProcess(data);
});
```

### 4. Shallow Mode to Force useState

Use `useState` for object types as well, replacing the entire object instead of Draft updates:

```jsx
const [config, setConfig] = useState$(
  { theme: 'light', locale: 'zh-CN' },
  true // shallow: true
);

// Must replace the entire object
setConfig({ theme: 'dark', locale: 'zh-CN' }); // ✅ Correct
// config.theme = 'dark'; // ❌ Invalid, object is frozen
```

### 5. Collection Types (Map/Set)

Supports Draft updates for Map/Set:

```jsx
const [userMap, updateMap] = useState$(new Map([['id', 1], ['name', 'Alice']]));

updateMap(draft => {
  draft.set('age', 30); // ✅ Directly operate on Map
  draft.delete('id');   // ✅ Delete key
});

const [tagSet, updateSet] = useState$(new Set(['admin', 'user']));

updateSet(draft => {
  draft.add('moderator'); // ✅ Add item
  draft.delete('user');   // ✅ Delete item
});
```

## Differences from Vue

**Core Difference: No Reactive Proxy and .value Access**

| Feature | Vue `ref/reactive` | `useState$` |
|---------|-------------------|-------------|
| **Implementation Mechanism** | **Proxy reactive proxy** | **useState / useImmer** |
| **Value Access** | `.value` access (ref) | **Direct access** (no .value) |
| **Update Method** | **Mutable** (automatically converted to immutable) | **Mutable** (Immer Draft) or **Immutable** (useState) |
| **Nested Reactivity** | **Deep reactivity** (automatic tracking) | **Draft mode** (explicit modification in callback) |
| **Performance** | **Proxy overhead** | **Immer structural sharing** |

**Key Distinctions**:

1. **No `.value`**: Vue's `ref` requires `.value` access, while this Hook returns the state value directly.

2. **Update Syntax Differences**:

   ```typescript
   // Vue (reactive)
   state.info.city = 'Paris' // Direct assignment, automatic tracking
   
   // useState$ (useImmer)
   updateUser(draft => {
     draft.info.city = 'Paris' // Must be in draft callback
   })
   ```

3. **No Reactive Proxy**: Vue's reactivity is fine-grained, only triggering re-renders for components that have actually accessed the state. Updates with `useImmer` will cause the entire component to re-render (based on React's rendering mechanism).

4. **Unification of Primitives and Objects**: Vue's `ref` handles all types uniformly. `useState$` automatically selects the underlying Hook based on the type, but the return value structure differs (`useState` returns `[value, setter]`, `useImmer` returns `[value, updater]`).

## Notes

- **Type Inference**: The return type `StateHook<S>` is automatically inferred based on whether `S` is a primitive value or an object. For complex objects, functional updates (`update(draft => {...})`) should be used instead of direct assignment.
- **Immer's Draft Limitations**: Modifications to `draft` in the Draft callback must be synchronous, not asynchronous. Immer generates an immutable new state immediately after the callback ends.
- **Choosing Shallow Mode**: For objects that don't require deep updates (such as configurations replaced entirely), use `shallow: true` to avoid unnecessary Immer overhead. If the object contains nested structures and requires partial updates, the default deep mode must be used.
- **Initial State Stability**: Using a factory function `() => initialState` ensures the initial state is created only once. If an object literal is passed directly like `useState$(obj)`, a new object is created on each render (though it only takes effect the first time), which may cause issues with double invocations in React's strict mode.
- **SSR Compatibility**: `useImmer` works fine in server-side rendering, but ensure the initial state is consistent after serialization on both the server and client to avoid hydration errors. For large initial objects, lazy loading on the client is recommended.
- **Comparison with `useState`**: The value of this Hook lies in unifying the APIs for primitives and objects, reducing mental burden. If you know the state is a primitive value, using `useState` directly has slightly better performance (skipping type checks).
