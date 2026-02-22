# useMounted

`useMounted` is a React adaptation of Vue's `onMounted`, which executes after a component is first mounted.

## Basic Usage

This hook is commonly used for initial data requests, subscription initialization, and one-time side effects.

```tsx
useMounted(async () => {
  const data = await fetchData();
  setData(data);

  return () => {
    console.log('optional cleanup');
  };
});
```

In this code snippet: A request is triggered after mounting; the optional cleanup function will execute when the component is unmounted.

## API

```ts
function useMounted(fn: EffectCallback): void;
```

## Notes

- Executes only once after the first mounting.
- Supports asynchronous callbacks.
- Based on `useEffect`.
