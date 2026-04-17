# useAttrs 语义对照

解析 Vue 中常见的 `useAttrs` API 经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 `useAttrs` 的 API 用法与核心行为。

## `useAttrs()` → React `props` 引用

`useAttrs` 是 Vue 3 中用于获取未在 `defineProps` 中声明的透传属性的 API。在 React 中，所有属性都统一通过 `props` 传递，因此 VuReact 会将 `useAttrs()` 编译为对 `props` 的引用。

Tip：若组件未声明任何 `props`，VuReact 会自动补全组件参数 `props` 或 `props: Record<string, unknown>`。

- Vue 代码：

```ts
const attrs = useAttrs();
```

- VuReact 编译后 React 代码：

```tsx
const attrs = props as Record<string, unknown>;
```

从示例可以看到：Vue 的 `useAttrs()` 被编译为 React 中对 `props` 的直接引用。VuReact 会保留 `useAttrs` 的运行时含义，同时将其与 React 的 Props 机制自然对接。

## `useAttrs()` 与 TypeScript 类型处理

VuReact 会根据场景自动补齐 `useAttrs()` 的类型信息，确保 React 端类型提示正常。

- Vue 代码：

```ts
interface Attrs {
  class?: string;
  style?: string;
  [key: string]: unknown;
}

const attrs = useAttrs();

const { style, class: cls } = useAttrs() as Attrs;

const typeAnnotation: Attrs = useAttrs();
```

- VuReact 编译后 React 代码：

```tsx
interface Attrs {
  class?: string;
  style?: string;
  [key: string]: unknown;
}

const attrs = props as Record<string, unknown>;

const { style, class: cls } = props as Attrs;

const typeAnnotation = props as Attrs;
```

VuReact 会在可用时对 `useAttrs()` 添加类型断言或保留显式注解，从而让 React 中的 `attrs` 访问保持类型安全。

## `useAttrs()` 在纯 JavaScript 场景

在纯 JavaScript 环境中，VuReact 会将 `useAttrs()` 直接替换为对 `props` 的引用。

- Vue 代码：

```ts
const attrs = useAttrs();
```

- VuReact 编译后 React 代码：

```tsx
const attrs = props;
```

这意味着在 JS 场景下，`attrs` 仍然是 React 组件接收的 `props` 对象，行为上与 Vue 的透传属性访问保持一致。
