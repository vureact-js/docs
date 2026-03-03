# 组件引用

组件引用是 Vue 项目的基础，理解如何正确组织和引用组件对于项目维护和转换至关重要。本章将展示 Vue 组件间的引用模式，以及这些引用如何被 VuReact 转换为 React 项目结构。

## 基础组件引用

### 简单的父子组件引用

在 Vue 中，组件通过 `import` 语句引入，然后在模板中使用：

```vue
<!-- src/components/ChildComponent.vue -->
<template>
  <div class="child">{{ message }}</div>
</template>

<script setup lang="ts">
defineProps(['message']);
</script>

<style scoped>
.child {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
</style>
```

```vue
<!-- src/App.vue -->
<template>
  <div class="app">
    <h1>组件引用示例</h1>
    <ChildComponent :message="greeting" />
  </div>
</template>

<script setup lang="ts">
import ChildComponent from './components/ChildComponent.vue';

const greeting = 'Hello from parent component!';
</script>

<style scoped>
.app {
  padding: 24px;
}
</style>
```

### 转换后的 React 代码

VuReact 会自动处理组件引用，移除 `.vue` 扩展名并调整导入路径：

```tsx
// src/components/ChildComponent.tsx
import React from 'react';
import './ChildComponent.css';

interface IChildComponentProps {
  message?: any;
}

export default function ChildComponent($props$: IChildComponentProps) {
  return <div className="child">{$props?.message}</div>;
}
```

```tsx
// src/App.tsx
import React from 'react';
import ChildComponent from './components/ChildComponent';
import './App.css';

export default function App() {
  const greeting = 'Hello from parent component!';

  return (
    <div className="app">
      <h1>组件引用示例</h1>
      <ChildComponent message={greeting} />
    </div>
  );
}
```

## 项目结构组织

### 按功能模块组织组件

在实际项目中，我们通常按功能模块组织组件。以下是一个示例项目结构：

```txt
src/
├── App.vue
├── main.ts
├── components/
│   ├── common/
│   │   ├── Button.vue
│   │   └── Card.vue
│   └── layout/
│       ├── Header.vue
│       └── Footer.vue
├── features/
│   ├── dashboard/
│   │   ├── UserCard.vue
│   │   ├── UserPanel.vue
│   │   └── index.ts
│   └── settings/
│       ├── ProfileForm.vue
│       └── Preferences.vue
└── shared/
    ├── utils.ts
    └── constants.ts
```

### 跨目录组件引用

```vue
<!-- src/features/dashboard/UserCard.vue -->
<template>
  <div class="user-card">
    <h3>{{ user.name }}</h3>
    <p>年龄: {{ user.age }}</p>
    <button @click="$emit('follow', user)">关注</button>
  </div>
</template>

<script setup lang="ts">
defineProps(['user']);
defineEmits(['follow']);
</script>

<style scoped>
.user-card {
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 16px;
}
</style>
```

```vue
<!-- src/features/dashboard/UserPanel.vue -->
<template>
  <section class="user-panel">
    <h2>用户面板</h2>
    <UserCard :user="currentUser" @follow="handleFollow" />
    <p>总关注数: {{ followCount }}</p>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UserCard from './UserCard.vue';

const currentUser = ref({ name: '张三', age: 28 });
const followCount = ref(0);

const handleFollow = (user) => {
  console.log('关注了:', user.name);
  followCount.value += 1;
};
</script>

<style scoped>
.user-panel {
  padding: 20px;
  background: #f9fafb;
  border-radius: 16px;
}
</style>
```

## 实际示例分析

让我们分析示例中的组件引用模式：

### App.vue 整合多个模块

```vue
<!-- src/App.vue -->
<template>
  <main class="app-shell">
    <header class="hero">
      <img class="logo" src="./assets/demo.svg" alt="demo" />
      <h1>{{ title }}</h1>
      <p class="subtitle">{{ summary }}</p>
    </header>

    <!-- 引用来自不同目录的组件 -->
    <UserPanel />
    <ParentPage />
    <TemplateStableDemo />
    <StylePipelineDemo />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
// 从不同功能模块导入组件
import UserPanel from './feature-alpha/UserPanel.vue';
import ParentPage from './feature-beta/ParentPage.vue';
import StylePipelineDemo from './labs/StylePipelineDemo.vue';
import TemplateStableDemo from './labs/TemplateStableDemo.vue';

const title = 'Messy Vue SFC Playground';
const summary = computed(() => `${title} / pre-release-e2e`);
</script>
```

### 组件间的嵌套引用

```vue
<!-- src/feature-alpha/UserPanel.vue -->
<template>
  <section class="alpha-panel">
    <h2>feature-alpha</h2>
    <!-- 引用同目录下的子组件 -->
    <UserCard :name="user.name" :age="user.age" @follow="onFollow" />
    <p>Total follows: {{ totalFollows }}</p>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UserCard from './UserCard.vue'; // 相对路径引用

const user = ref({ name: 'Ada', age: 26 });
const totalFollows = ref(0);

const onFollow = (payload) => {
  totalFollows.value = payload.count;
};
</script>
```

## 转换指南

### 1. 导入路径转换

VuReact 会自动处理导入路径：

| Vue 导入                                                | React 转换                                          |
| ------------------------------------------------------- | --------------------------------------------------- |
| `import UserPanel from './feature-alpha/UserPanel.vue'` | `import UserPanel from './feature-alpha/UserPanel'` |
| `import Button from '../components/common/Button.vue'`  | `import Button from '../components/common/Button'`  |
| `import utils from '../../shared/utils'`                | `import utils from '../../shared/utils'` (保持不变) |

### 2. 组件使用转换

组件在模板中的使用方式基本保持不变：

| Vue 模板                          | React JSX                          |
| --------------------------------- | ---------------------------------- |
| `<UserPanel />`                   | `<UserPanel />`                    |
| `<UserCard :name="user.name" />`  | `<UserCard name={user.name} />`    |
| `<Button @click="handleClick" />` | `<Button onClick={handleClick} />` |

### 3. 相对路径处理

VuReact 会保持相对路径结构，确保转换后的项目结构一致：

```txt
# 转换前 (Vue)
src/
├── feature-alpha/
│   ├── UserPanel.vue
│   └── UserCard.vue
└── feature-beta/
    ├── ParentPage.vue
    └── ThemeCard.vue

# 转换后 (React)
src/
├── feature-alpha/
│   ├── UserPanel.tsx
│   └── UserCard.tsx
└── feature-beta/
    ├── ParentPage.tsx
    └── ThemeCard.tsx
```

## 最佳实践

### 1. 目录组织建议

- **按功能划分**：将相关组件放在同一目录下
- **清晰的命名**：使用有意义的目录和文件名称
- **避免深层嵌套**：保持目录结构扁平，避免过多层级
- **使用 index 文件**：为模块提供统一的导出入口

### 2. 组件设计原则

- **单一职责**：每个组件只负责一个特定功能
- **明确的 Props**：使用 TypeScript 定义清晰的 Props 接口
- **合理的事件命名**：使用 `on` 前缀命名事件处理器
- **保持独立**：尽量减少组件间的直接依赖

### 3. 转换准备建议

1. **检查导入路径**：确保所有相对路径引用正确
2. **验证组件名称**：确保组件有明确的名称（可使用 `@vr-name` 指令）
3. **处理循环依赖**：避免组件间的循环引用
4. **测试引用关系**：转换前验证组件间的通信是否正常

## 常见问题

### Q: 如何处理别名路径（如 `@/components/Button.vue`）？

A: VuReact 会原封不动将路径迁移过去，你需要在构建后的配置文件中（如 `vite.config.ts`/`tsconfig.json`等），配置对应的别名映射。

### Q: 动态导入（`import()`）会被转换吗？

A: 是的，VuReact 会处理动态导入，保持相同的路径逻辑。

### Q: 如果组件分散在多个目录中怎么办？

A: VuReact 会保持原有的目录结构，确保引用关系正确。

### Q: 如何处理第三方 Vue 组件库？

A: 对于第三方库，需要配置对应的适配器或使用兼容层。

## 总结

组件引用是 Vue 项目的基础结构，正确的组织方式能大大提高项目的可维护性。VuReact 能够智能地处理各种引用模式，保持项目结构的完整性，确保转换后的 React 项目具有相同的组织逻辑。

通过本章的学习，你应该能够：

1. 理解 Vue 组件的基本引用方式
2. 掌握项目结构的组织原则
3. 了解 VuReact 如何处理组件引用转换
4. 应用最佳实践来优化项目结构

在下一章中，我们将学习更复杂的组件通信模式，包括上下文、事件和插槽的综合应用。

---

[在 Github 查看示例源码](https://github.com/vureact-js/core/tree/master/packages/compiler-core/examples)
