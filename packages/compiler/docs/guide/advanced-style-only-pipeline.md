# 样式文件处理链路

本章展示 `*.(less|scss|sass)`（非 `.vue`）在 VuReact 中的编译路径。

## 1. 适用场景

1. 迁移阶段保留独立的样式文件，不急于整合到组件中。
2. 项目中有大量独立的 `.less/.scss` 文件需要统一处理。
3. 希望使用同一套编译工具链处理所有样式文件。
4. 需要保持样式预处理器的特性（变量、嵌套、混合等）。

此外，VuReact 会自动将组件、脚本和样式文件中 `import` 的样式文件路径后缀（如 `.less`、`.sass`、`.scss`）替换为 `.css`，前提是 [preprocessStyles](/api/config.html#compileroptions) 选项处于开启状态。

## 2. 输入示例（LESS 文件）

```less src/styles/test-1.less
@primary-color: #1890ff;
@padding-base: 12px;

.container {
  padding: @padding-base;
  background-color: lighten(@primary-color, 40%);

  .title {
    color: @primary-color;
    font-size: 24px;
    &:hover {
      text-decoration: underline;
    }
  }

  .content {
    margin-top: @padding-base;
    border: 1px solid darken(@primary-color, 10%);
    border-radius: 4px;
    padding: @padding-base / 2;
  }

  .button-group {
    display: flex;
    gap: 8px;
    margin-top: @padding-base;

    .btn {
      padding: @padding-base / 2 @padding-base;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;

      &.primary {
        background-color: @primary-color;
        color: white;

        &:hover {
          background-color: darken(@primary-color, 10%);
        }
      }

      &.secondary {
        background-color: lighten(@primary-color, 30%);
        color: darken(@primary-color, 20%);
        border: 1px solid darken(@primary-color, 10%);

        &:hover {
          background-color: lighten(@primary-color, 20%);
        }
      }
    }
  }

  @media (max-width: 768px) {
    padding: @padding-base / 2;

    .title {
      font-size: 20px;
    }

    .button-group {
      flex-direction: column;
    }
  }
}
```

## 3. 输入示例（SCSS 文件）

```scss src/styles/test-2.scss
$primary-color: #1890ff;
$padding-base: 12px;

.container {
  padding: $padding-base;
  background-color: lighten($primary-color, 40%);

  .title {
    color: $primary-color;
    font-size: 24px;
    &:hover {
      text-decoration: underline;
    }
  }

  .content {
    margin-top: $padding-base;
    border: 1px solid darken($primary-color, 10%);
    border-radius: 4px;
    padding: $padding-base / 2;
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

  .button-group {
    display: flex;
    gap: 8px;
    margin-top: $padding-base;

    .btn {
      &-primary {
        @include button-variant($primary-color);
      }

      &-secondary {
        @include button-variant(lighten($primary-color, 30%));
        color: darken($primary-color, 20%);
        border: 1px solid darken($primary-color, 10%);
      }
    }
  }
}
```

## 4. 输出示例（编译后的 CSS）

原 `Less` 文件的输出：

```css
.container {
  padding: 12px;
  background-color: #e4f2ff;
}
.container .title {
  color: #1890ff;
  font-size: 24px;
}
.container .title:hover {
  text-decoration: underline;
}
.container .content {
  margin-top: 12px;
  border: 1px solid #0076e4;
  border-radius: 4px;
  padding: 6px;
}
.container .button-group {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
.container .button-group .btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}
.container .button-group .btn.primary {
  background-color: #1890ff;
  color: white;
}
.container .button-group .btn.primary:hover {
  background-color: #0076e4;
}
.container .button-group .btn.secondary {
  background-color: #b1daff;
  color: #005cb1;
  border: 1px solid #0076e4;
}
.container .button-group .btn.secondary:hover {
  background-color: #7ec1ff;
}
@media (max-width: 768px) {
  .container {
    padding: 6px;
  }
  .container .title {
    font-size: 20px;
  }
  .container .button-group {
    flex-direction: column;
  }
}
```

原 `Scss` 文件的输出：

```css
.container {
  padding: 12px;
  background-color: rgb(228, 242.025974026, 255);
}
.container .title {
  color: #1890ff;
  font-size: 24px;
}
.container .title:hover {
  text-decoration: underline;
}
.container .content {
  margin-top: 12px;
  border: 1px solid rgb(0, 118.4415584416, 228);
  border-radius: 4px;
  padding: 6px;
}
.container .button-group {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
.container .button-group .btn-primary {
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.3s;
}
.container .button-group .btn-primary:hover {
  background-color: rgb(0, 118.4415584416, 228);
}
.container .button-group .btn-secondary {
  background-color: rgb(177, 217.5194805195, 255);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.3s;
}
.container .button-group .btn-secondary:hover {
  background-color: rgb(126, 193.012987013, 255);
}
.container .button-group .btn-secondary {
  color: rgb(0, 91.9480519481, 177);
  border: 1px solid rgb(0, 118.4415584416, 228);
}
```

## 5. 处理链路要点

1. **预处理**：LESS/SCSS/SASS 文件会先经过对应的预处理器转换为标准 CSS。
2. **变量计算**：预处理器变量（`@variable` / `$variable`）会被计算为实际值。
3. **函数处理**：内置函数如 `lighten()`、`darken()` 等会被计算。
4. **嵌套展开**：嵌套的选择器会被展开为扁平结构。
5. **混合宏展开**：`@mixin` 和 `.mixin()` 会被展开到使用位置。
6. **媒体查询保持**：`@media` 查询会保持原样输出。

## 6. 和 SFC 样式链路的区别

1. **无作用域**：独立的样式文件不会自动添加 `scoped` 属性，保持全局样式。
2. **无模块化**：不会自动生成 CSS Modules，需要手动管理类名。
3. **无组件绑定**：不与特定 Vue 组件绑定，可作为通用样式文件使用。
4. **导入处理**：`@import` 语句会被正确处理，但需要注意路径解析。

## 7. 建议

1. **迁移策略**：先将独立的样式文件通过此链路处理，再逐步迁移到组件内样式。
2. **路径管理**：注意相对路径和别名配置，确保 `@import` 能正确解析。
3. **性能考虑**：大量独立的样式文件会增加构建时间，考虑合并或按需加载。
4. **命名规范**：使用有意义的类名前缀，避免全局样式冲突。
