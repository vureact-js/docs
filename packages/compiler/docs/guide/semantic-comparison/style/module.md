# `<style module>` 语义对照

解析 Vue SFC 中的 `<style module>` CSS Modules 样式经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 CSS Modules 的用法。

## 模块样式转换 → React `CSS Modules` 导入

Vue 的 CSS Modules 会转换为 React 兼容的模块导入形式，保持类名映射的完整性。

- Vue 代码：

```vue
<!-- Component.vue -->
<template>
  <div :class="$style.container">Hello</div>
</template>

<style module>
.container {
  padding: 20px;
  background: #f5f5f5;
}
</style>
```

- VuReact 编译后 React 代码：

```tsx
// Component.jsx
import $style from './component-abc1234.module.css';

function Component() {
  return <div className={$style.container}>Hello</div>;
}
```

```css
/* component-abc1234.module.css */
.container {
  padding: 20px;
  background: #f5f5f5;
}
```

从示例可以看到：Vue 的 `<style module>` 块被编译为 CSS Modules 文件，并在 React 组件中通过模块导入方式使用。VuReact 提供的**CSS Modules 转换**功能，可理解为「React 版的 Vue CSS Modules」，**完全模拟 Vue SFC 的模块样式映射机制**，例如通过 `$style.container` 访问编译后的类名，确保样式模块化的完整性。

## 模块名映射 → React 自定义模块导入

CSS Modules 支持不同的模块名映射方式：

1. **默认模块名**：`$style` → `$style`
2. **自定义模块名**：`<style module="custom">` → `custom`

**自定义模块名示例**：

- Vue 代码：

```vue
<!-- Component.vue -->
<template>
  <div :class="custom.container">Custom Module</div>
</template>

<style module="custom">
.container {
  margin: 10px;
  border: 1px solid #ccc;
}
</style>
```

- VuReact 编译后 React 代码：

```tsx
// Component.jsx
import custom from './component-xyz123.module.css';

function Component() {
  return <div className={custom.container}>Custom Module</div>;
}
```

模块名映射特点：

1. **灵活性**：支持自定义模块名，适应不同项目需求
2. **一致性**：保持 Vue 和 React 端的模块名一致
3. **导入方式**：使用 ES6 模块导入语法
4. **类型安全**：TypeScript 环境下有完整的类型提示

## 带 `Scoped` 的 `CSS Modules` → React 双重样式隔离

CSS Modules 可以与 Scoped 样式结合使用，提供更强的样式隔离。

- Vue 代码：

```vue
<!-- Component.vue -->
<template>
  <div :class="$style.wrapper">
    <span :class="$style.text">Text Content</span>
  </div>
</template>

<style module scoped>
.wrapper {
  padding: 20px;
  background: #f8f8f8;
}

.text {
  color: #333;
  font-size: 16px;
}
</style>
```

- VuReact 编译后 React 代码：

```tsx
// Component.jsx
import $style from './component-abc123.module.css';

function Component() {
  return (
    <div className={$style.wrapper} data-css-abc123>
      <span className={$style.text} data-css-abc123>
        Text Content
      </span>
    </div>
  );
}
```

```css
/* component-abc123.module.css */
.wrapper[data-css-abc123] {
  padding: 20px;
  background: #f8f8f8;
}

.text[data-css-abc123] {
  color: #333;
  font-size: 16px;
}
```

Scoped + Module 组合优势：

1. **双重隔离**：模块化 + 作用域双重样式隔离
2. **类名安全**：避免类名冲突
3. **开发体验**：清晰的类名引用方式
4. **维护性**：易于维护和重构

## 总结

VuReact 的 CSS Modules 编译策略展示了**完整的模块化样式转换能力**：

1. **模块提取**：将 Vue 的 CSS Modules 提取为独立的 `.module.css` 文件
2. **类名映射**：保持类名映射关系，支持 `$style.className` 语法
3. **模块导入**：转换为 React 兼容的模块导入方式

VuReact 的编译策略确保了从 Vue 到 React 的平滑迁移，开发者无需手动处理 CSS Modules 的兼容性问题。编译后的代码既保持了 Vue 的 CSS Modules 使用体验，又符合 React 的模块化设计模式，让迁移后的应用保持完整的样式模块化能力。
