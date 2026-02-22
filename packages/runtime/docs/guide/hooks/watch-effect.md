# useWatchEffect

`useWatchEffect` 是对 Vue `watchEffect` 的 React 适配，用于自动执行副作用，并支持清理与手动停止。

## 基本使用

这个示例展示了：依赖变化时重新执行 effect，并在重新执行/卸载前自动清理。

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

## Flush 时机

当你需要读 DOM 最新状态时，使用 `useWatchPostEffect`。它会在 DOM 更新后执行。

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

## 注意事项

- `useWatchEffect` 默认 `flush: 'pre'`。
- `useWatchPostEffect` 适合读取/测量 DOM。
- `stop` 可多次调用，但只会生效一次。
- `onCleanup` 注册的清理函数优先于直接 `return` 清理函数。
