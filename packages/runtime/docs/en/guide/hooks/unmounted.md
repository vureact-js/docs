# useUnmounted

`useUnmounted` is a React adaptation of Vue's `onUnmounted`, which executes when a component is unmounted.

## Basic Usage

This hook is suitable for placing "cleanup logic on leaving", such as reporting logs and disconnecting connections.

```tsx
useUnmounted(async () => {
  await reportLeave();
});
```

It will not run during the mount and update phases, only triggering when unmounted.

## API

```ts
function useUnmounted(fn: EffectCallback): void;
```

## Notes

- Executes only when unmounted.
- Asynchronous logic can be written.
- Based on `useEffect` cleanup.
