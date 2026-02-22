# useUpdated

`useUpdated` is a React adaptation of Vue's `onUpdated` hook. It skips the initial mount phase and only executes after the dependencies are updated.

## Basic Usage

This hook is suitable for placing "post-commit side effects", such as reading the latest rendering results or triggering subsequent synchronization operations.

```tsx
useUpdated(() => {
  console.log('updated', count);

  return () => {
    console.log('cleanup before next updated / unmount');
  };
}, [count]);
```

It executes every time `count` is updated, and the cleanup function runs before the next trigger and during unmounting.

## API

```ts
function useUpdated(fn: EffectCallback, deps?: DependencyList): void;
```

## Notes

- It does not execute on the initial mount.
- Based on `useEffect`, it belongs to the post-commit phase.
- Cleanup is supported.
