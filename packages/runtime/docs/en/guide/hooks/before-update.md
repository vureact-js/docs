# useBeforeUpdate

`useBeforeUpdate` is a React equivalent adaptation of Vue's `onBeforeUpdate`, which skips the initial mount and only triggers before dependencies are updated.

## Basic Usage

This hook is suitable for placing logic that needs to run "before a change is committed", such as recording old values or performing pre-update validation.

```tsx
useBeforeUpdate(() => {
  console.log('before update');

  return () => {
    console.log('cleanup before next update / unmount');
  };
}, [count, status]);
```

It triggers when `count` or `status` changes; the cleanup function will run before the next trigger or on unmount.

## API

```ts
function useBeforeUpdate(fn: EffectCallback, deps?: DependencyList): void;
```

## Notes

- It does not execute on the initial mount.
- Based on `useLayoutEffect`, it fires earlier than `useEffect`.
- A cleanup function can be returned.
