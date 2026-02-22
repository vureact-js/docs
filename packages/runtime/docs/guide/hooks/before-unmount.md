# useBeforeUnMount

`useBeforeUnMount` 是对 Vue `onBeforeUnmount` 的 React 近似适配，在组件卸载前触发回调。

## 基本使用

这个 hook 适合放“离开页面前立即执行”的逻辑，例如停止动画、打点、解绑资源。

```tsx
useBeforeUnMount(() => {
  console.log('before unmount');
});
```

这段代码在挂载和更新阶段都不会执行，只在卸载时触发。

## API

```ts
function useBeforeUnMount(fn: EffectCallback): void;
```

## 注意事项

- 仅在卸载阶段触发。
- 当前实现不消费返回 cleanup。
- 基于 `useLayoutEffect` 的 cleanup 路径。
