# useBeforeMount

`useBeforeMount` 是对 Vue `onBeforeMount` 的 React 近似适配，基于 `useLayoutEffect` 在首次挂载阶段执行。

## 基本使用

这个 hook 适合放“首次渲染前后紧贴布局阶段”的逻辑，例如提前准备 DOM 相关数据。

```tsx
useBeforeMount(() => {
  console.log('before mount');

  return () => {
    console.log('cleanup on unmount');
  };
});
```

这段代码中：回调在首次挂载执行，返回的 cleanup 在卸载时执行。

## API

```ts
function useBeforeMount(fn: EffectCallback): void;
```

## 注意事项

- 只执行一次。
- 执行时机早于普通 `useEffect`。
- 可返回 cleanup。
