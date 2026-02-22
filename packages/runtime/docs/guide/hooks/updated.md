# useUpdated

`useUpdated` 是对 Vue `onUpdated` 的 React 适配，跳过首次挂载，仅在依赖更新后执行。

## 基本使用

这个 hook 适合放“提交后副作用”，例如读取最新渲染结果、触发后续同步。

```tsx
useUpdated(() => {
  console.log('updated', count);

  return () => {
    console.log('cleanup before next updated / unmount');
  };
}, [count]);
```

每次 `count` 更新后执行，cleanup 在下次触发前和卸载时执行。

## API

```ts
function useUpdated(fn: EffectCallback, deps?: DependencyList): void;
```

## 注意事项

- 首次挂载不执行。
- 基于 `useEffect`，属于提交后时机。
- 支持 cleanup。
