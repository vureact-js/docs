# ESLint Rule Conflicts

When using VuReact's reactive hooks (`useVRef`, `useComputed`, `useReactive`, etc.), you may encounter ESLint warning about React Hooks rule conflicts. This is because Vue 3's reactive pattern differs from the design philosophy of React Hooks.

## Problem Manifestations

### 1. Error when modifying the `.value` property

```js
const count = useVRef(0);

// ❌ ESLint error: This value cannot be modified
count.value = 2;
```

### 2. Warning for incomplete dependency array

```js
useEffect(() => {
  console.log(count.value);
  // ⚠️ ESLint warning: missing dependency: 'count'
}, [count?.value]);
```

## Solutions

### Solution 1: Use ESLint comments (Recommended)

Add comments in the code to disable ESLint checks for specific lines:

```js
const count = useVRef(0);

// eslint-disable-next-line react-hooks/immutability
count.value = 2;

useEffect(() => {
  console.log(count.value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [count?.value]);
```

### Solution 2: Disable rules for the entire file

Add a comment at the top of the file to disable specific rules:

```js
/* eslint-disable react-hooks/exhaustive-deps */

const count = useVRef(0);
count.value = 2; // ✅ No more warnings

useEffect(() => {
  console.log(count.value);
}, [count?.value]); // ✅ No more warnings
```

### Solution 3: Modify ESLint configuration

Modify the project's ESLint configuration file:

```js
// eslint.config.js or .eslintrc.js
rules: {
  'react-hooks/exhaustive-deps': ['off'],
  'react-hooks/rules-of-hooks': ['off'],
},
```

## Why This Problem Occurs?

The reactive hooks provided by VuReact return Vue 3-style reactive objects, which are read and written via the `.value` property. However, ESLint's React Hooks rules expect the return values of hooks to be immutable.

## Notes

1. **Solution 1** (using comments) is the most flexible, allowing precise control over which code requires exceptions.
2. **Solution 2** (disabling file rules) is suitable for files with intensive use of Vue Reactivity hooks.
3. **Solution 3** (modifying configuration) is the simplest but completely disables the relevant rule checks.

## Example Code

### Before modification (with warnings)

```ts
const count = useVRef(1);
const add = useCallback(() => {
  // Error: This value cannot be modified
  count.value += 1;
  // Warning: missing dependency: 'count'
}, [count?.value]);
```

### After modification (no warnings)

```ts
const count = useVRef(1);
const toggleTheme = useCallback(() => {
  count.value += 1;
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [count?.value]);
```

## Summary

There is a conflict in design philosophy between VuReact's reactive hooks and ESLint's React Hooks rules. By adding ESLint comments or modifying the configuration, these warnings can be resolved and the code can run normally.
