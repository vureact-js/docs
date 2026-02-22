# useWatch

`useWatch` is a React adaptation of Vue's `watch`, designed to listen for changes in source values and execute side effects.

## Basic Usage

This example demonstrates the complete workflow of listening to a ref, sending an asynchronous request, and cleaning up the previous request before the next trigger.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FWatch%2FWatchBasic.tsx&initialpath=/hooks/useWatch/basic">
</iframe>

```tsx
const userId = useVRef(1);

useWatch(
  userId,
  async (newId, oldId, onCleanup) => {
    let cancelled = false;

    onCleanup?.(() => {
      cancelled = true;
    });

    const data = await fetchUser(newId);
    if (!cancelled) {
      setUserData(data);
    }
  },
  { immediate: true },
);
```

This code ensures that when `userId` changes rapidly, the result of the old request will not overwrite the result of the new request.

## Deep Watching & Multi-Source Watching

Use `deep` when listening for changes in internal fields of an object, and pass an array as the source when paying attention to multiple values simultaneously.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FWatch%2FWatchAdvanced.tsx&initialpath=/hooks/useWatch/advanced">
</iframe>

```tsx
const state = useReactive({ info: { name: 'Vureact' }, count: 0 });

useWatch(
  () => state.info,
  (val) => {
    console.log(val.name);
  },
  { deep: true },
);

useWatch([state.count, state.info.name], ([count, name]) => {
  console.log(count, name);
});
```

## Stop Watching

`useWatch` returns a `stop` function. Calling it will immediately stop subsequent listening and execute the cleanup logic.

```tsx
const stop = useWatch(source, callback);

stop();
```

## API

```ts
type WatchSource<T = any> = T | (() => T);

type WatchCallback<V = any, OV = any> = (
  value: V,
  oldValue: OV | undefined,
  onCleanup?: OnCleanup,
) => Destructor | Promise<Destructor>;

interface WatchOptions {
  immediate?: boolean;
  deep?: boolean | number;
  once?: boolean;
  flush?: 'pre' | 'post' | 'sync';
}

type WatchStopHandle = () => void;

function useWatch<T>(
  source: WatchSource<T>,
  fn: WatchCallback<T, T>,
  options?: WatchOptions,
): WatchStopHandle;
```

## Notes

- By default, it does not execute on initial mount; only when `immediate: true` is set will it execute immediately.
- `once: true` triggers only once and then stops automatically.
- `deep: number` can limit the depth of deep comparison.
- `flush` is used to control the execution timing of the callback: `pre / post / sync`.
