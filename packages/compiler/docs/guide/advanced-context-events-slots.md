# SFC 高级特性

本章是“高级链路”示例：在一个场景中串联 `provide/inject`、`emits`、`scoped slot`；注意，VuReact 实际支持的特性远不止列举的这些。

## 上下文 + 事件 + 插槽链路

### 1. 场景目标

1. 上层页面通过 `provide` 下发主题。
2. 子组件通过 `inject` 读取主题并触发事件。
3. 父组件通过作用域插槽拿到子组件状态做二次渲染。

### 2. 输入示例（Vue）

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

### 3. 输出示例（React，简化）

```tsx
// ParentPage 侧：provide(...) 会转换为 Provider 包装结构
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
// ThemeCard 侧：inject -> useInject, emit -> onUpgrade
const theme = useInject('theme', 'default');

const upgrade = useCallback(() => {
  props.onUpgrade?.(props.level + 1);
}, [props.level, props.onUpgrade]);
```

### 4. 关键说明

1. `provide/inject` 走 runtime 适配，不是字符串替换。
2. `emit` 事件名仍建议稳定字符串。
3. scoped slot 在高级场景下仍是“函数型 props”语义。
