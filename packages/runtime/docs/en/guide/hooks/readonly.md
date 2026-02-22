# useReadonly

`useReadonly` is a React adaptation of Vue's `readonly`, designed to create read-only views and prevent accidental modification of state in areas where writing should not occur.

## Basic Usage

This scenario demonstrates that reading data through a read-only view is allowed, but directly writing to the read-only view has no effect.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FReadonly%2FReadonlyBasic.tsx&initialpath=/hooks/useReadonly/basic">
</iframe>

```tsx
const source = useReactive({ count: 0, nested: { text: 'Hello' } });
const read = useReadonly(source);

source.count++; // Valid
(read as any).count++; // Invalid, will trigger a warning/error in development environment
```

When the source data changes, `read` will synchronously reflect the new value.

## Shallow Readonly

`useShallowReadonly` only protects the first layer from being written to. Deep-level objects remain as the original references and can be modified according to the original logic.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FReadonly%2FShallowReadonly.tsx&initialpath=/hooks/useReadonly/shallow">
</iframe>

```tsx
const state = useReactive({ user: { name: 'React' } });
const shallowRead = useShallowReadonly(state);

(shallowRead as any).user = { name: 'New' }; // Invalid
(shallowRead.user as any).name = 'Vureact'; // Valid
```

## API

```ts
type ReadonlyType<T> = Readonly<T> | Snapshot<T>;
type ReadonlySnapshot<T> = T extends WrapRef<any> ? ReadonlyType<UnwrapRef<T>> : ReadonlyType<T>;

function useReadonly<T extends object>(target: T): ReadonlySnapshot<T>;

function useShallowReadonly<T extends object>(target: T): ReadonlySnapshot<T>;
```

## Notes

- When called on a reactive proxy, the readonly result will synchronize with the source data.
- When called on a plain object, it freezes a copy and does not have reactive linkage.
- When used with `useVRef`, it will automatically unwrap the `value` property.
