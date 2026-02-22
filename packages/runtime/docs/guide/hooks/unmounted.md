# useUnmounted

`useUnmounted` 是对 Vue `onUnmounted` 的 React 适配，在组件卸载时执行。

## 基本使用

这个 hook 适合放“离开时收尾逻辑”，例如上报日志、断开连接。

```tsx
useUnmounted(async () => {
  await reportLeave();
});
```

挂载和更新阶段不会运行，只有卸载时触发。

## API

```ts
function useUnmounted(fn: EffectCallback): void;
```

## 注意事项

- 仅卸载时执行。
- 可写异步逻辑。
- 基于 `useEffect` cleanup。
