# defineEmits Semantic Comparison

What does the Vue `defineEmits` macro compile into in VuReact, and how does it map to React code?

## Preface

To avoid confusion from verbose examples, we make two assumptions:

1. Vue and React code snippets only show the core logic; unrelated component wrappers and configuration are omitted.
2. The reader is already familiar with the Vue 3 `defineEmits` API and its core behavior.

## `defineEmits` → React `props` event callback mapping

`defineEmits` is a Vue 3 `<script setup>` macro for declaring component custom events. It defines event names and parameter types as function signatures. VuReact compiles it into React `props` event callbacks and converts event names to camelCase.

- Vue code:

```ts
defineProps<{ name?: string }>();

const emit = defineEmits<{
  (e: 'save-item', payload: { id: string }): void;
  (e: 'update:name', value: string): void;
}>();

const submit = () => {
  emit('save-item', { id: '1' });
  emit('update:name', 'next');
};
```

- React code after VuReact compilation:

```tsx
type ICompProps = {
  name?: string;
  onSaveItem?: (payload: { id: string }) => void;
  onUpdateName?: (value: string) => void;
};

const submit = useCallback(() => {
  props.onSaveItem?.({ id: '1' });
  props.onUpdateName?.('next');
}, [props.onSaveItem, props.onUpdateName]);
```

This example shows that Vue's `defineEmits` is not compiled into a runtime hook. Instead, it is transformed into callback props on the React component. VuReact maps event names like `save-item` / `update:name` to `onSaveItem` / `onUpdateName` while preserving parameter types, achieving a seamless mapping between event signatures and React prop callbacks.

## `v-model:xxx` → React two-way binding `props` mapping

Events such as `update:xxx` are commonly used in Vue for parent-child two-way binding, where the parent uses `v-model:xxx="value"`. VuReact understands this pattern and converts it precisely:

- Vue parent component:

```vue
<template>
  <Child v-model:name="current" />
</template>

<script setup>
// @vr-name: Parent
const current = ref('');
</script>
```

- React code after VuReact compilation:

```tsx
const Parent = memo(() => {
  const current = useVRef('');
  return <Child name={current.value} onUpdateName={(value) => (current.value = value)} />;
});
```

## `emit()` → React `props` callback invocation

In Vue, `emit('event-name', payload)` triggers a component custom event. In React, VuReact compiles it to `props.onEventName?.(payload)`.

- Vue code:

```ts
const emit = defineEmits<{
  (e: 'submit', value: string): void;
}>();

const handleSubmit = () => {
  emit('submit', 'ok');
};
```

- React code after VuReact compilation:

```tsx
type ICompProps = {
  onSubmit?: (value: string) => void;
};

const handleSubmit = useCallback(() => {
  props.onSubmit?.('ok');
}, [props.onSubmit]);
```

VuReact maps the `emit` event name and parameters to types, and automatically generates the `useCallback` dependency array when needed, keeping React callback references stable while avoiding manual dependency maintenance.

## defineEmits compatible event name mapping rules

VuReact supports mapping Vue event names with hyphens or colons to React camelCase callback props:

- `save-item` → `onSaveItem`
- `update:name` → `onUpdateName`
- `close` → `onClose`

This mapping aligns with React event prop conventions while preserving the semantics of Vue event declarations.
