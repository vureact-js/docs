# What Is Semantic-Aware?

**Semantic-aware compilation** does not mechanically replace Vue syntax with React syntax.  
It first understands runtime semantics (reactivity, lifecycle, and data flow), then generates code that is valid in React.

If you remember one sentence, make it this:

> **VuReact is not about “how to rewrite code text”, but about “how that code should remain correct in React”.**

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
const [count, setCount] = useState(0); // similar syntax, but semantics changed
const inc = () => count++; // behavior is incorrect
```

Semantic-aware output (illustrative):

```tsx
const count = useVRef(0); // keeps reactive reference semantics
const inc = useCallback(() => {
  count.value++; // preserves runtime behavior
}, [count.value]); // dependency is semantically inferred
```

**Key point**: this is not a keyword rename; it preserves reactive behavior and rebuilds valid React structure.

## 2. What Problems Does It Solve?

The real pain in Vue -> React migration is usually **semantic loss**, not syntax mismatch.
Common issues:

1. behavior drift after directive/structure conversion (conditions, loops, slots, two-way binding)
2. unstable output patterns across similar files
3. reduced readability and harder long-term maintenance

Why semantic-aware compilation helps:

- **Stability**: similar inputs produce more consistent outputs
- **Maintainability**: generated structure is closer to React engineering practices
- **Mental clarity**: teams reason in “input behavior -> output behavior”

## 3. How It Differs from Common Approaches

Most migration approaches fall into three buckets:

1. syntax replacement: fast but fragile in complex cases
2. AST mapping: stricter, but still mechanical without semantic staging
3. runtime proxying: quick short-term wins, but may shift complexity to runtime

VuReact takes a different route:

- staged processing (parse -> understand -> generate)
- semantic context first, generation second
- decisions made at compile time whenever possible

**Key point**: this improves predictability and long-term maintainability.

## 4. Template / Script Dimensions: Why This Is Logic Reconstruction

## 4.1 Template: structure, scope, and directive semantics

Template processing focuses on:

- branch relationships (`v-if / v-else-if / v-else`)
- loop semantics (`v-for` source/value/index/key)
- event modifier semantics (`v-on`)
- slot scope semantics (`v-slot`)
- `v-model` behavior across different targets

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

**Key point**: this rebuilds a **data-flow contract**, not just an attribute rename.

### Comparison C: Nested conditional directives -> JSX ternary structure

This is a classic semantic case: it is not about replacing `v-if` with `? :`, but preserving branch relationships and fallback order.

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

**Key point**: the compiler preserves branch dependency and fallback semantics, not just syntax labels.

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
  list.map((item, i) => (
    <li key={item.id}>
      {i} - {item.name}
    </li>
  ));
}
{
  Object.entries(obj).map(([key, val], i) => (
    <li key={key}>
      {i} - {key}: {val}
    </li>
  ));
}
```

**Key point**: this preserves iteration semantics, key stability, and the role of value/key/index.

## 4.2 Script: align reactivity, lifecycle, and setup logic

Script processing handles:

- reactive API semantic mapping (`ref/computed/watch`)
- macro semantics (`defineProps`, `defineEmits`, `defineExpose`, etc.)
- lifecycle + dependency relationships
- how setup logic becomes valid React component structure

In short:  
**Script alignment happens under analyzable, executable, and maintainable constraints.**

## 5. Static Hoisting and Top-Level `useMemo` Optimization

### 5.1 Static Hoisting

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

**Value**:

- fewer repeated allocations on render
- cleaner static/dynamic separation
- output closer to hand-optimized React

### 5.2 Top-Level `useMemo` Optimization

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

Plain conversion (illustrative):

```tsx
const profile = { label: 'Count', value: count.value }; // recreated every render
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

**Key point**: this is not “blindly adding hooks”; it is a semantic decision based on dependency understanding.

### 5.3 Combined Mini Example

Vue input (illustrative):

```vue
<script setup lang="ts">
const BASE = 'panel';
const count = ref(0);
const options = { key: BASE, value: count.value };
</script>
```

Semantic-aware output (illustrative):

```tsx
const BASE = 'panel'; // static hoisting
const count = useVRef(0);
const options = useMemo(() => ({ key: BASE, value: count.value }), [count.value]);
```

Simple reading:
semantic compilation decides what should stay static and what should be memoized.

## 6. Macro Semantics: `defineProps`, `defineEmits`, `defineSlots`, `defineExpose`

These four macros define a component’s interface semantics in Vue.  
Semantic-aware compilation does not keep them as macro calls; it rebuilds them into natural React interface shapes.

Combined illustration:

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

const Component = memo(
  forwardRef<any, IComponentProps>((props, expose) => {
    const count = useVRef(0);

    useImperativeHandle(expose, () => ({ count }));

    return <>{props.children}</>;
  }),
);
```

### 6.1 `defineProps`: from macro declaration to input contract

`defineProps` declares the input contract.  
Semantic compilation rebuilds this as React props typing and props access paths.
**Key point**: what matters is a clear input boundary, not preserving macro syntax.

### 6.2 `defineEmits`: from event declaration to callback protocol

`defineEmits` is an output-event contract.  
Semantic compilation rebuilds it as `onXxx` callbacks and maps `emit(...)` into `props.onXxx?.(...)`.
**Key point**: this preserves outward communication semantics.

### 6.3 `defineSlots`: from slot declaration to function/node props

`defineSlots` describes how child content is injected.  
Semantic compilation rebuilds this as `children` and/or function props in React.
**Key point**: it preserves slot scope and invocation relationships.

### 6.4 `defineExpose`: from exposed object to `ref` capability boundary

`defineExpose` defines what is publicly exposed to the parent.  
Semantic compilation rebuilds this as `forwardRef + useImperativeHandle`.
**Key point**: it preserves public capability boundaries.

One-line summary:  
**These macros define input, output, slot, and exposure boundaries; semantic compilation carries those boundaries into React in a stable way.**

## 7. What Does the Compiled Output Look Like?

Typical shape (illustrative):

```tsx
import { memo, useMemo, useCallback } from 'react';
import { useVRef, useComputed } from '@vureact/runtime-core';

const LABEL = 'Counter'; // static hoisting
const Counter = memo((props) => {
  const count = useVRef(0);
  const double = useComputed(() => count.value * 2);

  const meta = useMemo(() => ({ label: LABEL, value: count.value }), [count.value]);

  const onAdd = useCallback(() => {
    count.value++;
  }, [count.value]);

  return (
    <div>
      {meta.label}: {double.value}
    </div>
  );
});

export default Counter;
```

Output characteristics:

- **clear React component structure**
- **runtime adapters** preserve Vue semantics where needed
- **native React maintainability** stays intact for manual edits

## 8. Why “Semantic-Aware + AI Collaboration” Works Better

1. **AI understands structure more easily**: clearer responsibilities and data flow
2. **AI follow-up edits are more stable**: easier batch consistency
3. **progressive migration is smoother**: module-level parallel rollout
4. **large projects gain more**: stability/readability/batchability beats “magic conversion”

> **One-line takeaway**: clearer semantics means lower AI collaboration cost.

## 9. Summary

The real value of semantic-aware compilation is not rewrite speed, but:

- **output stability**
- **team readability**
- **long-term editability**

VuReact takes an engineering route:  
more understanding and constraints at compile time, more reliable React output.
