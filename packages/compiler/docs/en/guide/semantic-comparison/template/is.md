# Dynamic Component Semantic Comparison

How do Vue's common `is` and `:is` attributes transform into React code after VuReact compilation?

## Prerequisites

To avoid redundancy in example code and ensure clear understanding, let's establish two conventions:

1. Vue/React code examples in this document are simplified core logic, omitting full component wrappers and unrelated configurations.
2. Readers are assumed to be familiar with the usage and applicable scenarios of the `is` attribute in Vue 3.

## `:is` → React `<Component>` Adapter Component

The `:is` attribute is used for dynamic component rendering, allowing components to be rendered based on data.

- Vue code:

```vue
<component :is="currentComponent" />
```

- VuReact compiled React code:

```jsx
import { Component } from '@vureact/runtime-core';

<Component is={currentComponent} />;
```

As shown in the example: Vue's `:is` attribute is compiled into the `is` attribute of the [Component](https://runtime.vureact.top/en/guide/components/dynamic-components.html) **adapter component**, which can be understood as "Vue dynamic components in React style."

Key characteristics of this compilation approach:

1. **Semantic consistency**: Fully mimics Vue dynamic component behavior for component switching
2. **Component mapping**: Converts Vue's `<component>` element to VuReact Runtime's `<Component>` component
3. **Property passing**: Maintains dynamic binding capability of the `is` attribute

## Dynamic Components with `props`

Dynamic components often need to pass props, which VuReact also handles correctly.

- Vue code:

```vue
<component :is="currentView" :title="pageTitle" :data="pageData" @custom-event="handleCustom" />
```

- VuReact compiled React code:

```jsx
<Component is={currentView} title={pageTitle} data={pageData} onCustomEvent={handleCustom} />
```

**Props passing rules**:

1. **Property mapping**: Converts Vue attributes to React props
2. **Event conversion**: Converts Vue events to React event properties
3. **Type preservation**: Maintains completeness of prop type definitions
4. **Default value handling**: Correctly handles component default props

## Plain String `is`

- Vue code:

```vue
<div is="my-tag"></div>
```

- VuReact compiled React code:

```jsx
<div is="my-tag" />
```

As shown in the example: Vue's `is` attribute remains unchanged after compilation because React also supports the `is` attribute.

Key characteristics of this handling approach:

1. **Attribute preservation**: Maintains the original value of the `is` attribute
2. **DOM compatibility**: Ensures correct rendering in React
3. **Semantic consistency**: Maintains the same semantics as Vue

## With `'vue:'` Prefix → React Component Direct Replacement

- Vue code:

```vue
<div is="vue:user-info"></div>
```

- VuReact compiled React code:

```jsx
<UserInfo />
```

**Compilation strategy**:

1. **Component replacement**: Replaces `is="vue:user-info"` with `<UserInfo />`
2. **Vue prefix handling**: Automatically removes the `vue:` prefix

## Dynamic Components Combined with `v-bind`

Dynamic components are often used with `v-bind` for more flexible component configuration.

- Vue code:

```vue
<component :is="componentType" v-bind="componentProps" />
```

- VuReact compiled React code:

```jsx
import { dir } from '@vureact/runtime-core';

<Component is={componentType} {...dir.keyless(componentProps)} />;
```

**Object spread handling**:

1. **Property merging**: Correctly handles merging of `v-bind` objects with explicit properties
2. **Conflict resolution**: Handles property name conflicts
3. **Special property conversion**: Automatically converts special properties like `class`, `style`, etc.

## Summary

VuReact's `is`/`:is` compilation strategy demonstrates **complete dynamic component transformation capability**:

1. **Dynamic component rendering**: Converts `<component :is>` to `<Component is>`
2. **DOM limitation resolution**: Directly replaces `is="vue:component-name"` with components
3. **Props passing**: Correctly handles props passing for dynamic components
4. **Component caching**: Supports `<KeepAlive>` component caching
5. **Animation support**: Supports `<Transition>` component animations

**Differences between `is` and `:is`**:

| Feature                | `is` attribute                     | `:is` attribute                 |
| ---------------------- | ---------------------------------- | ------------------------------- |
| **Purpose**            | Resolves DOM template restrictions | Dynamically switches components |
| **Syntax**             | `is="vue:component-name"`          | `:is="componentName"`           |
| **Element**            | Used inside specific HTML elements | Used with `<component>` element |
| **Compilation result** | Directly replaced with component   | Uses `<Component is={...}>`     |

VuReact's compilation strategy ensures smooth migration from Vue to React, eliminating the need for developers to manually rewrite dynamic component logic. The compiled code maintains both Vue's semantics and flexibility while adhering to React's component rendering patterns, preserving complete dynamic component capabilities in migrated applications.
