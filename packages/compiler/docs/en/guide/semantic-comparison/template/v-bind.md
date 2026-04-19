# v-bind Semantic Comparison

How do Vue's common `v-bind`/`:` directives transform into React code after VuReact compilation?

## Prerequisites

To avoid redundancy in example code and ensure clear understanding, let's establish two conventions:

1. Vue/React code examples in this document are simplified core logic, omitting full component wrappers and unrelated configurations.
2. Readers are assumed to be familiar with the usage of the v-bind directive in Vue 3.

## `v-bind` → React `JSX Attributes`

`v-bind` (shorthand `:`) is Vue's directive for dynamically binding HTML attributes, component `props`, `class`, and `style`.

- Vue code:

```vue
<img :src="imageUrl" :class="imageCls" />
```

- VuReact compiled React code:

```jsx
<img src={imageUrl} className={imageCls} />
```

As shown in the example: Vue's `:src` and `:class` directives are compiled into React's standard attribute syntax. VuReact adopts a **direct attribute compilation strategy**, converting template directives to React's JSX attributes, **fully preserving Vue's attribute binding semantics**—dynamically binding variable values to element attributes.

## `:class` → React `dir.cls()`

Vue supports complex `class` binding expressions, which VuReact handles through runtime helper functions.

- Vue code:

```vue
<div :class="['card', active && 'is-active', error ? 'has-error' : '']" />
```

- VuReact compiled React code:

```jsx
import { dir } from '@vureact/runtime-core';

<div className={dir.cls(['card', active && 'is-active', error ? 'has-error' : ''])} />;
```

## `:style` → React `dir.style()` Helper Function

Vue supports complex `style` binding expressions, which VuReact handles through runtime helper functions.

- Vue code:

```vue
<div :style="{ color: textColor, fontSize: size + 'px', 'background-color': bgColor }" />
```

- VuReact compiled React code:

```jsx
import { dir } from '@vureact/runtime-core';

<div style={dir.style({ color: textColor, fontSize: size + 'px', backgroundColor: bgColor })} />;
```

As shown in the example: Complex class and style bindings are compiled using [dir.cls()](https://runtime.vureact.top/en/guide/utils/v-cls.html) and [dir.style()](https://runtime.vureact.top/en/guide/utils/v-style.html) helper functions. VuReact adopts a **complex binding runtime processing strategy**, converting Vue's complex expressions to runtime function calls, **fully preserving Vue's dynamic styling semantics**.

**How runtime helper functions work**:

1. **`dir.cls()`**:
   - Handles various class formats: arrays, objects, strings
   - Automatically filters falsy values (false, null, undefined, '')
   - Merges duplicate class names
   - Generates final className string

2. **`dir.style()`**:
   - Handles object format styles
   - Automatically converts kebab-case to camelCase (`background-color` → `backgroundColor`)
   - Handles numeric values with units (automatically adds `px`, etc.)
   - Generates React-compatible style objects

**Compilation strategy details**:

```jsx
// Vue: :class="{ active: isActive, 'text-danger': hasError }"
// React: className={dir.cls({ active: isActive, 'text-danger': hasError })}

// Vue: :class="[isActive ? 'active' : '', errorClass]"
// React: className={dir.cls([isActive ? 'active' : '', errorClass])}

// Vue: :style="style"
// React: style={dir.style(style)}
```

### Parameterless `v-bind` → React Object Spread Syntax

Vue supports parameterless `v-bind` for spreading an entire object as element attributes.

- Vue code:

```vue
<Comp v-bind="props">Click</Comp>
```

- VuReact compiled React code:

```jsx
import { dir } from '@vureact/runtime-core';

<Comp {...dir.keyless(props)}>Click</Comp>;
```

As shown in the example: Parameterless `v-bind` is compiled using the [dir.keyless()](https://runtime.vureact.top/en/guide/utils/v-keyless.html) helper function and object spread syntax. VuReact adopts an **object spread compilation strategy**, converting Vue's object binding to React's object spread, **fully preserving Vue's object attribute binding semantics**.

**`dir.keyless()` helper function functions**:

1. **Attribute conflict handling**: Handles conflicts between object properties and existing attributes
2. **Special attribute conversion**: Automatically converts `class` → `className`, `for` → `htmlFor`, etc.
3. **Style object handling**: Recognizes and correctly handles style objects
4. **Event handling**: Recognizes and converts event attributes (`@click` → `onClick`)

## Dynamic Attribute Name Binding → React Computed Property Names

Vue supports using dynamic expressions as attribute names (though not recommended), which VuReact also handles correctly.

- Vue code:

```vue
<div :[dynamicAttr]="value">Content</div>
```

- VuReact compiled React code:

```jsx
<div {...{ [dynamicAttr]: value }}>Content</div>
```

**Compilation strategy**:

1. **Computed property names**: Uses object computed property syntax `{ [key]: value }`
2. **Object spread**: Applies to element through object spread syntax

## Summary

VuReact's v-bind compilation strategy demonstrates **complete attribute binding transformation capability**:

1. **Basic attribute mapping**: Precisely maps Vue attribute bindings to React JSX attributes
2. **Complex style handling**: Supports complex class and style bindings through runtime helper functions
3. **Object spread support**: Fully supports parameterless v-bind object spread semantics
4. **Boolean attribute handling**: Correctly handles special behavior of boolean attributes
5. **Dynamic attribute names**: Supports dynamic expressions as attribute names
6. **Component props conversion**: Correctly handles props passing between components

Performance optimization strategies:

1. **On-demand import**: Only imports `dir` helper functions when complex bindings are used
2. **Cache optimization**: Intelligently caches processing results for identical expressions
3. **Compile-time optimization**: Generates inline logic directly for simple expressions

VuReact's compilation strategy ensures smooth migration from Vue to React, eliminating the need for developers to manually rewrite attribute binding logic. The compiled code maintains both Vue's semantics and functionality while adhering to React's attribute handling best practices, preserving complete UI presentation capabilities in migrated applications.
