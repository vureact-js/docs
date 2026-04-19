# v-model Semantic Comparison

How does Vue's common `v-model` directive transform into React code after VuReact compilation?

## Prerequisites

To avoid redundancy in example code and ensure clear understanding, let's establish two conventions:

1. Vue/React code examples in this document are simplified core logic, omitting full component wrappers and unrelated configurations.
2. Readers are assumed to be familiar with the usage of the v-model directive in Vue 3.

## `v-model` → React Controlled Components

`v-model` is Vue's syntactic sugar for implementing two-way data binding for form input elements, combining the functionality of `v-bind` and `v-on`.

- Vue code:

```vue
<input v-model="keyword" />
```

- VuReact compiled React code:

```jsx
<input
  value={keyword.value}
  onChange={(value) => {
    keyword.value = value;
  }}
/>
```

As shown in the example: Vue's `v-model` directive is compiled into React's controlled component pattern. VuReact adopts a **controlled component compilation strategy**, converting template directives to combinations of `value` and `onChange`, **fully preserving Vue's two-way binding semantics**—achieving synchronized updates between data and view.

Key characteristics of this compilation approach:

1. **Semantic consistency**: Fully mimics Vue `v-model` behavior for two-way data binding
2. **Controlled component pattern**: Uses React's standard controlled component implementation
3. **Event handling**: Automatically handles input events and value updates
4. **Reactive integration**: Seamlessly integrates with Vue's reactive system

## Checkboxes

Vue's `v-model` automatically adapts based on input element type, which VuReact also maintains.

- Vue code:

```vue
<input type="checkbox" v-model="checked" />
<input type="checkbox" value="vue" v-model="frameworks" />
```

- VuReact compiled React code:

```jsx
<input
  type="checkbox"
  checked={checked.value}
  onChecked={(e) => {
    checked.value = e.target.checked;
  }}
/>
<input
  type="checkbox"
  value="vue"
  checked={frameworks.value}
  onChange={(e) => {
    frameworks.value = e.target.checked;
  }}
/>
```

## Radio Buttons

- Vue code:

```vue
<input type="radio" value="male" v-model="gender" />
<input type="radio" value="female" v-model="gender" />
```

- VuReact compiled React code:

```jsx
<input
  type="radio"
  value="male"
  checked={gender.value === 'male'}
  onChange={() => { gender.value = 'male' }}
/>

<input
  type="radio"
  value="female"
  checked={gender.value === 'female'}
  onChange={() => { gender.value = 'female' }}
/>
```

## Dropdown Select

- Vue code:

```vue
<select v-model="selected">
  <option value="a">Option A</option>
  <option value="b">Option B</option>
</select>
```

- VuReact compiled React code:

```jsx
<select
  value={selected.value}
  onChange={(e) => {
    selected.value = e.target.value;
  }}
>
  <option value="a">Option A</option>
  <option value="b">Option B</option>
</select>
```

## `v-model.lazy` → React Event Handler

Vue's `v-model` supports various modifiers for controlling data update timing and formatting.

- Vue code:

```vue
<input v-model.lazy="message" />
```

- VuReact compiled React code:

```jsx
<input
  value={message.value}
  onBlur={(e) => {
    message.value = e.target.value;
  }}
/>
```

## `v-model.number` Modifier

- Vue code:

```vue
<input v-model.number="age" />
```

- VuReact compiled React code:

```jsx
<input
  value={age.value}
  onChange={(e) => {
    age.value = Number(e.target.value);
  }}
/>
```

## `v-model.trim` Modifier

- Vue code:

```vue
<input v-model.trim="username" />
```

- VuReact compiled React code:

```jsx
<input
  value={username.value}
  onChange={(e) => {
    username.value = e.target.value?.trim();
  }}
/>
```

## Modifier Combinations

- Vue code:

```vue
<input v-model.lazy.trim="search" />
```

- VuReact compiled React code:

```jsx
<input
  value={search.value}
  onBlur={(e) => {
    search.value = e.target.value?.trim();
  }}
/>
```

## Component `v-model` → React `props` Two-way Binding

Vue 3 introduced significant improvements to component `v-model`, supporting multiple `v-model` bindings and custom modifiers.

- Vue code:

```vue
<!-- Parent component -->
<CustomInput v-model="inputValue" />

<!-- Child component CustomInput.vue -->
<script setup lang="ts">
const props = defineProps(['modelValue']);
const emits = defineEmits(['update:modelValue']);
</script>

<template>
  <input :value="props.modelValue" @input="(e) => emits('update:modelValue', e.target.value)" />
</template>
```

- VuReact compiled React code:

```tsx
// Parent component
<CustomInput
  modelValue={inputValue.value}
  onUpdateModelValue={(value) => {
    inputValue.value = value;
  }}
/>;

// Child component CustomInput.tsx
type ICustomInputProps = {
  modelValue?: any;
  onUpdateModelValue?: (...args: any[]) => any;
};

function CustomInput(props: ICustomInputProps) {
  return (
    <input value={props.modelValue} onChange={(e) => props.onUpdateModelValue?.(e.target.value)} />
  );
}
```

## Parameterized `v-model` → React `props` + Event Callbacks

- Vue code:

```vue
<UserForm v-model:name="userName" v-model:email="userEmail" />
```

- VuReact compiled React code:

```jsx
<UserForm
  name={userName.value}
  onUpdateName={(value) => {
    userName.value = value;
  }}
  email={userEmail.value}
  onUpdateEmail={(value) => {
    userEmail.value = value;
  }}
/>
```

## Summary

VuReact's v-model compilation strategy demonstrates **complete two-way binding transformation capability**:

1. **Basic form elements**: Converts `v-model` for various input types to corresponding controlled components
2. **Modifier support**: Fully supports `.lazy`, `.number`, `.trim` and other modifiers
3. **Component v-model**: Supports component-level two-way binding, including multiple `v-model` and custom modifiers
4. **Event mapping**: Intelligently maps Vue events to React events (`input` → `onChange`, etc.)
5. **Type safety**: Maintains completeness of TypeScript type definitions

**Compilation mapping for different element types**:

| Element Type             | Vue Event | React Event | Value Property |
| ------------------------ | --------- | ----------- | -------------- |
| `input[type="text"]`     | `input`   | `onChange`  | `value`        |
| `textarea`               | `input`   | `onChange`  | `value`        |
| `input[type="checkbox"]` | `change`  | `onChange`  | `checked`      |
| `input[type="radio"]`    | `change`  | `onChange`  | `checked`      |
| `select`                 | `change`  | `onChange`  | `value`        |

VuReact's compilation strategy ensures smooth migration from Vue to React, eliminating the need for developers to manually rewrite form binding logic. The compiled code maintains both Vue's semantics and convenience while adhering to React's form handling best practices, preserving complete form interaction capabilities in migrated applications.
