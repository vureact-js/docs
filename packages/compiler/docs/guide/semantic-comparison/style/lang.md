# 样式预处理器语义对照

解析 Vue 中的样式预处理器（如 `SCSS`、`Less` 等）经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉样式预处理器的用法。

VuReact 编译器支持在 Vue SFC 中使用常见的 CSS 预处理器，如 `SCSS`、`Less` 等，并在编译时转换为标准 `CSS`。

## `SCSS` → React `CSS` 文件

- Vue 代码：

```vue
<!-- Button.vue -->
<template>
  <button class="button">Click me</button>
</template>

<style lang="scss">
$primary: #42b883;

.button {
  background: $primary;
  padding: 12px 24px;
  border-radius: 4px;
  color: white;

  &:hover {
    background: darken($primary, 10%);
  }
}
</style>
```

- VuReact 编译后 React 代码：

```tsx
// Button.jsx
import './button.css';

function Button() {
  return <button className="button">Click me</button>;
}
```

```css
/* button.css */
.button {
  background: #42b883;
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
}

.button:hover {
  background: rgba(#42b883, 10%);
}
```

从示例可以看到：Vue 的 `<style lang="scss">` 块被编译为标准 CSS 文件，预处理器语法在编译时被转换。

## `Less` → React `CSS` 文件

- Vue 代码：

```vue
<!-- Card.vue -->
<template>
  <div class="card">
    <h3 class="title">Card Title</h3>
  </div>
</template>

<style lang="less">
@border-color: #e5e5e5;

.card {
  border: 1px solid @border-color;
  border-radius: 8px;
  padding: 16px;

  .title {
    color: #333;
    font-size: 18px;
  }
}
</style>
```

- VuReact 编译后 React 代码：

```tsx
// Card.jsx
import './card.css';

function Card() {
  return (
    <div className="card">
      <h3 className="title">Card Title</h3>
    </div>
  );
}
```

```css
/* card.css */
.card {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 16px;
}

.card .title {
  color: #333;
  font-size: 18px;
}
```

**预处理器支持特点**：

1. **语法转换**：预处理器语法在编译时转换为标准 CSS
2. **变量处理**：Less 的 `@variable` 和 SCSS 的 `$variable` 都被正确解析
3. **嵌套支持**：支持选择器嵌套语法
4. **混合函数**：支持 `darken()`、`lighten()` 等颜色函数

VuReact 同样支持独立的样式文件，处理方式与 SFC 中的 `<style lang>` 块相同。

## 独立 `SCSS` 文件 → React `CSS` 导入

- Vue 项目结构：

```
src/
├── components/
│   ├── Button.vue
│   └── button.scss
│   └── other.scss
```

- `button.scss` 文件：

```scss
@import url('./other.scss');

$primary: #42b883;

.button {
  background: $primary;
  padding: 12px 24px;
  border-radius: 4px;
  color: white;

  &:hover {
    background: darken($primary, 10%);
  }
}
```

- `Button.vue` 中使用：

```vue
<template>
  <button class="button">Click me</button>
</template>

<script setup>
import './button.scss';
</script>
```

- VuReact 编译后 React 代码：

```tsx
// Button.jsx
import './button.css';

function Button() {
  return <button className="button">Click me</button>;
}
```

```css
/* button.css */
@import url('./other.css');

.button {
  background: #42b883;
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
}

.button:hover {
  background: rgba(#42b883, 10%);
}
```

## 独立 `Less` 文件 → React `CSS` 导入

- Vue 项目结构：

```
src/
├── components/
│   ├── Card.vue
│   └── card.less
```

- `card.less` 文件：

```less
@border-color: #e5e5e5;

.card {
  border: 1px solid @border-color;
  border-radius: 8px;
  padding: 20px;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .title {
    font-size: 18px;
    color: #333;
  }
}
```

- `Card.vue` 中使用：

```vue
<template>
  <div class="card">
    <h3 class="title">Card Title</h3>
  </div>
</template>

<script setup>
import './card.less';
</script>
```

- VuReact 编译后 React 代码：

```tsx
// Card.jsx
import './card.css';

function Card() {
  return (
    <div className="card">
      <h3 className="title">Card Title</h3>
    </div>
  );
}
```

```css
/* card.css */
.card {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 20px;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card .title {
  font-size: 18px;
  color: #333;
}
```

独立文件处理特点：

1. **文件识别**：根据文件后缀自动识别预处理器类型
2. **导入转换**：将 `.scss`、`.less` 导入转换为 `.css` 导入
3. **语法处理**：与 SFC 中的 `<style lang>` 处理方式一致
4. **路径保持**：保持原始文件路径结构

## 总结

VuReact 的样式语言编译策略展示了**完整的预处理器转换能力**：

1. **语言识别**：根据 `lang` 属性或文件后缀识别预处理器类型
2. **语法转换**：在编译时将预处理器语法转换为标准 CSS
3. **文件生成**：生成对应的 CSS 文件
4. **导入适配**：自动适配 React 的导入方式
5. **导入处理**：支持 `@import` 语句

支持的预处理器：

1. **SCSS/Sass**：支持 `.scss`、`.sass` 文件
2. **Less**：支持 `.less` 文件

VuReact 的编译策略确保了从 Vue 到 React 的平滑迁移，开发者无需手动转换预处理器代码。编译后的代码既保持了 Vue 的预处理器使用体验，又符合 React 的样式组织方式，让迁移后的应用保持完整的样式预处理能力。
