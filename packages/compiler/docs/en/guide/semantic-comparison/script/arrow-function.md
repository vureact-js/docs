# Arrow Function Optimization Comparison

This section explains how **top-level arrow functions** in Vue are analyzed and automatically optimized into React code by VuReact.

## Assumptions

To keep the examples focused and avoid unnecessary noise:

1. Vue and React snippets only include core logic, omitting full component wrappers and unrelated configuration
2. Readers are expected to be familiar with top-level arrow functions in Vue 3 and dependency optimization patterns in React

## Top-Level Arrow Functions → React `useCallback`

In Vue `<script setup>`, top-level arrow functions are commonly used for event handlers, computed logic, or helper utilities.

During compilation, VuReact analyzes the external dependencies of these functions and transforms eligible ones into `useCallback`.

- Vue:

```vue
<script setup>
const inc = () => {
  count.value++;
};

const fn = () => {};

const fn2 = () => {
  const value = foo.value;
  const fn4 = () => {
    value + state.bar.c--;
  };

  fn();
};
</script>
```

- Compiled React (VuReact):

```tsx
const inc = useCallback(() => {
  count.value++;
}, [count.value]);

// Functions without dependencies are left untouched
const fn = () => {};

const fn2 = useCallback(() => {
  // Trace initial values and collect foo.value
  const value = foo.value;

  // Local functions are not optimized
  const fn4 = () => {
    value + state.bar.c--;
  };

  fn();
}, [foo.value, state.bar.c]);
```

From this example, you can see that VuReact automatically generates the `useCallback` dependency array — **no manual dependency management is required**.

## Key Points of Automatic Dependency Analysis

- **Only top-level arrow functions are considered**
  Local or nested functions are not transformed into `useCallback`

- **Dependency tracking follows React semantics**
  Only externally accessible reactive values are analyzed

- **Precise dependency collection**
  Accesses like `foo.value` or `state.bar.c` are explicitly included in the dependency array

- **Avoids over-optimization**
  Top-level arrow functions without external dependencies remain plain functions to prevent unnecessary Hook overhead
