# Transition Semantic Comparison

[VuReact](https://vureact.top/guide/introduction.html) is a tool that compiles Vue 3 code into standard, maintainable React code. Today, let's dive into the core: How does Vue's built-in `<Transition>` component transform into React code after VuReact compilation?

## Prerequisites

To avoid redundancy in example code and ensure clear understanding, let's establish two conventions:

1. Vue/React code examples in this document are simplified core logic, omitting full component wrappers and unrelated configurations.
2. Readers are assumed to be familiar with the usage of the `<Transition>` component in Vue 3.

## `Transition` → React `Transition` Adapter Component

`<Transition>` is Vue's built-in component for adding transition animations to the entry/exit process of single elements or components.

- Vue code:

```vue
<template>
  <Transition name="fade">
    <div v-if="show">Content</div>
  </Transition>
</template>
```

- VuReact compiled React code:

```tsx
import { Transition } from '@vureact/runtime-core';

<Transition name="fade">{show ? <div>Content</div> : null}</Transition>;
```

As shown in the example: Vue's `<Transition>` component is compiled into the [Transition](https://runtime.vureact.top/en/guide/components/transition.html) **adapter component** provided by VuReact Runtime, which can be understood as "Vue Transition in React style."

Key characteristics of this compilation approach:

1. **Semantic consistency**: Fully mimics Vue `<Transition>` behavior for transition animations
2. **CSS class names**: Automatically generates and applies transition-related CSS class names
3. **Conditional rendering**: Supports transition effects for conditionally rendered elements
4. **React integration**: Implements Vue's transition semantics in React environment

**Corresponding CSS styles**:

```css
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active {
  opacity: 1;
  transition: opacity 0.5s ease;
}

.fade-leave-active {
  opacity: 0;
  transition: opacity 0.5s ease;
}
```

## `mode` → React `mode` Property

The `mode` property controls the switching order of old and new content, preventing simultaneous entry and exit animations.

- Vue code:

```vue
<template>
  <Transition name="slide-fade" mode="out-in">
    <button v-if="state" key="on">On</button>
    <button v-else key="off">Off</button>
  </Transition>
</template>
```

- VuReact compiled React code:

```tsx
<Transition name="slide-fade" mode="out-in">
  {state ? <button key="on">On</button> : <button key="off">Off</button>}
</Transition>
```

**Transition modes**:

1. **out-in**: Executes exit animation first, then entry animation after completion
2. **in-out**: Executes entry animation first, then exit animation after completion
3. **Default**: Executes entry and exit animations simultaneously

**Importance of `key`**:

1. **Node identification**: Helps Transition identify different elements
2. **Animation triggering**: Transition animations trigger when key changes
3. **State preservation**: Ensures animations correctly apply to corresponding elements
4. **Automatic key handling for multiple nodes**: When `key` is not explicitly specified, VuReact automatically generates random identifiers to ensure correct triggering of transition animations

## Custom Transition Class Names → React Custom Class Name Properties

In addition to using `name` for automatic class name generation, custom transition class names can be directly specified for easier integration with third-party animation libraries.

- Vue code:

```vue
<template>
  <Transition
    enter-active-class="animate__animated animate__fadeIn"
    leave-active-class="animate__animated animate__fadeOut"
  >
    <div v-if="show">Custom animation</div>
  </Transition>
</template>
```

- VuReact compiled React code:

```tsx
<Transition
  enterActiveClass="animate__animated animate__fadeIn"
  leaveActiveClass="animate__animated animate__fadeOut"
>
  {show ? <div>Custom animation</div> : null}
</Transition>
```

**Custom class name properties**:

1. **enterFromClass**: Class name for entry start
2. **enterActiveClass**: Class name for entry active state
3. **enterToClass**: Class name for entry end
4. **leaveFromClass**: Class name for exit start
5. **leaveActiveClass**: Class name for exit active state
6. **leaveToClass**: Class name for exit end

## JavaScript Hook Functions → React Event Properties

Transition supports executing custom logic at different animation stages through JavaScript hook functions.

- Vue code:

```vue
<template>
  <Transition
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @leave="onLeave"
  >
    <div v-if="show">JS-controlled animation</div>
  </Transition>
</template>
```

- VuReact compiled React code:

```tsx
<Transition
  onBeforeEnter={onBeforeEnter}
  onEnter={onEnter}
  onAfterEnter={onAfterEnter}
  onLeave={onLeave}
>
  {show ? <div>JS-controlled animation</div> : null}
</Transition>
```

**JavaScript hooks**:

1. **onBeforeEnter**: Triggered before entry animation starts
2. **onEnter**: Triggered during entry animation
3. **onAfterEnter**: Triggered after entry animation completes
4. **onLeave**: Triggered during exit animation
5. **onAfterLeave**: Triggered after exit animation completes

## `duration` → React `duration` Property

The `duration` property explicitly specifies the transition duration.

- Vue code:

```vue
<template>
  <Transition :duration="800">
    <div v-if="show">Specified duration animation</div>
  </Transition>
</template>
```

- VuReact compiled React code:

```tsx
<Transition duration={800}>{show ? <div>Specified duration animation</div> : null}</Transition>
```

**duration configuration**:

- **Number**: Uniformly sets duration for both entry and exit
- **Object**: Separately sets duration for entry and exit

```jsx
<Transition duration={{ enter: 300, leave: 500 }}>{show ? <div>Content</div> : null}</Transition>
```

## Summary

VuReact's Transition compilation strategy demonstrates **complete transition animation transformation capability**:

1. **Direct component mapping**: Maps Vue `<Transition>` directly to VuReact's `<Transition>`
2. **Full property support**: Supports all properties including `name`, `mode`, custom class names, hook functions
3. **CSS class name generation**: Automatically generates and applies transition-related CSS class names
4. **JavaScript integration**: Supports controlling animation process through JS hooks

Important considerations:

1. **Single child node**: `<Transition>` can only have one direct child node
2. **Key requirement**: Provide stable `key` when switching between different elements
3. **CSS requirement**: Must set transition appearance in `*-enter-active` and `*-leave-active`
4. **Performance consideration**: Complex animations may affect performance, use judiciously

VuReact's compilation strategy ensures smooth migration from Vue to React, eliminating the need for developers to manually implement transition animation logic. The compiled code maintains both Vue's transition semantics and animation effects while adhering to React's component design patterns, preserving complete transition animation capabilities in migrated applications.
