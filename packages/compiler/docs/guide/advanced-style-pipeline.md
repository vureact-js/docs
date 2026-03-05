# 组件内样式

本章展示编译器如何处理 SFC 中的样式块，包括 `scoped`、`module`、`less/sass`。

## 1. 输入示例（Vue）

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

## 2. 产物示意

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

CSS 文件内容 `demo-<hash>.module.css`:

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
  padding: 6px;
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

.button[data-css-abc123] .btn-primary[data-css-abc123] {
  color: rgb(0, 91.9480519481, 177);
  border: 1px solid rgb(0, 118.4415584416, 228);
}
```

## 3. 高级链路要点

1. `lang="scss"/"less"` 会先预处理，再进入 CSS 输出阶段。
2. `module` 会映射为模块导入（`$style.xxx`），可自定义模块名。
3. `scoped` 会生成作用域标识并注入到原生节点（根据文件路径生成稳定 id）。
4. 复杂 `:class/:style` 绑定会走 runtime 辅助（如 `dir.cls/dir.style`）。

## 4. 当前边界

1. 多个 `<style>` 块：当前以首个样式块为主路径。
2. `cssVars`（`v-bind()` CSS 变量）不在稳定支持范围。
3. `scoped + @import` 需谨慎验证全局污染。

## 下一步

- 查看 [非 SFC 脚本文件链路](./advanced-script-only-pipeline)
