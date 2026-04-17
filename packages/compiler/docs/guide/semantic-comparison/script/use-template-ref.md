# useTemplateRef 语义对照

解析 Vue 中常见的 `useTemplateRef` API 经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 `useTemplateRef` 的 API 用法与核心行为。

## `useTemplateRef` → React `useRef` + `.current`

`useTemplateRef` 是 Vue 3 中用于获取模板 ref 节点的 API，它在 React 中没有直接对应的运行时实现，但语义上等价于 React 的 `useRef`。VuReact 会将其编译为 `useRef` 并将 `.value` 访问替换为 `.current`。

- Vue 代码：

```ts
const pRef = useTemplateRef<HTMLParagraphElement>('p');

onMounted(() => {
  console.log(pRef.value.offsetWidth);
});
```

- VuReact 编译后 React 代码：

```tsx
import { useMounted, useRef } from 'react';

const pRef = useRef<HTMLParagraphElement | null>(null);

useMounted(() => {
  console.log(pRef.current?.offsetWidth);
});
```

从示例可以看到：Vue 的 `useTemplateRef()` 被翻译为 React 的 `useRef`。VuReact 会将模板 ref 的类型保留，并将其访问方式从 `pRef.value` 转为 `pRef.current`，**保持模板引用语义一致**。

## 模板 `useTemplateRef` → React `ref` 绑定

在 Vue 模板中使用 `ref` 引用 DOM 节点时，VuReact 会把它编译为 React 的 `ref` 绑定方式。

- Vue 代码：

```vue
<template>
  <p ref="pRef">Hello</p>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';

const pRef = useTemplateRef<HTMLParagraphElement>('p');
</script>
```

- VuReact 编译后 React 代码：

```tsx
import { useRef } from 'react';

const pRef = useRef<HTMLParagraphElement | null>(null);

return <p ref={pRef}>Hello</p>;
```

VuReact 会把 Vue 模板中的 `ref` 绑定转换为 React 的 `ref={pRef}` 形式，并保持类型与访问方式的一致性。
