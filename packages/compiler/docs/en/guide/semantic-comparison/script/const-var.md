# Constants & Variables Comparison

How do Vue’s **top-level static constants** and **variables** translate into React code after VuReact performs hoisting and automatic dependency analysis?

## Prerequisites

To avoid unnecessary noise in the examples, here are two quick assumptions:

1. The Vue / React snippets focus only on core logic, omitting full component wrappers and unrelated configs;
2. You’re already familiar with the semantics of top-level `const` declarations and variable/function optimization in Vue 3.

## Top-level Constants → Hoisted Outside React Component

In Vue, top-level constants inside `<script setup>` are commonly used for static configuration or default values. VuReact performs static analysis on these constants:

If the initial value is a **simple literal** (e.g., string, number, boolean), it will be hoisted outside the component to avoid re-creation on every render.

- Vue code:

```vue
<script setup>
const defaultValue = 1;
const isEnabled = true;
</script>
```

- Compiled React code (VuReact):

```tsx
const defaultValue = 1;
const isEnabled = true;

const Comp = memo(() => {
  return <></>;
});
```

As shown, simple top-level constants are hoisted outside the component, which **prevents repeated initialization during each React render**.

## Top-level Variables → React `useMemo` with Auto Dependency Tracking

If a top-level variable is derived from an expression and involves reactive dependencies, VuReact compiles it into `useMemo` and **automatically injects the correct dependency array**.

Purely static expressions, however, remain unchanged—no unnecessary wrapping.

- Vue code:

```vue
<script setup>
const count = ref(0);
const state = reactive({ foo: 'bar', bar: { c: 1 } });

const memoizedObj = {
  title: 'test',
  bar: count.value,
  add: () => {
    state.bar.c++;
  },
};

const staticObj = {
  foo: 1,
  state: { bar: { c: 1 } },
};

const reactiveList = [count.value, 1, 2];
</script>
```

- Compiled React code (VuReact):

```tsx
const count = useVRef(0);
const state = useReactive({ foo: 'bar', bar: { c: 1 } });

const memoizedObj = useMemo(
  () => ({
    title: 'test',
    bar: count.value,
    add: () => {
      state.bar.c++;
    },
  }),
  [count.value, state.bar.c],
);

const staticObj = {
  foo: 1,
  state: {
    bar: { c: 1 },
  },
};

const reactiveList = useMemo(() => [count.value, 1, 2], [count.value]);
```

### Key Takeaways

- `memoizedObj` depends on `count.value` and `state.bar.c`, so it is compiled into `useMemo` with automatically generated dependencies;
- `staticObj` has no reactive dependencies and remains a plain static object;
- `reactiveList` is wrapped with `useMemo`, with dependencies inferred automatically.
