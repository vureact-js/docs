# v-memo & v-once Semantic Comparison

How do Vue's frequently used `v-memo` and `v-once` directives in templates transform into React code after semantic compilation?

## Prerequisites

To avoid redundancy in example code and ensure clear understanding, let's establish two conventions:

1. Vue/React code examples in this document are simplified core logic, omitting full component wrappers and unrelated configurations.
2. Readers are assumed to be familiar with the usage of v-memo and v-once directives in Vue 3.

## `v-memo` → React `useMemo` Conditional Memoization

`v-memo` is a performance optimization directive introduced in Vue 3.2+, used to determine whether to re-render components or elements based on changes in the dependency array. Re-rendering only triggers when dependencies change.

- Vue code:

```vue
<Comp v-memo="[a, b]"> ... </Comp>
```

- VuReact compiled React code:

```jsx
{
  useMemo(() => <Comp>...</Comp>, [a, b]);
}
```

As shown in the example: Vue's `v-memo` directive is compiled into React's `useMemo` Hook. VuReact adopts a **memoization compilation strategy**, converting template directives to React's performance optimization Hook, **fully preserving Vue's conditional memoization semantics**—recalculating and rendering the `<Comp>` component only when `a` or `b` changes.

Key characteristics of this compilation approach:

1. **Semantic consistency**: Fully mimics Vue `v-memo` behavior, performing conditional rendering based on dependency array
2. **Performance optimization**: Avoids unnecessary component re-renders, improving application performance
3. **React native support**: Uses React's built-in `useMemo` Hook without additional runtime

**Core working principle**:

- Vue's `v-memo`: Compares values in the dependency array, skipping subtree updates if all values are equal (using `Object.is` comparison)
- React's `useMemo`: Compares dependency array, returns cached rendering result if dependencies haven't changed

## `v-once` → React `useMemo` Empty Dependency Static Rendering

`v-once` is Vue's directive for one-time rendering, where elements or components are calculated and rendered only during initial rendering, never updating even if data changes.

- Vue code:

```vue
<Comp v-once />
```

- VuReact compiled React code:

```jsx
{
  useMemo(() => <Comp />, []);
}
```

As shown in the example: Vue's `v-once` directive is compiled into React's `useMemo` Hook with an empty dependency array. VuReact adopts a **static memoization compilation strategy**, converting template directives to dependency-free `useMemo`, **fully preserving Vue's one-time rendering semantics**—components are calculated only once during initial rendering, returning cached results forever after.

Key characteristics of this compilation approach:

1. **Semantic consistency**: Fully mimics Vue `v-once` behavior, achieving true one-time rendering
2. **Extreme performance optimization**: Completely avoids subsequent re-renders for optimal performance
3. **Static content optimization**: Particularly suitable for static content that never changes
4. **React native implementation**: Uses `useMemo` with empty dependency array for one-time caching

**Core working principle**:

- Vue's `v-once`: Marks elements/components as static, skipping all subsequent reactive updates
- React's `useMemo` empty dependency: Calculates only once during component mounting, returns cached value directly in subsequent renders

## `v-memo` vs `v-once` Comparison

| Feature                  | v-memo                                      | v-once                               |
| ------------------------ | ------------------------------------------- | ------------------------------------ |
| **Vue semantics**        | Conditional memoization rendering           | One-time static rendering            |
| **React equivalent**     | `useMemo(fn, deps)`                         | `useMemo(fn, [])`                    |
| **Re-render condition**  | When dependencies change                    | Never re-renders                     |
| **Applicable scenarios** | Optimization for specific data dependencies | Completely static content            |
| **Performance impact**   | Reduces unnecessary renders                 | Completely avoids subsequent renders |
| **Flexibility**          | High (can specify dependencies)             | Low (completely static)              |

VuReact's compilation strategy ensures smooth migration from Vue to React, eliminating the need for developers to manually rewrite performance optimization logic. The compiled code maintains both Vue's semantics and optimization effects while adhering to React's performance best practices, preserving high performance in migrated applications.
