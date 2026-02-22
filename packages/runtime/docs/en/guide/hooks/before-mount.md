# useBeforeMount

`useBeforeMount` is a React equivalent adaptation of Vue's `onBeforeMount`, implemented based on `useLayoutEffect` during the initial mounting phase.

## Basic Usage

This hook is suitable for placing logic that "runs closely to the layout phase right before and after the first render", such as preparing DOM-related data in advance.

```tsx
useBeforeMount(() => {
  console.log('before mount');

  return () => {
    console.log('cleanup on unmount');
  };
});
```

In this code snippet: the callback is executed during the initial mount, and the returned cleanup function is executed when the component is unmounted.

## API

```ts
function useBeforeMount(fn: EffectCallback): void;
```

## Notes

- Executes only once.
- Executes earlier than the regular `useEffect`.
- Can return a cleanup function.
