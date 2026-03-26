# What Is Semantic-Aware Compilation?

**Semantic-aware compilation** does not mechanically replace Vue syntax with React syntax.  
It first understands runtime semantics (reactivity, lifecycle, data flow), then generates code that is valid in React.

If you remember one sentence, make it this:

> **VuReact is not just “rewriting code text”, it is preserving correctness in React semantics.**

## 1. Core Concept: How Is It Different from Syntax-Level Conversion?

The difference is simple:
- syntax-level conversion asks “what does this look like?”
- semantic-aware conversion asks “what does this actually do?”

### Comparison A: `ref` is not just a rename

Vue input:
```vue
<script setup lang="ts">
import { ref } from 'vue';
const count = ref(0);
const inc = () => count.value++;
</script>
```

Typical mechanical conversion (illustrative):
```tsx
const [count, setCount] = useState(0); // similar syntax, different semantics
const inc = () => count++; // incorrect behavior
```

Semantic-aware output (illustrative):
```tsx
const count = useVRef(0);
const inc = useCallback(() => {
  count.value++;
}, [count.value]);
```

**Key point**: this is semantic preservation, not keyword substitution.

## 2. What Problems Does It Solve?

The real pain in Vue -> React migration is usually **semantic loss**, not syntax mismatch.
Common issues:
1. behavior drift after directive/structure conversion (conditions, loops, slots, two-way binding)
2. unstable output across similar files
3. weaker readability and maintainability
4. **dependency loss or incomplete dependency collection**, causing stale closures, state desync, or intermittent behavior bugs

Why semantic-aware compilation helps:

- **Stability**: similar inputs produce more consistent outputs
- **Maintainability**: output stays closer to React engineering structure
- **Mental clarity**: teams reason in “input behavior -> output behavior”
- **Dependency reliability**: automatic dependency analysis/collection reduces hidden missing-dependency risks

**Reading tip**: if your top concern is missing dependencies and how to prevent them, jump to Section 5 first, then return here.

## 3. How It Differs from Common Approaches

Most approaches fall into three buckets:
1. syntax replacement: fast but fragile in complex cases
2. AST mapping: stricter, but still mechanical without semantic staging
3. runtime proxying: fast short-term, but may shift complexity to runtime

VuReact takes a different route:
- staged processing (parse -> understand -> generate)
- semantic context first, generation second
- compile-time decisions whenever possible

**Key point**: this improves predictability and long-term maintainability.

## 4. Template / Script Dimensions: Why This Is Logic Reconstruction

## 4.1 Template: structure, scope, and directive semantics

Template processing focuses on:
- branch relationships (`v-if / v-else-if / v-else`)
- loop semantics (`v-for` source/value/index/key)
- event modifier semantics (`v-on`)
- slot scope semantics (`v-slot`)
- `v-model` behavior on different targets

### Comparison B: `v-model` is not only an event-name change

Vue input:
```vue
<ChildPanel v-model="title" />
```

Semantic-aware output (illustrative):
```tsx
<ChildPanel
  modelValue={title.value}
  onUpdateModelValue={(value) => {
    title.value = value;
  }}
/>
```

**Key point**: this rebuilds a data-flow contract, not only an attribute rename.

### Comparison C: Nested conditional directives -> JSX ternary structure

This is a core semantic case: not just replacing `v-if` with `? :`, but preserving branch dependency and fallback order.

Vue input (illustrative):
```vue
<template>
  <div v-if="user">
    <AdminPanel v-if="user.role === 'admin'" />
    <GuestPanel v-else-if="user.role === 'guest'" />
    <MemberPanel v-else />
  </div>
  <EmptyState v-else />
</template>
```

Semantic-aware output (illustrative):
```tsx
{
  user ? (
    user.role === 'admin' ? (
      <AdminPanel />
    ) : user.role === 'guest' ? (
      <GuestPanel />
    ) : (
      <MemberPanel />
    )
  ) : (
    <EmptyState />
  );
}
```

### Comparison D: `v-for` -> `map / Object.entries`

`v-for` reconstruction depends on data shape:
- arrays usually become `map`
- objects usually become `Object.entries(...).map(...)`

Vue input (illustrative):
```vue
<template>
  <li v-for="(item, i) in list" :key="item.id">{{ i }} - {{ item.name }}</li>
  <li v-for="(val, key, i) in obj" :key="key">{{ i }} - {{ key }}: {{ val }}</li>
</template>
```

Semantic-aware output (illustrative):
```tsx
{
  list.map((item, i) => <li key={item.id}>{i} - {item.name}</li>);
}
{
  Object.entries(obj).map(([key, val], i) => (
    <li key={key}>
      {i} - {key}: {val}
    </li>
  ));
}
```

### Template readability tips (for more stable conversion)

1. keep condition chains flat when possible
2. always provide stable `:key` in loops
3. keep template expressions simple; move complex logic to script
4. use clear slot param names and avoid deeply nested destructuring
5. keep one dominant data-flow style per template area

## 4.2 Script: align reactivity, lifecycle, and setup logic

Script processing handles:
- reactive API mapping (`ref/computed/watch`)
- macro semantics (`defineProps`, `defineEmits`, `defineExpose`, etc.)
- lifecycle and dependency relationships
- setup logic into valid React component structure

In short:  
**Script alignment happens under analyzable, executable, and maintainable constraints.**

## 5. Automatic Dependency Analysis and Collection (Critical Capability)

The highlight here is not “put every variable into a dependency array.”  
The real capability is: **target-based triggering, scope-aware filtering, and trace-back collection across references**.

From compiler test scenarios, this works from basic reads to deep nesting and alias/destructure trace-back.  
So it is not “collect on every statement”; it has explicit triggers and boundaries.

### 5.1 When dependency analysis is triggered

Analysis is triggered only for targets that are rebuilt into dependency-shaped React structures:

1. top-level arrow functions (typically rebuilt to `useCallback`)
2. top-level objects/arrays/expressions (typically rebuilt to `useMemo`)
3. reactive reads inside those targets (`ref.value`, chained `reactive` access)
4. traceable aliases, destructuring, and cross-variable references

**Key point**: identify the analysis target first, then collect dependencies.

### 5.2 What is intentionally not collected (designed boundaries)

To avoid false positives, the strategy is conservative in these cases:

1. normal `function` declarations (not dependency-shaped rewrite targets)
2. temporary callbacks passed as arguments, class methods, local functions in object methods
3. reactive variables created inside a function, or local shadowing of outer names
4. highly dynamic access paths (for example dynamic index access), handled with limited inference

**Key point**: this is intentional for **predictable, explainable, maintainable** output.

### 5.3 Complex nested case: object + array + function cross-references

Vue input (illustrative):
```vue
<script setup lang="ts">
const fooRef = ref(0);
const reactiveState = reactive({ foo: 'bar', bar: { c: 1 } });

const memoizedObj = {
  title: 'test',
  bar: fooRef.value,
  add: () => {
    reactiveState.bar.c++;
  },
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
      d: () => memoizedObj.bar,
    },
    e: mixedList,
  },
};

const computeFn = () => {
  memoizedObj.add();
  return nestedObj.a.b.d();
};
</script>
```

Semantic-aware output (illustrative):
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

const reactiveList = useMemo(() => [fooRef.value, 1, 2], [fooRef.value]);
const mixedList = useMemo(
  () => [{ name: reactiveState.foo, age: fooRef.value }, { name: 'A', age: 20 }],
  [reactiveState.foo, fooRef.value],
);

const nestedObj = useMemo(
  () => ({
    a: {
      b: { c: reactiveList[0], d: () => memoizedObj.bar },
      e: mixedList,
    },
  }),
  [reactiveList[0], memoizedObj.bar, mixedList],
);

const computeFn = useCallback(() => {
  memoizedObj.add();
  return nestedObj.a.b.d();
}, [memoizedObj, nestedObj.a?.b]);
```

Notice what stands out:  
dependencies for `nestedObj` are collected across layers and references, not guessed loosely.

### 5.4 Trace-back collection case: alias chains and destructuring

Vue input (illustrative):
```vue
<script setup lang="ts">
const state = reactive({ foo: 'bar' });
const listRef = ref([1, 2, 3]);

const aliasA = state.foo;
const aliasB = aliasA;
const aliasC = aliasB;

const { foo: stateFoo } = state;
const [first] = listRef.value;

const traceFn = () => {
  aliasC;
  stateFoo;
  first;
};
</script>
```

Semantic-aware output (illustrative):
```tsx
const aliasA = useMemo(() => state.foo, [state.foo]);
const aliasB = useMemo(() => aliasA, [aliasA]);
const aliasC = useMemo(() => aliasB, [aliasB]);

const { foo: stateFoo } = useMemo(() => state, [state]);
const [first] = useMemo(() => listRef.value, [listRef.value]);

const traceFn = useCallback(() => {
  aliasC;
  stateFoo;
  first;
}, [aliasC, stateFoo, first]);
```

**Key point**: collection does not stop at surface variable names; it can follow alias/destructure paths.

### 5.5 Writing tips for more stable dependency analysis

1. keep key callbacks and view-model-like values at top level
2. avoid mixing dynamic paths with deeply nested anonymous callbacks
3. aliases/destructuring are fine, but keep reference chains readable
4. isolate highly dynamic logic locally and keep main flow analyzable

## 6. Static Hoisting and Top-Level `useMemo` Optimization

### 6.1 Static Hoisting
When top-level values are proven static, they are hoisted outside the component to avoid repeated creation.

Vue input (illustrative):
```vue
<script setup lang="ts">
const TITLE = 'User Panel';
const RETRY_LIMIT = 3;
</script>
```

Semantic-aware output (illustrative):
```tsx
const TITLE = 'User Panel';
const RETRY_LIMIT = 3;

const UserPanel = memo(() => {
  return <h3>{TITLE}</h3>;
});
```

### 6.2 Top-level `useMemo` optimization

If a top-level variable depends on reactive state, semantic compilation rebuilds it with `useMemo` and inferred dependencies.

Vue input (illustrative):
```vue
<script setup lang="ts">
const count = ref(1);
const profile = {
  label: 'Count',
  value: count.value,
};
</script>
```

Semantic-aware output (illustrative):
```tsx
const profile = useMemo(
  () => ({
    label: 'Count',
    value: count.value,
  }),
  [count.value],
);
```

## 7. Macro Semantics: `defineProps`, `defineEmits`, `defineSlots`, `defineExpose`

These macros define component interface semantics in Vue.  
Semantic-aware compilation rebuilds them into native React interface shapes.

Vue input (illustrative):
```vue
<script setup lang="ts">
const props = defineProps<{ title: string }>();
const emit = defineEmits<{ (e: 'save', id: number): void }>();
const slots = defineSlots<{ default?: () => any; footer?: (p: { count: number }) => any }>();
const count = ref(0);
defineExpose({ count });
</script>
```

Semantic-aware output (illustrative):
```tsx
type IComponentProps = {
  title: string;
  onSave?: (id: number) => void;
  children?: React.ReactNode;
  footer?: (p: { count: number }) => React.ReactNode;
};
```

**Key point**: these macros define input/output/slot/expose boundaries; semantic compilation preserves those boundaries in React.

## 8. What Does the Compiled Output Look Like?

Typical shape (illustrative):
```tsx
import { memo, useMemo, useCallback } from 'react';
import { useVRef, useComputed } from '@vureact/runtime-core';
```

Output characteristics:
- **clear React component structure**
- **runtime adapters** preserve Vue semantics where needed
- **native React maintainability** is preserved for manual edits

## 9. Why “Semantic-Aware + AI Collaboration” Works Better

1. **AI understands structure better**
2. **AI follow-up edits stay more stable**
3. **progressive migration is easier to run in parallel**
4. **large projects gain more from stability/readability/batchability**

> **One-line takeaway**: clearer semantics means lower AI collaboration cost.

## 10. Summary

The real value of semantic-aware compilation is not rewrite speed, but:
- **output stability**
- **team readability**
- **long-term editability**

VuReact takes an engineering route:  
more understanding and constraints at compile time, more reliable React output.

Continue reading:
1. [Philosophy](./philosophy)
2. [Conversion Overview](./conversion-overview)
3. [Template Conversion Guide](./conversion-template)
4. [Script Conversion Guide](./conversion-script)
5. [Router Adaptation Guide](./router-adaptation)
