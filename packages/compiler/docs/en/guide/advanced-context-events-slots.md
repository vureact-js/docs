# Advanced Features of Single-File Components (SFC)

This chapter presents an "advanced link" example: chaining `provide/inject`, `emits`, and `scoped slots` in a single scenario. Note that VuReact actually supports far more features than those listed here.

## Context + Events + Slots Link

### 1. Scenario Objectives

1. The upper-level page delivers a theme via `provide`.
2. Child components read the theme through `inject` and trigger events.
3. Parent components obtain child component state via scoped slots for secondary rendering.

### 2. Input Example (Vue)

```vue
<!-- ParentPage.vue -->
<template>
  <ThemeCard :level="level" @upgrade="onUpgrade">
    <template #header>
      <p>Header</p>
    </template>

    <template #footer="{ level, theme }">
      <small>theme={{ theme }}, level={{ level }}</small>
    </template>
  </ThemeCard>
</template>

<script setup lang="ts">
// @vr-name: ParentPage
import { provide, ref } from 'vue';
import ThemeCard from './ThemeCard.vue';

const level = ref(1);
provide('theme', 'ocean');

const onUpgrade = (next: number) => {
  level.value = next;
};
</script>
```

```vue
<!-- ThemeCard.vue -->
<template>
  <section>
    <slot name="header"></slot>

    <p>Theme: {{ theme }}</p>
    <p>Level: {{ props.level }}</p>

    <button @click="upgrade">Upgrade</button>

    <slot name="footer" :level="props.level" :theme="theme" />
  </section>
</template>

<script setup lang="ts">
// @vr-name: ThemeCard
import { inject } from 'vue';

const props = defineProps<{ level: number }>();
const emit = defineEmits<{ (e: 'upgrade', next: number): void }>();

const theme = inject('theme', 'default');

const upgrade = () => {
  emit('upgrade', props.level + 1);
};
</script>
```

### 3. Output Example (React, Simplified)

```tsx
// ParentPage side: provide(...) is converted to a Provider wrapper structure
return (
  <Provider name={'theme'} value={'ocean'}>
    <ThemeCard
      level={level.value}
      onUpgrade={onUpgrade}
      header={<p>Header</p>}
      footer={({ level, theme }) => (
        <small>
          theme={theme}, level={level}
        </small>
      )}
    />
  </Provider>
);
```

```tsx
// ThemeCard side: inject -> useInject, emit -> onUpgrade
const theme = useInject('theme', 'default');

const upgrade = useCallback(() => {
  props.onUpgrade?.(props.level + 1);
}, [props.level, props.onUpgrade]);
```

### 4. Key Notes

1. `provide/inject` is adapted at runtime, not via string replacement.
2. It is still recommended to use stable strings for `emit` event names.
3. In advanced scenarios, scoped slots still retain the semantics of "function-type props".
