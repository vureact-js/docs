# Scoped Styles Semantic Comparison

How do `<style scoped>` scoped styles in Vue SFCs transform into React code after VuReact compilation?

## Prerequisites

To avoid redundancy in example code and ensure clear understanding, let's establish two conventions:

1. Vue/React code examples in this document are simplified core logic, omitting full component wrappers and unrelated configurations.
2. Readers are assumed to be familiar with SFC scoped style block usage in Vue 3.

## Scoped Style Conversion → React CSS with Scope Identifiers

VuReact calculates and generates CSS **with scope identifiers**, using PostCSS processing to correctly associate style selectors with DOM attributes through proper injection.

- Vue code:

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

- VuReact compiled React code:

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

As shown in the example: Vue's `<style scoped>` block is compiled into CSS files with scope identifiers, and in React components, **only elements with class/id attributes** automatically inject `data-css-{hash}` attributes. VuReact's **scoped style conversion** functionality fully mimics Vue SFC's scoped style isolation mechanism, ensuring styles only take effect within the current component.

## Scope Injection Rules → React Attribute Injection Strategy

Scope attribute injection follows these rules:

1. **template elements**: No scope attributes injected
2. **slot elements**: No scope attributes injected
3. **Elements with class/id attributes**: Automatically inject `data-css-{hash}` attributes

Scope isolation principle:

1. **CSS selector enhancement**: Converts `.card` to `.card[data-css-hash]`
2. **DOM attribute injection**: Adds `data-css-hash` attributes to corresponding elements
3. **Style isolation**: Ensures styles only take effect on elements with same scope attributes
4. **Conflict avoidance**: Prevents style interference between components

## Summary

VuReact's Scoped style compilation strategy demonstrates **complete scoped style transformation capability**:

1. **PostCSS processing**: Processes Scoped styles through PostCSS, generating scope identifiers
2. **CSS selector enhancement**: Converts regular selectors to selectors with scope attributes
3. **DOM attribute injection**: Injects scope attributes in React component elements
4. **File separation**: Generates independent scoped style files

VuReact's compilation strategy ensures smooth migration from Vue to React, eliminating the need for developers to manually implement style isolation. The compiled code maintains both Vue's scoped style isolation mechanism and React's component design patterns, preserving complete style isolation capabilities in migrated applications.
