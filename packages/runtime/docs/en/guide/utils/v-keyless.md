# vKeyless

`vKeyless` is used to convert a "Vue-style props object" into React props that can be directly spread into JSX.

## Description

In template compilation or runtime adaptation, a common scenario is `v-bind="obj"`. `vKeyless` is responsible for handling class/style/event/attribute naming differences all at once.

## Basic Usage

```tsx
const input = {
  id: 'main',
  class: ['container', { fluid: true }],
  'click.stop': onClick,
  style: 'background-color: #eee; font-size: 14px',
};

const props = vKeyless(input);

<div {...props} />;
```

After conversion, you will get React-usable fields such as `className`, `onClick`, `style`, etc.

## Internal Processing Rules

### 1. Class Merging

- Both `class` and `className` are passed to `vCls` for merging
- Only `className` is output in the end

### 2. Event Conversion

- Event fields are passed to `vOn(..., true)` to return a standard event object and merge them
- Supports both `onClick` style and `click.stop` style

### 3. Style Conversion

- The `style` field is passed to `vStyle` to be converted into a React style object

### 4. Attribute Naming Mapping

- `for` -> `htmlFor`
- `class` -> `className`
- `v-html` -> `dangerouslySetInnerHTML`
- `data-*` / `aria-*` remain unchanged
- Other kebab-case attributes are converted to camelCase

## API

```ts
function vKeyless(obj: Record<string, any>): Record<string, any>;
```

## Notes

- `v-html` only performs key mapping and does not automatically wrap the `__html` object.
- It is recommended to pass functions as event values; non-function values will be wrapped according to `vOn` rules.
- When an object contains both `class` and `className`, they will be uniformly merged into `className`.
