# useComputed

`useComputed` is a React adaptation of Vue's `computed` property. It automatically tracks dependencies and caches the result, recalculating only when dependencies change.

## Basic Usage

This scenario demonstrates the most common "derived value" calculation: computing `totalPrice` from `count` and `price`.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FComputed%2FComputedBasic.tsx&initialpath=/hooks/useComputed/basic">
</iframe>

```tsx
const state = useReactive({ count: 1, price: 99 });

const totalPrice = useComputed(() => state.count * state.price);

<p>{totalPrice.value}</p>;
```

`totalPrice.value` will automatically refresh when dependencies update, and reuse the cache when there are no changes.

## List Filtering Scenario

This pattern is suitable for derived data with high computation costs such as list filtering and sorting.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FComputed%2FComputedList.tsx&initialpath=/hooks/useComputed/list">
</iframe>

```tsx
const state = useReactive({ searchQuery: '', items: ['Apple', 'Banana'] });

const filteredList = useComputed(() =>
  state.items.filter((item) => item.toLowerCase().includes(state.searchQuery.toLowerCase())),
);
```

Filtering will not be repeated when `searchQuery` or `items` remain unchanged.

## Writable Computed Property

When you want to encapsulate "read/write logic" in the same computed property, use the `get/set` form.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FComputed%2FComputedWritable.tsx&initialpath=/hooks/useComputed/writable">
</iframe>

```tsx
const state = useReactive({ firstName: 'Zhang', lastName: 'San' });

const fullName = useComputed({
  get: () => `${state.firstName} ${state.lastName}`,
  set: (val) => {
    const [first, last] = val.split(' ');
    state.firstName = first || '';
    state.lastName = last || '';
  },
});

<input value={fullName.value} onChange={(e) => (fullName.value = e.target.value)} />;
```

Modifying `fullName.value` via the input box will update `firstName/lastName` in reverse.

## API

```ts
type ComputedGetter<T> = () => T;
type ComputedSetter<T> = (value: T) => void;

interface ComputedRef<T> {
  readonly value: T;
}

interface WritableComputedRef<T> extends ComputedRef<T> {
  value: T;
}

interface WritableComputedOptions<T> {
  get: ComputedGetter<T>;
  set: ComputedSetter<T>;
}

function useComputed<T>(getter: ComputedGetter<T>): ComputedRef<T>;

function useComputed<T>(options: WritableComputedOptions<T>): WritableComputedRef<T>;
```

## Notes

- Writing to a read-only computed property will trigger a warning in the development environment.
- Computed properties are lazily evaluated — calculation only occurs when `.value` is accessed.
- A writable computed property must provide a `set` method.
