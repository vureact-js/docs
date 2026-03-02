# Controllable Mixed Writing

This chapter provides a "controllable" mixed writing baseline:

1. Vue is responsible for template organization and basic reactive state management.
2. React is responsible for local complex calculations or reusing existing Hooks.
3. Avoid introducing large-scale ecosystem dependencies, prioritizing readability and maintainability.

## 1. Input Example (Vue + React Mixed Writing)

```vue
<template>
  <section>
    <h3>{{ title }}</h3>
    <p>count: {{ count }}</p>
    <p>doubled: {{ doubled }}</p>
    <button @click="inc">+1</button>
  </section>
</template>

<script setup lang="ts">
// @vr-name: MindControlSafe
import { computed, ref } from 'vue';
import { useMemo } from 'react';

const title = ref('Mind Control - Safe Mode');
const count = ref(1);

const inc = () => {
  count.value += 1;
};

// React Hook: Reuse local calculation logic
const doubled = useMemo(() => count.value * 2, [count.value]);
</script>
```

## 2. Key Boundaries

1. Vue state is still managed via `ref`/`computed`.
2. React Hooks must still comply with the top-level call rule.
3. `.value` is automatically appended to `count` in templates—no need to write `.value` manually.

## 3. Controllable Mixed Writing Checklist

1. Label the source (Vue or React) for each variable.
2. Event handler functions should only handle one type of semantic logic.
3. Do not nest "dynamic magic syntax" within mixed writing sections.
4. Check if the compiled output remains readable after each modification.

## 4. When to Stop "Controllable Mixed Writing"

Stop when you notice:

1. The same function manipulates two state models simultaneously;
2. Dependency arrays become increasingly difficult to maintain;
3. The team cannot quickly determine semantic ownership during reviews;

At this point, refactor the code into clearer boundaries.

## Next Steps

- See [Full Ecosystem Unleashed](./mind-control-full-ecosystem)
