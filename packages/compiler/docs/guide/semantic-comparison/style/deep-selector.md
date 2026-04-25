# 穿透选择器语义对照

解析 Vue 作用域样式中的穿透选择器（`:deep`/`:global`/`:slotted`）经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉样式 `:deep`/`:global`/`:slotted` 的用法。

## `:global()`：声明全局样式

`:global()` 用于在 scoped 样式中声明一段不受作用域限制的全局样式。VuReact 的处理方式：**移除 `:global()` 包装，保留内部选择器原样输出**。

- Vue 代码：

```vue
<!-- Component.vue -->
<template>
  <div class="component">
    <div class="global-class">全局类</div>
  </div>
</template>

<style scoped>
.component {
  :global(.global-class) {
    color: green;
  }
}
</style>
```

- VuReact 编译后 CSS：

```css
/* component-abc123.css */
.component[data-css-abc123] {
  .global-class {
    color: green;
  }
}
```

从示例可以看到：`:global(...)` 被完全移除，内部的选择器照常展开，且**不添加 scope 属性**。这样 `.global-class` 就是一个全局可用的样式类。

## `:deep()`：样式穿透

`:deep()` 是 scoped 样式中最常用的穿透选择器，用于让父组件的样式能够影响子组件内部的元素。VuReact 的处理策略是：**将 `:deep(...)` 左侧的选择器加上 scope，右侧（`:deep` 内部）的选择器保持原样**。

- Vue 代码：

```vue
<!-- Component.vue -->
<template>
  <div class="component">
    <div class="nested-component">深层嵌套组件</div>
  </div>
</template>

<style scoped>
.component {
  :deep(.nested-component) {
    background: yellow;
  }
}
</style>
```

- VuReact 编译后 CSS：

```css
/* component-abc123.css */
.component[data-css-abc123] {
  & .nested-component {
    background: yellow;
  }
}
```

从示例可以看到：在嵌套规则中，`:deep()` 左侧是 `.component`（加 scope），右侧 `.nested-component`（不加 scope）。

## 在单行规则中使用 `:deep()`

`:deep()` 也可以在非嵌套的单行规则中使用，左侧部分仍然被 scoped。

- Vue 代码：

```vue
<style scoped>
.parent :deep(.btn) {
  color: red;
}
</style>
```

- VuReact 编译后 CSS：

```css
.parent[data-css-abc123] .btn {
  color: red;
}
```

## `:deep()` 紧贴选择器

- Vue 代码：

```vue
<style scoped>
.parent:deep(.btn) {
  color: red;
}
</style>
```

- VuReact 编译后 CSS：

```css
.parent[data-css-abc123] .btn {
  color: red;
}
```

## 带组合器的 `:deep()`

- Vue 代码：

```vue
<style scoped>
.parent > :deep(.btn) {
  color: red;
}
</style>
```

- VuReact 编译后 CSS：

```css
.parent[data-css-abc123] > .btn {
  color: red;
}
```

## 单独 `:deep()`

当 `:deep()` 单独位于选择器最左侧时（无左侧部分），VuReact 会直接用 `[scopeId]` 作为左侧。

- Vue 代码：

```vue
<style scoped>
:deep(.btn) {
  color: red;
}
</style>
```

- VuReact 编译后 CSS：

```css
[data-css-abc123] .btn {
  color: red;
}
```

**处理逻辑**：左侧为空时，用 `[data-css-abc123]` 自身作为 scoped 占位。

## `:deep()` 展开逗号选择器

`:deep()` 内部可以包含多个逗号分隔的选择器，VuReact 会逐一展开。

- Vue 代码：

```vue
<style scoped>
.a :deep(.x, .y) {
  color: red;
}
</style>
```

- VuReact 编译后 CSS：

```css
.a[data-css-abc123] .x,
.a[data-css-abc123] .y {
  color: red;
}
```

从示例可以看到：`:deep(.x, .y)` 被展开为两个独立的选择器 `.x` 和 `.y`，各自与左侧 `.a[data-css-abc123]` 拼接。

## `:slotted()`：插槽样式

`:slotted()` 用于为插槽传入的内容设置样式，VuReact 当前的处理方式是**简单解包**。

- Vue 代码：

```vue
<style scoped>
.component {
  :slotted(.slotted-content) {
    display: flex;
  }
}
</style>
```

- VuReact 编译后 CSS：

```css
.component[data-css-abc123] {
  .slotted-content {
    display: flex;
  }
}
```

从示例可以看到：`:slotted(...)` 被移除，内部选择器 `.slotted-content` 保留，但**不加 scope**。完整的 `:slotted()` 语义支持仍在解决中。

## 复杂选择器共存

在一个组件中，`:global`、`:deep`、`:slotted` 可以与标准 scoped 选择器以及伪类（`:hover`、`::before` 等）混合使用。

- Vue 代码：

```vue
<style scoped>
.component {
  &:hover {
    opacity: 0.8;
  }
  &.active {
    font-weight: bold;
  }
  :global(.global-class) {
    color: green;
  }
  :deep(.nested-component) {
    background: yellow;
  }
  :slotted(.slotted-content) {
    display: flex;
  }
  &:not(:first-child) {
    margin-top: 20px;
  }
  &:nth-child(2n) {
    background: #f0f0f0;
  }
  &::before {
    content: '→';
  }
  &::placeholder {
    color: gray;
  }
}
</style>
```

- VuReact 编译后 CSS：

```css
.component[data-css-abc123] {
  &:hover {
    opacity: 0.8;
  }
  &.active {
    font-weight: bold;
  }
  .global-class {
    color: green;
  }
  & .nested-component {
    background: yellow;
  }
  .slotted-content {
    display: flex;
  }
  &:not(:first-child) {
    margin-top: 20px;
  }
  &:nth-child(2n) {
    background: #f0f0f0;
  }
  &::before {
    content: '→';
  }
  &::placeholder {
    color: gray;
  }
}
```

**共处规则**：

| 选择器类型      | 行为                          | scope 注入   |
| --------------- | ----------------------------- | ------------ |
| 标准选择器      | 尾部追加 `[data-css-xxx]`     | ✅           |
| 伪类/属性选择器 | 保持原样，插入 scope 在其之前 | ✅           |
| `:global(...)`  | 移除包装，内部不加 scope      | ✅           |
| `:deep(...)`    | 左侧加 scope，内部不加        | ✅           |
| `:slotted(...)` | 移除包装，内部不加 scope      | ⚠️（待完善） |

## 总结

VuReact 的作用域样式穿透选择器编译策略展示了**完整的 scoped 选择器转换能力**：

1. **`:global()` 转换**：移除 `:global(...)` 包装，内部选择器按全局样式输出，不加 scope
2. **`:deep()` 转换**：将选择器按 `:deep(...)` 位置切割，左侧加 scope，内部保持穿透能力，支持嵌套、组合器、逗号展开等复杂场景
3. **`:slotted()` 转换**：移除 `:slotted(...)` 包装，内部选择器保持原样（完整语义实现 WIP）
4. **伪类兼容**：`:hover`、`::before`、`:not()`、`:nth-child()` 等伪类保持原样，scope 只插入在伪类之前
5. **嵌套兼容**：与 SCSS/Less 的 `&` 嵌套语法协作良好

**支持的穿透选择器**：

| 选择器       | 状态        | 说明                     |
| ------------ | ----------- | ------------------------ |
| `:deep()`    | ✅ 完整支持 | 左侧 scoped + 右侧穿透   |
| `:global()`  | ✅ 完整支持 | 移除包装，全局样式       |
| `:slotted()` | ⚠️ 部分支持 | 解包处理，完整语义待完善 |

VuReact 的编译策略确保了从 Vue 到 React 的平滑迁移。编译后的 CSS 选择器既保持了 Vue scoped 样式的作用域隔离语义，又能通过 `:deep()` 和 `:global()` 灵活控制样式穿透范围，让迁移后的应用保持完整的 scoped 样式能力。
