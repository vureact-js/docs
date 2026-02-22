# useComputed

`useComputed` 是对 Vue `computed` 的 React 适配。它会自动追踪依赖并缓存结果，只有依赖变化后才重新计算。

## 基本使用

这个场景展示最常见的“派生值”计算：由 `count` 与 `price` 计算 `totalPrice`。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FComputed%2FComputedBasic.tsx&initialpath=/hooks/useComputed/basic">
</iframe>

```tsx
const state = useReactive({ count: 1, price: 99 });

const totalPrice = useComputed(() => state.count * state.price);

<p>{totalPrice.value}</p>
```

`totalPrice.value` 会在依赖更新时自动刷新，未变化时复用缓存。

## 列表过滤场景

这个模式适合列表筛选、排序等计算量较高的派生数据。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FComputed%2FComputedList.tsx&initialpath=/hooks/useComputed/list">
</iframe>

```tsx
const state = useReactive({ searchQuery: '', items: ['Apple', 'Banana'] });

const filteredList = useComputed(() =>
  state.items.filter((item) => item.toLowerCase().includes(state.searchQuery.toLowerCase())),
);
```

当 `searchQuery` 或 `items` 不变时，不会重复筛选。

## 可写计算属性

当你希望把“读写逻辑”封装在同一个 computed 里时，使用 `get/set` 形式。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FComputed%2FComputedWritable.tsx&initialpath=/hooks/useComputed/writable">
</iframe>

```tsx
const state = useReactive({ firstName: '张', lastName: '三' });

const fullName = useComputed({
  get: () => `${state.firstName} ${state.lastName}`,
  set: (val) => {
    const [first, last] = val.split(' ');
    state.firstName = first || '';
    state.lastName = last || '';
  },
});

<input value={fullName.value} onChange={(e) => (fullName.value = e.target.value)} />
```

输入框修改 `fullName.value` 后，会反向更新 `firstName/lastName`。

## API

```ts
type ComputedGetter<T> = () => T;
type ComputedSetter<T> = (value: T) => void;

interface ComputedRef<T> {
  readonly value: T;
}

interface WritableComputedRef<T> extends ComputedRef<T> {
  value: T;
}

interface WritableComputedOptions<T> {
  get: ComputedGetter<T>;
  set: ComputedSetter<T>;
}

function useComputed<T>(getter: ComputedGetter<T>): ComputedRef<T>;

function useComputed<T>(options: WritableComputedOptions<T>): WritableComputedRef<T>;
```

## 注意事项

- 只读 computed 写入会在开发环境告警。
- computed 是惰性求值，只有访问 `.value` 才会计算。
- 可写 computed 必须提供 `set`。
