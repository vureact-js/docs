# 基础样式语义对照

解析 Vue SFC 中的基础 `<style>` 样式块经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 css 样式。

## 基础样式提取 → React `CSS` 文件导入

VuReact 编译器会提取 Vue SFC 中的第一个 `<style>` 块，生成独立的 CSS 文件并自动注入导入语句。

- Vue 代码：

```vue
<!-- Comp.vue -->
<template>
  <div class="container"></div>
</template>

<style>
.container {
  padding: 20px;
  color: #333;
}
</style>
```

- VuReact 编译后 React 代码：

```tsx
// Comp.jsx
import './comp.css';

function Comp() {
  return <div className="container"></div>;
}
```

```css
/* comp.css */
.container {
  padding: 20px;
  color: #333;
}
```

从示例可以看到：Vue 的 `<style>` 块被编译为独立的 CSS 文件，并在 React 组件中自动注入导入语句。VuReact 提供的**样式提取与文件生成**功能，可理解为「React 版的 Vue 样式处理」，**完全模拟 Vue SFC 的样式组织方式**，例如自动生成对应的 CSS 文件并保持样式隔离。

## 文件命名规则 → React `CSS` 文件命名

生成的 CSS 文件遵循以下命名规则：

1. **普通样式**：`{组件名}.css`
2. **作用域样式**：`{组件名}-{hash}.css`
3. **模块样式**：`{组件名}.module.css`
4. **作用域 + 模块样式**：`{组件名}-{hash}.module.css`
5. **带语言后缀**：如 `<style lang="scss">` 预处理成 `css` 文件

## 输出文件结构 → React 组件文件结构

典型输出结构：

```txt
.vureact/react-app/src/components/Counter
├─ index.tsx                  # React 组件
├─ index.css                  # 普通样式文件（如果存在）
├─ index-abc1234.css          # Scoped 样式文件（如果存在）
└─ index-abc1234.module.css   # CSS Modules 文件（如果存在）
```

## 总结

VuReact 的样式编译策略展示了**完整的样式转换能力**：

1. **样式提取**：将 Vue SFC 中的 `<style>` 块提取为独立 CSS 文件
2. **文件生成**：根据样式类型生成对应的 CSS 文件
3. **导入注入**：自动在 React 组件中注入样式导入语句
4. **预处理器支持**：支持 SCSS、Less 等常见预处理器

注意事项：

1. **多个样式块**：仅首个 `<style>` 块生效，其余告警
2. **动态样式**：编译时无法分析动态样式块
3. **CSS 变量**：`v-bind` 绑定不支持

VuReact 的编译策略确保了从 Vue 到 React 的平滑迁移，开发者无需手动处理样式文件。编译后的代码既保持了 Vue 的样式组织方式，又符合 React 的组件设计模式，让迁移后的应用保持完整的样式表现能力。
