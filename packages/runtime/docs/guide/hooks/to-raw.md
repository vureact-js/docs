# useToRaw

`useToRaw` 用于从响应式代理对象中取回原始对象。常用于调试、序列化、或与非响应式工具交互。

## 基本使用

这个场景展示了从 proxy 取 raw 并做快照输出。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FToRaw%2FToRawBasic.tsx&initialpath=/hooks/useToRaw/basic">
</iframe>

```tsx
const source = { settings: { theme: 'dark' } };
const state = useReactive(source);

const raw = useToRaw(state);
console.log(raw); // 原始对象 -> source
```

需要注意：修改 `raw` 不会触发响应式渲染。

## API

```ts
function useToRaw<T extends object>(target: T): T | undefined;
```

## 注意事项

- 对 reactive proxy 调用时通常返回原对象。
- 对普通对象调用时可能是 `undefined`。
- 该 hook 主要用于读取“脱代理对象”，不是用来驱动 UI 更新。
