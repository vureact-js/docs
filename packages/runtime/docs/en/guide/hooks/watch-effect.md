# useWatchEffect

`useWatchEffect` is a React adaptation of Vue's `watchEffect`, designed to automatically execute side effects with support for cleanup and manual termination.

## Basic Usage

This example demonstrates re-executing the effect when dependencies change, with automatic cleanup before re-execution/unmounting:

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FWatchEffect%2FWatchEffectBasic.tsx&initialpath=/hooks/useWatchEffect/basic">
</iframe>

```tsx
const count = useVRef(0);

const stop = useWatchEffect(
  (onCleanup) => {
    const timer = setInterval(() => {
      console.log(count.value);
    }, 1000);

    onCleanup?.(() => clearInterval(timer));
  },
  [count.value],
);

stop();
```

## Flush Timing

Use `useWatchPostEffect` when you need to read the latest DOM state—it executes after DOM updates:

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FWatchEffect%2FWatchEffectFlush.tsx&initialpath=/hooks/useWatchEffect/flush">
</iframe>

```tsx
useWatchPostEffect(() => {
  if (elRef.current) {
    setWidth(elRef.current.offsetWidth);
  }
}, [count.value]);
```

## API

```ts
interface WatchEffectOptions {
  flush?: 'pre' | 'post' | 'sync';
}

type WatchStopHandle = () => void;

function useWatchEffect(
  fn: EffectCallback,
  deps?: DependencyList,
  options?: WatchEffectOptions,
): WatchStopHandle;

function useWatchPostEffect(fn: EffectCallback, deps?: DependencyList): WatchStopHandle;

function useWatchSyncEffect(fn: EffectCallback, deps?: DependencyList): WatchStopHandle;
```

## Notes

- `useWatchEffect` uses `flush: 'pre'` by default.
- `useWatchPostEffect` is suitable for reading/measuring the DOM.
- `stop` can be called multiple times but only takes effect once.
- Cleanup functions registered via `onCleanup` take precedence over cleanup functions returned directly.
