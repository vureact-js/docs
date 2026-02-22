# useToVRefs

`useToVRefs` 用于把 reactive 对象的每个属性都转换为 ref，主要解决“解构后丢失响应式”的问题。

## 基本使用

在组件里解构 reactive 对象前，先调用 `useToVRefs`，后续就可以通过各属性的 `.value` 读写并保持联动。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FtoVRef%2FToVRefsBasic.tsx&initialpath=/hooks/useToVRefs/basic">
</iframe>

```tsx
const state = useReactive({ foo: 1, bar: 'Hello' });
const { foo, bar } = useToVRefs(state);

foo.value++;
bar.value += '!';
```

这段代码的结果是：`foo`、`bar` 更新会同步回原始 `state`，反过来也成立。

## 数组场景

`useToVRefs` 也支持数组。每个索引位会被转换为 ref。

```tsx
const list = useReactive([1, 2, 3]);
const refs = useToVRefs(list);

refs[0].value = 99;
```

适用于需要把数组元素作为可独立传递的 ref 使用时。

## API

```ts
type ToRefStates<T> = {
  [K in keyof T]: ToRefValueState<T[K]>;
};

function useToVRefs<T extends object>(object: T): ToRefStates<T>;
```

## 注意事项

- 推荐传入 reactive 对象；传普通对象会在开发环境警告。
- 返回容器引用稳定，适合在 hooks 依赖中直接使用。
- 数组模式下仅处理索引项，不处理 `length` 等非索引属性。
