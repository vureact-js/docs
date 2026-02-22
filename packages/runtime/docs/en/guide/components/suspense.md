# Suspense

This is a component adapted to the semantics of Vue `<Suspense>`, used to display fallback content when asynchronous dependencies are not yet resolved. It supplements capabilities such as `timeout` and lifecycle callbacks on top of React `Suspense`.

## Basic Usage

Provide a `fallback` for asynchronous child components to display placeholder content before loading is complete.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FSuspense%2FBasicSuspense.tsx&initialpath=/components/suspense/basic">
</iframe>

```tsx
<Suspense fallback={<div>Loading...</div>}>
  <AsyncComponent />
</Suspense>
```

## Delayed Fallback Display

The display timing of fallback content can be controlled via `timeout` to avoid flickering caused by short requests.

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
  fallback={<div>Loading state displayed after exceeding 1 second...</div>}
  onPending={() => addLog('pending')}
  onFallback={() => addLog('fallback')}
  onResolve={() => addLog('resolve')}
>
  <AsyncComponent />
</Suspense>
```

## Nested Asynchronous Dependencies

When there are multiple asynchronous child components within a single boundary, the content area will be switched to only after all of them are available.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FSuspense%2FNestedSuspense.tsx&initialpath=/components/suspense/nested">
</iframe>

```tsx
<Suspense fallback={<div>Synchronizing multiple asynchronous components...</div>}>
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

## Notes

- `fallback` is required and used to define the waiting state UI.
- When `timeout` is not set or is less than or equal to `0`, the fallback will be triggered immediately.
- When `suspensible={false}`, the child nodes will be rendered directly without entering the suspense process.
- `onPending / onFallback / onResolve` are suitable for recording the state of asynchronous boundaries; it is not recommended to perform heavy logic in the callbacks.
