# vStyle

`vStyle` is used to convert Vue-style style inputs into React style objects.

## Description

Vue's style supports the mixed use of strings, objects, and arrays; React requires an object format. `vStyle` is responsible for parsing, expanding, and merging these styles.

## Basic Usage

```ts
vStyle({ color: 'red', fontSize: '14px' });
// { color: 'red', fontSize: '14px' }

vStyle('display: block; background-color: blue;');
// { display: 'block', backgroundColor: 'blue' }
```

## Array and Nested Merging

```ts
vStyle([{ color: 'red' }, 'font-size: 12px', [{ display: 'flex' }]]);
// { color: 'red', fontSize: '12px', display: 'flex' }
```

## Multi-parameter Merging

Subsequent inputs will override the same-named properties of previous ones:

```ts
vStyle({ color: 'red' }, { color: 'blue' }, 'margin-top: 10px');
// { color: 'blue', marginTop: '10px' }
```

## API

```ts
type VStyleItem = string | Record<string, any> | VStyleItem[] | null | undefined;

function vStyle(target: VStyleItem, ...mergeItems: VStyleItem[]): object;
```

## Notes

- String styles are parsed into camelCase keys.
- `null/undefined/false` values are ignored.
- For the same-named properties, the "later one overrides the earlier one" rule applies.
