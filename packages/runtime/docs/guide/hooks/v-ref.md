# useVRef

`useVRef` 是对 Vue `ref` 的 React 适配，用于创建带 `.value` 的响应式状态。

## 基本类型 Ref

这个场景用于保存简单值（数字、字符串、布尔值）。通过修改 `.value`，组件会自动重渲染。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FVRef%2FVRefBasic.tsx&initialpath=/hooks/useVRef/basic">
</iframe>

```tsx
const count = useVRef(0);
const name = useVRef('React');

<p>计数器: {count.value}</p>
<p>姓名: {name.value}</p>

<button onClick={() => count.value++}>自增</button>
<button onClick={() => (name.value = `Vureact ${count.value}`)}>改名</button>
```

这段代码的效果是：点击按钮后，`count.value` 和 `name.value` 变化会立即反映到界面。

## 对象 Ref

这个场景用于把一个对象整体作为 ref 保存。你既可以修改对象内部字段，也可以整体替换对象。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FVRef%2FVRefObject.tsx&initialpath=/hooks/useVRef/object">
</iframe>

```tsx
const user = useVRef({ name: 'Alice', age: 25 });

user.value.age++; // 改内部字段
user.value = { name: 'Bob', age: 30 }; // 整体替换
```

当你直接修改 `user.value.name`、`user.value.age` 时，界面会跟随变化更新。

## 浅层 Ref

`useShallowVRef` 只追踪 `.value` 这一层。也就是“改内部字段”不触发更新，“替换整个 value”才触发更新。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FVRef%2FShallowVRef.tsx&initialpath=/hooks/useVRef/shallow">
</iframe>

```tsx
const state = useShallowVRef({ count: 1 });

state.value.count++; // 不触发更新
state.value = { count: 2 }; // 触发更新
```

这个模式适合大对象场景，减少深层追踪开销。

## API

```ts
interface WrapRef<T = unknown> {
  value: T;
}

type RefState<T = unknown> = T extends WrapRef<infer U> ? U : WrapRef<T>;

function useVRef<T>(initialValue: T): RefState<T>;

function useShallowVRef<T>(initialValue: T): RefState<T>;
```

## 注意事项

- 在 JSX 中依然需要显式使用 `.value`，不会自动解包。
- `useVRef` 适合普通 ref 场景；只需追踪顶层替换时用 `useShallowVRef`。
- `Map`、`Set` 等复杂结构也可以作为 `useVRef` 的值。
