# defineExpose 语义对照

解析 Vue 中常见的 `defineExpose` 宏经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 `defineExpose` 的 API 用法与核心行为。

## `defineExpose` → React `forwardRef` + `useImperativeHandle`

`defineExpose` 是 Vue 3 `<script setup>` 中用于将组件内部方法或状态暴露给父组件的宏。VuReact 会将它编译为 React 的 `forwardRef` + `useImperativeHandle` 组合，使父组件可以通过 ref 访问暴露对象。

- Vue 代码：

```ts
defineProps<{ title: string }>();

const count = ref(0);
const increment = () => count.value++;

defineExpose({
  count,
  increment,
});
```

- VuReact 编译后 React 代码：

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

从示例可以看到：Vue 的 `defineExpose` 被翻译为 React 的 `forwardRef` 与 `useImperativeHandle`。VuReact 会保持暴露对象结构不变，**暴露的 `ref` 对象仍然保留 `.value` 访问方式，与 Vue 保持一致**。

## 父组件访问暴露内容 → React 父组件 `ref.current`

在 Vue 中，父组件通过 `ref` 和 `expose` 访问子组件暴露内容；在 React 中，VuReact 会编译为 `useRef` + `ref.current` 的访问方式。

- Vue 父组件代码：

```vue
<template>
  <Component ref="childRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const childRef = ref();

onMounted(() => {
  // 访问子组件暴露的内容
  childRef.value?.count.value; // 0
  childRef.value?.increment(); // 调用子组件方法 +1
  childRef.value?.count.value; // 1
});
</script>
```

- React 父组件代码：

```tsx
const Parent = () => {
  const childRef = useRef();

  useMounted(() => {
    // 访问子组件暴露的内容
    childRef.current?.count.value; // 0
    childRef.current?.increment(); // 调用子组件方法 +1
    childRef.current?.count.value; // 1
  });

  return <Component ref={childRef} />;
};
```

VuReact 会保证父组件访问路径与 Vue 暴露逻辑一致，`childRef.current?.count.value` 仍能读取和修改子组件内部 `ref` 状态。
