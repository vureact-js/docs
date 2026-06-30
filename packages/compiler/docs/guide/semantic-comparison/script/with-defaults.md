# withDefaults 语义对照

解析 Vue 中常见的 `withDefaults` 编译宏经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 `withDefaults` 的 API 用法与核心行为。

## `withDefaults(defineProps<T>(), defaults)` → `useMemo` 默认值合并

`withDefaults` 是 Vue 3 `<script setup>` 中用于为 `defineProps` 声明的 prop 提供编译时默认值的工具函数。Vue 中 `withDefaults` 会在编译时生成默认值逻辑，确保父组件未传递的 prop 拥有默认值。VuReact 会将它编译为 `useMemo`，**在组件初始化时合并传入的 props 与默认值，生成一个包含完整默认值的只读 props 对象**。

- Vue 代码：

```ts
interface Props {
  msg?: string;
  count?: number;
  labels: string[];
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  count: 42,
  labels: () => ['one', 'two'],
});
```

- VuReact 编译后 React 代码：

```tsx
interface Props {
  msg?: string;
  count?: number;
  labels: string[];
}

export type ICompProps = Props;

const Input = memo((vrProps: ICompProps) => {
  /* from withDefaults */
  const props = useMemo<Readonly<Props>>(() => ({
    ...vrProps,
    msg: vrProps.msg ?? 'hello',
    count: vrProps.count ?? 42,
    labels: vrProps.labels ?? ['one', 'two'],
  }), [vrProps]);
});
```

从示例可以看到：Vue 的 `withDefaults` 被编译为 React 的 `useMemo` + 空值合并运算符 `??` 组合。主要分为三部分：

1. **类型保留** → `Props` 接口原样保留，**不会因默认值而改变类型的可选/必填约束**。`msg?` 和 `count?` 仍是可选类型；
2. **默认值合并** → `useMemo` 中使用展开运算符 `...vrProps` 保留所有传入值，再对每个具有默认值的字段通过 `??` 空值合并运算符进行回退填充；
3. **只读保证** → `useMemo<Readonly<Props>>` 确保返回的 props 对象是只读的，与 Vue 中 `withDefaults` 的运行时不可变性一致。

> 请注意：

## 基本类型默认值 → `??` 空值合并

对于 `string`、`number` 等基本类型的默认值，VuReact 直接使用 `??` 空值合并运算符：

- Vue 代码：

```ts
const props = withDefaults(defineProps(), {
  msg: 'hello',
  count: 42,
});
```

- VuReact 编译后 React 代码：

```tsx
const props = useMemo(() => ({
  ...vrProps,
  msg: vrProps.msg ?? 'hello',
  count: vrProps.count ?? 42,
}), [vrProps]);
```

基本类型默认值直接作为 `??` 右侧的字面量值，**仅在父组件未传递该 prop（即 `undefined`）时生效**。

## 引用类型默认值 → 工厂函数调用

对于数组、对象等引用类型，Vue 的 `withDefaults` 要求使用工厂函数（如 `() => ['one', 'two']`）以避免多个实例共享同一引用。VuReact 同样遵循这一约定，**直接在 `??` 右侧调用工厂函数，保证每次渲染生成独立的引用实例**：

- Vue 代码：

```ts
const props = withDefaults(defineProps<Props>(), {
  labels: () => ['one', 'two'],
});
```

- VuReact 编译后 React 代码：

```tsx
const props = useMemo<Readonly<Props>>(() => ({
  ...vrProps,
  labels: vrProps.labels ?? ['one', 'two'],
}), [vrProps]);
```

**VuReact 保证 `??` 右侧的工厂函数每次执行都会返回新实例，避免引用共享导致的副作用污染。**

## 不支持的 `withDefaults` 用法

VuReact 明确不支持以下 `withDefaults` 用法，编译时会报错提示：

### 1. 未赋值给变量

`withDefaults()` 必须赋值给一个变量（如 `const props = withDefaults(...)`），不支持作为独立表达式调用：

```vue
<script setup lang="ts">
// 不支持的写法
withDefaults(defineProps<Props>(), { msg: 'hello' });
</script>
```

```vue
<script setup lang="ts">
// 支持的写法
const props = withDefaults(defineProps<Props>(), { msg: 'hello' });
</script>
```

### 2. 第一个参数非 `defineProps()` 调用

`withDefaults()` 的第一个参数必须是 `defineProps()` 的调用表达式，不支持传入其他表达式：

```vue
<script setup lang="ts">
// 不支持的写法
const props = withDefaults({ msg: 'hello' });
</script>
```

```vue
<script setup lang="ts">
// 支持的写法
const props = withDefaults(defineProps<Props>(), { msg: 'hello' });
</script>
```

### 3. 第二个参数非对象字面量

`withDefaults()` 的第二个参数必须是内联的对象字面量，不支持传入变量引用或其他表达式：

```vue
<script setup lang="ts">
// 不支持的写法
const defaults = { msg: 'hello' };
const props = withDefaults(defineProps<Props>(), defaults);
</script>
```

```vue
<script setup lang="ts">
// 支持的写法
const props = withDefaults(defineProps<Props>(), { msg: 'hello' });
</script>
```

## withDefaults 综合示例

完整的 `withDefaults` 单文件组件编译前后对照，可参考以下代码：

- Vue 代码：

```vue
<script setup lang="ts">
interface Props {
  msg?: string;
  count?: number;
  labels: string[];
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  count: 42,
  labels: () => ['one', 'two'],
});
</script>

<template>
  <div>{{ props.msg }} {{ props.count }}</div>
  <ul>
    <li v-for="value in props.labels" :key="value">{{ value }}</li>
  </ul>
</template>
```

- VuReact 编译后 React 代码：

```tsx
import { useMemo, memo } from 'react';

interface Props {
  msg?: string;
  count?: number;
  labels: string[];
}

export type ICompProps = Props;

const Input = memo((vrProps: ICompProps) => {
  /* from withDefaults */
  const props = useMemo<Readonly<Props>>(() => ({
    ...vrProps,
    msg: vrProps.msg ?? 'hello',
    count: vrProps.count ?? 42,
    labels: vrProps.labels ?? ['one', 'two'],
  }), [vrProps]);

  return (
    <>
      <div>{props.msg}{props.count}</div>
      <ul>
        {props.labels.map(value => <li key={value}>{value}</li>)}
      </ul>
    </>
  );
});

export default Input;
```
