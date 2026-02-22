# useReadonly

`useReadonly` 是对 Vue `readonly` 的 React 适配，用于创建只读视图，避免在不该写入的地方误改状态。

## 基本使用

这个场景展示了：通过只读视图读取数据是允许的，但直接写入只读视图无效。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FReadonly%2FReadonlyBasic.tsx&initialpath=/hooks/useReadonly/basic">
</iframe>

```tsx
const source = useReactive({ count: 0, nested: { text: 'Hello' } });
const read = useReadonly(source);

source.count++; // 有效
(read as any).count++; // 无效，开发环境会告警/抛错
```

当源数据变化时，`read` 会同步反映新值。

## 浅只读

`useShallowReadonly` 只保护第一层写入。深层对象仍是原引用，按原逻辑可改。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FReadonly%2FShallowReadonly.tsx&initialpath=/hooks/useReadonly/shallow">
</iframe>

```tsx
const state = useReactive({ user: { name: 'React' } });
const shallowRead = useShallowReadonly(state);

(shallowRead as any).user = { name: 'New' }; // 无效
(shallowRead.user as any).name = 'Vureact'; // 有效
```

## API

```ts
type ReadonlyType<T> = Readonly<T> | Snapshot<T>;
type ReadonlySnapshot<T> = T extends WrapRef<any> ? ReadonlyType<UnwrapRef<T>> : ReadonlyType<T>;

function useReadonly<T extends object>(target: T): ReadonlySnapshot<T>;

function useShallowReadonly<T extends object>(target: T): ReadonlySnapshot<T>;
```

## 注意事项

- 对 reactive proxy 调用时，readonly 结果会随源数据同步。
- 对普通对象调用时，是冻结副本，不具备响应式联动。
- 对 `useVRef` 使用时会自动解包 `value`。
