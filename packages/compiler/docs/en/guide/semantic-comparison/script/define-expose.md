# defineExpose Semantic Comparison

What does the Vue `defineExpose` macro compile into in VuReact, and how does it map to React code?

## Preface

To avoid confusion from verbose examples, we make two assumptions:

1. Vue and React code snippets only show the core logic; unrelated component wrappers and configuration are omitted.
2. The reader is already familiar with the Vue 3 `defineExpose` API and its core behavior.

## `defineExpose` → React `forwardRef` + `useImperativeHandle`

`defineExpose` is a Vue 3 `<script setup>` macro used to expose component internal methods or state to the parent component. VuReact compiles it into React's `forwardRef` + `useImperativeHandle` combination, allowing the parent to access the exposed object via ref.

- Vue code:

```ts
defineProps<{ title: string }>();

const count = ref(0);
const increment = () => count.value++;

defineExpose({
  count,
  increment,
});
```

- React code after VuReact compilation:

```tsx
import { forwardRef, useImperativeHandle, memo } from 'react';
import { useVRef } from '@vureact/runtime-core';

type IComponentProps = { title: string };

const Component = memo(
  forwardRef<any, IComponentProps>((props, expose) => {
    const count = useVRef(0);

    const increment = useCallback(() => {
      count.value++;
    }, [count.value]);

    useImperativeHandle(expose, () => ({
      count,
      increment,
    }));

    return <></>;
  }),
);
```

This example shows that Vue's `defineExpose` is translated to React's `forwardRef` and `useImperativeHandle`. VuReact preserves the exposed object shape, and the exposed `ref` object still uses `.value` access, maintaining consistency with Vue.

## Parent access to exposed content → React parent `ref.current`

In Vue, the parent uses `ref` and `expose` to access exposed content from the child component. In React, VuReact compiles this to `useRef` and `ref.current` access.

- Vue parent component:

```vue
<template>
  <Component ref="childRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const childRef = ref();

onMounted(() => {
  // access the exposed child content
  childRef.value?.count.value; // 0
  childRef.value?.increment(); // invoke the child method +1
  childRef.value?.count.value; // 1
});
</script>
```

- React parent component:

```tsx
const Parent = () => {
  const childRef = useRef();

  useMounted(() => {
    // access the exposed child content
    childRef.current?.count.value; // 0
    childRef.current?.increment(); // invoke the child method +1
    childRef.current?.count.value; // 1
  });

  return <Component ref={childRef} />;
};
```

VuReact ensures the parent access path remains consistent with Vue's expose semantics, so `childRef.current?.count.value` can still read and update the child's internal `ref` state.
