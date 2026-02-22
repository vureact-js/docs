# useToVRefs

`useToVRefs` is used to convert each property of a reactive object into a ref, primarily solving the problem of "losing reactivity after destructuring".

## Basic Usage

Before destructuring a reactive object in a component, call `useToVRefs` first. Afterwards, you can read and write each property via `.value` while maintaining linkage.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FtoVRef%2FToVRefsBasic.tsx&initialpath=/hooks/useToVRefs/basic">
</iframe>

```tsx
const state = useReactive({ foo: 1, bar: 'Hello' });
const { foo, bar } = useToVRefs(state);

foo.value++;
bar.value += '!';
```

The result of this code is: updates to `foo` and `bar` are synced back to the original `state`, and vice versa.

## Array Scenarios

`useToVRefs` also supports arrays. Each index position is converted to a ref.

```tsx
const list = useReactive([1, 2, 3]);
const refs = useToVRefs(list);

refs[0].value = 99;
```

This is suitable when you need to use array elements as independently passable refs.

## API

```ts
type ToRefStates<T> = {
  [K in keyof T]: ToRefValueState<T[K]>;
};

function useToVRefs<T extends object>(object: T): ToRefStates<T>;
```

## Notes

- It is recommended to pass a reactive object; passing a plain object will trigger a warning in the development environment.
- The returned container reference is stable and suitable for direct use in hooks dependencies.
- In array mode, only index items are processed, not non-index properties such as `length`.
