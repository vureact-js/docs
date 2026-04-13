# Script Conversion Guide

This page demonstrates common and advanced Script layer conversions in the format of "Vue Input -> React Output (illustrative)".

> Note: Examples are simplified comparisons; the specific import names, type names, and wrapper structures are subject to local compilation artifacts.

## 1. Reactive API Mapping (Core)

| Vue API                                               | Output Adapted API                                             |
| ----------------------------------------------------- | -------------------------------------------------------------- |
| `ref`                                                 | `useVRef`                                                      |
| `reactive`                                            | `useReactive`                                                  |
| `computed`                                            | `useComputed`                                                  |
| `readonly`                                            | `useReadonly`                                                  |
| `toRef` / `toRefs`                                    | `useToVRef` / `useToVRefs`                                     |
| `watch`                                               | `useWatch`                                                     |
| `watchEffect` / `watchPostEffect` / `watchSyncEffect` | `useWatchEffect` / `useWatchPostEffect` / `useWatchSyncEffect` |
| `onMounted` / `onUnmounted`                           | `useMounted` / `useUnmounted`                                  |
| `onBeforeUpdate` / `onUpdated`                        | `useBeforeUpdate` / `useUpdated`                               |

For more details, please refer to the [Runtime Hooks Documentation](https://runtime.vureact.top/en/guide/hooks/reactive.html)

### Example: `ref` + `computed`

Vue Input:

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';

const state = ref(1);
const double = computed(() => state.value * 2);
</script>
```

React Output (illustrative):

```tsx
import { useComputed, useVRef } from '@vureact/runtime-core';

const state = useVRef(1);
const double = useComputed(() => state.value * 2);
```

## 2. Macros: `defineProps` / `defineEmits` / `defineSlots`

### `defineProps` (Type Parameter + Runtime Syntax)

Vue Input:

```vue
<script setup lang="ts">
const props = defineProps<{ id: string; enabled?: boolean }>();
</script>
```

React Output (illustrative):

```tsx
type ICompProps = {
  id: string;
  enabled?: boolean;
};

const Comp = (props: ICompProps) => {
  // ...
};
```

Supplement: `defineProps(['foo', 'bar'])` and `defineProps({ ... })` also support type inference, but the type parameter form is recommended as a priority.

### `defineEmits` and Event Name Mapping

Vue Input:

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'save-item', payload: { id: string }): void;
  (e: 'update:name', value: string): void;
}>();

const submit = () => {
  emit('save-item', { id: '1' });
  emit('update:name', 'next');
};
</script>
```

React Output (illustrative):

```tsx
type ICompProps = {
  onSaveItem?: (payload: { id: string }) => void;
  onUpdateName?: (value: string) => void;
};

const submit = useCallback(() => {
  props.onSaveItem?.({ id: '1' });
  props.onUpdateName?.('next');
}, [props.onSaveItem, props.onUpdateName]);
```

### `defineSlots` and Slot Types

Vue Input:

```vue
<script setup lang="ts">
const slots = defineSlots<{
  default?(): any;
  footer(props: { count: number }): any;
}>();
</script>
```

React Output (illustrative):

```tsx
type ICompProps = {
  children?: React.ReactNode;
  footer?: (props: { count: number }) => React.ReactNode;
};
```

## 3. `useTemplateRef`: `useRef` + `.current`

Vue Input:

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue';

const pRef = useTemplateRef<HTMLParagraphElement>('p');
</script>
```

React Output (illustrative):

```tsx
import { useRef } from 'react';

const pRef = useRef<HTMLParagraphElement | null>(null);
```

Meanwhile, access to this ref in the script will be converted from `.value` to `.current` (e.g., `pRef.value` -> `pRef.current`).

## 4. `watchEffect` / Lifecycle: Supplement Dependency Parameters

Vue Input:

```vue
<script setup lang="ts">
watchEffect(() => {
  console.log(state.value);
});

onUpdated(() => {
  console.log(state.value);
});
</script>
```

React Output (illustrative):

```tsx
useWatchEffect(() => {
  console.log(state.value);
}, [state.value]);

useUpdated(() => {
  console.log(state.value);
}, [state.value]);
```

## 5. `defineAsyncComponent`: Mapping to `React.lazy`

Vue Input:

```vue
<script setup lang="ts">
const AsyncPanel = defineAsyncComponent(() => import('./Panel.vue'));
</script>
```

React Output (illustrative):

```tsx
const AsyncPanel = lazy(() => import('./Panel.jsx'));
```

Constraint: Only ESM dynamic `import('...')` syntax is supported.

## 6. `provide`/`inject`

Converted to Provider adaptation structure and useInject hook

Vue Input:

```vue
Parent Component

<script setup lang="ts">
provide('theme', theme);
</script>

Child Component

<script setup lang="ts">
const theme = inject<string>('theme');
</script>
```

React Output (illustrative):

```tsx
Parent Component

<Provider name={'theme'} value={theme}>
  {/* children */}
</Provider>

Child Component

const theme = useInject<string>('theme');
```

## 7. Static Hoisting and Optimization

### Static Hoisting

### `const`

For **top-level constant declarations**, if their initial values are literals of JavaScript basic data types (such as strings, numbers, booleans, etc.), they will be hoisted outside the component.

Vue Input:

```vue
<script setup lang="ts">
const defaultValue = 1;
const isEnabled = true;
</script>
```

React Output (illustrative):

```tsx
const defaultValue = 1;
const isEnabled = true;

// Example Component
const Component = memo(() => {
  return <></>;
});
```

### Optimization: Automatic Dependency Analysis

The compiler has a built-in powerful dependency analyzer that follows React rules and intelligently analyzes the dependency relationships of `top-level arrow functions` and `top-level variable declarations`.

### `useCallback`

For **top-level arrow functions**, if analyzable dependencies exist in their function bodies, they will be automatically optimized

Vue Input:

```vue
<script setup lang="ts">
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

React Output (illustrative):

```tsx
const inc = useCallback(() => {
  count.value++;
}, [count.value]);

const fn = () => {};

const fn2 = useCallback(() => {
  // Trace the initial value and collect foo.value
  const value = foo.value;

  // Ignore optimization for local arrow functions
  const fn4 = () => {
    value + state.bar.c--;
  };

  fn();
}, [foo.value, state.bar.c]);
```

### `useMemo`

For **top-level variable declarations** with initial values, if analyzable dependencies exist in their initial value expressions, they will be automatically optimized

Vue Input:

```vue
<script setup lang="ts">
const fooRef = ref(0);
const reactiveState = reactive({ foo: 'bar', bar: { c: 1 } });

const memoizedObj = {
  title: 'test',
  bar: fooRef.value,
  add: () => {
    reactiveState.bar.c++;
  },
};

const staticObj = {
  foo: 1,
  state: { bar: { c: 1 } },
};

const staticList = [1, 2, 3];

const reactiveList = [fooRef.value, 1, 2];

const mixedList = [
  { name: reactiveState.foo, age: fooRef.value },
  { name: 'A', age: 20 },
];

const nestedObj = {
  a: {
    b: {
      c: reactiveList[0],
      d: () => {
        return memoizedObj.bar;
      },
    },
    e: mixedList,
  },
};

const computeFn = () => {
  memoizedObj.add();
  return nestedObj.a.b.d();
};

const formattedValue = memoizedObj.bar.toFixed(2);
</script>
```

React Output (illustrative):

```tsx
const memoizedObj = useMemo(
  () => ({
    title: 'test',
    bar: fooRef.value,
    add: () => {
      reactiveState.bar.c++;
    },
  }),
  [fooRef.value, reactiveState.bar.c],
);

// No dependencies
const staticObj = {
  foo: 1,
  state: {
    bar: {
      c: 1,
    },
  },
};

const reactiveList = useMemo(() => [fooRef.value, 1, 2], [fooRef.value]);

// No dependencies
const staticList = [1, 2, 3];

const mixedList = useMemo(
  () => [
    {
      name: reactiveState.foo,
      age: fooRef.value,
    },
    {
      name: 'A',
      age: 20,
    },
  ],
  [reactiveState.foo, fooRef.value],
);

const nestedObj = useMemo(
  () => ({
    a: {
      b: {
        c: reactiveList[0],
        d: () => {
          return memoizedObj.bar;
        },
      },
      e: mixedList,
    },
  }),
  [reactiveList[0], memoizedObj.bar, mixedList],
);

const computeFn = useMemo(
  () => () => {
    memoizedObj.add();
    return nestedObj.a.b.d();
  },
  [memoizedObj, nestedObj.a.b],
);

const formattedValue = useMemo(() => memoizedObj.bar.toFixed(2), [memoizedObj.bar]);
```

## 8. Routing API (when integrating with the router ecosystem)

| Vue Router API                                                      | Output Adapted API                                                     |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `createRouter`                                                      | `createRouter`                                                         |
| `useRoute` / `useRouter` / `useLink`                                | `useRoute` / `useRouter` / `useLink`                                   |
| `onBeforeRouteLeave` / `onBeforeRouteUpdate` / `onBeforeRouteEnter` | `useBeforeRouteLeave` / `useBeforeRouteUpdate` / `useBeforeRouteEnter` |
| `createWebHistory` / `createWebHashHistory` / `createMemoryHistory` | `createWebHistory` / `createWebHashHistory` / `createMemoryHistory`    |

## 9. `useAttrs`: Fallthrough Attributes Handling

In Vue, `useAttrs()` is used to retrieve fallthrough attributes not declared in `defineProps`, such as `class`, `style`, custom attributes, etc. In React, all attributes are passed via `props`, so `useAttrs()` is converted to a reference to `props`.

> A fallthrough attribute is essentially an untyped JavaScript runtime object that merges with declared props to form the final set of component attributes.

### Basic Transformation

**Vue Input:**

```html
<script setup lang="ts">
  const attrs = useAttrs();
</script>
```

**React Output (Simplified):**

```tsx
const attrs = props as Record<string, unknown>;
```

### TypeScript Type Handling

The compiler automatically adds appropriate type assertions based on different scenarios:

1. **Default Type**: Uses `Record<string, unknown>` if no type is specified
2. **Type Assertion**: Preserves existing type assertions
3. **Variable Type Annotation**: Uses the annotated type if present
4. **Props Type Handling**: Automatically adds a props parameter with the default type if the component declares no props; intersects with the default type if props are already declared.

#### Example: Multiple Type Usages

**Vue Input:**

```vue
<script setup lang="ts">
interface Attrs {
  class?: string;
  style?: string;
  [key: string]: unknown;
}

// Basic usage
const attrs = useAttrs();

// Destructuring + type assertion
const { style, class: cls } = useAttrs() as Attrs;

// With type annotation
const typeAnnotation: Attrs = useAttrs();
</script>
```

**React Output (Simplified):**

```tsx
interface Attrs {
  class?: string;
  style?: string;
  [key: string]: unknown;
}

// Basic usage
const attrs = props as Record<string, unknown>;

// Destructuring + type assertion
const { style, class: cls } = props as Attrs;

// With type annotation
const typeAnnotation = props as Attrs;
```

### Usage in Templates

When accessing `attrs` properties in templates, the compiler correctly handles optional chaining and dynamic property access:

**Vue Input:**

```html
<template>
  <div
    :class="[
      'red',
      attrs.class,
      attrs.xx.class,
      attrs['class'],
      attrs.xx['class'],
      attrs?.['class'],
    ]"
  >
    {{ attrs?.xxx?.['class'] }}
  </div>
</template>
```

**React Output (Simplified):**

```tsx
<div
  className={dir.cls([
    'red',
    attrs.class,
    attrs.xx.class,
    attrs['class'],
    attrs.xx['class'],
    attrs?.['class'],
  ])}
>
  {attrs?.xxx?.['class']}
</div>
```

### JavaScript Environment

In plain JavaScript, `useAttrs()` is directly replaced with a reference to `props`:

**Vue Input:**

```vue
<script setup>
const attrs = useAttrs();
</script>
```

**React Output (Simplified):**

```tsx
const attrs = props;
```

### Notes

1. **Attribute Merging**: In React, `props` contains all passed attributes, both declared and undeclared.
2. **Type Safety**: Explicit type annotations for `useAttrs()` are recommended for better type hints.
3. **Attribute Access**: Optional chaining is preserved when accessing `attrs` in templates.
4. **Relationship with `defineProps`**: `useAttrs()` retrieves attributes not declared in `defineProps`; after conversion to React, all attributes are accessed via `props`.

### Full Example

**Vue Input:**

```vue
<template>
  <div :class="attrs.class" :style="attrs.style">
    {{ attrs.title }}
  </div>
</template>

<script setup lang="ts">
interface CustomAttrs {
  class?: string;
  style?: string;
  title?: string;
}

const props = defineProps<{ id: string }>();
const attrs = useAttrs() as CustomAttrs;
</script>
```

**React Output (Simplified):**

```tsx
interface CustomAttrs {
  class?: string;
  style?: string;
  title?: string;
}

type ICompProps = {
  id: string;
};

const Comp = memo((props: ICompProps & Record<string, unknown>) => {
  const attrs = props as CustomAttrs;

  return (
    <div className={attrs.class} style={attrs.style}>
      {attrs.title}
    </div>
  );
});
```

## 10. Strong Constraints and Common Failure Points

1. Macros can only be used at the top level of SFC and must be assigned to variables
2. Calls to be converted to Hooks must comply with React's top-level rules
3. Dynamic/unanalyzable syntax will trigger warnings, errors, or be handled conservatively
4. It is recommended to use stable strings for event names, avoiding dynamic `emit(eventName)`
5. Transferred attributes should use explicit `useAttrs()` and manually use its return value

## Next Steps

- See [Style Conversion Guide](./conversion-style) - Learn about style conversion rules
- See [Runtime Hooks Documentation](https://runtime.vureact.top/guide/hooks/reactive.html) - Learn about detailed usage of runtime APIs
