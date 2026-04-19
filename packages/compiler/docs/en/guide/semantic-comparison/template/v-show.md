# v-show Semantic Comparison

How does Vue's frequently used `v-show` directive in templates transform into React code after semantic compilation?

## Prerequisites

To avoid redundancy in example code and ensure clear understanding, let's establish two conventions:

1. Vue/React code examples in this document are simplified core logic, omitting full component wrappers and unrelated configurations.
2. Readers are assumed to be familiar with the usage of the v-show directive in Vue 3.

## `v-show` → React Inline Style Conditional Display

`v-show` is Vue's directive for controlling element visibility based on conditions. Unlike `v-if`, `v-show` doesn't remove DOM elements but controls visibility through CSS's `display` property.

- Vue code:

```vue
<div v-show="active">Content</div>
```

- VuReact compiled React code:

```jsx
<div style={{ display: active ? '' : 'none' }}>Content</div>
```

As shown in the example: Vue's `v-show` directive is compiled into React's inline style object. VuReact adopts a **style conditional compilation strategy**, converting template directives to JSX's `style` property, **fully preserving Vue's show/hide semantics**—when `active` is true, element displays normally (`display: ''` uses default value); when `active` is false, element hides (`display: 'none'`).

Key advantages of this compilation approach:

1. **Semantic consistency**: Fully mimics Vue `v-show` behavior, controlling visibility through CSS rather than removing DOM
2. **Performance optimization**: Avoids frequent DOM creation/destruction, suitable for frequently toggling visibility scenarios
3. **CSS inheritance preservation**: Uses `display: 'none'` rather than `visibility: 'hidden'`, ensuring elements are completely removed from document flow
4. **State preservation**: Element states (like form input values, scroll positions, etc.) are retained when hidden

VuReact's compilation strategy ensures smooth migration from Vue to React, eliminating the need for developers to manually rewrite show/hide logic. The compiled code maintains both Vue's semantics and React's best practices.
