# Automatic Dependency Tracking

This section explains how VuReact analyzes **reactive dependencies** in Vue 3 and generates precise **dependency arrays** for React Hooks.

## Assumptions

To keep the examples focused and easy to follow:

1. Vue and React snippets only include core logic, omitting full component wrappers and unrelated configuration
2. Readers are expected to be familiar with reactivity and dependency tracking in both Vue and React

## Automatic Dependency Analysis → Hook Dependency Arrays

The VuReact compiler includes a built-in **automatic dependency analysis system**.

It follows React’s rules to analyze reactive access within **top-level arrow functions** and **top-level variable declarations**, and generates accurate dependency arrays.

- Vue:

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

  const state = ref('fake'); // ⚠ invalid pattern
  const count = state.value + 'yoxi';

  count.charAt(1);
};
```

- Compiled React (VuReact):

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

  const state = useVRef('fake'); // ⚠ invalid pattern
  const count = state.value + 'yoxi';

  count.charAt(1);
}, [foo.value]);
```

This comparison shows:

- `fn1` is recognized as a top-level function, collecting `count.value` and `state.bar.c`
- `fn2` traces the origin of `c` and ignores the local function `fn4`
- `fn3` ignores reactive variables created inside the function, and only tracks external dependency `foo.value`

## Composite Access & Alias Tracing

VuReact can also **trace complex alias chains** and **destructured values** back to their reactive sources.

- Vue:

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

- Compiled React (VuReact):

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

This demonstrates:

- Alias chains are traced step by step back to their original reactive source
- Destructured values are converted via `useMemo` into trackable dependencies

## Top-Level Variables → React `useMemo` Dependency Arrays

- Vue:

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

- Compiled React (VuReact):

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

Key takeaways:

- `memoizedObj` collects dependencies from both object fields and methods
- `staticObj` remains unchanged since it has no reactive access
- `reactiveList`, `mixedList`, and `nestedObj` recursively collect dependencies based on structure

## Three Core Principles of Dependency Analysis

1. **Only top-level optimizable expressions are analyzed**
   Local functions and nested scopes are excluded from automatic Hook optimization

2. **Follows React dependency rules**
   Only external reactive access is tracked—not internal local variables

3. **Avoids over-optimization**
   Expressions without external reactive dependencies are not forced into Hooks

## Why This Matters

In React, function components recreate top-level functions and variables on every render.
If these expressions depend on reactive state without proper stabilization, it can lead to:

- Unnecessary re-renders of child components
- Frequent recomputation of Hooks
- Unstable callbacks and unpredictable performance

VuReact solves this at compile time by generating **accurate dependency arrays**, preserving Vue’s simplicity while ensuring React-level performance guarantees.
