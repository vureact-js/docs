# useReadonly

`useReadonly` corresponds to the `readonly()` API in Vue 3, used to create immutable reactive data.

It achieves immutability through **deep freezing** of objects, rather than Vue's reactive proxy mechanism. Any modification to the returned object will throw an error in strict mode or fail silently in non-strict mode.

## Core Features

- **Deep Freezing**: Uses `klona` for deep cloning + `freeze-mutate` for recursive freezing to ensure all nested levels of the object are unmodifiable. This is a **runtime simulation** of Vue's `readonly()`, not protection at the compilation or proxy layer.
- **Factory Function Support**: Accepts an object or a factory function as the initial state. The factory function executes once during the first rendering to avoid repeated object creation on each render.
- **Shallow Freezing Mode**: Only freezes the first layer of the object with the `shallow: true` parameter, while deep properties can still be modified, offering better performance than full deep freezing.
- **Essential Difference from Vue**: Vue's `readonly()` returns a **reactive proxy object** that can interact with other reactive APIs; this Hook returns a **pure frozen object** without reactive capabilities, providing only runtime immutability guarantees.
- **Caching Optimization**: Uses `useMemo` to cache the frozen result, ensuring the same reference is returned when dependencies remain unchanged, avoiding unnecessary component re-renders.

## Usage

### 1. Protecting Configuration Objects

Create immutable global configurations to prevent accidental runtime modifications:

```jsx
import { useReadonly } from 'react-vue3-hooks';

const config = useReadonly({
  apiBase: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
});

// Modifications will throw an error (strict mode)
// config.timeout = 10000; // ❌ TypeError: Cannot assign to read only property
```

### 2. Initialization with Factory Functions

When the initial state requires complex calculations, use a factory function to avoid repeated computations:

```jsx
const initialData = useReadonly(() => {
  // Executes only once when the component mounts, reuses the frozen result in subsequent renders
  const data = generateComplexInitialData();
  return deepProcess(data);
});

// initialData remains immutable throughout
```

### 3. Shallow Freezing Optimization

Freeze only the top level for large objects to improve performance while allowing modification of internal properties:

```jsx
const largeObject = useReadonly(
  {
    id: 1,
    data: { nested: { value: 100 } }, // The nested property can still be modified
  },
  true // Enable shallow freezing
);

// Only the top level is unmodifiable
// largeObject.id = 2; // ❌ Error

// Deep properties can be modified (immutability must be ensured manually)
largeObject.data.nested.value = 200; // ✅ Allowed
```

### 4. Providing Immutable Data with Context

Provide global immutable state in a Context Provider:

```jsx
function ConfigProvider({ children }) {
  const config = useReadonly({
    theme: 'light',
    locale: 'zh-CN',
  });

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
}
```

## Difference from Vue

**Core Difference: Freezing vs Proxy**

| Feature | Vue `readonly()` | `useReadonly` |
|---------|-----------------|---------------|
| **Implementation Mechanism** | **Proxy** (reactive tracking) | **Object.freeze()** (runtime freezing) |
| **Reactive Capability** | ✅ **Preserved** (can trigger re-renders) | ❌ **Completely lost** (pure static data) |
| **Nested Protection** | **Recursive proxy** (automatic deep protection) | **Deep clone + freeze** (memory overhead) |
| **Modification Behavior** | Dev environment warnings + strict mode errors | **Silent failure** (non-strict) or **TypeError** (strict) |
| **Usage Scenarios** | Creating read-only reactive data | Creating immutable static configurations |

**Key Limitations**:

1. **Non-reactive**: The returned object is **completely static**, and modifications will not trigger component re-renders. If reactive read-only data is needed, use `useState$` with the `readonly()` option instead of this Hook.

2. **Memory Overhead**: Deep cloning creates a full deep copy of the object, which may cause significant memory usage and performance loss for large objects. Re-cloning and freezing occur every time the `initialState` reference changes.

3. **Runtime Protection**: Vue's `readonly()` provides friendly warnings and tracking in the development environment; this Hook relies solely on the native freezing behavior of the JavaScript engine, throwing TypeError in strict mode and failing silently in non-strict mode.

## Notes

- **Avoid Frequent Reconstruction**: Ensure the `initialState` or factory function reference is stable. Passing a new object on each render will cause repeated deep cloning, severely affecting performance. It is recommended to extract the initial state outside the component or cache it with `useMemo`.

- **Shallow Freezing Trade-off**: `shallow: true` improves performance but only freezes top-level properties, while deep objects can still be modified. Manual assurance of deep immutability is required; otherwise, the "read-only" semantics will be violated.

- **Relationship with `useMemo`**: This Hook internally uses `useMemo`, so no additional wrapping is needed. The dependency array `[initialState, shallow]` ensures re-freezing only when inputs change.

- **Non-strict Mode Risks**: In code with strict mode disabled, modifications to frozen objects will fail silently, potentially leading to hard-to-debug logic errors. It is recommended to use it with the `Readonly<T>` type in TypeScript for compile-time protection.

- **SSR Safety**: Freezing works normally on both the server and client sides, but ensure `initialState` is consistent between server and client to avoid repeated freezing due to different references during hydration.

- **Alternatives**: If only protection against accidental modification is needed without deep cloning (e.g., when the object is already immutable), directly using `Object.freeze()` or the `as const` assertion may be more efficient.
