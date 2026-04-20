# CSS Modules Semantic Comparison

How do `<style module>` CSS Modules styles in Vue SFCs transform into React code after VuReact compilation?

## Prerequisites

To avoid redundancy in example code and ensure clear understanding, let's establish two conventions:

1. Vue/React code examples in this document are simplified core logic, omitting full component wrappers and unrelated configurations.
2. Readers are assumed to be familiar with CSS Modules usage in Vue 3.

## Module Style Conversion → React `CSS Modules` Import

Vue's CSS Modules convert to React-compatible module import forms, maintaining class name mapping integrity.

- Vue code:

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

- VuReact compiled React code:

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

As shown in the example: Vue's `<style module>` block is compiled into CSS Modules files, used in React components through module import approach. VuReact's **CSS Modules conversion** functionality can be understood as "Vue CSS Modules in React style", **fully mimicking Vue SFC's module style mapping mechanism**, such as accessing compiled class names through `$style.container`, ensuring completeness of style modularization.

## Module Name Mapping → React Custom Module Import

CSS Modules support different module name mapping approaches:

1. **Default module name**: `$style` → `$style`
2. **Custom module name**: `<style module="custom">` → `custom`

**Custom module name example**:

- Vue code:

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

- VuReact compiled React code:

```tsx
// Component.jsx
import custom from './component-xyz123.module.css';

function Component() {
  return <div className={custom.container}>Custom Module</div>;
}
```

Module name mapping characteristics:

1. **Flexibility**: Supports custom module names, adapting to different project requirements
2. **Consistency**: Maintains module name consistency between Vue and React sides
3. **Import approach**: Uses ES6 module import syntax
4. **Type safety**: Complete type hints in TypeScript environments

## `CSS Modules` with `Scoped` → React Dual Style Isolation

CSS Modules can combine with Scoped styles for stronger style isolation.

- Vue code:

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

- VuReact compiled React code:

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

Scoped + Module combination advantages:

1. **Dual isolation**: Modular + scoped dual style isolation
2. **Class name safety**: Avoids class name conflicts
3. **Development experience**: Clear class name referencing approach
4. **Maintainability**: Easy to maintain and refactor

## Summary

VuReact's CSS Modules compilation strategy demonstrates **complete modular style transformation capability**:

1. **Module extraction**: Extracts Vue's CSS Modules as independent `.module.css` files
2. **Class name mapping**: Maintains class name mapping relationships, supports `$style.className` syntax
3. **Module import**: Converts to React-compatible module import approach

VuReact's compilation strategy ensures smooth migration from Vue to React, eliminating the need for developers to manually handle CSS Modules compatibility issues. The compiled code maintains both Vue's CSS Modules usage experience and React's modular design patterns, preserving complete style modularization capabilities in migrated applications.
