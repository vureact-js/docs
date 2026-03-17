# CRM 管理后台项目实战

## 项目概述

[CRM Operations Portal](https://github.com/vureact-js/core/tree/master/packages/compiler-core/examples/crm-ops-portal) 是一个完整的 Vue 3 管理后台项目，展示了 VuReact 在实际应用中的转换能力。本项目包含：

- **6个页面组件**：仪表盘、客户管理、线索管道、任务看板、系统设置、登录/注册
- **6个通用组件**：KPI卡片、过滤栏、状态标签、销售阶段、客户表格、主题卡片
- **完整路由系统**：Vue Router 配置与路由守卫
- **样式系统**：Sass 样式与 CSS 变量主题
- **模拟数据层**：完整的 API 模拟与状态管理

## 项目结构

```txt
crm-ops-portal/
├── src/
│   ├── pages/                    # 页面组件
│   │   ├── Dashboard.vue         # 仪表板 - 数据概览
│   │   ├── Customers.vue         # 客户管理 - 表格与筛选
│   │   ├── LeadsPipeline.vue     # 销售线索 - 管道视图
│   │   ├── TasksBoard.vue        # 任务看板 - 看板布局
│   │   ├── Settings.vue          # 系统设置 - 表单配置
│   │   └── auth/                 # 认证页面
│   │       ├── Login.vue         # 登录页面
│   │       └── Register.vue      # 注册页面
│   ├── components/               # 通用组件
│   │   ├── CustomerTable.vue     # 客户表格组件
│   │   ├── FilterBar.vue         # 过滤栏组件
│   │   ├── KpiCard.vue           # KPI卡片组件
│   │   ├── PipelineStage.vue     # 销售阶段组件
│   │   ├── StatusPill.vue        # 状态标签组件
│   │   └── ThemeCard.vue         # 主题卡片组件
│   ├── router/                   # 路由配置
│   │   └── index.ts              # Vue Router 配置
│   ├── data/                     # 数据层
│   │   ├── mock-api.ts           # 模拟 API 函数
│   │   └── mock.ts               # 模拟数据定义
│   ├── styles/                   # 样式文件
│   │   └── app.scss              # 全局样式与主题变量
│   ├── App.vue                   # 根组件（布局）
│   └── main.ts                   # 应用入口
├── vureact.config.js             # VuReact 编译配置
└── package.json                  # 项目依赖
```

## 技术特性展示

### 1. 路由系统转换

本项目完整展示了 Vue Router 到 VuReact Router 的转换：

```ts
// Vue 路由配置 (src/router/index.ts)
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import Dashboard from './views/Dashboard.vue';
import Customers from './views/Customers.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: App,
      children: [
        { path: 'dashboard', component: Dashboard },
        { path: 'customers', component: Customers },
        // ... 其他路由
      ],
    },
  ],
});

// 导出路由实例供 main.ts 使用
export default router;
```

注意：转换后的路由配置需人工修改，请阅读[路由适配章节](/guide/router-adaptation)。

```tsx
// React 路由配置 (修改后)
import { createRouter, createWebHashHistory } from '@vureact/router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: <App />, // 注意：组件使用 JSX 语法
      children: [
        { path: 'dashboard', component: <Dashboard /> },
        { path: 'customers', component: <Customers /> },
        // ... 其他路由
      ],
    },
  ],
});
```

### 2. 复杂组件示例：KpiCard.vue

`src/components/KpiCard.vue`：

```vue
<template>
  <div class="card" :class="trendClass">
    <p class="title">{{ props.title }}</p>
    <div class="value">{{ props.value }}</div>
    <div class="meta">
      <p class="delta">{{ props.delta }}</p>
      <span v-if="props.sub" class="sub">{{ props.sub }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// @vr-name: KpiCard
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  value: string | number;
  delta: string;
  trend: 'up' | 'down';
  sub?: string;
}>();

const trendClass = computed(() => (props.trend === 'up' ? 'trend-up' : 'trend-down'));
</script>

<style scoped lang="less">
/* Less 样式 */
.card {
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
}
.trend-up .delta {
  color: #16a34a;
}
.trend-down .delta {
  color: #dc2626;
}
</style>
```

转换后的 React 组件 `.vureact/react-app/src/components/KpiCard.tsx`：

```tsx
// @vr-name: KpiCard
import { dir, useComputed } from '@vureact/runtime-core';
import { memo } from 'react';
import './KpiCard-5fea9dbe.css';

export type IKpiCardProps = {
  title: string;
  value: string | number;
  delta: string;
  trend: 'up' | 'down';
  sub?: string;
};

const KpiCard = memo((props: IKpiCardProps) => {
  const trendClass = useComputed(() => (props.trend === 'up' ? 'trend-up' : 'trend-down'));

  return (
    <>
      <div className={dir.cls('card', trendClass.value)} data-css-5fea9dbe>
        <p className="title" data-css-5fea9dbe>
          {props.title}
        </p>
        <div className="value" data-css-5fea9dbe>
          {props.value}
        </div>
        <div className="meta" data-css-5fea9dbe>
          <p className="delta" data-css-5fea9dbe>
            {props.delta}
          </p>
          {props.sub ? (
            <span className="sub" data-css-5fea9dbe>
              {props.sub}
            </span>
          ) : null}
        </div>
      </div>
    </>
  );
});

export default KpiCard;
```

### 3. 布局组件：App.vue 的关键特性

`src/App.vue`：

```vue
<!-- provide 提供上下文 -->
<script setup lang="ts">
import { provide, ref } from 'vue';

const theme = ref<'ocean' | 'forest'>('ocean');
const workspace = ref({
  name: '星河科技',
  region: '华东',
  plan: 'Growth',
});

provide('theme', theme);
provide('workspace', workspace);

// ...
</script>

<!-- 路由导航 -->
<template>
  <aside class="sidebar">
    <RouterLink to="/dashboard" class="nav-item">仪表盘</RouterLink>
    <RouterLink to="/customers" class="nav-item">客户</RouterLink>
    <!-- ... -->
  </aside>
  <main class="page">
    <RouterView />
  </main>
</template>
```

转换后的 React 组件 `.vureact/react-app/src/App.tsx`：

```tsx
import { RouterLink, RouterView, useRouter } from '@vureact/router';
import { Provider, useVRef } from '@vureact/runtime-core';

const App = memo(() => {
  const theme = useVRef<'ocean' | 'forest'>('ocean');
  const workspace = useVRef({ name: '星河科技', region: '华东', plan: 'Growth' });

  // ...
  return (
    // provide 转为 Provider 适配组件
    <Provider name={'theme'} value={theme}>
      <Provider name={'workspace'} value={workspace}>
        {/* ... */}
        <aside className="sidebar" data-css-8de34ae3>
          <RouterLink to="/dashboard" className="nav-item">
            仪表盘
          </RouterLink>
          <RouterLink to="/customers" className="nav-item">
            客户
          </RouterLink>
          <RouterLink to="/leads" className="nav-item">
            线索管道
          </RouterLink>
          <RouterLink to="/tasks" className="nav-item">
            任务看板
          </RouterLink>
          <RouterLink to="/settings" className="nav-item">
            设置
          </RouterLink>
        </aside>
        <main className="page" data-css-8de34ae3>
          <RouterView />
        </main>
      </Provider>
    </Provider>
  );
});

export default App;
```

### 4. 依赖注入转换：ThemeCard.vue

`src/components/ThemeCard.vue`：

```vue
<!-- Vue 组件使用 inject -->
<template>
  <section class="card">
    <header class="card-header">
      <div>
        <h3>{{ props.title }}</h3>
        <p class="hint">{{ props.hint }}</p>
      </div>
      <span class="theme">{{ themeValue }}</span>
    </header>

    <div class="card-body">
      <slot>
        <p>当前工作区：{{ workspaceValue.name }}</p>
      </slot>
    </div>

    <footer class="card-footer">
      <slot name="footer" :workspace="workspaceValue">
        <small>{{ workspaceValue.region }} · {{ workspaceValue.plan }}</small>
      </slot>
    </footer>
  </section>
</template>

<script setup lang="ts">
// @vr-name: ThemeCard
import { computed, inject, watch } from 'vue';

type Workspace = { name: string; region: string; plan: string };

const props = defineProps<{ title: string; hint: string }>();

// 依赖 App 侧 provide，避免在 inject 默认值中触发 ref 的 hook 规则
const theme = inject('theme');
const workspace = inject<Workspace>('workspace');

const themeValue = computed(() => (theme.value === 'ocean' ? '海洋主题' : '森林主题'));
const workspaceValue = computed(() => workspace.value);

watch(
  () => themeValue,
  (newVal) => {
    alert(`useWatch: ${newVal}`);
  },
);
</script>

<style scoped>
.card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hint {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 12px;
}

.theme {
  font-size: 12px;
  color: var(--accent);
  font-weight: 600;
}

.card-body {
  margin-top: 12px;
}

.card-footer {
  margin-top: 12px;
  color: var(--muted);
}
</style>
```

转换后的 React 组件 `.vureact/react-app/src/components/ThemeCard.tsx`：

```tsx
// @vr-name: ThemeCard
import { useComputed, useInject, useWatch } from '@vureact/runtime-core';
import { type ReactNode, memo } from 'react';
import './ThemeCard-adafd895.css';

type Workspace = { name: string; region: string; plan: string };

export type IThemeCardProps = { title: string; hint: string } & {
  children?: ReactNode;
  footer?: (props: { workspace: any }) => ReactNode;
};

const ThemeCard = memo((props: IThemeCardProps) => {
  const theme = useInject('theme');
  const workspace = useInject<Workspace>('workspace');
  const themeValue = useComputed(() => (theme.value === 'ocean' ? '海洋主题' : '森林主题'));
  const workspaceValue = useComputed(() => workspace.value);

  useWatch(
    () => themeValue,
    (newVal) => {
      alert(`useWatch: ${newVal}`);
    },
  );

  return (
    <>
      <section className="card" data-css-adafd895>
        <header className="card-header" data-css-adafd895>
          <div data-css-adafd895>
            <h3 data-css-adafd895>{props.title}</h3>
            <p className="hint" data-css-adafd895>
              {props.hint}
            </p>
          </div>
          <span className="theme" data-css-adafd895>
            {themeValue.value}
          </span>
        </header>
        <div className="card-body" data-css-adafd895>
          {props.children ?? <p data-css-adafd895>当前工作区：{workspaceValue.value.name}</p>}
        </div>
        <footer className="card-footer" data-css-adafd895>
          {props.footer?.({ workspace: workspaceValue.value }) ?? (
            <small data-css-adafd895>
              {workspaceValue.value.region}·{workspaceValue.value.plan}
            </small>
          )}
        </footer>
      </section>
    </>
  );
});

export default ThemeCard;
```

在父组件中，`provide` 被转换为 `Provider` 组件：

```tsx
// App.tsx 中的 provide 转换
import { Provider, useVRef } from '@vureact/runtime-core';

const App = memo(() => {
  const theme = useVRef<'ocean' | 'forest'>('ocean');
  // ...

  return (
    // provide('theme', theme) 转换为 Provider 组件
    <Provider name={'theme'} value={theme}>
      {/* ... */}
      <ThemeCard>{/* 子组件内容 */}</ThemeCard>
    </Provider>
  );
});
```

### 5. 样式转换：Sass 到 CSS

`src/styles/app.scss`：

```scss
$colors: (
  ocean: (
    accent: #2563eb,
    accent-soft: rgba(37, 99, 235, 0.14),
    banner: #e0f2fe,
  ),
  forest: (
    accent: #16a34a,
    accent-soft: rgba(22, 163, 74, 0.15),
    banner: #ecfccb,
  ),
);

// 循环生成所有主题
:root {
  @each $color-name, $color-value in map-get($colors, light) {
    --#{$color-name}: #{$color-value};
  }
}

.theme-ocean {
  @each $color-name, $color-value in map-get($colors, ocean) {
    --#{$color-name}: #{$color-value};
  }
}

.theme-forest {
  @each $color-name, $color-value in map-get($colors, forest) {
    --#{$color-name}: #{$color-value};
  }
}
```

`.vureact/react-app/src/styles/app.css`：

```css
/* 转换后的 CSS */
:root {
  --accent: #2563eb;
  --accent-soft: rgba(37, 99, 235, 0.12);
  --banner: #fef3c7;
}

.theme-ocean {
  --accent: #2563eb;
  --accent-soft: rgba(37, 99, 235, 0.14);
  --banner: #e0f2fe;
}

.theme-forest {
  --accent: #16a34a;
  --accent-soft: rgba(22, 163, 74, 0.15);
  --banner: #ecfccb;
}
```

## 编译配置

```javascript
// vureact.config.js
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: 'src',
  exclude: [
    'src/main.ts', // 排除 Vue 入口文件
  ],
  output: {
    workspace: '.vureact',
    outDir: 'react-app',
    bootstrapVite: true, // 自动创建 React Vite 项目
  },
  format: {
    enabled: false, // 关闭格式化以观察原始输出
    formatter: 'prettier',
  },
});
```

## 转换步骤

### 步骤 1：安装依赖并编译

在本示例根目录下运行：

```bash
# 安装依赖
npm install

# 执行编译
npm run vr:build
# 或使用监听模式
npm run vr:watch
```

### 步骤 2：调整路由配置（关键步骤）

> 建议前往[路由适配](/guide/router-adaptation)章节。

由于路由需要人工调整，编译后需要：

- **1. 修改路由文件扩展名 .ts -> .tsx**：

```bash
mv .vureact/react-app/src/router/index.ts .vureact/react-app/src/router/index.tsx
```

- **2. 更新路由配置文件**：

`.vureact/react-app/src/router/index.tsx`：

```tsx
import { createRouter, createWebHashHistory } from '@vureact/router';
import App from '../App';
import Dashboard from '../pages/Dashboard';
// ... 其他导入

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: <App />, // 注意：使用 JSX 语法
      children: [
        { path: 'dashboard', component: <Dashboard /> },
        // ... 其他路由
      ],
    },
  ],
});

export default router;
```

- **3. 更新入口文件**：

`.vureact/react-app/src/main.tsx`：

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import router from './router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <router.RouterProvider />
  </StrictMode>,
);
```

- **4. 更新编译配置排除项**：

在 `vureact.config.js` 中添加：

```javascript
exclude: [
  'src/main.ts',
  'src/router/**',  // 排除路由目录，防止覆盖
],
```

### 步骤 3：运行 React 应用

```bash
# 进入输出目录
cd .vureact/react-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 转换亮点

### 1. 完整的路由适配

- `<router-link>` → `<RouterLink>`
- `<router-view>` → `<RouterView>`
- 路由守卫自动转换
- 路由 meta 字段支持

### 2. 样式处理

- Sass/Less 编译为 CSS
- Scoped 样式自动哈希
- CSS 变量主题系统完整保留

### 3. 组件 API 转换

- `defineProps` → TypeScript 接口
- `defineEmits` → 回调函数 props
- `provide/inject` → Context API
- `computed` → `useComputed`
- `ref` → `useVRef`

### 4. 模板语法转换

- `v-for` → `map()` 循环
- `v-if` → 条件渲染
- `v-bind` → JSX 属性绑定
- `v-on` → React 事件处理
- `v-model` → 双向绑定适配

## 常见问题

### Q1: 路由页面空白

**问题**：编译后路由页面不显示内容
**解决**：

1. 确认路由文件已改为 `.tsx` 扩展名
2. 检查组件是否使用 `<Component />` JSX 语法
3. 验证 `<RouterView />` 是否正确放置在布局中

### Q2: 样式丢失或错乱

**问题**：转换后样式显示异常
**解决**：

1. 检查 Sass/Less 预处理是否启用
2. 确认 scoped 样式哈希是否正确生成
3. 验证 CSS 变量主题是否正常转换

### Q3: 状态更新不触发渲染

**问题**：`ref` 值更新但界面不刷新
**解决**：

1. 检查 `ref.value` 是否转换为 `.value` 访问
2. 确认 `useVRef` 是否正确使用
3. 验证响应式依赖追踪是否正常

## 最佳实践总结

### 1. 路由配置规范

- 使用命名路由便于维护
- 路由组件统一使用懒加载
- 路由 meta 字段类型化

### 2. 组件设计原则

- 单一职责：每个组件只做一件事
- 明确接口：使用 TypeScript 定义 props
- 样式隔离：合理使用 scoped 样式

### 3. 状态管理策略

- 局部状态使用 `ref`/`computed`
- 跨组件状态使用 `provide`/`inject`
- 复杂状态考虑使用 Pinia（需额外适配）

### 4. 样式编写建议

- 使用 CSS 变量定义主题
- 避免深度选择器
- 合理使用 CSS 预处理器

## 下一步

完成本项目的学习后，你可以：

1. **应用到实际项目**：参考此[项目源码](https://github.com/vureact-js/core/tree/master/packages/compiler-core/examples/crm-ops-portal)创建自己的管理后台
2. **在线演示**：[CodeSandbox 链接](xxx)
3. **路由适配指南**：[路由适配文档](/guide/router-adaptation)
4. **探索高级特性**：学习[心灵控制](/guide/mind-control-readme)章节掌握混合开发
5. **深入学习**：查看[能力矩阵](/guide/capabilities-overview)了解完整支持特性
6. **查阅 API**：参考[API 文档](/api/)了解详细配置选项
7. **问题反馈**：[GitHub Issues](https://github.com/vureact-js/core/issues)
