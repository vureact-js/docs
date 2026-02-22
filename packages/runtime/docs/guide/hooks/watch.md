# useWatch

`useWatch` 是对 Vue `watch` 的 React 适配，用于监听来源值变化并执行副作用。

## 基本使用

这个例子展示了监听 ref、发起异步请求、以及在下一次触发前清理上一次请求的完整流程。

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

这段代码保证了：当 `userId` 快速变化时，旧请求结果不会覆盖新请求结果。

## 深度监听与多源监听

当监听对象内部字段变化时可使用 `deep`，当同时关注多个值时可传数组来源。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FWatch%2FWatchAdvanced.tsx&initialpath=/hooks/useWatch/advanced">
</iframe>

```tsx
const state = useReactive({ info: { name: 'Vureact' }, count: 0 });

useWatch(() => state.info, (val) => {
  console.log(val.name);
}, { deep: true });

useWatch([state.count, state.info.name], ([count, name]) => {
  console.log(count, name);
});
```

## 停止监听

`useWatch` 返回 `stop` 函数，调用后会立即停止后续监听并执行清理逻辑。

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

## 注意事项

- 默认首次挂载不执行，`immediate: true` 才会立刻执行。
- `once: true` 仅触发一次后自动停止。
- `deep: number` 可限制深比较层级。
- `flush` 用于控制回调执行时机：`pre / post / sync`。
