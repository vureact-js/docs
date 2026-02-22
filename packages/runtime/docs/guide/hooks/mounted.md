# useMounted

`useMounted` 是对 Vue `onMounted` 的 React 适配，在组件首次挂载后执行。

## 基本使用

这个 hook 常用于初始化请求、订阅启动、一次性副作用。

```tsx
useMounted(async () => {
  const data = await fetchData();
  setData(data);

  return () => {
    console.log('optional cleanup');
  };
});
```

这段代码中：挂载后触发请求；可选 cleanup 会在卸载时执行。

## API

```ts
function useMounted(fn: EffectCallback): void;
```

## 注意事项

- 仅首次挂载后执行一次。
- 支持异步回调。
- 基于 `useEffect`。
