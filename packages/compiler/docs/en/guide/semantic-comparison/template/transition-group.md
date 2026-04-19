# TransitionGroup Semantic Comparison

How does Vue's built-in `<TransitionGroup>` component transform into React code after VuReact compilation?

## Prerequisites

To avoid redundancy in example code and ensure clear understanding, let's establish two conventions:

1. Vue/React code examples in this document are simplified core logic, omitting full component wrappers and unrelated configurations.
2. Readers are assumed to be familiar with the usage of the `<TransitionGroup>` component in Vue 3.

## `TransitionGroup` → React `TransitionGroup` Adapter Component

`<TransitionGroup>` is Vue's built-in component for providing transition animations for list item insertion, removal, and reordering, serving as the list version of `<Transition>`.

- Vue code:

```vue
<template>
  <TransitionGroup name="list" tag="ul">
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </TransitionGroup>
</template>
```

- VuReact compiled React code:

```tsx
import { TransitionGroup } from '@vureact/runtime-core';

<TransitionGroup name="list" tag="ul">
  {items.map((item) => (
    <li key={item.id}>{item.name}</li>
  ))}
</TransitionGroup>;
```

As shown in the example: Vue's `<TransitionGroup>` component is compiled into the [TransitionGroup](https://runtime.vureact.top/en/guide/components/transition-group.html) **adapter component** provided by VuReact Runtime, which can be understood as "Vue TransitionGroup in React style."

Key characteristics of this compilation approach:

1. **Semantic consistency**: Fully mimics Vue `<TransitionGroup>` behavior for list transition animations
2. **List support**: Specifically provides animation support for list item entry, exit, and movement
3. **Container tag**: Specifies list container element through `tag` property
4. **Key requirement**: List items must provide stable `key` property

**Corresponding CSS styles**:

```css
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.5s ease;
}

.list-leave-active {
  opacity: 0;
  transform: translateX(30px);
  transition: all 0.5s ease;
}
```

## `moveClass` → React `moveClass` Property

`<TransitionGroup>` supports smooth movement animations during list item reordering, implemented through the `moveClass` property.

- Vue code:

```vue
<template>
  <TransitionGroup name="list" tag="ul" move-class="list-move">
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </TransitionGroup>
</template>
```

- VuReact compiled React code:

```tsx
<TransitionGroup name="list" tag="ul" moveClass="list-move">
  {items.map((item) => (
    <li key={item.id}>{item.name}</li>
  ))}
</TransitionGroup>
```

**Movement animation CSS**:

```css
/* Movement animation class */
.list-move {
  transition: all 0.5s ease;
}

/* Exit animation requires absolute positioning */
.list-leave-active {
  position: absolute;
}
```

**Movement animation principle**:

1. **FLIP technique**: Uses First-Last-Invert-Play technique for smooth movement
2. **Position calculation**: Calculates element position differences between old and new states, applies inverse transformations
3. **Smooth transitions**: Achieves animation effects for position changes through CSS transitions
4. **Performance optimization**: Uses transform property for high-performance animations

## `tag` → React `tag` Property

The `tag` property specifies the container element type for the list.

- Vue code:

```vue
<template>
  <TransitionGroup name="fade" tag="div" class="item-list">
    <div v-for="item in items" :key="item.id" class="item">
      {{ item.name }}
    </div>
  </TransitionGroup>
</template>
```

- VuReact compiled React code:

```tsx
<TransitionGroup name="fade" tag="div" className="item-list">
  {items.map((item) => (
    <div key={item.id} className="item">
      {item.name}
    </div>
  ))}
</TransitionGroup>
```

**tag property function**:

1. **Container type**: Specifies HTML element type to render (div, ul, ol, etc.)
2. **Semantic**: Uses appropriate semantic tags
3. **Style control**: Facilitates applying container styles
4. **Clear structure**: Maintains clear DOM structure

## Inheriting `Transition` Functionality → React Property Inheritance

`<TransitionGroup>` inherits all functionality from `<Transition>`, supporting the same properties and hooks.

- Vue code:

```vue
<template>
  <TransitionGroup name="slide" tag="div" :duration="500" @enter="onEnter" @leave="onLeave">
    <div v-for="item in items" :key="item.id">
      {{ item.name }}
    </div>
  </TransitionGroup>
</template>
```

- VuReact compiled React code:

```tsx
<TransitionGroup name="slide" tag="div" duration={500} onEnter={onEnter} onLeave={onLeave}>
  {items.map((item) => (
    <div key={item.id}>{item.name}</div>
  ))}
</TransitionGroup>
```

**Inherited functionality**:

1. **Custom class names**: Supports custom class names for enter/leave transitions
2. **JavaScript hooks**: Supports all transition lifecycle hooks
3. **Duration**: Supports duration property for controlling animation length
4. **CSS control**: Supports css property for controlling whether to apply CSS transitions

## Summary

VuReact's TransitionGroup compilation strategy demonstrates **complete list transition transformation capability**:

1. **Direct component mapping**: Maps Vue `<TransitionGroup>` directly to VuReact's `<TransitionGroup>`
2. **Full property support**: Supports all properties including `name`, `tag`, `moveClass`
3. **List rendering conversion**: Converts `v-for` to `map` function calls
4. **Animation function inheritance**: Inherits all animation functionality from `<Transition>`

Important considerations:

1. **Key required**: List items must provide stable `key`, otherwise animations may behave unexpectedly
2. **CSS requirements**: Must set transition appearance in `*-enter-active` and `*-leave-active`
3. **Movement animation**: Exit animations require `position: absolute`

VuReact's compilation strategy ensures smooth migration from Vue to React, eliminating the need for developers to manually implement list transition animation logic. The compiled code maintains both Vue's list transition semantics and animation effects while adhering to React's component design patterns, preserving complete list transition capabilities in migrated applications.
