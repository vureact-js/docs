# useTemplateRef Semantic Comparison

What does the common `useTemplateRef` API in Vue become after being compiled by VuReact into React code?

## Prerequisites

To avoid misunderstandings caused by redundant example code, let's first clarify two conventions:

1. The Vue/React code in this document is simplified core logic, omitting complete component wrappers, irrelevant configurations, etc.;
2. It is assumed that readers are already familiar with the API usage and core behavior of `useTemplateRef` in Vue 3.

## `useTemplateRef` → React `useRef` + `.current`

`useTemplateRef` is an API in Vue 3 used to obtain template ref nodes. It has no direct runtime equivalent in React, but semantically corresponds to React's `useRef`. VuReact will compile it to `useRef` and replace `.value` access with `.current`.

- Vue code:

```ts
const pRef = useTemplateRef<HTMLParagraphElement>('p');

onMounted(() => {
  console.log(pRef.value.offsetWidth);
});
```

- React code after VuReact compilation:

```tsx
import { useMounted, useRef } from 'react';

const pRef = useRef<HTMLParagraphElement | null>(null);

useMounted(() => {
  console.log(pRef.current?.offsetWidth);
});
```

From the example, we can see: Vue's `useTemplateRef()` is translated to React's `useRef`. VuReact preserves the template ref's type and converts its access method from `pRef.value` to `pRef.current`, **maintaining consistent template reference semantics**.

## Template `useTemplateRef` → React `ref` Binding

When using `ref` in Vue templates to reference DOM nodes, VuReact will compile it to React's `ref` binding method.

- Vue code:

```vue
<template>
  <p ref="pRef">Hello</p>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';

const pRef = useTemplateRef<HTMLParagraphElement>('p');
</script>
```

- React code after VuReact compilation:

```tsx
import { useRef } from 'react';

const pRef = useRef<HTMLParagraphElement | null>(null);

return <p ref={pRef}>Hello</p>;
```

VuReact converts the `ref` binding in Vue templates to React's `ref={pRef}` form, maintaining consistency in type and access method.
