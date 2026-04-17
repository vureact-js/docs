# `<script setup>`

在这章我们不讲某个 API 的映射，而是从宏观层面看：Vue 的 `<script setup>` 如何被编译成一个完整的 React 组件。

## 前置约定

为避免示例冗长，本文聚焦于 `<script setup>` 的整体编译结果和结构变化：

1. `<script setup>` 本身是一个编译宏，不会在运行时保留；
2. 其内部顶层代码会被提炼为 React 组件函数体；
3. Vue 模板最终会被转成 JSX 的 `return` 语句。

## JavaScript：`<script setup>` 到 React 组件函数

- Vue 代码：

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

- VuReact 编译后 React 代码：

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

这段转换显示了 `<script setup>` 的核心编译思路：

- 非纯 UI 组件会被 `memo` 包裹以进行性能优化。
- `defineProps` 不是运行时调用，而是被编译为组件的 `props` 参数；
- `emit` 调用被编译为 `props.onXxx` 的事件回调；
- 你在 `script setup` 中编写的大多数代码，直接成为组件内部的函数；
- 对 script 代码进行编译时静态优化；
- Vue 模板被编译为 `return (...)` 中的 JSX。

## TypeScript：带类型的 `<script setup>` 整体编译

- Vue 代码：

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

- VuReact 编译后 React 代码：

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

这说明：

- `<script setup lang="ts">` 中的类型信息会被保留并转换为组件 `props` 类型；
- `defineProps` 的类型参数最终用在 React `props` 类型定义上；
- `defineEmits` 的事件类型会映射成 `onUpdate` 的回调类型。

---

在 TypeScript 环境下，VuReact 也支持将 `defineProps` 和 `defineEmits` 的 JavaScript **运行时参数写法**，编译为对应的 TS 类型信息。

- Vue 代码：

```ts
const props = defineProps({
  title: String,
  count: Number,
});

const emit = defineEmits(['update']);
```

- VuReact 编译后 React 代码：

```tsx
type ICompProps = {
  title: string;
  count: number;
  onUpdate?: () => any;
};
```
