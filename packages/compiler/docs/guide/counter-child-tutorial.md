# 计数器 + 子组件通信

这个教程把两条主线放在同一个场景里：

1. 计数器状态（`ref` / `computed`）
2. 子组件通信（`defineProps` / `defineEmits` / scoped slot）

目标是让你一次看清楚「状态更新 + 父子通信 + 插槽回传」的完整路径。

## Step 0：目录结构（示意）

```txt
my-app/
├─ src/
│  ├─ components/
│  │  ├─ CounterPanel.vue
│  │  └─ CounterPage.vue
│  ├─ main.ts
│  └─ index.css
└─ vureact.config.js
```

## Step 1：子组件输入（CounterPanel.vue）

```vue
<template>
  <section class="panel">
    <h3>{{ props.title }}</h3>
    <p>Current: {{ props.modelValue }}</p>

    <div class="actions">
      <button @click="increase">+{{ props.step ?? 1 }}</button>
      <button @click="decrease">-{{ props.step ?? 1 }}</button>
      <button @click="reset">Reset</button>
    </div>

    <!-- 作用域插槽：回传当前值/下一步值/等级 -->
    <slot
      name="status"
      :current="props.modelValue"
      :next="props.modelValue + (props.step ?? 1)"
      :level="props.modelValue >= 10 ? 'high' : 'normal'"
    >
      <small>Default status: {{ props.modelValue }}</small>
    </slot>
  </section>
</template>

<script setup lang="ts">
// @vr-name: CounterPanel
const props = defineProps<{
  title: string;
  modelValue: number;
  step?: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
  (e: 'reset'): void;
}>();

const increase = () => {
  // 重点：不直接修改 props，而是通过 update:modelValue 通知父组件
  emit('update:modelValue', props.modelValue + (props.step ?? 1));
};

const decrease = () => {
  emit('update:modelValue', props.modelValue - (props.step ?? 1));
};

const reset = () => {
  emit('reset');
};
</script>

<style scoped>
.panel {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  display: grid;
  gap: 8px;
}

.actions {
  display: flex;
  gap: 8px;
}
</style>
```

## Step 2：父组件输入（CounterPage.vue）

```vue
<template>
  <CounterPanel
    title="Simple Counter"
    :model-value="count"
    :step="step"
    @update:model-value="onUpdate"
    @reset="onReset"
  >
    <!-- 作用域插槽：解构子组件传回字段 -->
    <template #status="{ current, next, level }">
      <small>{{ statusText(current, next, level) }}</small>
    </template>
  </CounterPanel>

  <p>Total operations: {{ totalOps }}</p>
</template>

<script setup lang="ts">
// @vr-name: CounterPage
import { computed, ref } from 'vue';
import CounterPanel from './CounterPanel.vue';

const count = ref(0);
const step = ref(2);
const totalOps = ref(0);

const badge = computed(() => (count.value >= 10 ? 'High' : 'Normal'));

const onUpdate = (nextValue: number) => {
  count.value = nextValue;
  totalOps.value += 1;
};

const onReset = () => {
  count.value = 0;
  totalOps.value += 1;
};

const statusText = (current: number, next: number, level: 'high' | 'normal') => {
  return `current=${current}, next=${next}, level=${level}, badge=${badge.value}`;
};
</script>
```

## Step 3：编译后对照（简化示意）

### `CounterPanel.tsx`

```tsx
import { memo, useCallback, type ReactNode } from 'react';

type ICounterPanelProps = {
  title: string;
  modelValue: number;
  step?: number;
  // update:modelValue / reset -> onReset
  onUpdateModelValue?: (value: number) => void;
  onReset?: () => void;
  // scoped slot -> 函数型 props
  status?: (slotProps: { current: any; next: any; level: any }) => ReactNode;
};

const CounterPanel = memo((props: ICounterPanelProps) => {
  const increase = useCallback(() => {
    // 重点：不直接修改 props，而是通过 update:modelValue 通知父组件
    props.onUpdateModelValue(props.modelValue + (props.step ?? 1));
  }, [props.modelValue, props.step, props.onUpdateModelValue]);

  const decrease = useCallback(() => {
    props.onUpdateModelValue(props.modelValue - (props.step ?? 1));
  }, [props.modelValue, props.step, props.onUpdateModelValue]);

  const reset = useCallback(() => {
    props.onReset();
  }, [props.onReset]);

  return (
    <section className="panel">
      <h3>{props.title}</h3>
      <p>Current: {props.modelValue}</p>
      <div className="actions">
        <button onClick={increase}>+{props.step ?? 1}</button>
        <button onClick={decrease}>-{props.step ?? 1}</button>
        <button onClick={reset}>Reset</button>
      </div>
      {props.status?.({
        current: props.modelValue,
        next: props.modelValue + (props.step ?? 1),
        level: props.modelValue >= 10 ? 'high' : 'normal',
      })}
    </section>
  );
});

export default CounterPanel;
```

### `CounterPage.tsx`

```tsx
import { memo, useCallback } from 'react';
import { useComputed, useVRef } from '@vureact/runtime-core';

const CounterPage = memo(() => {
  // ref/computed 映射为 runtime 适配 API
  const count = useVRef(0);
  const step = useVRef(2);
  const totalOps = useVRef(0);
  const badge = useComputed(() => (count.value >= 10 ? 'High' : 'Normal'));

  const onUpdate = useCallback(
    (nextValue: number) => {
      count.value = nextValue;
      totalOps.value += 1;
    },
    [count.value, totalOps.value],
  );

  const onReset = useCallback(() => {
    count.value = 0;
    totalOps.value += 1;
  }, [count.value, totalOps.value]);

  const statusText = useCallback(
    (current: number, next: number, level: 'high' | 'normal') => {
      return `current=${current}, next=${next}, level=${level}, badge=${badge.value}`;
    },
    [badge.value],
  );

  return (
    <>
      <CounterPanel
        title="Simple Counter"
        modelValue={count.value}
        step={step.value}
        onUpdateModelValue={onUpdate}
        onReset={onReset}
        status={({ current, next, level }) => <small>{statusText(current, next, level)}</small>}
      />
      <p>Total operations: {totalOps.value}</p>
    </>
  );
});
```

## Step 4：重点观察

1. `@update:model-value` 会映射到 `onUpdateModelValue`
2. `@reset` 会映射到 `onReset`
3. 作用域插槽会映射为回调 props（本例是 `status`）
4. 父组件继续用 `ref` / `computed` 思维，编译后由 runtime 适配

## 建议

- 先保持这种“单向数据 + 显式事件 + 轻量 slot 数据”的结构
- 让编译器可以稳定分析，再逐步加复杂业务逻辑
