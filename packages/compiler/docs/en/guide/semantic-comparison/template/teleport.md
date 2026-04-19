# Teleport Semantic Comparison

How does Vue's built-in `<Teleport>` component transform into React code after VuReact compilation?

## Prerequisites

To avoid redundancy in example code and ensure clear understanding, let's establish two conventions:

1. Vue/React code examples in this document are simplified core logic, omitting full component wrappers and unrelated configurations.
2. Readers are assumed to be familiar with the usage of the `<Teleport>` component in Vue 3.

## `Teleport` → React `Teleport` Adapter Component

`<Teleport>` is Vue's built-in component for rendering component content to other positions in the DOM tree, commonly used for modals, notifications, overlays, and other scenarios requiring rendering outside the current component hierarchy.

- Vue code:

```vue
<template>
  <Teleport to="body">
    <Modal />
  </Teleport>
</template>
```

- VuReact compiled React code:

```tsx
import { Teleport } from '@vureact/runtime-core';

<Teleport to="body">
  <Modal />
</Teleport>;
```

As shown in the example: Vue's `<Teleport>` component is compiled into the [Teleport](https://runtime.vureact.top/en/guide/components/teleport.html) **adapter component** provided by VuReact Runtime, which can be understood as "Vue Teleport in React style."

Key characteristics of this compilation approach:

1. **Semantic consistency**: Fully mimics Vue `<Teleport>` behavior for content teleportation
2. **DOM manipulation**: Renders child content to specified DOM positions
3. **React integration**: Implements teleportation functionality within React's virtual DOM system
4. **Performance optimization**: Intelligently manages DOM node mounting and unmounting

## `disabled` → React `disabled` Property

The `disabled` property can temporarily disable teleportation, rendering content at its original position.

- Vue code:

```vue
<template>
  <Teleport to="body" :disabled="isMobile">
    <Notification />
  </Teleport>
</template>
```

- VuReact compiled React code:

```tsx
<Teleport to="body" disabled={isMobile}>
  <Notification />
</Teleport>
```

## Multiple `Teleport` to Same Target → React Multi-Component Sequential Appending

Multiple `<Teleport>` components can point to the same target container, with content appended in rendering order.

- Vue code:

```vue
<template>
  <Teleport to="#modal-container">
    <ModalA />
  </Teleport>

  <Teleport to="#modal-container">
    <ModalB />
  </Teleport>
</template>
```

- VuReact compiled React code:

```tsx
<Teleport to="#modal-container">
  <ModalA />
</Teleport>

<Teleport to="#modal-container">
  <ModalB />
</Teleport>
```

## `defer` → React `defer` Property

The `defer` property can delay teleportation until component mounting completes.

- Vue code:

```vue
<template>
  <Teleport to="#dynamic-container" :defer="true">
    <DynamicContent />
  </Teleport>
</template>
```

- VuReact compiled React code:

```tsx
<Teleport to="#dynamic-container" defer>
  <DynamicContent />
</Teleport>
```

## Summary

VuReact's Teleport compilation strategy demonstrates **complete portal transformation capability**:

1. **Direct component mapping**: Maps Vue `<Teleport>` directly to VuReact's `<Teleport>`
2. **Full property support**: Supports all properties including `to`, `disabled`, `defer`
3. **DOM operation encapsulation**: Encapsulates React's Portal functionality for teleportation
4. **Error handling**: Handles exceptional cases like non-existent target containers

VuReact's compilation strategy ensures smooth migration from Vue to React, eliminating the need for developers to manually implement portal logic. The compiled code maintains both Vue's teleportation semantics and functionality while adhering to React's component design patterns, preserving complete portal capabilities in migrated applications.
