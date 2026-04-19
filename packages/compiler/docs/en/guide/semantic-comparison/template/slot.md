# Slot Semantic Comparison

How do Vue's common `<slot>` slots transform into React code after VuReact compilation?

## Prerequisites

To avoid redundancy in example code and ensure clear understanding, let's establish two conventions:

1. Vue/React code examples in this document are simplified core logic, omitting full component wrappers and unrelated configurations.
2. Readers are assumed to be familiar with slot usage in Vue 3.

## Default Slot → React `children`

Default slots are the most basic form of slots in Vue, used to receive default content passed from parent components.

- Vue code:

```html
<!-- Child component Child.vue -->
<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<!-- Parent component usage -->
<Child>
  <p>This is slot content</p>
</Child>
```

- VuReact compiled React code:

```jsx
// Child component Child.jsx
function Child(props) {
  return <div className="container">{props.children}</div>;
}

// Parent component usage
<Child>
  <p>This is slot content</p>
</Child>;
```

As shown in the example: Vue's `<slot>` element is compiled into React's `children` prop. VuReact adopts a **children compilation strategy**, converting slot outlets to React's standard children receiving approach, **fully preserving Vue's default slot semantics**—receiving and rendering child content passed from parent components.

Key characteristics of this compilation approach:

1. **Semantic consistency**: Fully mimics Vue default slot behavior for content distribution
2. **React native support**: Uses React's standard children mechanism without additional adaptation
3. **Syntax simplicity**: Vue's `<slot>` simplifies to `{children}` expression
4. **Performance optimization**: Directly uses React's native mechanism with no runtime overhead

## Named Slots → React `props`

Named slots allow components to define multiple slot outlets, with parent components specifying content insertion positions by name.

- Vue code:

```html
<!-- Child component Layout.vue -->
<template>
  <div class="layout">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<!-- Parent component usage -->
<Layout>
  <template #header>
    <h1>Page Title</h1>
  </template>

  <p>Main content</p>

  <template #footer>
    <p>Copyright information</p>
  </template>
</Layout>
```

- VuReact compiled React code:

```jsx
// Child component Layout.jsx
function Layout(props) {
  return (
    <div className="layout">
      <header>{props.header}</header>
      <main>{props.children}</main>
      <footer>{props.footer}</footer>
    </div>
  );
}

// Parent component usage
<Layout header={<h1>Page Title</h1>} footer={<p>Copyright information</p>}>
  <p>Main content</p>
</Layout>;
```

As shown in the example: Vue's named slots `<slot name="xxx">` are compiled into React's props. VuReact adopts a **props compilation strategy**, converting named slot outlets to component's named props, **fully preserving Vue's named slot semantics**—distinguishing different slot content through different prop names.

**Compilation rules**:

1. **Slot name mapping**: `<slot name="header">` → `header` prop
2. **Default slot**: `<slot>` → `children` prop
3. **Props receiving**: Destructure all slot props in component function parameters

## Scoped Slots → React Function `children` with Parameters

Scoped slots allow child components to pass data to slot content, enabling more flexible rendering control.

- Vue code:

```html
<!-- Child component List.vue -->
<template>
  <ul>
    <li v-for="(item, i) in props.items" :key="item.id">
      <slot :item="item" :index="i"></slot>
    </li>
  </ul>
</template>

<!-- Parent component usage -->
<List :items="users">
  <template v-slot="slotProps">
    <div class="user-item">{{ slotProps.index + 1 }}. {{ slotProps.item.name }}</div>
  </template>
</List>
```

- VuReact compiled React code:

```jsx
// Child component List.jsx
function List(props) {
  return (
    <ul>
      {props.items.map((item, index) => (
        <li key={item.id}>{props.children?.({ item, index })}</li>
      ))}
    </ul>
  );
}

// Parent component usage
<List
  items={users}
  children={(slotProps) => (
    <div className="user-item">
      {slotProps.index + 1}. {slotProps.item.name}
    </div>
  )}
/>;
```

As shown in the example: Vue's scoped slots are compiled into React's function children. VuReact adopts a **function children compilation strategy**, converting scoped slot outlets to functions that receive parameters, **fully preserving Vue's scoped slot semantics**—child components pass data to parent components through function calls, and parent components receive data through function parameters and render.

**Compilation rules**:

1. **Slot attribute conversion**: `<slot :item="item" :index="i">` → function parameters `{ item, index }`
2. **Function call**: Calls `children()` function at render position and passes data
3. **Optional chaining protection**: Uses `?.` to avoid errors when no slot content is provided

## Named Scoped Slots → React Function `props` with Parameters

Named scoped slots combine features of named slots and scoped slots.

- Vue code:

```html
<!-- Child component Table.vue -->
<template>
  <table>
    <thead>
      <tr>
        <slot name="header" :columns="props.columns"></slot>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in props.data" :key="row.id">
        <slot name="body" :row="row" :columns="props.columns"></slot>
      </tr>
    </tbody>
  </table>
</template>

<!-- Parent component usage -->
<table :columns="tableColumns" :data="tableData">
  <template #header="headerProps">
    <th v-for="col in headerProps.columns" :key="col.id">{{ col.title }}</th>
  </template>

  <template #body="bodyProps">
    <td v-for="col in bodyProps.columns" :key="col.id">{{ bodyProps.row[col.field] }}</td>
  </template>
</table>
```

- VuReact compiled React code:

```jsx
// Child component Table.jsx
function Table(props) {
  return (
    <table>
      <thead>
        <tr>{props.header?.({ columns: props.columns })}</tr>
      </thead>
      <tbody>
        {props.data.map((row) => (
          <tr key={row.id}>{props.body?.({ row, columns: props.columns })}</tr>
        ))}
      </tbody>
    </table>
  );
}

// Parent component usage
<Table
  columns={tableColumns}
  data={tableData}
  header={(headerProps) => (
    <>
      {headerProps.columns.map((col) => (
        <th key={col.id}>{col.title}</th>
      ))}
    </>
  )}
  body={(bodyProps) => (
    <>
      {bodyProps.columns.map((col) => (
        <td key={col.id}>{bodyProps.row[col.field]}</td>
      ))}
    </>
  )}
/>;
```

**Compilation strategy**:

1. **Named function props**: Named scoped slots convert to function props
2. **Parameter passing**: Correctly passes scoped parameters
3. **Fragment wrapping**: Multiple elements wrapped in Fragment
4. **Type safety**: Maintains completeness of TypeScript type definitions

## Slot Default Content → React Conditional Rendering

Vue supports providing default content at slot definition, displayed when parent components don't provide slot content.

- Vue code:

```html
<!-- Child component Button.vue -->
<template>
  <button class="btn">
    <slot>
      <span class="default-text">Click me</span>
    </slot>
  </button>
</template>
```

- VuReact compiled React code:

```jsx
// Child component Button.jsx
function Button(props) {
  return (
    <button className="btn">
      {props.children || <span className="default-text">Click me</span>}
    </button>
  );
}
```

**Default content handling rules**:

1. **Conditional rendering**: Uses `||` operator to check if children exists
2. **Default value provision**: Renders default content when children is falsy
3. **React pattern**: Uses standard React conditional rendering pattern

## Dynamic Slot Names → React Computed Properties

Vue supports dynamic slot names for more flexible slot selection.

- Vue code:

```html
<!-- Child component DynamicSlot.vue -->
<template>
  <div>
    <slot :name="dynamicSlotName"></slot>
  </div>
</template>
```

- VuReact compiled React code:

```jsx
// Child component DynamicSlot.jsx
function DynamicSlot(props) {
  return <div>{props[dynamicSlotName]}</div>;
}
```

**Dynamic slot handling**:

1. **Computed property names**: Uses object computed property syntax to receive dynamic slots
2. **Runtime determination**: Slot names determined at runtime

## Summary

VuReact's `<slot>` compilation strategy demonstrates **complete slot system transformation capability**:

1. **Default slots**: Convert to React's `children`
2. **Named slots**: Convert to component's named props
3. **Scoped slots**: Convert to function children or function props
4. **Default content**: Supports slot default content
5. **Dynamic slots**: Supports dynamic slot names

**Slot type mapping table**:

| Vue Slot Type                     | React Equivalent    | Description                                   |
| --------------------------------- | ------------------- | --------------------------------------------- |
| `<slot>`                          | `children`          | Default slot, as component's children         |
| `<slot name="xxx">`               | `xxx` prop          | Named slot, as component's property           |
| `<slot :prop="value">`            | Function `children` | Scoped slot, as function receiving parameters |
| `<slot name="xxx" :prop="value">` | Function `xxx` prop | Named scoped slot, as function property       |

Performance optimization strategies:

1. **Static slot optimization**: Compiles static slot content to static JSX
2. **Function caching**: Intelligently caches render functions for scoped slots
3. **On-demand generation**: Generates minimal code based on actual usage
4. **Type inference**: Supports intelligent type definition inference for slots in TypeScript

VuReact's compilation strategy ensures smooth migration from Vue to React, eliminating the need for developers to manually rewrite slot logic. The compiled code maintains both Vue's semantics and flexibility while adhering to React's component design patterns, preserving complete content distribution capabilities in migrated applications.
