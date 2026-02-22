# vCls

`vCls` is used to convert Vue-style class inputs (strings, objects, arrays, and their nestings) into React `className` strings.

## Description

React typically only accepts string `className`, while Vue's class syntax supports more forms. `vCls` is responsible for normalizing them uniformly at runtime.

## Basic Usage

```ts
vCls('btn primary');
// "btn primary"

vCls({ active: true, disabled: false });
// "active"

vCls(['btn', { active: true }, ['size-lg']]);
// "btn active size-lg"
```

## Merge with the Second Input

A second parameter can be passed for merging (commonly used to merge an existing `className` with new classes):

```ts
vCls('base', { active: true });
// "base active"

vCls('foo bar', 'bar baz');
// "foo bar baz"  // Deduplicated while preserving order
```

## Details of Object Syntax

- The key is retained when the object's value is truthy.
- The value supports functions, and the key is retained only if the function returns a truthy value.
- When the key starts with `...`, its value will be recursively expanded.

```ts
vCls({
  active: () => true,
  hidden: () => false,
});
// "active"
```

## API

```ts
type ClsInputValue = string | Record<string, any> | ClsInputValue[];

function vCls(value: ClsInputValue, mergeItem?: ClsInputValue): string;
```

## Notes

- Extra spaces are automatically normalized.
- `false/null/undefined` in arrays are ignored.
- Duplicates are removed during merging, and the order of first occurrence is preserved.
