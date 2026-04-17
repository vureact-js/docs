# defineEmits 语义对照

解析 Vue 中常见的 `defineEmits` 宏经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 `defineEmits` 的 API 用法与核心行为。

## `defineEmits` → React `props` 事件回调映射

`defineEmits` 是 Vue 3 `<script setup>` 中用于声明组件自定义事件的宏，它会把事件名称和参数类型定义为函数签名。VuReact 会将它编译为 React `props` 的事件回调形式，并对事件名做驼峰映射。

- Vue 代码：

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

- VuReact 编译后 React 代码：

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

从示例可以看到：Vue 的 `defineEmits` 不会直接编译为运行时 Hook，而是转换为 React 组件 `props` 中的回调函数。VuReact 会将事件名 `save-item` / `update:name` 映射为 `onSaveItem` / `onUpdateName`，并保留参数类型定义，**实现了事件签名与 React props 回调的无缝对接**。

## `v-model:xxx` → React 双向绑定 `props` 映射

此外，子组件中定义的 `update:xxx` 这类事件，通常用于实现 Vue 中**父子组件的双向数据绑定**，父组件会以 `v-model:xxx="value"` 的形式使用。VuReact 充分考虑了这种模式，能够精准地进行转换：

- 父组件 Vue 代码：

```vue
<template>
  <Child v-model:name="current" />
</template>

<script setup>
// @vr-name: Parent
const current = ref('');
</script>
```

- VuReact 编译后 React 代码：

```tsx
const Parent = memo(() => {
  const current = useVRef('');
  return <Child name={current.value} onUpdateName={(value) => (current.value = value)} />;
});
```

## `emit()` → React `props` 回调调用

在 Vue 中，`emit('event-name', payload)` 触发组件自定义事件；在 React 中，VuReact 会把它编译为 `props.onEventName?.(payload)` 的调用形式。

- Vue 代码：

```ts
const emit = defineEmits<{
  (e: 'submit', value: string): void;
}>();

const handleSubmit = () => {
  emit('submit', 'ok');
};
```

- VuReact 编译后 React 代码：

```tsx
type ICompProps = {
  onSubmit?: (value: string) => void;
};

const handleSubmit = useCallback(() => {
  props.onSubmit?.('ok');
}, [props.onSubmit]);
```

VuReact 会对 `emit` 的事件名和参数进行类型映射，并在必要时自动为 `useCallback` 生成依赖数组，**让 React 端的回调引用保持稳定，同时避免开发者手动维护依赖**。

## defineEmits 兼容事件名映射规则

VuReact 支持将 Vue 的短横线事件名、冒号事件名等映射为 React 的驼峰命名回调：

- `save-item` → `onSaveItem`
- `update:name` → `onUpdateName`
- `close` → `onClose`

这种映射方式与 React 事件 props 习惯一致，也保持了 Vue 事件声明的语义。
