# AdapterUtils

`adapter-utils` is a set of template runtime utilities provided by runtime-core, primarily used to map Vue-style capabilities for class/style/event/object spreading to React JSX.

It can be used in two ways:

- Direct use of standalone functions: `vCls`, `vStyle`, `vOn`, `vKeyless`
- Use the unified instance entry: `adapterUtils` (or its alias `dir`)

## Unified Entry

The `AdapterUtil` class is defined in `adapter-utils/index.ts` and exported as an instance:

```ts
class AdapterUtil {
  cls(value, mergeItem?);
  keyless(obj);
  on(event, handler, fullEventObj?);
  style(target, ...mergeItems);
}

export const adapterUtils = new AdapterUtil();
export const dir = adapterUtils;
```

Therefore, it can be used as follows:

```tsx
import { adapterUtils, dir } from '@vureact/runtime-core';

const cls = adapterUtils.cls(['btn', { active: isActive }]);
const props = dir.keyless({ class: ['card', { selected: true }], click: onClick });
const onKeyDown = dir.on('keydown.enter.stop', handleEnter);
const style = adapterUtils.style('color: red', { fontSize: '14px' });
```

## Description

`adapter-utils` mainly addresses the following runtime issues:

- Unify Vue's multi-syntax for class/style (string, object, array) into a format consumable by React
- Convert Vue-style event names and modifiers (e.g., `.stop`, `.prevent`, `.enter`) into React event handler functions
- Batch convert `v-bind="obj"` style objects into JSX props (including `class`, `style`, events, and property renaming)
- Provide asynchronous scheduling capability for `nextTick`

## API

```ts
// class
adapterUtils.cls(value: ClsInputValue, mergeItem?: ClsInputValue): string;

// spread props
adapterUtils.keyless(obj: Record<string, any>): Record<string, any>;

// event
adapterUtils.on(event: string, handler: any, fullEventObj?: boolean): any;

// style
adapterUtils.style(target: VStyleItem, ...mergeItems: VStyleItem[]): object;

// alias
const dir = adapterUtils;
```

## Notes

- `nextTick` is a standalone exported function and not included in the `AdapterUtil` instance methods.
- `dir` is just an alias for `adapterUtils` and has the same capabilities.
- For complex behaviors (modifier priority, property mapping rules), please refer to the respective sub-documents.
