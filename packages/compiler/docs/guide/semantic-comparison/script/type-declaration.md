# TS 类型声明静态提升

解析 Vue 中的`顶层 TS 类型声明`，通过 VuReact 的提升后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 TypeScript。

## 顶层 TS 类型声明 → React 组件外部静态提升

在 Vue 中，`<script setup>` 顶层的类型声明（如 `interface`、`type`、`enum` 等）是纯 TypeScript 构造，不产生任何运行时代码。VuReact 在编译时会进行静态分析：将这些顶层类型声明完整地提升至生成的 React 组件外部，保持其模块级别的类型作用域，确保类型系统的一致性，同时避免对组件运行时逻辑产生任何影响。

- Vue 代码：

```vue
<script setup lang="ts">
export interface ExampleInterface { ... }

enum ExampleEnum { ... }

function func() {
  type ExampleType = { ... };
}
</script>
```

- VuReact 编译后 React 代码：

```tsx
export interface ExampleInterface { ... }

enum ExampleEnum { ... }

const Example = memo(() => {
  function func() {
    type ExampleType = { ... };
  }

  return <></>;
});
```

从示例可以看到：顶层的**类型声明**会被提升到组件外部保留，继续作为 React 模块级别的类型声明；而函数内部声明的**类型**则保持在函数作用域中，不会被错误提升（任何非顶层声明都是如此）。

这样的处理让 VuReact 在保留 TS 类型语义的同时，避免了运行时结构被无谓改变。
