# Style Preprocessors Semantic Comparison

How do style languages in Vue (like `SCSS`, `Less`, etc.) transform into React code after VuReact compilation?

## Prerequisites

To avoid redundancy in example code and ensure clear understanding, let's establish two conventions:

1. Vue/React code examples in this document are simplified core logic, omitting full component wrappers and unrelated configurations.
2. Readers are assumed to be familiar with style preprocessor usage.

VuReact compiler supports using common CSS preprocessors in Vue SFCs, such as `SCSS`, `Less`, etc., and converts them to standard `CSS` during compilation.

## `SCSS` → React `CSS` File

- Vue code:

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

- VuReact compiled React code:

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

As shown in the example: Vue's `<style lang="scss">` block is compiled into a standard CSS file, with preprocessor syntax converted during compilation.

## `Less` → React `CSS` File

- Vue code:

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

- VuReact compiled React code:

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

**Preprocessor support characteristics**:

1. **Syntax conversion**: Preprocessor syntax converted to standard CSS during compilation
2. **Variable handling**: Less's `@variable` and SCSS's `$variable` both correctly parsed
3. **Nesting support**: Supports selector nesting syntax
4. **Mixins/functions**: Supports color functions like `darken()`, `lighten()`, etc.

VuReact also supports independent style files, processed the same way as `<style lang>` blocks in SFCs.

## Independent `SCSS` File → React `CSS` Import

- Vue project structure:

```
src/
├── components/
│   ├── Button.vue
│   └── button.scss
│   └── other.scss
```

- `button.scss` file:

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

- Usage in `Button.vue`:

```vue
<template>
  <button class="button">Click me</button>
</template>

<script setup>
import './button.scss';
</script>
```

- VuReact compiled React code:

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

## Independent `Less` File → React `CSS` Import

- Vue project structure:

```
src/
├── components/
│   ├── Card.vue
│   └── card.less
```

- `card.less` file:

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

- Usage in `Card.vue`:

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

- VuReact compiled React code:

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

Independent file processing characteristics:

1. **File recognition**: Automatically identifies preprocessor type based on file extension
2. **Import conversion**: Converts `.scss`, `.less` imports to `.css` imports
3. **Syntax processing**: Consistent with `<style lang>` processing in SFCs
4. **Path preservation**: Maintains original file path structure

## Summary

VuReact's style language compilation strategy demonstrates **complete preprocessor transformation capability**:

1. **Language identification**: Identifies preprocessor type based on `lang` attribute or file extension
2. **Syntax conversion**: Converts preprocessor syntax to standard CSS during compilation
3. **File generation**: Generates corresponding CSS files
4. **Import adaptation**: Automatically adapts to React's import approach
5. **Import handling**: Supports `@import` statements

Supported preprocessors:

1. **SCSS/Sass**: Supports `.scss`, `.sass` files
2. **Less**: Supports `.less` files

VuReact's compilation strategy ensures smooth migration from Vue to React, eliminating the need for developers to manually convert preprocessor code. The compiled code maintains both Vue's preprocessor usage experience and React's style organization approach, preserving complete style preprocessing capabilities in migrated applications.
