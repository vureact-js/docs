# 计数器组件

本教程演示一个标准流程：把一个 Vue 3 SFC 组件编译成 React 组件。

由于目前没有在线 Playground，本页采用：

- 代码生成前后对照
- 目录树结构图

## 教程目标

完成后你会明确三件事：

1. 输入 SFC 在什么约定下可稳定转换
2. 编译后目录会长什么样
3. 输出 TSX 与原始 SFC 的语义对应关系

## Step 0：准备目录

先准备一个最小工程（示意）：

```txt
my-app/
├─ src/
│  ├─ components/
│  │  └─ Counter.vue
│  ├─ main.ts
│  └─ index.css
├─ package.json
└─ vureact.config.js
```

## Step 1：编写输入 SFC

`src/components/Counter.vue`

```vue
<template>
  <section class="counter-card">
    <h2>{{ title }}</h2>
    <p>Count: {{ count }}</p>
    <button @click="increment">+1</button>
    <button @click="methods.decrease">-1</button>
  </section>
</template>

<script setup lang="ts">
// @vr-name: Counter （注：用于告诉编译器，该生成什么组件名）
import { computed, ref } from 'vue';

// 也可以使用宏定义组件名
defineOptions({ name: 'Counter' });

const step = ref(1);
const count = ref(0);
const title = computed(() => `Counter x${step.value}`);

const increment = () => {
  count.value += step.value;
};

const methods = {
  decrease() {
    count.value -= step.value;
  },
};
</script>

<style lang="less" scoped>
@border-color: #ddd;
@border-radius: 8px;
@padding-base: 12px;

.counter-card {
  border: 1px solid @border-color;
  border-radius: @border-radius;
  padding: @padding-base;
}
</style>
```

## Step 2：配置编译器

`vureact.config.js`

```js
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: 'src',
  // 关键：排除 Vue 入口文件，避免入口语义冲突
  exclude: ['src/main.ts'],
  output: {
    workspace: '.vureact',
    outDir: 'dist',
    // 教程场景关闭环境初始化，便于观察纯编译产物
    bootstrapVite: false,
  },
  format: {
    enabled: true, // 开启格式化，同时这也会增加编译耗时。
    formatter: 'prettier',
  },
});
```

## Step 3：执行编译

```bash
npx vureact build
```

## Step 4：查看输出目录树

编译后目录（示意）：

```txt
my-app/
├─ .vureact/
│  ├─ cache/
│  │  └─ _metadata.json
│  └─ dist/
│     └─ src/
│        └─ components/
│           ├─ Counter.tsx
│           └─ counter-<hash>.css
├─ src/
│  └─ ...
└─ vureact.config.js
```

## Step 5：对照生成结果

下面是一个格式化后的典型输出（为说明做了轻微简化，实际哈希与属性名以本地产物为准）：

```tsx
import { memo, useCallback, useMemo } from 'react';
import { useComputed, useVRef } from '@vureact/runtime-core';
import './counter-a1b2c3.css';

// 固定使用 memo 包裹组件
const Counter = memo(() => {
  // ref/computed 转换成了对等的适配 API
  const step = useVRef(1);
  const count = useVRef(0);
  const title = useComputed(() => `Counter x${step.value}`);

  // 自动分析顶层箭头函数依赖，并追加 useCallback 优化
  const increment = useCallback(() => {
    count.value += step.value;
  }, [count.value, step.value]);

  // 自动分析顶层对象中的依赖，并追加 useMemo 优化
  const methods = useMemo(
    () => ({
      decrease() {
        count.value -= step.value;
      },
    }),
    [count.value],
  );

  return (
    <>
      <section className="counter-card" data-css-a1b2c3>
        <h2 data-css-a1b2c3>{title.value}</h2>
        <p data-css-a1b2c3>Count: {count.value}</p>
        <button onClick={increment} data-css-a1b2c3>
          +1
        </button>
        <button onClick={methods.decrease} data-css-a1b2c3>
          -1
        </button>
      </section>
    </>
  );
});

export default Counter;
```

CSS 文件内容：

```css
.counter-card[data-css-a1b2c3] {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
}
```

## 关键观察点

1. `// @vr-name: Counter` 这段特殊注释定义了组件名
2. 组件默认会走 `memo` 包装
3. `ref` / `computed` 被转换为 runtime 适配 API（`useVRef` / `useComputed`）
4. 模板事件回调会生成符合 React 语义的 `onClick`
5. 顶层箭头函数依赖会尝试注入 `useCallback`
6. 顶层对象依赖会尝试注入 `useMemo`
7. 对 JSX 中的原 `ref` 状态值补上 `.value`
8. `less` 样式被编译为 css 代码
9. `scoped` 样式会生成带哈希的 css 文件，并在元素上标注作用域属性

## 常见失败点

- 没排除 `src/main.ts`
- 在非顶层调用会被转换为 Hook 的 API
- 模板里出现不可分析表达式并被告警
- 关闭样式预处理且使用 `scoped`，导致作用域失效

## 下一步

- 继续阅读 [能力矩阵总览](./capabilities-overview)
- 遇到规则问题时回看 [编译约定](./specification)
