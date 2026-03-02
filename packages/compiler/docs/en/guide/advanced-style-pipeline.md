# SFC Style Processing Pipeline

This chapter demonstrates how the compiler processes style blocks in SFCs, including `scoped`, `module`, and `less/sass` support.

## 1. Input Example (Vue)

```vue
<template>
  <div :class="$style.container">
    <h3 class="title">Style Pipeline</h3>
    <div :class="$style.content">Content</div>
  </div>
  <button class="button button-primary">Button</button>
</template>

<script setup lang="ts">
// @vr-name: Demo
</script>

<style module scoped lang="scss">
$primary-color: #1890ff;
$padding-base: 12px;

.container {
  padding: $padding-base;
  background-color: lighten($primary-color, 40%);

  .title {
    color: $primary-color;
    font-size: 24px;
  }

  .content {
    margin-top: $padding-base;
    border: 1px solid darken($primary-color, 10%);
    border-radius: 4px;
    padding: $padding-base / 2 $padding-base;
  }
}

@mixin button-variant($bg-color) {
  background-color: $bg-color;
  color: white;
  border: none;
  border-radius: 4px;
  padding: $padding-base / 2 $padding-base;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: darken($bg-color, 10%);
  }
}

.button {
  display: flex;
  margin-top: $padding-base;

  &-primary {
    @include button-variant(lighten($primary-color, 30%));
    color: darken($primary-color, 20%);
    border: 1px solid darken($primary-color, 10%);
  }
}
</style>
```

## 2. Output Illustration

```txt
.vureact/dist/src/components/
├─ Demo.tsx
└─ demo-<hash>.module.css
```

```tsx
import $style from './demo-abc123.module.css';

const Demo = memo(() => {
  return (
    <>
      <div className={$style.panel} data-css-abc123>
        <h3 className="title" data-css-abc123>
          Style Pipeline
        </h3>
        <div className={$style.content}>Content</div>
      </div>
      <button className="button button-primary">Button</button>
    </>
  );
});
```

CSS file content `demo-<hash>.module.css`:

```css
.container[data-css-abc123] {
  padding: 12px;
  background-color: rgb(228, 242.025974026, 255);
}

.container[data-css-abc123] .title[data-css-abc123] {
  color: #1890ff;
  font-size: 24px;
}

.container[data-css-abc123] .content[data-css-abc123] {
  margin-top: 12px;
  border: 1px solid rgb(0, 118.4415584416, 228);
  border-radius: 4px;
  padding: 6px 12px;
}

.button[data-css-abc123] {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.button[data-css-abc123] .btn-primary[data-css-abc123] {
  background-color: rgb(177, 217.5194805195, 255);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.button[data-css-abc123] .btn-primary[data-css-abc123]:hover {
  background-color: darken(rgb(177, 217.5194805195, 255), 10%);
}

.button[data-css-abc123] .btn-primary[data-css-abc123] {
  color: rgb(0, 91.9480519481, 177);
  border: 1px solid rgb(0, 118.4415584416, 228);
}
```

## 3. Key Points of Advanced Pipeline

1. `lang="scss"/"less"` will be preprocessed first before entering the CSS output phase.
2. `module` will be mapped to module imports (`$style.xxx`), and the module name can be customized.
3. `scoped` generates a scope identifier and injects it into native nodes (a stable ID generated based on the file path).
4. Complex `:class/:style` bindings will use runtime helpers (e.g., `dir.cls/dir.style`).

## 4. Current Boundaries

1. Multiple `<style>` blocks: Currently, the first style block is used as the main path.
2. `cssVars` (`v-bind()` CSS variables) are not in the scope of stable support.
3. `scoped + @import` requires careful verification for global pollution.

## Next Steps

- See [Non-SFC Script File Pipeline](./advanced-script-only-pipeline)
