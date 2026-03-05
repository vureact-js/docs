# Style File Processing Pipeline

This chapter demonstrates the compilation path of `*.(less|scss|sass)` (non-`.vue`) files in VuReact.

## 1. Applicable Scenarios

1. Retaining independent style files during the migration phase without rushing to integrate them into components.
2. Having a large number of independent `.less/.scss` files in the project that need unified processing.
3. Desiring to use the same set of compilation toolchain to process all style files.
4. Needing to retain the features of style preprocessors (variables, nesting, mixins, etc.).

In addition, VuReact automatically replaces the suffixes of style file paths (such as `.less`, `.sass`, `.scss`) imported in components, scripts, and style files with `.css`, provided that the [preprocessStyles](/api/config.html#compileroptions) option is enabled.

## 2. Input Example (LESS File)

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

## 3. Input Example (SCSS File)

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

## 4. Output Example (Compiled CSS)

Output of the original `Less` file:

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

Output of the original `Scss` file:

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

## 5. Key Points of the Processing Pipeline

1. **Preprocessing**: LESS/SCSS/SASS files are first converted to standard CSS by their respective preprocessors.
2. **Variable Calculation**: Preprocessor variables (`@variable` / `$variable`) are calculated to their actual values.
3. **Function Processing**: Built-in functions such as `lighten()`, `darken()`, etc., are evaluated.
4. **Nesting Expansion**: Nested selectors are expanded into a flat structure.
5. **Mixin Expansion**: `@mixin` and `.mixin()` are expanded at the point of use.
6. **Media Query Preservation**: `@media` queries are output as-is.

## 6. Differences from the SFC Style Pipeline

1. **No Scoping**: Independent style files are not automatically added with the `scoped` attribute, maintaining global styles.
2. **No Modularization**: CSS Modules are not automatically generated; class names need to be managed manually.
3. **No Component Binding**: Not bound to specific Vue components, and can be used as universal style files.
4. **Import Handling**: `@import` statements are processed correctly, but attention should be paid to path resolution.

## 7. Recommendations

1. **Migration Strategy**: First process independent style files through this pipeline, then gradually migrate to in-component styles.
2. **Path Management**: Pay attention to relative paths and alias configuration to ensure `@import` can be resolved correctly.
3. **Performance Considerations**: A large number of independent style files will increase build time; consider merging or lazy loading.
4. **Naming Conventions**: Use meaningful class name prefixes to avoid global style conflicts.
