# defineOptions 语义对照

解析 Vue 中常见的 `defineOptions` 宏经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 `defineOptions` 的 API 用法与核心行为。

## `defineOptions({ name })` → React 组件命名

`defineOptions` 是 Vue 3 中用于对组件进行额外配置的宏，例如指定组件名、继承属性行为等。VuReact 会将其中的 `name` 配置编译为 React 组件的名称建议，但在 React 中组件名本身更多依赖导出标识；因此该配置通常作为编译信息使用，而不产生运行时 Hook。

- Vue 代码：

```ts
defineOptions({
  name: 'MyComponent',
});
```

- VuReact 编译后 React 代码：

```tsx
const MyComponent = () => {
  return <></>;
};
```

从示例可以看到：Vue 的 `defineOptions({ name })` 不会被编译为运行时 API，而是被用于生成 React 组件名称或保持组件定义的语义。VuReact 会将 `name` 的概念与 React 的文件/导出命名保持一致，**让组件在 React 端更贴近 Vue 的命名意图**。

## `defineOptions` 其他选项 → React 忽略

`defineOptions` 还可能包含如 `inheritAttrs`、`customOptions` 等配置项。由于 React 与 Vue 在组件属性、生命周期等机制上存在差异，VuReact 会对这些配置项进行保守处理：

- `inheritAttrs`: 在 React 中无直接对应概念，通常忽略；
- `其他无关选项`：忽略。

- Vue 代码：

```ts
defineOptions({
  name: 'MyComponent',
  inheritAttrs: false,
  ...
});
```

- VuReact 编译后 React 代码：

```tsx
const MyComponent = () => {
  return <></>;
};
// inheritAttrs 在 React 中无直接对应概念，会被忽略
```

VuReact 会对 `defineOptions` 中的非运行时配置项进行静态分析，并尽量保持兼容性。对于无法直接映射的字段，编译器通常会忽略它们，**避免在 React 端引入不必要的运行时开销**。

---

### `defineOptions` 与组件命名建议

在 React 中，组件名称通常由变量名或导出名决定。若你希望在编译结果中显式保留 Vue 组件名语义，建议使用特殊注释形式：

```ts
// @vr-name: MyComponent
```

这种方式会让 VuReact 在生成 React 组件时保留更明确的组件命名信息，避免 `defineOptions({ name })` 被忽略后丧失语义。
