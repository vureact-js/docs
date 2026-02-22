# Suspense

这是适配 Vue `<Suspense>` 语义的组件，用于在异步依赖未完成时展示回退内容。它在 React `Suspense` 基础上补充了 `timeout`、生命周期回调等能力。

## 基本使用

为异步子组件提供 `fallback`，在加载完成前显示占位内容。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FSuspense%2FBasicSuspense.tsx&initialpath=/components/suspense/basic">
</iframe>

```tsx
<Suspense fallback={<div>加载中...</div>}>
  <AsyncComponent />
</Suspense>
```

## 延迟展示 Fallback

通过 `timeout` 可以控制回退内容的展示时机，避免短请求导致的闪烁。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FSuspense%2FTimeoutSuspense.tsx&initialpath=/components/suspense/timeout">
</iframe>

```tsx
<Suspense
  timeout={1000}
  fallback={<div>超过 1s，显示加载态...</div>}
  onPending={() => addLog('pending')}
  onFallback={() => addLog('fallback')}
  onResolve={() => addLog('resolve')}
>
  <AsyncComponent />
</Suspense>
```

## 嵌套异步依赖

当一个边界内有多个异步子组件时，会在整体可用后再切换到内容区。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FSuspense%2FNestedSuspense.tsx&initialpath=/components/suspense/nested">
</iframe>

```tsx
<Suspense fallback={<div>正在同步多个异步组件...</div>}>
  <AsyncA />
  <AsyncB />
</Suspense>
```

## API

### Props

```ts
interface SuspenseProps extends PropsWithChildren {
  fallback: ReactNode;
  timeout?: number;
  suspensible?: boolean;
  onPending?: () => void;
  onResolve?: () => void;
  onFallback?: () => void;
}
```

## 注意事项

- `fallback` 为必填，用于定义等待态 UI。
- `timeout` 未设置或小于等于 `0` 时，会立即触发 fallback。
- `suspensible={false}` 时会直接渲染子节点，不进入 suspense 流程。
- `onPending / onFallback / onResolve` 适合记录异步边界状态，不建议在回调中做重逻辑。
