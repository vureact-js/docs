# Base Styles Semantic Comparison

How do `<style>` blocks in Vue SFCs transform into React code after VuReact compilation?

## Prerequisites

To avoid redundancy in example code and ensure clear understanding, let's establish two conventions:

1. Vue/React code examples in this document are simplified core logic, omitting full component wrappers and unrelated configurations.
2. Readers are assumed to be familiar with CSS styling.

## Basic Style Extraction → React `CSS` File Import

VuReact compiler extracts the first `<style>` block from Vue SFCs, generates independent CSS files, and automatically injects import statements.

- Vue code:

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

- VuReact compiled React code:

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

As shown in the example: Vue's `<style>` block is compiled into an independent CSS file with import statements automatically injected in the React component. VuReact's **style extraction and file generation** functionality can be understood as "Vue style processing in React style", **fully mimicking Vue SFC's style organization approach**, such as automatically generating corresponding CSS files while maintaining style isolation.

## File Naming Rules → React `CSS` File Naming

Generated CSS files follow these naming rules:

1. **Regular styles**: `{component-name}.css`
2. **Scoped styles**: `{component-name}-{hash}.css`
3. **Module styles**: `{component-name}.module.css`
4. **Scoped + module styles**: `{component-name}-{hash}.module.css`
5. **With language suffix**: e.g., `<style lang="scss">` preprocessed into `css` file

## Output File Structure → React Component File Structure

Typical output structure:

```txt
.vureact/react-app/src/components/Counter
├─ index.tsx                  # React component
├─ index.css                  # Regular style file (if exists)
├─ index-abc1234.css          # Scoped style file (if exists)
└─ index-abc1234.module.css   # CSS Modules file (if exists)
```

## Summary

VuReact's style compilation strategy demonstrates **complete style transformation capability**:

1. **Style extraction**: Extracts `<style>` blocks from Vue SFCs as independent CSS files
2. **File generation**: Generates corresponding CSS files based on style type
3. **Import injection**: Automatically injects style import statements in React components
4. **Preprocessor support**: Supports common preprocessors like SCSS, Less, etc.

Important considerations:

1. **Multiple style blocks**: Only the first `<style>` block takes effect, others generate warnings
2. **Dynamic styles**: Cannot analyze dynamic style blocks at compile time
3. **CSS variables**: `v-bind` bindings not supported

VuReact's compilation strategy ensures smooth migration from Vue to React, eliminating the need for developers to manually handle style files. The compiled code maintains both Vue's style organization approach and React's component design patterns, preserving complete style presentation capabilities in migrated applications.
