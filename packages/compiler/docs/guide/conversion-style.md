# 样式转换指南

> 说明：示例为简化对照，最终输出以本地编译产物为准。

## 1. 样式块提取与文件生成

### 基础样式提取

VuReact 编译器会提取 Vue SFC 中的第一个 `<style>` 块，生成独立的 CSS 文件并自动注入导入语句。

Vue 输入：

```vue
<template>
  <div class="container">Hello</div>
</template>

<style>
.container {
  padding: 20px;
  color: #333;
}
</style>
```

React 输出（示意）：

```tsx
// Counter.tsx
import './counter.css';

export default function Counter() {
  return <div className="container">Hello</div>;
}
```

```css
/* counter.css */
.container {
  padding: 20px;
  color: #333;
}
```

### 文件命名规则

生成的 CSS 文件遵循以下命名规则：

1. **普通样式**：`{组件名}.css`
2. **作用域样式**：`{组件名}-{hash}.css`
3. **模块样式**：`{组件名}-{hash}.module.css`
4. **带语言后缀**：根据 `<style lang="scss">` 生成对应后缀

## 2. Scoped 样式支持

### 作用域样式转换

Vue 的 `scoped` 样式通过 PostCSS 处理，生成带作用域标识的 CSS 并注入 DOM 属性。

Vue 输入：

```vue
<template>
  <div class="card">Content</div>
</template>

<style scoped>
.card {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
}
</style>
```

React 输出（示意）：

```tsx
// Counter.tsx
import './counter-abc1234.css';

export default function Counter() {
  return (
    <div className="card" data-v-abc1234>
      Content
    </div>
  );
}
```

```css
/* counter-abc1234.css */
.card[data-v-abc1234] {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
}
```

### 作用域注入规则

1. **组件元素**：不注入作用域属性（如自定义组件）
2. **动态组件**：不注入作用域属性（如 `<component :is="...">`）
3. **原生元素**：自动注入 `data-v-{hash}` 属性

## 3. CSS Modules 支持

### 模块样式转换

Vue 的 CSS Modules 会转换为 React 兼容的模块导入形式。

Vue 输入：

```vue
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

React 输出（示意）：

```tsx
// Counter.tsx
import $style from './counter-ghi789.module.css';

export default function Counter() {
  return <div className={$style.container}>Hello</div>;
}
```

```css
/* counter-ghi789.module.css */
.container {
  padding: 20px;
  background: #f5f5f5;
}
```

### 模块名映射

1. **默认模块名**：`$style` → `$style`
2. **自定义模块名**：`<style module="custom">` → `custom`

## 4. 样式语言支持

### 预处理器支持

编译器支持常见的 CSS 预处理器：

```vue
<style lang="scss" scoped>
$primary: #42b883;

.button {
  background: $primary;

  &:hover {
    background: darken($primary, 10%);
  }
}
</style>
```

```vue
<style lang="less" module>
@border-color: #e5e5e5;

.container {
  border: 1px solid @border-color;
}
</style>
```

### 输出处理

预处理器代码会在编译时转换为标准 CSS，生成对应的 CSS 文件。

## 5. 运行时样式辅助

### `dir.style` 辅助函数

复杂样式表达式会使用运行时辅助函数 `dir.style` 处理。

Vue 输入：

```vue
<template>
  <div :style="{ color, fontSize: size + 'px' }">Text</div>
  <div :style="[baseStyle, dynamicStyle]">Combined</div>
</template>
```

React 输出（示意）：

```tsx
import { dir } from '@vureact/runtime-core';

export default function Component() {
  return (
    <>
      <div style={dir.style({ color, fontSize: size + 'px' })}>Text</div>
      <div style={dir.style(baseStyle, dynamicStyle)}>Combined</div>
    </>
  );
}
```

### 样式字符串解析

内联样式字符串会自动解析为对象格式：

```vue
<template>
  <div style="color: red; font-size: 14px">Text</div>
</template>
```

```tsx
<div style={{ color: 'red', fontSize: '14px' }}>Text</div>
```

## 6. Class 绑定转换

### 复杂 Class 表达式

复杂 class 绑定会使用 `dir.cls` 辅助函数处理。

Vue 输入：

```vue
<template>
  <div :class="['card', active && 'is-active', { 'has-error': error }]">Content</div>
</template>
```

React 输出（示意）：

```tsx
import { dir } from '@vureact/runtime-core';

export default function Component() {
  return (
    <div className={dir.cls(['card', active && 'is-active', { 'has-error': error }])}>Content</div>
  );
}
```

## 7. 约束与限制

### 多个样式块

| 场景                 | 状态       | 说明                 |
| -------------------- | ---------- | -------------------- |
| 多个 `<style>` 块    | 不完整支持 | 仅首个生效，其余告警 |
| 混合 `scoped` 和全局 | 支持       | 但建议统一风格       |
| 动态样式块           | 不支持     | 编译时无法分析       |

### @import 限制

```vue
<style scoped>
/* 警告：@import 内容可能保留全局影响 */
@import './base.css';

.local {
  color: red;
}
</style>
```

编译器会发出警告，建议内联导入的样式以保持作用域。

### CSS 变量（CSS Custom Properties）

| 场景                   | 状态   | 说明         |
| ---------------------- | ------ | ------------ |
| 原生 CSS 变量定义      | 支持   | 正常输出     |
| `v-bind` 绑定 CSS 变量 | 不支持 | 解析阶段报错 |
| CSS 变量在 JS 中使用   | 不支持 | 需要手动处理 |

## 8. 输出文件结构

典型输出结构：

```txt
.vureact/dist/src/components/
├─ Counter.tsx                  # React 组件
├─ counter.css                  # 普通样式文件
├─ counter-abc1234.css          # Scoped 样式文件
└─ counter-abc1234.module.css   # CSS Modules 文件
```

文件生成规则：

1. **Hash 生成**：基于文件内容和路径生成唯一 hash
2. **路径保持**：保持与源文件相同的目录结构
3. **导入注入**：自动在组件中插入样式导入

## 9. 编译流程

### 样式处理阶段

1. **解析阶段**：提取 SFC 中的 `<style>` 块
2. **预处理阶段**：
   - 处理 `scoped` 样式，生成作用域标识
   - 处理 `module` 样式，生成模块映射
   - 处理预处理器代码
3. **文件生成阶段**：
   - 生成 CSS 文件
   - 注入作用域属性到模板
   - 生成样式导入语句
4. **后处理阶段**：
   - 优化 CSS 输出
   - 处理资源引用（如图片、字体）

### 作用域处理流程

```txt
Vue SFC → 提取 Style 块 → 是否有 scoped?
    ↓是                        ↓否
PostCSS 处理                直接输出
    ↓
生成作用域标识
    ↓
虚拟节点注入属性
    ↓
生成作用域 CSS             生成普通 CSS
    ↓                           ↓
输出 CSS 文件 ←───────────────┘
```

## 10. 最佳实践

### 样式组织建议

1. **单一样式块**：每个组件保持一个 `<style>` 块
2. **作用域选择**：
   - 组件私有样式：使用 `scoped`
   - 可复用样式：使用 CSS Modules
   - 全局样式：使用普通样式或外部 CSS
3. **预处理器**：项目统一使用一种预处理器

### 迁移策略

1. **渐进迁移**：
   - 先迁移无样式组件
   - 再迁移简单样式组件
   - 最后处理复杂样式
2. **测试验证**：
   - 视觉回归测试
   - 交互状态测试
   - 响应式布局测试
3. **性能优化**：
   - 合并重复样式
   - 移除未使用样式
   - 优化 CSS 选择器

### 常见问题处理

1. **样式冲突**：
   - 使用更具体的选择器
   - 增加作用域隔离
   - 重构样式结构
2. **性能问题**：
   - 避免深层嵌套
   - 减少通用选择器
   - 优化重绘重排
3. **维护性问题**：
   - 建立样式规范
   - 使用设计系统
   - 文档化样式约定

## 11. 与迁移策略的关系

样式是迁移中的高风险面，建议：

1. **建立基线**：先建立样式约束基线
2. **逐步扩大**：再扩大模块迁移范围
3. **回归测试**：每次迁移后做视觉回归

## 12. 下一步

- 查看 [运行时辅助工具](https://vureact-runtime.vercel.app/guide/utils/v-style.html) - 了解 `dir.xxx` 详细用法
