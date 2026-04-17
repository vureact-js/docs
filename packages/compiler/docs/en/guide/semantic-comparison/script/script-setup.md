# `<script setup>`

In this chapter, we're not discussing the mapping of a specific API, but rather looking from a macro perspective: how Vue's `<script setup>` is compiled into a complete React component.

## Prerequisites

To avoid lengthy examples, this article focuses on the overall compilation results and structural changes of `<script setup>`:

1. `<script setup>` itself is a compile-time macro and is not preserved at runtime;
2. Its internal top-level code will be extracted into the React component function body;
3. Vue templates will ultimately be transformed into JSX `return` statements.

## JavaScript: `<script setup>` to React Component Function

- Vue code:

```vue
<script setup>
const props = defineProps({
  title: String,
  count: Number,
});

const emit = defineEmits(['update']);

const handleClick = () => {
  emit('update', props.count + 1);
};
</script>

<template>
  <button @click="handleClick">{{ props.title }} - {{ props.count }}</button>
</template>
```

- React code after VuReact compilation:

```jsx
const Comp = memo((props) => {
  const handleClick = useCallback(() => {
    props.onUpdate?.(props.count + 1);
  }, [props.onUpdate, props.count]);

  return (
    <button onClick={handleClick}>
      {props.title} - {props.count}
    </button>
  );
});

export default Comp;
```

This transformation shows the core compilation approach of `<script setup>`:

- Non-pure UI components are wrapped with `memo` for performance optimization.
- `defineProps` is not a runtime call, but is compiled into the component's `props` parameter;
- `emit` calls are compiled into `props.onXxx` event callbacks;
- Most of the code you write in `script setup` directly becomes functions inside the component;
- Static optimization of script code during compilation;
- Vue templates are compiled into JSX within `return (...)`.

## TypeScript: Overall Compilation of `<script setup>` with Types

- Vue code:

```vue
<script setup lang="ts">
const props = defineProps<{
  title: string;
  count: number;
}>();

const emit = defineEmits<{
  (e: 'update', value: number): void;
}>();

const handleClick = () => {
  emit('update', props.count + 1);
};
</script>

<template>
  <button @click="handleClick">{{ props.title }} - {{ props.count }}</button>
</template>
```

- React code after VuReact compilation:

```tsx
type ICompProps = {
  title: string;
  count: number;
  onUpdate?: (value: number) => void;
};

const Comp = memo((props: ICompProps) => {
  const handleClick = useCallback(() => {
    props.onUpdate?.(props.count + 1);
  }, [props.onUpdate, props.count]);

  return (
    <button onClick={handleClick}>
      {props.title} - {props.count}
    </button>
  );
});
```

This demonstrates:

- Type information in `<script setup lang="ts">` is preserved and converted into component `props` types;
- The type parameters of `defineProps` are ultimately used in React `props` type definitions;
- Event types from `defineEmits` are mapped to callback types like `onUpdate`.

---

In TypeScript environments, VuReact also supports compiling JavaScript **runtime parameter syntax** of `defineProps` and `defineEmits` into corresponding TS type information.

- Vue code:

```ts
const props = defineProps({
  title: String,
  count: Number,
});

const emit = defineEmits(['update']);
```

- React code after VuReact compilation:

```tsx
type ICompProps = {
  title: string;
  count: number;
  onUpdate?: () => any;
};
```
