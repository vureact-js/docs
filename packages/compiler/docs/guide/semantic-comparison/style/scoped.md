# 作用域样式语义对照

解析 Vue SFC 中的 `<style scoped>` 作用域样式经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 SFC 作用域样式块的用法。

## 作用域样式转换 → React 带作用域标识 `CSS`

VuReact 会计算并生成`带作用域标识`的 CSS，并借助 PostCSS 处理，将样式选择器与 DOM 属性进行正确的关联注入。

- Vue 代码：

```vue
<!-- Counter.vue -->
<template>
  <div class="card">
    <p>Header</p>
    <p class="content">Content</p>
  </div>
  <button>Submit</button>
</template>

<style scoped>
.card {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
}
.card:hover {
  background: #2a8c5e;
}
.content {
  font-size: 12px;
}
</style>
```

- VuReact 编译后 React 代码：

```tsx
// Counter.jsx
import './counter-abc1234.css';

function Counter() {
  return (
    <div className="card" data-css-abc1234>
      <p>Header</p>
      <p className="content" data-css-abc1234>Content</p>
    </div>
    <button>Submit</button>
  );
}
```

```css
/* counter-abc1234.css */
.card[data-css-abc1234] {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
}
.card[data-css-abc1234]:hover {
  background: #2a8c5e;
}
.content[data-css-abc1234] {
  font-size: 12px;
}
```

从示例可以看到：Vue 的 `<style scoped>` 块被编译为带作用域标识的 CSS 文件，并在 React 组件中**只对有 class/id 属性的元素标签**自动注入 `data-css-{hash}` 属性。VuReact 的**作用域样式转换**功能完全模拟 Vue SFC 的作用域样式隔离机制，确保样式只在当前组件内生效。

## 作用域注入规则 → React 属性注入策略

作用域属性的注入遵循以下规则：

1. **template 元素**：不注入作用域属性
2. **slot 元素**：不注入作用域属性
3. **存在 class/id 属性的元素**：自动注入 `data-css-{hash}` 属性

作用域隔离原理：

1. **CSS 选择器增强**：将 `.card` 转换为 `.card[data-css-hash]`
2. **DOM 属性注入**：在对应元素上添加 `data-css-hash` 属性
3. **样式隔离**：确保样式只在具有相同作用域属性的元素上生效
4. **避免冲突**：防止组件间样式相互影响

## 总结

VuReact 的 Scoped 样式编译策略展示了**完整的作用域样式转换能力**：

1. **PostCSS 处理**：通过 PostCSS 处理 Scoped 样式，生成作用域标识
2. **CSS 选择器增强**：将普通选择器转换为带作用域属性的选择器
3. **DOM 属性注入**：在 React 组件元素中注入作用域属性
4. **文件分离**：生成独立的作用域样式文件

VuReact 的编译策略确保了从 Vue 到 React 的平滑迁移，开发者无需手动实现样式隔离。编译后的代码既保持了 Vue 的作用域样式隔离机制，又符合 React 的组件设计模式，让迁移后的应用保持完整的样式隔离能力。
