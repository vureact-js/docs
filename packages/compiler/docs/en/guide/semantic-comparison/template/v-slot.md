# v-slot Semantic Comparison

[VuReact](https://vureact.top/guide/introduction.html) is a tool that compiles Vue 3 code into standard, maintainable React code. Today, let's dive into the core: How does Vue's common `v-slot` directive transform into React code after VuReact compilation?

## Prerequisites

To avoid redundancy in example code and ensure clear understanding, let's establish two conventions:

1. Vue/React code examples in this document are simplified core logic, omitting full component wrappers and unrelated configurations.
2. Readers are assumed to be familiar with the usage of the v-slot directive in Vue 3.

### `v-slot` → React `children` / `props`

`v-slot` (shorthand `#`) is Vue's directive for defining and using slots, used for component content distribution and reuse.

- Vue code:

```vue
<!-- Parent component -->
<MyComponent>
  <template #default>
    <p>Default slot content</p>
  </template>
</MyComponent>

<!-- Or shorthand -->
<MyComponent>
  <p>Default slot content</p>
</MyComponent>
```

- VuReact compiled React code:

```jsx
// Parent component
<MyComponent>
  <p>Default slot content</p>
</MyComponent>
```

As shown in the example: Vue's default slot is directly compiled into React's children. VuReact adopts a **children compilation strategy**, converting template slots to React's standard children passing approach, **fully preserving Vue's default slot semantics**—passing content as child elements to components.

Key characteristics of this compilation approach:

1. **Semantic consistency**: Fully mimics Vue default slot behavior for content distribution
2. **React native support**: Uses React's standard children mechanism without additional adaptation
3. **Syntax simplification**: Vue's `<template #default>` simplifies to directly passing child elements
4. **Performance optimization**: Directly uses React's native mechanism with no runtime overhead

## Named Slots → React `props`

Vue supports multiple named slots for more flexible content distribution.

- Vue code:

```vue
<!-- Parent component -->
<Layout>
  <template #header>
    <h1>Page Title</h1>
  </template>

  <template #main>
    <p>Main content area</p>
  </template>

  <template #footer>
    <p>Footer information</p>
  </template>
</Layout>
```

- VuReact compiled React code:

```jsx
// Parent component
<Layout
  header={<h1>Page Title</h1>}
  main={<p>Main content area</p>}
  footer={<p>Footer information</p>}
/>
```

As shown in the example: Vue's named slots are compiled into React's props. VuReact adopts a **props compilation strategy**, converting named slots to component's props attributes, **fully preserving Vue's named slot semantics**—distinguishing different slot content through different prop names.

## Scoped Slots → React `Function props`

Vue's scoped slots allow child components to pass data to parent components for more flexible rendering control.

- Vue code:

```vue
<!-- Parent component -->
<DataList :items="users">
  <template #item="slotProps">
    <div class="user-item">
      <span>{{ slotProps.user.name }}</span>
      <span>{{ slotProps.user.age }} years old</span>
    </div>
  </template>
</DataList>

<!-- Child component DataList.vue -->
<template>
  <ul>
    <li v-for="item in props.items" :key="item.id">
      <slot name="item" :user="item"></slot>
    </li>
  </ul>
</template>
```

- VuReact compiled React code:

```jsx
// Parent component
<DataList
  items={users}
  item={(slotProps) => (
    <div className="user-item">
      <span>{slotProps.user.name}</span>
      <span>{slotProps.user.age} years old</span>
    </div>
  )}
/>;

// Child component DataList.jsx
function DataList(props) {
  return (
    <ul>
      {props.items.map((itemData) => (
        <li key={itemData.id}>{props.item?.({ user: itemData })}</li>
      ))}
    </ul>
  );
}
```

As shown in the example: Vue's scoped slots are compiled into React's function props. VuReact adopts a **function props compilation strategy**, converting scoped slots to function props that receive parameters, **fully preserving Vue's scoped slot semantics**—child components pass data to parent components through function calls, and parent components receive data through function parameters and render.

## Dynamic Slot Names → React Computed Properties

Vue supports dynamic slot names for more flexible slot selection.

- Vue code:

```vue
<BaseLayout>
  <template #[dynamicSlotName]> Dynamic slot content </template>
</BaseLayout>
```

- VuReact compiled React code:

```jsx
<BaseLayout {...{ [dynamicSlotName]: 'Dynamic slot content' }} />
```

**Compilation strategy**:

1. **Computed property names**: Uses object computed property syntax `{ [key]: value }`
2. **Object spread**: Applies to component through object spread syntax
3. **Runtime processing**: Dynamic slot names need to be determined at runtime

## Slot Default Content → React Conditional Rendering

Vue supports providing default content at slot definition, displayed when parent components don't provide slot content.

- Vue code:

```vue
<!-- Child component Button.vue -->
<template>
  <button class="btn">
    <slot>
      <span>Default button text</span>
    </slot>
  </button>
</template>
```

- VuReact compiled React code:

```jsx
// Child component Button.jsx
function Button(props) {
  return <button className="btn">{props.children || <span>Default button text</span>}</button>;
}
```

**Default content handling rules**:

1. **children check**: Checks if children exists
2. **Default value rendering**: Renders default content when children is falsy
3. **React compatibility**: Uses standard React conditional rendering pattern

## Summary

VuReact's `v-slot` compilation strategy demonstrates **complete slot system transformation capability**:

1. **Default slots**: Convert to React's children
2. **Named slots**: Convert to component's props
3. **Scoped slots**: Convert to function props
4. **Dynamic slots**: Supports dynamic slot names
5. **Default content**: Supports slot default content

**Slot type mapping table**:

| Vue Slot Type | React Equivalent    | Description                               |
| ------------- | ------------------- | ----------------------------------------- |
| Default slot  | `children`          | As component's children                   |
| Named slot    | `prop`              | As component's property                   |
| Scoped slot   | `function prop`     | As function property receiving parameters |
| Dynamic slot  | `computed property` | Uses object computed property syntax      |

Performance optimization strategies:

1. **Static slot optimization**: Compiles static slot content to static JSX
2. **Function caching**: Intelligently caches render functions for scoped slots
3. **On-demand generation**: Generates minimal code based on actual usage
4. **Type inference**: Intelligently infers slot type definitions

VuReact's compilation strategy ensures smooth migration from Vue to React, eliminating the need for developers to manually rewrite slot logic. The compiled code maintains both Vue's semantics and flexibility while adhering to React's component design patterns, preserving complete content distribution capabilities in migrated applications.
