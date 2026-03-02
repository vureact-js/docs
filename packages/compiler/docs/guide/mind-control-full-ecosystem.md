# 彻底暴走

> ⚠️ 本章仅用于展示“能力边界”，不代表默认推荐写法。

本章演示：在 Vue SFC 中直接接入 React 生态（`TanStack Query + Zustand`），用于覆盖“没有适配包时如何落地”的现实场景。

## 1. 输入示例（实验性混写）

```vue
<template>
  <section>
    <h3>{{ title }}</h3>

    <p>global count: {{ globalCount }}</p>
    <button @click="incGlobal">inc global</button>

    <p v-if="query.isPending">loading...</p>
    <p v-else-if="query.isError">failed</p>
    <ul v-else>
      <li v-for="item in query.data" :key="item.id">{{ item.title }}</li>
    </ul>
  </section>
</template>

<script setup lang="ts">
// @vr-name: MindControlChaos
import { ref } from 'vue';
import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';

const title = ref('Mind Control - Chaos Mode');

// Zustand 直连
const useCounterStore = create<{ count: number; inc: () => void }>((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
}));

const globalCount = useCounterStore((s) => s.count);
const incGlobal = useCounterStore((s) => s.inc);

// TanStack Query 直连
const query = useQuery({
  queryKey: ['todos'],
  queryFn: async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=3');
    return res.json();
  },
});
</script>
```

## 2. 你必须自己兜住的部分

1. React Provider 体系（如 `QueryClientProvider`）要在应用入口正确接好。
2. 生态库版本和 React 版本兼容性由项目自行管理。
3. 一旦写法越界，问题通常不是编译器能自动修复的。

## 3. 风险清单

1. 心智模型切换失败会导致“看似能编译、实际不可维护”。
2. Hook 依赖和状态来源混乱后，调试成本极高。
3. 团队成员若不熟悉双栈，接手成本会显著上升。

## 4. 建议的落地方式

1. 先在隔离目录或实验模块试点。
2. 先建立团队代码评审清单（Vue 规则 + React 规则）。
3. 在 CI 中加入更严格的 lint 与类型检查。
4. 定期回收“暴走写法”，把可沉淀能力迁回稳定模式。
