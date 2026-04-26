# 快速开始

帮助开发者在最短时间内上手，并完成一个简单的 Vue 项目到 React 项目的编译转换。

### 概述

1. 输入 SFC 在什么约定下可稳定转换
2. 编译后目录会长什么样
3. 输出 TSX 与原始 SFC 的语义对应关系
4. 编译器自动分析并追加 React hook 依赖，无需手动管理

> 🎥 你可以先观看下方的演示视频，对整个流程建立直观印象。

<!--
TODO: 插入演示视频
<video controls width="100%">
  <source src="/static/quick-start-demo.mp4" type="video/mp4">
  您的浏览器不支持视频播放，请参考下方的文字教程。
</video>
-->

## Step 0：准备 Vite + Vue 工程

- 使用 Vite 新建一个标准的 Vue + TS 项目：

```bash
npx create-vite@latest vue-app --template vue-ts
```

- 当出现交互式选择 `Install with npm and start now?` 时，选择 `No`。

- 你将会看到类似以下工程目录结构（示意）：

```txt
vue-app/
├─ public/
├─ src/
│  ├─ assets/
│  ├─ components/
│  │  └─ HelloWorld.vue
│  ├─ App.vue
│  ├─ main.ts
│  └─ style.css
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
└─ ...
```

## Step 1：安装 VuReact

- 进入目录并安装项目依赖：

```bash
cd vue-app
npm install
```

- 安装 VuReact 编译核心

```bash
npm install -D @vureact/compiler-core
```

## Step 2：配置 VuReact

在 `vue-app` 目录下新建 `vureact.config.ts`：

```ts
// vue-app/vureact.config.ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  // 输入路径，包含要编译的 Vue 文件；允许输入单文件 'xxx.vue'
  input: './src',

  // 排除 Vue 入口文件，避免语义冲突
  exclude: ['src/main.ts'],

  output: {
    // 工作区目录，存放编译产物和缓存
    workspace: '.vureact',

    // 输出目录名
    outDir: 'react-app',

    // 自动初始化 Vite React 环境
    bootstrapVite: true,
  },
});
```

> 除 `exclude` 需手动指定外，其余选项均使用默认值，无需额外配置。

## Step 3：编写 Vue 组件

### 3.1 实现一个简单的计数器

将原来的 `HelloWorld.vue` 替换为计数器组件代码：

```html
<!-- src/components/HelloWorld.vue -->
<template>
  <section class="counter-card">
    <h2>{{ props.title + title }}</h2>
    <p>Count: {{ count }}</p>
    <button @click="increment">+1</button>
    <button @click="methods.decrease">-1</button>
  </section>
</template>

<script setup lang="ts">
  // @vr-name: HelloWorld
  import { computed, ref } from 'vue';

  // 除了顶部的特殊注释外，也可以使用宏定义组件名
  // defineOptions({ name: 'HelloWorld' });

  // 必须使用 defineProps 定义 props
  const props = defineProps<{ title?: string }>();

  // 必须使用 defineEmits 定义 emits
  const emits = defineEmits<{
    (e: 'update', value: number): void;
  }>();

  const step = ref(1);
  const count = ref(0);
  const title = computed(() => `x${step.value}`);

  const increment = () => {
    count.value += step.value;
    emits('update', count.value);
  };

  const methods = {
    decrease() {
      count.value -= step.value;
      emits('update', count.value);
    },
  };
</script>

<!-- VuReact 支持处理 Less 和 Sass -->
<style scoped>
  .counter-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 12px;
  }
</style>
```

### 3.2 修改 `App.vue` 的 `HelloWorld` 组件

```vue
<!-- src/App.vue -->
<template>
  <HelloWorld
    title="计数器组件"
    @update="
      (v) => {
        console.log(v);
      }
    "
  />
</template>
```

## Step 4：编译到 React 工程

### 方式一：使用 npx 命令

在 `vue-app` 目录下运行：

```bash
# 全量/增量编译
npx vureact build

# 或监听模式
npx vureact watch
```

### 方式二：使用 npm scripts

在 `package.json` 里添加脚本命令：

```json
"scripts": {
  "vr:build": "vureact build",
  "vr:watch": "vureact watch"
}
```

```bash
npm run vr:build
```

运行命令后，终端会输出相关编译信息。

## Step 5：查看输出目录树

输出到 `vue-app/.vureact` 工作区目录（示意）：

```txt
vue-app/
├── .vureact/              # 工作区（编译生成）
│   ├── cache/             # 编译缓存
│   ├── react-app/         # 生成的 Vite + React 工程
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── HelloWorld.tsx
│   │   │   │   └── helloworld-[hash].css
│   │   │   ├── App.tsx
│   │   │   ├── index.css
│   │   │   ├── main.tsx
│   │   │   └── style.css
│   │   └── package.json
│   │   └── tsconfig.json
│   │   └── vite.config.ts
│   │   └── ...
│   │
├── src/                   # 原始 Vue 代码
├── ...
└── vureact.config.js      # VuReact 配置文件
```

## Step 6：运行 React 应用

- 进入 `react-app` 目录：

```bash
cd .vureact/react-app
```

- 安装依赖：

```bash
npm run install
```

- 启动项目：

```bash
npm run dev
```

> 进入页面后，你可能会发现与 Vue 的页面样式存在差异，这是因为 Vite 初始化 React 后，自带的默认样式 `index.css` 注入到了 `main.tsx` 中导致的，手动调整即可。

如遇问题，可查阅 [常见问题](/guide/faq) 章节。

## Step 7：对照生成结果

下面是一个格式化后的典型输出（为说明做了轻微简化，实际哈希与属性名以本地产物为准）：

```tsx
import { memo, useCallback, useMemo } from 'react';
import { useComputed, useVRef } from '@vureact/runtime-core';
import './helloworld-abc123.css';

// VuReact 根据 defineProps 和 defineEmits 自动生成
type IHelloWorldType = {
  title?: string;
  onUpdate: (value: number) => number;
};

// 自动使用 memo 优化组件
const HelloWorld = memo((props: IHelloWorldType) => {
  // ref/computed 转换成了对等的适配 API
  const step = useVRef(1);
  const count = useVRef(0);
  const title = useComputed(() => `x${step.value}`);

  // 自动分析顶层箭头函数依赖，并追加 useCallback 优化
  const increment = useCallback(() => {
    count.value += step.value;
    props.onUpdate?.(count.value); // emits 转换
  }, [count.value, step.value, props.onUpdate]);

  // 自动分析顶层变量中的依赖，并追加 useMemo 优化
  const methods = useMemo(
    () => ({
      decrease() {
        count.value -= step.value;
        props.onUpdate?.(count.value);
      },
    }),
    [count.value, step.value, props.onUpdate],
  );

  return (
    <>
      <section className="counter-card" data-css-abc123>
        <h2 data-css-abc123>{props.title + title.value}</h2>
        <p data-css-abc123>Count: {count.value}</p>
        <button onClick={increment} data-css-abc123>
          +1
        </button>
        <button onClick={methods.decrease} data-css-abc123>
          -1
        </button>
      </section>
    </>
  );
});

// 自动保持组件导出
export default Counter;
```

CSS 文件内容：

```css
.counter-card[data-css-abc123] {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
}
```

### 关键观察点

1. `// @vr-name: Counter` 这段特殊注释定义了组件名
2. `defineProps` 和 `defineEmits` 被转换成了 TS 组件类型
3. 非纯 UI 展示组件，默认会走 `memo` 包装
4. `ref` / `computed` 被转换为 runtime 适配 API（`useVRef` / `useComputed`）
5. 模板事件回调会生成符合 React 语义的 `onClick`
6. 顶层箭头函数自动分析依赖，尝试注入 `useCallback`
7. 顶层变量声明自动分析依赖，尝试注入 `useMemo`
8. 对 JSX 中的原 `ref/computed` 状态值补上 `.value`
9. `scoped` 样式会生成带哈希的 css 文件，并在元素上标注作用域属性

## 总结

通过以上步骤，你已完成了一个 Vue SFC 项目到 React 项目的完整编译流程。回顾整个过程：

1. **初始化项目**：使用 Vite 创建标准的 Vue + TS 工程
2. **安装编译器**：添加 `@vureact/compiler-core` 依赖
3. **编写配置**：通过 `vureact.config.ts` 指定输入、排除和输出规则
4. **编写组件**：按照约定（`@vr-name` 注释、`defineProps`/`defineEmits` 宏）编写 SFC
5. **执行编译**：使用 CLI 命令一键转换
6. **运行产物**：直接启动生成的 React 工程并验证效果

VuReact 在编译过程中拥有以下核心转换能力：

- Vue 模板语法 → React JSX（`v-if`/`v-slot`/`v-model`/`<slot>` 等）
- Composition API → React Hooks（`ref` → `useVRef`、`computed` → `useComputed`）
- 响应式依赖分析 → 自动注入 `useCallback`/`useMemo` 依赖数组
- 组件通信 → Props 类型推导 + 事件回调映射
- 样式处理 → Scoped CSS / CSS Modules / 预处理器一站式编译

## 相关资源

- **[@vureact/runtime-core](https://runtime.vureact.top/)**：提供 React 版的 Vue 常用内置组件、核心 Composition API 等
- **[@vureact/router](https://router.vureact.top/)**：支持 Vue Router 4.x -> React Router DOM 7.9+ 转换

## 下一步

完成快速开始后，建议继续阅读以下章节：

- [ESLint 规则冲突](/guide/eslint-rule-conflicts)：了解响应式 hooks 与 ESLint React Hooks 规则的冲突及解决方案
- [编译器配置项](/api/config)：了解更多的 VuReact 配置 API
- [语义编译对照](/guide/best-practices)：了解 Vue 被编译为什么样的 React 代码，及当前支持的 API 与语法范围。
- [项目实战](/guide/crm-admin-backend)：通过真实项目案例（管理后台、协同后台）掌握大规模迁移流程
