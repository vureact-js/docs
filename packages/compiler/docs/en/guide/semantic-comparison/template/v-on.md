# v-on Semantic Comparison

[VuReact](https://vureact.top/guide/introduction.html) is a tool that compiles Vue 3 code into standard, maintainable React code. Today, let's dive into the core: How does Vue's common `v-on`/`@` directive transform into React code after VuReact compilation?

## Prerequisites

To avoid redundancy in example code and ensure clear understanding, let's establish two conventions:

1. Vue/React code examples in this document are simplified core logic, omitting full component wrappers and unrelated configurations.
2. Readers are assumed to be familiar with the usage of the v-on directive in Vue 3.

## `v-on` → React Event Properties

`v-on` (shorthand `@`) is Vue's directive for binding event listeners, used to respond to user interactions.

- Vue code:

```vue
<button @click="increment">+1</button>
```

- VuReact compiled React code:

```jsx
<button onClick={increment}>+1</button>
```

As shown in the example: Vue's `@click` directive is compiled into React's `onClick` property. VuReact adopts an **event property compilation strategy**, converting template directives to React's standard event properties, **fully preserving Vue's event binding semantics**—calling the `increment` function when the button is clicked.

Key characteristics of this compilation approach:

1. **Semantic consistency**: Fully mimics Vue `v-on` behavior for event listening functionality
2. **Naming conversion**: Vue's `@click` converts to React's `onClick` (camelCase naming)
3. **Function passing**: Directly passes function references, maintaining event handling logic
4. **React native support**: Uses React's standard event system without additional adaptation

## With Event Modifiers → React `dir.on()`

Vue's event system supports rich modifiers for controlling event behavior. VuReact handles these modifiers through runtime helper functions.

- Vue code:

```vue
<button @click.stop.prevent="submit">Submit</button>
```

- VuReact compiled React code:

```jsx
import { dir } from '@vureact/runtime-core';

<button onClick={dir.on('click.stop.prevent', submit)}>Submit</button>;
```

As shown in the example: Vue events with modifiers are compiled using the [dir.on()](https://runtime.vureact.top/en/guide/utils/v-on.html) helper function. VuReact adopts a **modifier runtime processing strategy**, converting complex modifier combinations to runtime function calls, **fully preserving Vue's event modifier semantics**.

**Compilation strategy details**:

```jsx
// Vue: @click.stop.prevent="handler"
// React: onClick={dir.on('click.stop.prevent', handler)}

// Vue: @keyup.enter="search"
// React: onKeyUp={dir.on('keyup.enter', search)}

// Vue: @click.capture="captureHandler"
// React: onClickCapture={dir.on('click.capture', captureHandler)}
```

**How runtime helper function `dir.on()` works**:

1. **Parse modifiers**: Parses event name and modifier strings
2. **Create wrapper function**: Creates event handling wrapper function based on modifiers
3. **Apply modifier logic**: Implements modifier-corresponding behavior in wrapper function
4. **Call original handler**: Ultimately calls developer-provided event handling function

## Inline Event Handling → React Arrow Functions

Vue supports directly writing inline event handling logic in templates, which VuReact also handles correctly.

- Vue code:

```vue
<button @click="count++">Increase</button>
<button @click="sayHello('world')">Greet</button>
<button @click="handleEvent($event, 'custom')">With Event Object</button>
```

- VuReact compiled React code:

```jsx
<button onClick={() => count.value++}>Increase</button>
<button onClick={() => sayHello('world')}>Greet</button>
<button onClick={(event) => handleEvent(event, 'custom')}>With Event Object</button>
```

**Compilation strategy**:

1. **Expression conversion**: Converts Vue template expressions to JSX arrow functions
2. **Event object handling**: Vue's `$event` converts to React's event parameter
3. **Parameter passing**: Maintains function call parameter order and values
4. **Reactive updates**: Automatically handles `.value` access (for ref/computed variables, etc.)

## `defineEmits()` Events → React `props` Callbacks

For component custom events, VuReact also has corresponding compilation strategies.

- Vue code:

```vue
<!-- Parent component -->
<Child @custom-event="handleCustom" />

<!-- Child component Child.vue -->
<template>
  <button @click="emits('custom-event', data)">Trigger Event</button>
</template>

<script setup>
const emits = defineEmits(['custom-event']);
</script>
```

- VuReact compiled React code:

```jsx
// Parent component usage
<Child onCustomEvent={handleCustom} />;

// Child component Child.jsx
function Child(props) {
  return <button onClick={() => props.onCustomEvent?.(data)}>Trigger Event</button>;
}
```

**Compilation rules**:

1. **Event name conversion**: `kebab-case` converts to `camelCase` (`custom-event` → `onCustomEvent`)
2. **emits call conversion**: `emits()` converts to props callback calls
3. **Optional chaining protection**: Adds `?.` optional chaining operator to avoid undefined errors
4. **Type safety**: Maintains TypeScript type definition consistency

### Summary

VuReact's event compilation strategy demonstrates **complete event system transformation capability**:

1. **Basic event mapping**: Precisely maps Vue event directives to React event properties
2. **Modifier support**: Fully supports Vue event modifiers through runtime helper functions
3. **Inline handling**: Correctly handles inline event expressions in templates
4. **Custom events**: Supports custom event communication between components
5. **Type safety**: Maintains completeness of TypeScript type definitions

VuReact's compilation strategy ensures smooth migration from Vue to React, eliminating the need for developers to manually rewrite event handling logic. The compiled code maintains both Vue's semantics and functionality while adhering to React's event handling best practices, preserving complete interaction capabilities in migrated applications.
