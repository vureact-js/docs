# Template Conversion Guide

This page is based on the current implementation of `compiler-core` and demonstrates common and advanced conversions from Vue to React at the Template layer.

> Note: Examples are simplified comparisons, and the final output is subject to local compilation results.

## 1. Key Rule: `ref` in templates automatically appends `.value`

In Vue templates, `ref` variables are usually written directly by their variable names without manually adding `.value`. VuReact automatically appends `.value` when converting template expressions.

Vue Input:

```vue
<script setup lang="ts">
import { ref } from 'vue';

const count = ref(1);
</script>

<template>
  <p>{{ count }}</p>
  <button @click="count++">+1</button>
</template>
```

React Output (illustration):

```tsx
<p>{count.value}</p>
<button onClick={() => count.value++; }>+1</button>
```

## 2. Conditional Branches: `v-if / v-else-if / v-else`

Vue Input:

```vue
<template>
  <div v-if="a">A</div>
  <div v-else-if="b">B</div>
  <div v-else>C</div>
</template>
```

React Output (illustration):

```tsx
{
  a ? <div>A</div> : b ? <div>B</div> : <div>C</div>;
}
```

Constraint: `v-else` / `v-else-if` must be adjacent to valid branches.

## 3. Lists: `v-for`

### Array Traversal

Vue Input:

```vue
<li v-for="(item, i) in list" :key="item.id">{{ i }} - {{ item.name }}</li>
```

React Output (illustration):

```tsx
{
  list.map((item, i) => (
    <li key={item.id}>
      {i} - {item.name}
    </li>
  ));
}
```

### Object Traversal

Vue Input:

```vue
<li v-for="(val, key, i) in obj" :key="key">{{ i }} - {{ key }}: {{ val }}</li>
```

React Output (illustration):

```tsx
{
  Object.entries(obj).map(([key, val], i) => (
    <li key={key}>
      {i} - {key}: {val}
    </li>
  ));
}
```

## 4. Events: `v-on` / `@`

### Basic Events

Vue Input:

```vue
<button @click="increment">+1</button>
```

React Output (illustration):

```tsx
<button onClick={increment}>+1</button>
```

### With Modifiers (illustration)

Vue Input:

```vue
<button @click.stop.prevent="submit">Submit</button>
```

React Output (illustration):

```tsx
<button onClick={dir.on('click.stop.prevent', submit)}>Submit</button>
```

Note: Events with modifiers use the [runtime](https://runtime.vureact.top/en/guide/utils/adapter-utils.html) directive helper; `.capture` maps to `onClickCapture`.

## 5. Binding: `v-bind` / `:prop` / `class` / `style`

### Regular Binding

Vue Input:

```vue
<img :src="url" :alt="title" />
```

React Output (illustration):

```tsx
<img src={url} alt={title} />
```

### Complex `class/style` Expressions

Vue Input:

```vue
<div :class="['card', active && 'is-active']" :style="{ color, fontSize: size + 'px' }" />
```

React Output (illustration):

```tsx
<div
  className={dir.cls(['card', active && 'is-active'])}
  style={dir.style({ color, fontSize: size + 'px' })}
/>
```

Note: Complex `class/style` merging uses the [runtime](https://runtime.vureact.top/guide/utils/adapter-utils.html) helper functions.

### Keyless `v-bind`

Vue Input:

```vue
<button v-bind="btnProps">Go</button>
```

React Output (illustration):

```tsx
<button {...dir.keyless(btnProps)}>Go</button>
```

Note: Keyless `v-bind` overrides duplicate props, and a compilation warning will be issued.

## 6. `v-model` (Partial Capabilities)

### Native Inputs

Vue Input:

```vue
<input v-model="keyword" />
<input type="checkbox" v-model="checked" />
```

React Output (illustration):

```tsx
<input value={keyword.value} onInput={(value) => { keyword.value = value; }} />
<input checked={checked.value} onChecked={(value) => { checked.value = value; }} />
```

### Component `v-model`

Vue Input:

```vue
<CounterPanel v-model="count" />
```

React Output (illustration):

```tsx
<CounterPanel
  modelValue={count.value}
  onUpdateCount={(value) => {
    count.value = value;
  }}
/>
```

Note: `v-model` semantics vary across different elements/components; always validate compiled output during integration.

## 7. Slots: Default Slots and Scoped Slots

### Default Slots

Vue Input:

```vue
<MyPanel>
  <span>Inner</span>
</MyPanel>
```

React Output (illustration):

```tsx
<MyPanel>
  <span>Inner</span>
</MyPanel>
```

### Scoped Slots

Vue Input:

```vue
<ListBox>
  <template #item="{ row }">
    <span>{{ row.name }}</span>
  </template>
</ListBox>
```

React Output (illustration):

```tsx
<ListBox item={({ row }) => <span>{row.name}</span>} />
```

### Child Component `<slot>` Outlet

Vue Input:

```vue
<slot name="footer" :count="count"></slot>
```

React Output (illustration):

```tsx
{
  props.footer?.({ count: count.value });
}
```

Note: Dynamic slot keys/props may trigger warnings and use a conservative conversion strategy.

## 8. `ref` Attribute: `ref="x"` and `:ref`

Vue Input:

```vue
<p ref="p"></p>
<span :ref="(el) => (domRef = el)"></span>
```

React Output (illustration):

```tsx
<p ref={pRef} />
<span ref={(el) => (domRef.value = el)} />
```

Note: Variables bound with `useTemplateRef` map to the `.current` semantics.

## 9. Dynamic Components: `is` / `:is`

Vue Input:

```vue
<component :is="currentView" />
```

React Output (illustration):

```tsx
<Component is={currentView} />
```

## 10. Other Directives

### `v-show`

```vue
<div v-show="open">Content</div>
```

```tsx
<div style={{ display: open ? '' : 'none' }}>Content</div>
```

### `v-text`

```vue
<p v-text="message"></p>
```

```tsx
<p>{message}</p>
```

### `v-html`

```vue
<div v-html="htmlContent"></div>
```

```tsx
<div dangerouslySetInnerHTML={{ __html: htmlContent }} />
```

### `v-memo`

```vue
<div v-memo="[id, status]"></div>
```

```tsx
{
  /* Generates memo wrapping (dependency array must be analyzable) */
}
```

## 11. Component Rules (Post-Template Processing)

1. `Transition` child nodes must meet structural requirements and are recommended to be used with `v-if` / `v-show`
2. `Transition` scenarios add `key` to ensure stable switching
3. `RouterLink`'s `v-slot` converts to `customRender` format

## 12. Common Warnings and Limitations

1. Unknown directives trigger warnings
2. Unanalyzable Vue runtime `$xxx` variables cause errors
3. Dynamic prop keys/slot keys may be downgraded
4. The more "analyzable" template expressions are, the more stable the conversion results

## 13. Built-in Component Conversion Support

### Vue Built-in Components

VuReact supports conversion for the following Vue built-in components:

| Vue Component     | React Equivalent  | Description                 |
| ----------------- | ----------------- | --------------------------- |
| `KeepAlive`       | `KeepAlive`       | Caches component state      |
| `Suspense`        | `Suspense`        | Async component loading     |
| `Teleport`        | `Teleport`        | Portal component            |
| `Transition`      | `Transition`      | Transition animations       |
| `TransitionGroup` | `TransitionGroup` | List transitions            |
| `Component`       | `Component`       | Dynamic component container |

### Vue Router Components

| Vue Router Component | React Equivalent | Description |
| -------------------- | ---------------- | ----------- |
| `RouterLink`         | `RouterLink`     | Route link  |
| `RouterView`         | `RouterView`     | Route view  |

## 14. Runtime Helper Functions

During conversion, VuReact uses the following runtime helper functions:

### `dir.cls(className: string | Array<string | boolean>)`

Handles complex `class` binding expressions, supporting arrays, conditional expressions, etc.

```tsx
// Vue: :class="['card', active && 'is-active']"
// React: className={dir.cls(['card', active && 'is-active'])}
```

### `dir.style(styleObject: object)`

Handles complex `style` binding expressions, supporting object expressions.

```tsx
// Vue: :style="{ color, fontSize: size + 'px' }"
// React: style={dir.style({ color, fontSize: size + 'px' })}
```

### `dir.on(eventName: string, handler: Function)`

Handles event bindings with modifiers.

```tsx
// Vue: @click.stop.prevent="submit"
// React: onClick={dir.on('click.stop.prevent', submit)}
```

### `dir.keyless(propsObject: object)`

Handles keyless `v-bind`.

```tsx
// Vue: v-bind="btnProps"
// React: {...dir.keyless(btnProps)}
```

## 15. Compilation Process Overview

VuReact's template conversion follows these steps:

### 1. Parsing Phase

- Parses Vue SFC using `@vue/compiler-sfc`
- Separates template, script, and style sections
- Generates Vue AST

### 2. Transformation Phase

- Traverses Vue AST and converts to Intermediate Representation (IR)
- Processes directives, attributes, events, etc.
- Collects reactive variable references

### 3. Code Generation Phase

- Converts IR to Babel AST
- Generates JSX code
- Applies code formatting

### 4. Post-Processing Phase

- Optimizes generated JSX structure
- Adds necessary runtime imports
- Processes style and asset references

## 16. Special Scenario Handling

### Dynamic Slot Key

```vue
<template #[dynamicSlotName]>Content</template>
```

Dynamic slot keys trigger warnings and use a conservative conversion strategy.

### Dynamic Prop Key

```vue
<component :[dynamicProp]="value" />
```

Dynamic prop keys may not be fully analyzable, and a compilation hint will be provided.

### Vue Runtime Variables

Template expressions containing Vue runtime variables in the form of `$xxx` will throw errors, as these variables do not exist in the React environment.

### Expression Analyzability

The simpler and more statically analyzable template expressions are, the more stable the conversion results. Recommendations:

- Avoid complex chained expressions
- Avoid using Vue-specific global variables
- Use explicit variable references as much as possible

## 17. Compilation Warnings and Errors

### Warning Levels

1. **Info**: Informational messages that do not affect compilation
2. **Warning**: Issues that may affect functionality but allow compilation to continue
3. **Error**: Severe issues that prevent compilation from continuing

### Common Warnings

- Unknown directives or attributes
- Structural errors (e.g., v-else without adjacent v-if)
- Unanalyzable dynamic content
- Potential runtime issues

### Error Handling

- Syntax errors: Immediately stop compilation
- Type errors: Continue or stop based on configuration
- Missing runtime dependencies: Prompt users to install required packages

## 18. Best Practice Recommendations

### Template Writing

1. **Keep it simple**: Avoid overly complex template logic
2. **Explicit references**: Use clear variable names to avoid ambiguity
3. **Clear structure**: Use components and slots appropriately

### Conversion Preparation

1. **Type checking**: Ensure complete TypeScript type definitions
2. **Dependency management**: Verify React equivalents for all used Vue features
3. **Test validation**: Perform functional testing after conversion

### Debugging Tips

1. **Incremental conversion**: Convert simple components first, then handle complex logic
2. **Output comparison**: Compare functional behavior before and after conversion
3. **Runtime checks**: Pay attention to console warnings and errors

## Next Steps

- See [Script Conversion Guide](./conversion-script) - Learn about script conversion rules
- See [Runtime Components](https://runtime.vureact.top/guide/components/keep-alive.html) - Learn about detailed usage of runtime components
- See [Runtime Helper Functions](https://runtime.vureact.top/guide/utils/adapter-utils.html) - Learn about detailed usage of runtime helper functions
