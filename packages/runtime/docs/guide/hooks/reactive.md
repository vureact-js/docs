# useReactive

`useReactive` 是对 Vue `reactive` 的 React 适配，用于创建可追踪的响应式对象。它适合对象、数组、Map、Set 等可代理结构。

## 基本使用

这个场景展示了最常见的对象状态读写。你直接改属性，视图会自动更新。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FReactive%2FReactiveBasic.tsx&initialpath=/hooks/useReactive/basic">
</iframe>

```tsx
const state = useReactive({
  count: 0,
  name: 'Gemini',
});

<p>姓名: {state.name}</p>
<p>计数: {state.count}</p>

<button onClick={() => state.count++}>count++</button>
<button onClick={() => (state.name = 'React Proxy')}>修改名称</button>
```

## 深层嵌套响应

这个场景说明：深层对象和数组也能被追踪，`push`、深层字段修改都能触发正确更新。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FReactive%2FReactiveNested.tsx&initialpath=/hooks/useReactive/nested">
</iframe>

```tsx
const state = useReactive({
  user: { profile: { age: 25 }, tags: ['React', 'Vue'] },
});

state.user.profile.age++;
state.user.tags.push('New Tag');
```

## 浅层响应

`useShallowReactive` 仅追踪第一层属性。适合大对象或你只关心顶层替换的场景。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FReactive%2FShallowReactive.tsx&initialpath=/hooks/useReactive/shallow">
</iframe>

```tsx
const state = useShallowReactive({
  count: 0,
  nested: { val: 100 },
});

state.count++; // 触发更新
state.nested.val++; // 不触发更新
state.nested = { val: 200 }; // 触发更新
```

## API

```ts
type ReactiveState<T> = T extends WrapRef<any> ? UnwrapRef<T> : T;

function useReactive<T extends object>(target: T): ReactiveState<T>;

function useShallowReactive<T extends object>(target: T): ReactiveState<T>;
```

## 注意事项

- 基础类型建议用 `useVRef`。
- `useShallowReactive` 不会深层递归代理。
- 传入已代理对象会直接复用。
