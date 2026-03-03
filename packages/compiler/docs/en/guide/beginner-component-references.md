# Component References

Component references are fundamental to Vue projects. Understanding how to properly organize and reference components is crucial for project maintenance and migration. This chapter will demonstrate Vue inter-component reference patterns and how these references are converted to React project structures by VuReact.

## Basic Component References

### Simple Parent-Child Component Reference

In Vue, components are imported via `import` statements and then used in templates:

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
    <h1>Component Reference Example</h1>
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

### Converted React Code

VuReact automatically handles component references, removing the `.vue` extension and adjusting import paths:

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
      <h1>Component Reference Example</h1>
      <ChildComponent message={greeting} />
    </div>
  );
}
```

## Project Structure Organization

### Organizing Components by Functional Modules

In real-world projects, we typically organize components by functional modules. Here's an example project structure:

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

### Cross-Directory Component References

```vue
<!-- src/features/dashboard/UserCard.vue -->
<template>
  <div class="user-card">
    <h3>{{ user.name }}</h3>
    <p>Age: {{ user.age }}</p>
    <button @click="$emit('follow', user)">Follow</button>
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
    <h2>User Panel</h2>
    <UserCard :user="currentUser" @follow="handleFollow" />
    <p>Total Follows: {{ followCount }}</p>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UserCard from './UserCard.vue';

const currentUser = ref({ name: 'Zhang San', age: 28 });
const followCount = ref(0);

const handleFollow = (user) => {
  console.log('Followed:', user.name);
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

## Practical Example Analysis

Let's analyze the component reference patterns in the examples:

### App.vue Integrating Multiple Modules

```vue
<!-- src/App.vue -->
<template>
  <main class="app-shell">
    <header class="hero">
      <img class="logo" src="./assets/demo.svg" alt="demo" />
      <h1>{{ title }}</h1>
      <p class="subtitle">{{ summary }}</p>
    </header>

    <!-- Reference components from different directories -->
    <UserPanel />
    <ParentPage />
    <TemplateStableDemo />
    <StylePipelineDemo />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
// Import components from different feature modules
import UserPanel from './feature-alpha/UserPanel.vue';
import ParentPage from './feature-beta/ParentPage.vue';
import StylePipelineDemo from './labs/StylePipelineDemo.vue';
import TemplateStableDemo from './labs/TemplateStableDemo.vue';

const title = 'Messy Vue SFC Playground';
const summary = computed(() => `${title} / pre-release-e2e`);
</script>
```

### Nested Component References

```vue
<!-- src/feature-alpha/UserPanel.vue -->
<template>
  <section class="alpha-panel">
    <h2>feature-alpha</h2>
    <!-- Reference child component in the same directory -->
    <UserCard :name="user.name" :age="user.age" @follow="onFollow" />
    <p>Total follows: {{ totalFollows }}</p>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UserCard from './UserCard.vue'; // Relative path reference

const user = ref({ name: 'Ada', age: 26 });
const totalFollows = ref(0);

const onFollow = (payload) => {
  totalFollows.value = payload.count;
};
</script>
```

## Migration Guide

### 1. Import Path Conversion

VuReact automatically handles import path conversion:

| Vue Import                                              | React Conversion                                     |
| ------------------------------------------------------- | ---------------------------------------------------- |
| `import UserPanel from './feature-alpha/UserPanel.vue'` | `import UserPanel from './feature-alpha/UserPanel'`  |
| `import Button from '../components/common/Button.vue'`  | `import Button from '../components/common/Button'`   |
| `import utils from '../../shared/utils'`                | `import utils from '../../shared/utils'` (unchanged) |

### 2. Component Usage Conversion

Component usage in templates remains largely unchanged:

| Vue Template                      | React JSX                          |
| --------------------------------- | ---------------------------------- |
| `<UserPanel />`                   | `<UserPanel />`                    |
| `<UserCard :name="user.name" />`  | `<UserCard name={user.name} />`    |
| `<Button @click="handleClick" />` | `<Button onClick={handleClick} />` |

### 3. Relative Path Handling

VuReact preserves the relative path structure to ensure consistency in the converted project:

```txt
# Before conversion (Vue)
src/
├── feature-alpha/
│   ├── UserPanel.vue
│   └── UserCard.vue
└── feature-beta/
    ├── ParentPage.vue
    └── ThemeCard.vue

# After conversion (React)
src/
├── feature-alpha/
│   ├── UserPanel.tsx
│   └── UserCard.tsx
└── feature-beta/
    ├── ParentPage.tsx
    └── ThemeCard.tsx
```

## Best Practices

### 1. Directory Organization Recommendations

- **Functional division**: Place related components in the same directory
- **Clear naming**: Use meaningful directory and file names
- **Avoid deep nesting**: Keep directory structures flat and avoid excessive hierarchy
- **Use index files**: Provide a unified export entry for modules

### 2. Component Design Principles

- **Single responsibility**: Each component should handle only one specific function
- **Explicit Props**: Use TypeScript to define clear Props interfaces
- **Proper event naming**: Prefix event handlers with `on`
- **Maintain independence**: Minimize direct dependencies between components

### 3. Migration Preparation Recommendations

1. **Check import paths**: Ensure all relative path references are correct
2. **Validate component names**: Ensure components have explicit names (use the `@vr-name` directive if needed)
3. **Handle circular dependencies**: Avoid circular references between components
4. **Test reference relationships**: Verify component communication works correctly before conversion

## Frequently Asked Questions

### Q: How to handle alias paths (e.g., `@/components/Button.vue`)?

A: VuReact migrates the paths as-is. You need to configure the corresponding alias mappings in the post-build configuration files (e.g., `vite.config.ts`/`tsconfig.json`, etc.).

### Q: Are dynamic imports (`import()`) converted?

A: Yes, VuReact handles dynamic imports while preserving the same path logic.

### Q: What if components are scattered across multiple directories?

A: VuReact preserves the original directory structure to ensure correct reference relationships.

### Q: How to handle third-party Vue component libraries?

A: For third-party libraries, you need to configure corresponding adapters or use a compatibility layer.

## Summary

Component references form the basic structure of Vue projects, and proper organization greatly improves project maintainability. VuReact intelligently handles various reference patterns, preserving project structure integrity and ensuring the converted React project has the same organizational logic.

After studying this chapter, you should be able to:

1. Understand basic Vue component reference methods
2. Master project structure organization principles
3. Learn how VuReact handles component reference conversion
4. Apply best practices to optimize project structure

In the next chapter, we will learn more complex component communication patterns, including the comprehensive use of context, events, and slots.

---

[View example source code on GitHub](https://github.com/vureact-js/core/tree/master/packages/compiler-core/examples)
