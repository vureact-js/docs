# Deep Selector Semantic Comparison

How do the piercing selectors (`:deep`/`:global`/`:slotted`) in Vue scoped styles transform into React code after VuReact compilation?

## Prerequisites

To avoid redundancy in example code and ensure clear understanding, let's establish two conventions:

1. Vue/React code examples in this document are simplified core logic, omitting full component wrappers and unrelated configurations.
2. Readers are assumed to be familiar with using `:deep`/`:global`/`:slotted` selectors in styles.

## `:global()`: Declaring Global Styles

`:global()` is used to declare a block of styles within scoped styles that are not subject to scope restrictions. VuReact's approach: **removes the `:global()` wrapper and preserves the inner selectors as-is**.

- Vue code:

```vue
<!-- Component.vue -->
<template>
  <div class="component">
    <div class="global-class">Global Class</div>
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

- VuReact compiled CSS:

```css
/* component-abc123.css */
.component[data-css-abc123] {
  .global-class {
    color: green;
  }
}
```

As shown in the example: `:global(...)` is completely removed, the inner selector is expanded as usual, and **no scope attribute is added**. This makes `.global-class` a globally available style class.

## `:deep()`: Style Piercing

`:deep()` is the most commonly used piercing selector in scoped styles, allowing parent component styles to affect elements inside child components. VuReact's strategy: **adds scope to the selector on the left side of `:deep(...)`, while the selector on the right side (inside `:deep`) remains unchanged**.

- Vue code:

```vue
<!-- Component.vue -->
<template>
  <div class="component">
    <div class="nested-component">Deeply Nested Component</div>
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

- VuReact compiled CSS:

```css
/* component-abc123.css */
.component[data-css-abc123] {
  & .nested-component {
    background: yellow;
  }
}
```

As shown in the example: in nested rules, the left side of `:deep()` is `.component` (with scope), and the right side `.nested-component` (without scope).

## Using `:deep()` in Single-Line Rules

`:deep()` can also be used in non-nested single-line rules, where the left part is still scoped.

- Vue code:

```vue
<style scoped>
.parent :deep(.btn) {
  color: red;
}
</style>
```

- VuReact compiled CSS:

```css
.parent[data-css-abc123] .btn {
  color: red;
}
```

## `:deep()` Adjacent to Selector

- Vue code:

```vue
<style scoped>
.parent:deep(.btn) {
  color: red;
}
</style>
```

- VuReact compiled CSS:

```css
.parent[data-css-abc123] .btn {
  color: red;
}
```

## `:deep()` with Combinator

- Vue code:

```vue
<style scoped>
.parent > :deep(.btn) {
  color: red;
}
</style>
```

- VuReact compiled CSS:

```css
.parent[data-css-abc123] > .btn {
  color: red;
}
```

## Standalone `:deep()`

When `:deep()` is positioned at the far left of a selector (with no left-side part), VuReact directly uses `[scopeId]` as the left side.

- Vue code:

```vue
<style scoped>
:deep(.btn) {
  color: red;
}
</style>
```

- VuReact compiled CSS:

```css
[data-css-abc123] .btn {
  color: red;
}
```

**Logic**: When the left side is empty, `[data-css-abc123]` itself is used as the scoped placeholder.

## `:deep()` Expanding Comma-Separated Selectors

`:deep()` can contain multiple comma-separated selectors, and VuReact expands each one individually.

- Vue code:

```vue
<style scoped>
.a :deep(.x, .y) {
  color: red;
}
</style>
```

- VuReact compiled CSS:

```css
.a[data-css-abc123] .x,
.a[data-css-abc123] .y {
  color: red;
}
```

As shown in the example: `:deep(.x, .y)` is expanded into two independent selectors `.x` and `.y`, each concatenated with the left side `.a[data-css-abc123]`.

## `:slotted()`: Slot Styles

`:slotted()` is used to style content passed into slots. VuReact's current approach is **simple unwrapping**.

- Vue code:

```vue
<style scoped>
.component {
  :slotted(.slotted-content) {
    display: flex;
  }
}
</style>
```

- VuReact compiled CSS:

```css
.component[data-css-abc123] {
  .slotted-content {
    display: flex;
  }
}
```

As shown in the example: `:slotted(...)` is removed, and the inner selector `.slotted-content` is preserved but **without scope**. Complete `:slotted()` semantic support is still being addressed.

## Coexistence of Complex Selectors

Within a single component, `:global`, `:deep`, `:slotted` can be mixed with standard scoped selectors and pseudo-classes (`:hover`, `::before`, etc.).

- Vue code:

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

- VuReact compiled CSS:

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

**Coexistence Rules**:

| Selector Type                    | Behavior                                               | Scope Injection |
| -------------------------------- | ------------------------------------------------------ | --------------- |
| Standard selectors               | Append `[data-css-xxx]` at the end                     | ✅              |
| Pseudo-class/attribute selectors | Kept as-is, scope inserted before them                 | ✅              |
| `:global(...)`                   | Removes wrapper, inner selectors without scope         | ✅              |
| `:deep(...)`                     | Adds scope to left side, inner selectors without scope | ✅              |
| `:slotted(...)`                  | Removes wrapper, inner selectors without scope         | ⚠️ (WIP)        |

## Summary

VuReact's scoped style piercing selector compilation strategy demonstrates **complete scoped selector transformation capability**:

1. **`:global()` conversion**: Removes `:global(...)` wrapper, inner selectors output as global styles without scope
2. **`:deep()` conversion**: Splits the selector at the `:deep(...)` position, adds scope to the left side, preserves piercing capability on the inside, supports complex scenarios such as nesting, combinators, and comma expansion
3. **`:slotted()` conversion**: Removes `:slotted(...)` wrapper, inner selectors remain unchanged (full semantic implementation WIP)
4. **Pseudo-class compatibility**: `:hover`, `::before`, `:not()`, `:nth-child()` and other pseudo-classes remain unchanged, scope only inserted before pseudo-classes
5. **Nesting compatibility**: Works well with SCSS/Less `&` nesting syntax

**Supported Piercing Selectors**:

| Selector     | Status             | Description                            |
| ------------ | ------------------ | -------------------------------------- |
| `:deep()`    | ✅ Full support    | Left side scoped + right side piercing |
| `:global()`  | ✅ Full support    | Removes wrapper, global styles         |
| `:slotted()` | ⚠️ Partial support | Unwrapping, full semantics WIP         |

VuReact's compilation strategy ensures smooth migration from Vue to React. The compiled CSS selectors maintain Vue scoped styles' isolation semantics while allowing flexible control over style piercing scope through `:deep()` and `:global()`, enabling migrated applications to retain complete scoped styling capabilities.
