# 可控混写

本章给一个“可控”的混写基线：

1. Vue 负责模板组织与基础响应式状态。
2. React 负责局部复杂计算或复用既有 Hook。
3. 不引入大规模生态依赖，优先保证可读和可维护。

## 1. 输入示例（Vue + React 混写）

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

// React Hook：局部计算逻辑复用
const doubled = useMemo(() => count.value * 2, [count.value]);
</script>
```

## 2. 关键边界

1. Vue 状态仍通过 `ref`/`computed` 管理。
2. React Hook 仍必须满足顶层调用规则。
3. 模板中 `count` 会自动补 `.value`，不手写 `.value`。

## 3. 可控混写清单

1. 每个变量标注来源（Vue 还是 React）。
2. 事件处理函数只做一类语义的事。
3. 混写章节内不要再嵌套“动态魔术写法”。
4. 每次改动都看编译后产物是否仍可读。

## 4. 何时停止“可控混写”

当你发现：

1. 同一函数同时操作两套状态模型；
2. 依赖数组越来越难维护；
3. 团队评审时无法快速判断语义归属；

就应该停下来，把代码拆分为更清晰的边界。

## 下一步

- 查看 [全生态释放](./mind-control-full-ecosystem)
