# useToVRef

`useToVRef` is used to convert values, object properties, or getters into ref-style state, corresponding to the main usage of Vue's `toRef`.

## Convert Object Properties to Ref

This is the most commonly used pattern: extract a specific field from a reactive object while maintaining two-way synchronization.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FtoVRef%2FToVRefBasic.tsx&initialpath=/hooks/useToVRef/basic">
</iframe>

```tsx
const state = useReactive({ count: 1 });
const countRef = useToVRef(state, 'count');

countRef.value++; // Synchronized to state.count
state.count--; // Synchronized to countRef.value
```

This allows you to safely destructure a field without losing reactive linkage.

## Convert Getter to Readonly Ref

When you want to expose the "result of an expression" as a ref, you can pass a getter. The return value is a readonly ref.

```tsx
const state = useReactive({ count: 2 });
const doubleRef = useToVRef(() => state.count * 2);

console.log(doubleRef.value); // 4
```

This pattern is suitable for uniformly consuming derived values in the `.value` form.

## Convert Value to Ref

When a plain value is passed in, `useToVRef` degrades to "creating a standard ref".

```tsx
const idRef = useToVRef(1001);
idRef.value = 1002;
```

This pattern is useful when writing utility functions and expecting input parameters to follow ref semantics uniformly.

## API

```ts
type ToRefValueState<T> = T extends WrapRef<infer T> ? T : RefState<T>;

function useToVRef<T>(value: T): ToRefValueState<T>;

function useToVRef<T>(value: () => T): Readonly<RefState<T>>;

function useToVRef<T extends object, K extends keyof T>(
  object: T,
  key: K,
): ToRefPropertyState<T, K>;

function useToVRef<T extends object, K extends keyof T>(
  object: T,
  key: K,
  defaultValue: T[K],
): ToRefPropertyState<T, K>;
```

## Notes

- In the property pattern, `ref.value` and the source property maintain a two-way synchronization relationship.
- The getter pattern returns a readonly ref; writing to it will trigger a warning in the development environment.
- `defaultValue` only acts as a fallback when the current value of the property is `undefined`.
