# useToVRef

`useToVRef` 用于把值、对象属性或 getter 转为 ref 风格状态，对应 Vue `toRef` 的主要使用方式。

## 对象属性转 Ref

这个模式最常用：把 reactive 对象中的某个字段单独提取出来，同时保持双向同步。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-hooks%2FtoVRef%2FToVRefBasic.tsx&initialpath=/hooks/useToVRef/basic">
</iframe>

```tsx
const state = useReactive({ count: 1 });
const countRef = useToVRef(state, 'count');

countRef.value++; // 同步到 state.count
state.count--; // 同步到 countRef.value
```

这使你可以安全解构某个字段而不丢失响应式联动。

## Getter 转只读 Ref

当你希望把“表达式结果”暴露为 ref 时，可以传 getter。返回值是只读 ref。

```tsx
const state = useReactive({ count: 2 });
const doubleRef = useToVRef(() => state.count * 2);

console.log(doubleRef.value); // 4
```

这种模式适合把派生值统一用 `.value` 形式消费。

## 值转 Ref

传入普通值时，`useToVRef` 会退化为“创建一个标准 ref”。

```tsx
const idRef = useToVRef(1001);
idRef.value = 1002;
```

当你写工具函数并希望入参统一为 ref 语义时，这个模式很实用。

## API

```ts
type ToRefValueState<T> = T extends WrapRef<infer T> ? T : RefState<T>;

function useToVRef<T>(value: T): ToRefValueState<T>;

function useToVRef<T>(value: () => T): Readonly<RefState<T>>;

function useToVRef<T extends object, K extends keyof T>(
  object: T,
  key: K,
): ToRefPropertyState<T, K>;

function useToVRef<T extends object, K extends keyof T>(
  object: T,
  key: K,
  defaultValue: T[K],
): ToRefPropertyState<T, K>;
```

## 注意事项

- 属性模式下，`ref.value` 与源属性是双向同步关系。
- getter 模式是只读 ref，写入会在开发环境告警。
- `defaultValue` 仅在属性当前值为 `undefined` 时兜底。
