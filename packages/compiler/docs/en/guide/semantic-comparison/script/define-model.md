# defineModel Semantic Comparison

What does the Vue `defineModel` macro compile into in VuReact, and how does it map to React code?

## Preface

To avoid confusion from verbose examples, we make four assumptions:

1. Vue and React code snippets only show the core logic; unrelated component wrappers and configuration are omitted.
2. The reader is already familiar with the Vue 3 `defineModel` API and its core behavior.
3. Only the `type`, `default`, `required` options and custom prop names are supported.
4. Array destructuring of the return value is not supported.

## `defineModel` → `useVRef` + `useUpdated` Auto-Notification

`defineModel` is a Vue 3 `<script setup>` macro that simplifies the declaration of `v-model` two-way bindings. In Vue, `defineModel` automatically creates a `ref` and generates the corresponding `modelValue` prop and `update:modelValue` event. VuReact compiles it into [useVRef](https://runtime.vureact.top/en/guide/hooks/v-ref.html) to **convert the prop value into a reactive ref**, combined with [useUpdated](https://runtime.vureact.top/en/guide/hooks/updated.html) to **automatically trigger the `onUpdate:xxx` callback to notify the parent when the value changes**.

- Vue code:

```ts
// Declares a "state" prop, used by parent via v-model:state
const state = defineModel<string>('state');

// Declares a "modelValue" prop with options, used by parent via v-model
const modelValue = defineModel({ default: 'xxx' });
```

- VuReact compiled React code:

```tsx
type IChildProps = {
  state?: string;
  modelValue?: string;
} & {
  onUpdateState?: (arg: string) => void;
  onUpdateModelValue?: (arg: string) => void;
};

// Declares a "state" prop, used by parent via v-model:state
const state = useVRef<string>(props.state);

// Declares a "modelValue" prop with options, used by parent via v-model
const modelValue = useVRef<string>(props.modelValue ?? 'xxx');

// Automatically notifies parent when value changes
useUpdated(() => {
  props.onUpdateState?.(state.value);
}, [state.value]);

useUpdated(() => {
  props.onUpdateModelValue?.(modelValue.value);
}, [modelValue.value]);
```

As shown above, Vue's `defineModel` is decomposed into three parts:

1. **Prop type declaration** → Non-event fields in the `IChildProps` type (`state?`, `modelValue?`);
2. **Event callback declaration** → `onUpdateXxx` event callback fields in the `IChildProps` type;
3. **Runtime reactivity** → `useVRef` turns the initial prop value into a reactive ref, `useUpdated` watches for changes and automatically invokes the callback passed by the parent.

**VuReact ensures that directly modifying `.value` of a `defineModel` ref within the component triggers a parent update, exactly matching the Vue development experience.**

## `defineModel(name, options)` → Prop Declaration with Default Values and Type Constraints

`defineModel` accepts a `name` to specify the prop name, along with the `type`, `default`, and `required` options. VuReact converts these into corresponding React type constraints and default value handling:

- Vue code:

```ts
// Declares a "count" prop with options, used by parent via v-model:count
const count = defineModel<number>('count', {
  type: Number,
  default: 0,
  required: true,
});
```

- VuReact compiled React code:

```tsx
type IChildProps = {
  count: number;  // required: true → non-optional type
} & {
  onUpdateCount?: (arg: number) => void;
};

const count = useVRef<number>(props.count ?? 0); // default: 0 → fallback to default
```

As illustrated:

- `required: true` makes `count` required in the type definition (`count: number`) instead of optional (`count?: number`);
- `default: 0` is implemented via the `??` nullish coalescing operator, falling back to the default value `0` when the parent does not pass the prop;
- `type: Number` influences the generic type parameter (`<number>`), which VuReact uses to generate accurate TypeScript types.

## Unsupported `defineModel` Usages

VuReact explicitly does not support the following `defineModel` usages; they are skipped or cause compilation errors:

### 1. Array Destructuring of Return Value

```vue
<script setup lang="ts">
// Unsupported syntax (Vue 3.4+ experimental feature)
const [arg1, arg2] = defineModel();
</script>
```

Vue 3.4+ allows destructuring the `defineModel` return value into a `[model, modifiers]` tuple to access modifier state. VuReact does not currently support this syntax. Use the standard form instead:

```vue
<script setup lang="ts">
// Supported syntax
const model = defineModel();
</script>
```

### 2. get / set / validator Options

```vue
<script setup lang="ts">
// Unsupported syntax
const modelValue = defineModel({
  get() {},
  set() {},
  validator() {},
});
</script>
```

Vue's `defineModel` supports `get`, `set` custom accessors and a `validator` function. VuReact does not currently support these options. It is recommended to implement custom logic directly using `useVRef`.

## Assigning `.value` on `defineModel` → Consistent `.value` Modification with Vue

In Vue, `defineModel` returns a `ref` object, which must be accessed and modified via `.value`. In React, VuReact retains this `.value` access pattern after compilation:

- Vue code:

```ts
const state = defineModel<string>('state');

const update = () => {
  state.value = 'hello'; // directly assign
};
```

- VuReact compiled React code:

```tsx
const state = useVRef<string>(props.state);

const update = useCallback(() => {
  state.value = 'hello'; // directly assign, automatically triggers props.onUpdateState callback
}, [state.value]);
```

VuReact automatically wraps functions involving `state.value` with `useCallback` and correctly includes `state.value` in the dependency array, **allowing developers to keep Vue's assignment habits unchanged**. `state.value = 'hello'` simultaneously updates the component's internal state and synchronizes the two-way binding with the parent.

## `v-model` Template Binding → React Controlled Components

In Vue templates, `v-model` can directly bind to a ref declared by `defineModel`. In React, VuReact compiles this into the controlled component `value` + `onChange` pattern:

- Vue template:

```vue
<input v-model="modelValue" />
<div>Parent bound v-model is: {{ count }}</div>
<button @click="update">Increment</button>
```

- React compiled JSX:

```tsx
<input
  value={modelValue}
  onChange={(e) => {
    modelValue = e.target.value;
  }}
/>
<div>Parent bound v-model is:{count.value}</div>
<button onClick={update}>Increment</button>
```

`v-model` is translated by VuReact into the standard React controlled component pattern:

- `value` binds to the ref's value;
- `onChange` directly modifies the ref value, triggering `useUpdated` to automatically sync with the parent;

## Complete `defineModel` Example

For a full before-and-after comparison of a single-file component using `defineModel`, refer to the code below:

- Vue code (`input.vue`):

```vue
<script setup lang="ts">
// @vr-name: Child

// Declares a "state" prop, used by parent via v-model:state
const state = defineModel<string>('state');

// Declares a "modelValue" prop with options, used by parent via v-model
const modelValue = defineModel({ default: 'xxx' });

// Declares a "count" prop with options, used by parent via v-model:count
const count = defineModel<number>('count', {
  type: Number,
  default: 0,
  required: true,
});

const update = () => {
  state.value = 'hello';
  count.value++;
};
</script>

<template>
  <input v-model="modelValue" />
  <div>Parent bound v-model is: {{ count }}</div>
  <button @click="update">Increment</button>
</template>
```

- VuReact compiled React code (`output.tsx`):

```tsx
import { useCallback, memo } from 'react';
import { useVRef, useUpdated } from '@vureact/runtime-core';

export type IChildProps = {
  state?: string;
  modelValue?: string;
  count: number;
} & {
  onUpdateState?: (arg: string) => void;
  onUpdateModelValue?: (arg: string) => void;
  onUpdateCount?: (arg: number) => void;
};

const Child = memo((props: IChildProps) => {
  const state = useVRef<string>(props.state);
  const modelValue = useVRef<string>(props.modelValue ?? 'xxx');
  const count = useVRef<number>(props.count ?? 0);

  const update = useCallback(() => {
    state.value = 'hello';
    count.value++;
  }, [state.value, count.value]);

  useUpdated(() => {
    props.onUpdateState?.(state.value);
  }, [state.value]);

  useUpdated(() => {
    props.onUpdateModelValue?.(modelValue.value);
  }, [modelValue.value]);
  
  useUpdated(() => {
    props.onUpdateCount?.(count.value);
  }, [count.value]);

  return (
    <>
      <input
        value={modelValue}
        onChange={(e) => {
          modelValue = e.target.value;
        }}
      />
      <div>Parent bound v-model is:{count.value}</div>
      <button onClick={update}>Increment</button>
    </>
  );
});

export default Child;
```
