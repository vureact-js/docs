# 常量与变量的优化对照

解析 Vue 中的`顶层常量静态`与`变量`，通过 VuReact 的提升与自动依赖分析后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中顶层 `const` 声明与函数/变量优化的语义。

## 顶层常量声明 → React 组件外部静态提升

在 Vue 中，`<script setup>` 顶层的常量声明常用于组件的静态配置、默认值等。VuReact 会对这些常量进行静态分析：若初始值为`简单字面量`（如字符串、数字、布尔值等），则会被提升至组件外部，避免每次渲染重新创建。

- Vue 代码：

```vue
<script setup>
const defaultValue = 1;
const isEnabled = true;
</script>
```

- VuReact 编译后 React 代码：

```tsx
const defaultValue = 1;
const isEnabled = true;

const Comp = memo(() => {
  return <></>;
});
```

从示例可以看到：对于值为简单数据类型的顶层常量，VuReact 会将其提升为组件外部，**避免 React 组件每次渲染时重复初始化**。

## 顶层变量声明 → React `useMemo` 自动依赖分析

顶层变量如果由表达式计算得到，且存在响应式依赖，VuReact 会将其编译为 `useMemo`，并自动补齐依赖数组。对纯静态表达式则保持原样，不会强制包装。

- Vue 代码：

```vue
<script setup>
const count = ref(0);
const state = reactive({ foo: 'bar', bar: { c: 1 } });

const memoizedObj = {
  title: 'test',
  bar: count.value,
  add: () => {
    state.bar.c++;
  },
};

const staticObj = {
  foo: 1,
  state: { bar: { c: 1 } },
};

const reactiveList = [count.value, 1, 2];
</script>
```

- VuReact 编译后 React 代码：

```tsx
const count = useVRef(0);
const state = useReactive({ foo: 'bar', bar: { c: 1 } });

const memoizedObj = useMemo(
  () => ({
    title: 'test',
    bar: count.value,
    add: () => {
      state.bar.c++;
    },
  }),
  [count.value, state.bar.c],
);

const staticObj = {
  foo: 1,
  state: {
    bar: { c: 1 },
  },
};

const reactiveList = useMemo(() => [count.value, 1, 2], [count.value]);
```

此处说明：

- `memoizedObj` 因为依赖 `count.value` 和 `state.bar.c`，被自动编译为 `useMemo`；
- `staticObj` 不含响应式依赖，保持为普通静态对象；
- `reactiveList` 则根据依赖自动补齐 `useMemo` 的依赖数组。
