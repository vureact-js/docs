# useBeforeUnMount

`useBeforeUnMount` is a React equivalent adaptation of Vue's `onBeforeUnmount`, which triggers a callback before a component is unmounted.

## Basic Usage

This hook is suitable for placing logic that "executes immediately before leaving the page", such as stopping animations, tracking events, and unbinding resources.

```tsx
useBeforeUnMount(() => {
  console.log('before unmount');
});
```

This code will not execute during the mount and update phases, only when unmounting.

## API

```ts
function useBeforeUnMount(fn: EffectCallback): void;
```

## Notes

- Triggered only during the unmount phase.
- The current implementation does not consume the returned cleanup function.
- Based on the cleanup path of `useLayoutEffect`.
