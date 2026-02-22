# useToRaw

`useToRaw` is used to retrieve the original object from a reactive proxy object. It is commonly used for debugging, serialization, or interacting with non-reactive tools.

## Basic Usage

This scenario demonstrates retrieving the raw object from a proxy and outputting a snapshot of it.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FToRaw%2FToRawBasic.tsx&initialpath=/hooks/useToRaw/basic">
</iframe>

```tsx
const source = { settings: { theme: 'dark' } };
const state = useReactive(source);

const raw = useToRaw(state);
console.log(raw); // Original object -> source
```

Note: Modifying `raw` will not trigger reactive rendering.

## API

```ts
function useToRaw<T extends object>(target: T): T | undefined;
```

## Notes

- When called on a reactive proxy, it usually returns the original object.
- When called on a plain object, it may return `undefined`.
- This hook is mainly used to read the "de-proxied object" and is not intended to drive UI updates.
