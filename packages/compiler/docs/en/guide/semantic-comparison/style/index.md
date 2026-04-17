# Style Conversion Guide

> Note: Examples are simplified for comparison purposes; the final output shall be based on local compilation artifacts.

## 1. Style Block Extraction and File Generation

### Basic Style Extraction

The VuReact compiler extracts the first `<style>` block from a Vue SFC (Single-File Component), generates an independent CSS file, and automatically injects the import statement.

Vue Input:

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

React Output (illustration):

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

### File Naming Rules

Generated CSS files follow these naming conventions:

1. **Regular styles**: `{ComponentName}.css`
2. **Scoped styles**: `{ComponentName}-{hash}.css`
3. **Module styles**: `{ComponentName}-{hash}.module.css`
4. **Language suffixes**: Corresponding suffixes are generated based on `<style lang="scss">`

## 2. Scoped Style Support

### Scoped Style Conversion

Vue's `scoped` styles are processed via PostCSS to generate scoped CSS with unique identifiers and inject DOM attributes.

Vue Input:

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

React Output (illustration):

```tsx
// Counter.tsx
import './counter-abc1234.css';

export default function Counter() {
  return (
    <div className="card" data-css-abc1234>
      Content
    </div>
  );
}
```

```css
/* counter-abc1234.css */
.card[data-css-abc1234] {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
}
```

### Scope Injection Rules

1. **Component elements**: No scope attributes are injected (e.g., custom components)
2. **Dynamic components**: No scope attributes are injected (e.g., `<component :is="...">`)
3. **Native elements**: `data-css-{hash}` attribute is automatically injected

## 3. CSS Modules Support

### Module Style Conversion

Vue's CSS Modules are converted to React-compatible module import syntax.

Vue Input:

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

React Output (illustration):

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

### Module Name Mapping

1. **Default module name**: `$style` → `$style`
2. **Custom module name**: `<style module="custom">` → `custom`

## 4. Style Language Support

### Preprocessor Support

The compiler supports common CSS preprocessors:

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
<style lang="less" module scoped>
@border-color: #e5e5e5;

.container {
  border: 1px solid @border-color;
}
</style>
```

Single style files also support `less` and `sass`:

```scss
$primary: #42b883;

.button {
  background: $primary;

  &:hover {
    background: darken($primary, 10%);
  }
}
```

React Output (illustration):

```css
.button[data-css-abc1234] {
  background: #42b883;
}

.button[data-css-abc1234]:hover {
  background: rgba(#42b883, 10%);
}
```

### Output Processing

Preprocessor code is transpiled to standard CSS during compilation, with corresponding CSS files generated.

## 5. Runtime Style Helpers

### `dir.style` Helper Function

Complex style expressions are processed using the runtime helper function `dir.style`.

Vue Input:

```vue
<template>
  <div :style="{ color, fontSize: size + 'px' }">Text</div>
  <div :style="[baseStyle, dynamicStyle]">Combined</div>
</template>
```

React Output (illustration):

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

### Style String Parsing

Inline style strings are automatically parsed into object format:

```vue
<template>
  <div style="color: red; font-size: 14px">Text</div>
</template>
```

```tsx
<div style={{ color: 'red', fontSize: '14px' }}>Text</div>
```

## 6. Class Binding Conversion

### Complex Class Expressions

Complex class bindings are processed using the `dir.cls` helper function.

Vue Input:

```vue
<template>
  <div :class="['card', active && 'is-active', { 'has-error': error }]">Content</div>
</template>
```

React Output (illustration):

```tsx
import { dir } from '@vureact/runtime-core';

export default function Component() {
  return (
    <div className={dir.cls(['card', active && 'is-active', { 'has-error': error }])}>Content</div>
  );
}
```

## 7. Constraints and Limitations

### Multiple Style Blocks

| Scenario                       | Status          | Description                                                |
| ------------------------------ | --------------- | ---------------------------------------------------------- |
| Multiple `<style>` blocks      | Partial support | Only the first block takes effect; others trigger warnings |
| Mixed scoped and global styles | Supported       | Unified style is recommended                               |
| Dynamic style blocks           | Not supported   | Cannot be analyzed at compile time                         |

### @import Limitations

```vue
<style scoped>
/* Warning: @import content may retain global effects */
@import './base.css';

.local {
  color: red;
}
</style>
```

The compiler issues a warning, recommending inlining imported styles to maintain scoping.

### CSS Variables (CSS Custom Properties)

| Scenario                       | Status        | Description              |
| ------------------------------ | ------------- | ------------------------ |
| Native CSS variable definition | Supported     | Output normally          |
| `v-bind` bound CSS variables   | Not supported | Errors during parsing    |
| CSS variables used in JS       | Not supported | Requires manual handling |

## 8. Output File Structure

Typical output structure:

```txt
.vureact/dist/src/components/
├─ Counter.tsx                  # React component
├─ counter.css                  # Regular style file
├─ counter-abc1234.css          # Scoped style file
└─ counter-abc1234.module.css   # CSS Modules file
```

File generation rules:

1. **Hash generation**: Unique hash generated based on file content and path
2. **Path preservation**: Maintains the same directory structure as the source file
3. **Import injection**: Automatically inserts style import statements in components

## 9. Compilation Process

### Style Processing Stages

1. **Parsing stage**: Extract `<style>` blocks from SFC
2. **Preprocessing stage**:
   - Process `scoped` styles and generate scope identifiers
   - Process `module` styles and generate module mappings
   - Process preprocessor code
3. **File generation stage**:
   - Generate CSS files
   - Inject scope attributes into templates
   - Generate style import statements
4. **Postprocessing stage**:
   - Optimize CSS output
   - Process resource references (e.g., images, fonts)

### Scope Processing Flow

```txt
Vue SFC → Extract Style block → Has scoped?
    ↓Yes                        ↓No
PostCSS processing            Direct output
    ↓
Generate scope identifier
    ↓
Inject attributes to virtual nodes
    ↓
Generate scoped CSS           Generate regular CSS
    ↓                           ↓
Output CSS file ←───────────────┘
```

## 10. Best Practices

### Style Organization Recommendations

1. **Single style block**: Maintain one `<style>` block per component
2. **Scope selection**:
   - Component-private styles: Use `scoped`
   - Reusable styles: Use CSS Modules
   - Global styles: Use regular styles or external CSS
3. **Preprocessor**: Use a single preprocessor consistently across the project

### Migration Strategy

1. **Progressive migration**:
   - Migrate style-free components first
   - Then migrate components with simple styles
   - Finally handle complex styles
2. **Test validation**:
   - Visual regression testing
   - Interactive state testing
   - Responsive layout testing
3. **Performance optimization**:
   - Merge duplicate styles
   - Remove unused styles
   - Optimize CSS selectors

### Common Issue Resolution

1. **Style conflicts**:
   - Use more specific selectors
   - Increase scope isolation
   - Refactor style structure
2. **Performance issues**:
   - Avoid deep nesting
   - Reduce universal selectors
   - Optimize repaints and reflows
3. **Maintainability issues**:
   - Establish style guidelines
   - Use a design system
   - Document style conventions

## 11. Relationship to Migration Strategy

Styles represent a high-risk aspect of migration; recommendations:

1. **Establish baseline**: First establish a style constraint baseline
2. **Gradual expansion**: Then expand the scope of module migration
3. **Regression testing**: Perform visual regression testing after each migration

## 12. Next Steps

- See [Runtime Helpers](https://runtime.vureact.top/guide/utils/v-style.html) - Learn detailed usage of `dir.xxx`
