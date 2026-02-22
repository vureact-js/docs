# useBeforeUpdate

`useBeforeUpdate` 是对 Vue `onBeforeUpdate` 的 React 近似适配，跳过首次挂载，仅在依赖更新前触发。

## 基本使用

这个 hook 适合放“变更提交前”的逻辑，例如记录旧值、做更新前校验。

```tsx
useBeforeUpdate(() => {
  console.log('before update');

  return () => {
    console.log('cleanup before next update / unmount');
  };
}, [count, status]);
```

当 `count` 或 `status` 变化时触发；cleanup 会在下一次触发前或卸载时运行。

## API

```ts
function useBeforeUpdate(fn: EffectCallback, deps?: DependencyList): void;
```

## 注意事项

- 首次挂载不执行。
- 基于 `useLayoutEffect`，时机早于 `useEffect`。
- 可返回 cleanup。
