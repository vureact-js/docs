# useVRef

`useVRef` is a React adaptation of Vue's `ref`, designed to create reactive states with a `.value` property.

## Basic Type Ref

This scenario is used to store simple values (numbers, strings, booleans). Modifying `.value` will automatically re-render the component.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FVRef%2FVRefBasic.tsx&initialpath=/hooks/useVRef/basic">
</iframe>

```tsx
const count = useVRef(0);
const name = useVRef('React');

<p>Counter: {count.value}</p>
<p>Name: {name.value}</p>

<button onClick={() => count.value++}>Increment</button>
<button onClick={() => (name.value = `Vureact ${count.value}`)}>Rename</button>
```

The effect of this code is: after clicking the buttons, changes to `count.value` and `name.value` are immediately reflected in the interface.

## Object Ref

This scenario is used to store an entire object as a ref. You can either modify internal fields of the object or replace the object as a whole.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FVRef%2FVRefObject.tsx&initialpath=/hooks/useVRef/object">
</iframe>

```tsx
const user = useVRef({ name: 'Alice', age: 25 });

user.value.age++; // Modify internal field
user.value = { name: 'Bob', age: 30 }; // Replace the entire object
```

When you directly modify `user.value.name` or `user.value.age`, the interface updates accordingly.

## Shallow Ref

`useShallowVRef` only tracks the top-level `.value` property. That is, modifying internal fields does not trigger an update, while replacing the entire `value` does.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FVRef%2FShallowVRef.tsx&initialpath=/hooks/useVRef/shallow">
</iframe>

```tsx
const state = useShallowVRef({ count: 1 });

state.value.count++; // Does not trigger update
state.value = { count: 2 }; // Triggers update
```

This pattern is suitable for large object scenarios to reduce the overhead of deep tracking.

## API

```ts
interface WrapRef<T = unknown> {
  value: T;
}

type RefState<T = unknown> = T extends WrapRef<infer U> ? U : WrapRef<T>;

function useVRef<T>(initialValue: T): RefState<T>;

function useShallowVRef<T>(initialValue: T): RefState<T>;
```

## Notes

- You still need to explicitly use `.value` in JSX; automatic unwrapping is not supported.
- `useVRef` is suitable for normal ref scenarios; use `useShallowVRef` only when you need to track top-level replacements.
- Complex structures such as `Map` and `Set` can also be used as values for `useVRef`.
