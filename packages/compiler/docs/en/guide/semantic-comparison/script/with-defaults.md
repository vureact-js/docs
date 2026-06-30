# withDefaults Semantic Comparison

What does the Vue `withDefaults` compile macro produce when compiled by VuReact, and how does it map to React code?

## Prerequisites

To avoid misunderstandings caused by redundant example code, let's first clarify two conventions:

1. Vue and React code snippets only show the core logic; unrelated component wrappers and configuration are omitted.
2. The reader is already familiar with the Vue 3 `withDefaults` API and its core behavior.

## `withDefaults(defineProps<T>(), defaults)` → `useMemo` Default Value Merging

`withDefaults` is a Vue 3 `<script setup>` helper used to provide compile-time default values for props declared by `defineProps`. In Vue, `withDefaults` generates default value logic at compile time, ensuring that props not passed by the parent still have default values. VuReact compiles it into `useMemo`, **merging the incoming props with the defaults at component initialization to produce a read-only props object containing all default values**.

- Vue code:

```ts
interface Props {
  msg?: string;
  count?: number;
  labels: string[];
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  count: 42,
  labels: () => ['one', 'two'],
});
```

- VuReact compiled React code:

```tsx
import { useMemo, memo } from 'react';

interface Props {
  msg?: string;
  count?: number;
  labels: string[];
}

export type ICompProps = Props;

const Input = memo((vrProps: ICompProps) => {
  /* from withDefaults */
  const props = useMemo<Readonly<Props>>(() => ({
    ...vrProps,
    msg: vrProps.msg ?? 'hello',
    count: vrProps.count ?? 42,
    labels: vrProps.labels ?? ['one', 'two'],
  }), [vrProps]);

  return (
    <>
      <div>{props.msg}{props.count}</div>
      <ul>
        {props.labels.map(value => <li key={value}>{value}</li>)}
      </ul>
    </>
  );
});

export default Input;
```

As shown above, Vue's `withDefaults` is compiled into React's `useMemo` combined with the nullish coalescing operator `??`. It consists of three parts:

1. **Type preservation** → The `Props` interface is kept as-is; **default values do not alter optional/required constraints**. `msg?` and `count?` remain optional;
2. **Default value merging** → `useMemo` uses the spread operator `...vrProps` to preserve all passed-in values, then applies `??` to each field with a default value as a fallback;
3. **Read-only guarantee** → `useMemo<Readonly<Props>>` ensures the returned props object is read-only, consistent with the runtime immutability of `withDefaults` in Vue.

## Unsupported `withDefaults` Usages

VuReact explicitly does not support the following `withDefaults` usages; they cause compile-time errors:

### 1. Not Assigned to a Variable

`withDefaults()` must be assigned to a variable (e.g., `const props = withDefaults(...)`); it cannot be used as a standalone expression call:

```vue
<script setup lang="ts">
// Unsupported syntax
withDefaults(defineProps<Props>(), { msg: 'hello' });
</script>
```

```vue
<script setup lang="ts">
// Supported syntax
const props = withDefaults(defineProps<Props>(), { msg: 'hello' });
</script>
```

### 2. First Argument Not a `defineProps()` Call

The first argument to `withDefaults()` must be a `defineProps()` call expression; other expressions are not supported:

```vue
<script setup lang="ts">
// Unsupported syntax
const props = withDefaults({ msg: 'hello' });
</script>
```

```vue
<script setup lang="ts">
// Supported syntax
const props = withDefaults(defineProps<Props>(), { msg: 'hello' });
</script>
```

### 3. Second Argument Not an Object Literal

The second argument to `withDefaults()` must be an inline object literal; variable references or other expressions are not supported:

```vue
<script setup lang="ts">
// Unsupported syntax
const defaults = { msg: 'hello' };
const props = withDefaults(defineProps<Props>(), defaults);
</script>
```

```vue
<script setup lang="ts">
// Supported syntax
const props = withDefaults(defineProps<Props>(), { msg: 'hello' });
</script>
```

## Primitive Type Defaults → `??` Nullish Coalescing

For primitive types like `string` and `number`, VuReact directly uses the `??` nullish coalescing operator:

- Vue code:

```ts
const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  count: 42,
});
```

- VuReact compiled React code:

```tsx
const props = useMemo<Readonly<Props>>(() => ({
  ...vrProps,
  msg: vrProps.msg ?? 'hello',
  count: vrProps.count ?? 42,
}), [vrProps]);
```

Primitive default values are placed directly as literals on the right side of `??`, **taking effect only when the parent does not pass the prop (i.e., `undefined`)**.

## Reference Type Defaults → Factory Function Invocation

For reference types such as arrays and objects, Vue's `withDefaults` requires using a factory function (e.g., `() => ['one', 'two']`) to prevent multiple instances from sharing the same reference. VuReact follows the same convention, **directly invoking the factory function on the right side of `??` to produce a unique instance on each render**:

- Vue code:

```ts
const props = withDefaults(defineProps<Props>(), {
  labels: () => ['one', 'two'],
});
```

- VuReact compiled React code:

```tsx
const props = useMemo<Readonly<Props>>(() => ({
  ...vrProps,
  labels: vrProps.labels ?? ['one', 'two'],
}), [vrProps]);
```

**VuReact ensures that the factory function on the right side of `??` returns a new instance each time, avoiding side effects caused by shared references.**

## Complete `withDefaults` Example

For a full before-and-after comparison of a single-file component using `withDefaults`, refer to the code below:

- Vue code:

```vue
<script setup lang="ts">
interface Props {
  msg?: string;
  count?: number;
  labels: string[];
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  count: 42,
  labels: () => ['one', 'two'],
});
</script>

<template>
  <div>{{ props.msg }} {{ props.count }}</div>
  <ul>
    <li v-for="value in props.labels" :key="value">{{ value }}</li>
  </ul>
</template>
```

- VuReact compiled React code:

```tsx
import { useMemo, memo } from 'react';

interface Props {
  msg?: string;
  count?: number;
  labels: string[];
}

export type ICompProps = Props;

const Input = memo((vrProps: ICompProps) => {
  /* from withDefaults */
  const props = useMemo<Readonly<Props>>(() => ({
    ...vrProps,
    msg: vrProps.msg ?? 'hello',
    count: vrProps.count ?? 42,
    labels: vrProps.labels ?? ['one', 'two'],
  }), [vrProps]);

  return (
    <>
      <div>{props.msg}{props.count}</div>
      <ul>
        {props.labels.map(value => <li key={value}>{value}</li>)}
      </ul>
    </>
  );
});

export default Input;
```
