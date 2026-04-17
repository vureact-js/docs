# 自动依赖收集

解析 VuReact 如何自动分析 Vue 3 中的`响应式依赖`，精准生成 React Hooks 的`依赖数组`？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 和 React 的响应式与依赖追踪机制。

## 自动依赖分析 → React Hook 依赖数组生成

VuReact 编译器内置了`自动依赖分析能力`，遵循 React 规则，智能分析`顶层箭头函数`与`顶层变量声明`中的响应式访问，并生成准确的依赖数组。

- Vue 代码：

```ts
const count = ref(0);
const foo = ref(0);
const state = reactive({ foo: 'bar', bar: { c: 1 } });

const fn1 = () => {
  count.value += state.bar.c;
  console.log(count.value);
};

const fn = () => {};

const fn2 = () => {
  const c = foo.value;
  fn();

  const fn4 = () => {
    state.bar.c--;
    c + count.value;
  };
};

const fn3 = () => {
  foo.value++;

  const state = ref('fake'); // ⚠ 不符规范的写法
  const count = state.value + 'yoxi';

  count.charAt(1);
};
```

- VuReact 编译后 React 代码：

```tsx
const count = useVRef(0);
const foo = useVRef(0);
const state = useReactive({ foo: 'bar', bar: { c: 1 } });

const fn1 = useCallback(() => {
  count.value += state.bar.c;
  console.log(count.value);
}, [count.value, state.bar?.c]);

const fn = () => {};

const fn2 = useCallback(() => {
  const c = foo.value;
  fn();

  const fn4 = () => {
    state.bar.c--;
    c + count.value;
  };
}, [foo.value, state.bar?.c, count.value]);

const fn3 = useCallback(() => {
  foo.value++;

  const state = useVRef('fake'); // ⚠ 不符规范的写法
  const count = state.value + 'yoxi';

  count.charAt(1);
}, [foo.value]);
```

这段对比展示了：

- `fn1` 会被识别为顶层箭头函数并收集 `count.value` 与 `state.bar.c`；
- `fn2` 会溯源 `c` 并忽略局部函数 `fn4`；
- `fn3` 会忽略函数内部新建的响应式变量，只收集外部依赖 `foo.value`。

## 组合访问与别名追踪

VuReact 也会对`复杂别名链`和`解构`访问进行`溯源`。

- Vue 代码：

```ts
const objRef = ref({ a: 1, b: { c: 1 } });
const listRef = ref([1, 2, 3]);
const aliasA = state.foo;
const aliasB = aliasA;
const aliasC = aliasB;
const { foo: stateFoo } = state;
const [first] = listRef.value;

const traceFn = () => {
  aliasC;
};

const destructureFn = () => {
  stateFoo;
  first;
};
```

- VuReact 编译后 React 代码：

```tsx
const objRef = useVRef({ a: 1, b: { c: 1 } });
const listRef = useVRef([1, 2, 3]);
const aliasA = useMemo(() => state.foo, [state.foo]);
const aliasB = useMemo(() => aliasA, [aliasA]);
const aliasC = useMemo(() => aliasB, [aliasB]);
const { foo: stateFoo } = useMemo(() => state, [state]);
const [first] = useMemo(() => listRef.value, [listRef.value]);

const traceFn = useCallback(() => {
  aliasC;
}, [aliasC]);

const destructureFn = useCallback(() => {
  stateFoo;
  first;
}, [stateFoo, first]);
```

这样可见：

- alias 链会被逐层溯源到真实响应式来源；
- 解构后的变量也会通过 `useMemo` 转换为可追踪依赖。

## 顶层变量声明 → React `useMemo` 依赖数组生成

- Vue 代码：

```ts
const fooRef = ref(0);
const reactiveState = reactive({ foo: 'bar', bar: { c: 1 } });

const memoizedObj = {
  title: 'test',
  bar: fooRef.value,
  add: () => {
    reactiveState.bar.c++;
  },
};

let staticObj = {
  foo: 1,
  state: { bar: { c: 1 } },
};

const reactiveList = [fooRef.value, 1, 2];

const mixedList = [
  { name: reactiveState.foo, age: fooRef.value },
  { name: 'A', age: 20 },
];

const nestedObj = {
  a: {
    b: {
      c: reactiveList[0],
      d: () => {
        return memoizedObj.bar;
      },
    },
    e: mixedList,
  },
};
```

- VuReact 编译后 React 代码：

```tsx
const memoizedObj = useMemo(
  () => ({
    title: 'test',
    bar: fooRef.value,
    add: () => {
      reactiveState.bar.c++;
    },
  }),
  [fooRef.value, reactiveState.bar?.c],
);

let staticObj = {
  foo: 1,
  state: {
    bar: {
      c: 1,
    },
  },
};

const reactiveList = useMemo(() => [fooRef.value, 1, 2], [fooRef.value]);

const mixedList = useMemo(
  () => [
    { name: reactiveState.foo, age: fooRef.value },
    { name: 'A', age: 20 },
  ],
  [reactiveState.foo, fooRef.value],
);

const nestedObj = useMemo(
  () => ({
    a: {
      b: {
        c: reactiveList[0],
        d: () => {
          return memoizedObj.bar;
        },
      },
      e: mixedList,
    },
  }),
  [reactiveList[0], memoizedObj.bar, mixedList],
);
```

这里的核心对比是：

- `memoizedObj` 会收集对象内部的响应式字段与方法依赖；
- `staticObj` 因为不含响应式访问，不会被优化为 `useMemo`；
- `reactiveList`、`mixedList` 与 `nestedObj` 会根据结构递归补齐依赖数组。

## 自动依赖分析的三大原则

1. **仅分析顶层可优化表达式**：局部函数、嵌套作用域不纳入顶层 Hook 自动优化；
2. **遵循 React 依赖规则**：只收集函数/变量外部的响应式访问，而非内部局部变量；
3. **避免过度优化**：无外部响应式依赖的顶层箭头函数和变量不会被强制转换为 Hook。

## 为什么这很关键？

在 React 中，函数组件每次渲染会重新创建顶层函数与变量。如果这些顶层表达式依赖响应式状态且未获得稳定性处理，会带来：

- 不必要的子组件重新渲染；
- 频繁的 Hook 重新计算；
- 性能不可控的回调变化。

VuReact 在编译阶段自动生成准确依赖数组，既保留了 Vue 写法的简洁性，又实现了 React 端的性能优化。
