# useReactive

`useReactive` is a React adaptation of Vue's `reactive`, designed to create trackable reactive objects. It is suitable for proxyable structures such as objects, arrays, Maps, and Sets.

## Basic Usage

This scenario demonstrates the most common read and write operations on object state. You can directly modify properties, and the view will update automatically.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FReactive%2FReactiveBasic.tsx&initialpath=/hooks/useReactive/basic">
</iframe>

```tsx
const state = useReactive({
  count: 0,
  name: 'Gemini',
});

<p>Name: {state.name}</p>
<p>Count: {state.count}</p>

<button onClick={() => state.count++}>count++</button>
<button onClick={() => (state.name = 'React Proxy')}>Modify Name</button>
```

## Deep Nested Reactivity

This scenario illustrates that deep objects and arrays can also be tracked. Operations like `push` and deep field modifications can trigger correct updates.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FReactive%2FReactiveNested.tsx&initialpath=/hooks/useReactive/nested">
</iframe>

```tsx
const state = useReactive({
  user: { profile: { age: 25 }, tags: ['React', 'Vue'] },
});

state.user.profile.age++;
state.user.tags.push('New Tag');
```

## Shallow Reactivity

`useShallowReactive` only tracks first-level properties. It is suitable for large objects or scenarios where you only care about top-level replacement.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FReactive%2FShallowReactive.tsx&initialpath=/hooks/useReactive/shallow">
</iframe>

```tsx
const state = useShallowReactive({
  count: 0,
  nested: { val: 100 },
});

state.count++; // Triggers update
state.nested.val++; // Does not trigger update
state.nested = { val: 200 }; // Triggers update
```

## API

```ts
type ReactiveState<T> = T extends WrapRef<any> ? UnwrapRef<T> : T;

function useReactive<T extends object>(target: T): ReactiveState<T>;

function useShallowReactive<T extends object>(target: T): ReactiveState<T>;
```

## Notes

- For primitive types, it is recommended to use `useVRef`.
- `useShallowReactive` does not perform deep recursive proxying.
- Passing an already proxied object will be reused directly.
