# CRM Admin Backend Project Practice

## Project Overview

The [CRM Operations Portal](https://github.com/vureact-js/core/tree/master/packages/compiler-core/examples/crm-ops-portal) is a complete Vue 3 admin backend project that demonstrates VuReact's transformation capabilities in practical applications. This project includes:

- **6 Page Components**: Dashboard, Customer Management, Leads Pipeline, Tasks Board, System Settings, Login/Registration
- **6 Universal Components**: KPI Card, Filter Bar, Status Pill, Sales Stage, Customer Table, Theme Card
- **Complete Routing System**: Vue Router configuration and route guards
- **Style System**: Sass styles and CSS variable theming
- **Mock Data Layer**: Complete API simulation and state management

## Project Structure

```txt
crm-ops-portal/
├── src/
│   ├── pages/                    # Page components
│   │   ├── Dashboard.vue         # Dashboard - Data overview
│   │   ├── Customers.vue         # Customer Management - Tables & filters
│   │   ├── LeadsPipeline.vue     # Sales Leads - Pipeline view
│   │   ├── TasksBoard.vue        # Tasks Board - Kanban layout
│   │   ├── Settings.vue          # System Settings - Form configuration
│   │   └── auth/                 # Authentication pages
│   │       ├── Login.vue         # Login page
│   │       └── Register.vue      # Registration page
│   ├── components/               # Universal components
│   │   ├── CustomerTable.vue     # Customer table component
│   │   ├── FilterBar.vue         # Filter bar component
│   │   ├── KpiCard.vue           # KPI card component
│   │   ├── PipelineStage.vue     # Sales stage component
│   │   ├── StatusPill.vue        # Status pill component
│   │   └── ThemeCard.vue         # Theme card component
│   ├── router/                   # Routing configuration
│   │   └── index.ts              # Vue Router configuration
│   ├── data/                     # Data layer
│   │   ├── mock-api.ts           # Mock API functions
│   │   └── mock.ts               # Mock data definitions
│   ├── styles/                   # Style files
│   │   └── app.scss              # Global styles & theme variables
│   ├── App.vue                   # Root component (layout)
│   └── main.ts                   # Application entry point
├── vureact.config.js             # VuReact compilation configuration
└── package.json                  # Project dependencies
```

## Technical Feature Demonstration

### 1. Routing System Transformation

This project fully demonstrates the conversion from Vue Router to VuReact Router:

```ts
// Vue Router Configuration (src/router/index.ts)
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
        // ... Other routes
      ],
    },
  ],
});

// Export router instance for use in main.ts
export default router;
```

Note: The converted routing configuration requires manual modification. Please read the [Router Adaptation chapter](/guide/router-adaptation).

```tsx
// React Router Configuration (after modification)
import { createRouter, createWebHashHistory } from '@vureact/router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: <App />, // Note: Components use JSX syntax
      children: [
        { path: 'dashboard', component: <Dashboard /> },
        { path: 'customers', component: <Customers /> },
        // ... Other routes
      ],
    },
  ],
});
```

### 2. Complex Component Example: KpiCard.vue

`src/components/KpiCard.vue`:

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
/* Less styles */
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

Converted React component `.vureact/react-app/src/components/KpiCard.tsx`:

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

### 3. Layout Component: Key Features of App.vue

`src/App.vue`:

```vue
<!-- provide context -->
<script setup lang="ts">
import { provide, ref } from 'vue';

const theme = ref<'ocean' | 'forest'>('ocean');
const workspace = ref({
  name: 'Xinghe Technology',
  region: 'East China',
  plan: 'Growth',
});

provide('theme', theme);
provide('workspace', workspace);

// ...
</script>

<!-- Route navigation -->
<template>
  <aside class="sidebar">
    <RouterLink to="/dashboard" class="nav-item">Dashboard</RouterLink>
    <RouterLink to="/customers" class="nav-item">Customers</RouterLink>
    <!-- ... -->
  </aside>
  <main class="page">
    <RouterView />
  </main>
</template>
```

Converted React component `.vureact/react-app/src/App.tsx`:

```tsx
import { RouterLink, RouterView, useRouter } from '@vureact/router';
import { Provider, useVRef } from '@vureact/runtime-core';

const App = memo(() => {
  const theme = useVRef<'ocean' | 'forest'>('ocean');
  const workspace = useVRef({ name: 'Xinghe Technology', region: 'East China', plan: 'Growth' });

  // ...
  return (
    // provide converted to Provider adaptation component
    <Provider name={'theme'} value={theme}>
      <Provider name={'workspace'} value={workspace}>
        {/* ... */}
        <aside className="sidebar" data-css-8de34ae3>
          <RouterLink to="/dashboard" className="nav-item">
            Dashboard
          </RouterLink>
          <RouterLink to="/customers" className="nav-item">
            Customers
          </RouterLink>
          <RouterLink to="/leads" className="nav-item">
            Leads Pipeline
          </RouterLink>
          <RouterLink to="/tasks" className="nav-item">
            Tasks Board
          </RouterLink>
          <RouterLink to="/settings" className="nav-item">
            Settings
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

### 4. Dependency Injection Transformation: ThemeCard.vue

`src/components/ThemeCard.vue`:

```vue
<!-- Vue component using inject -->
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
        <p>Current workspace: {{ workspaceValue.name }}</p>
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

// Depends on provide from App side, avoid triggering ref hook rules in inject default value
const theme = inject('theme');
const workspace = inject<Workspace>('workspace');

const themeValue = computed(() => (theme.value === 'ocean' ? 'Ocean Theme' : 'Forest Theme'));
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

Converted React component `.vureact/react-app/src/components/ThemeCard.tsx`:

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
  const themeValue = useComputed(() => (theme.value === 'ocean' ? 'Ocean Theme' : 'Forest Theme'));
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
          {props.children ?? (
            <p data-css-adafd895>Current workspace: {workspaceValue.value.name}</p>
          )}
        </div>
        <footer className="card-footer" data-css-adafd895>
          {props.footer?.({ workspace: workspaceValue.value }) ?? (
            <small data-css-adafd895>
              {workspaceValue.value.region} · {workspaceValue.value.plan}
            </small>
          )}
        </footer>
      </section>
    </>
  );
});

export default ThemeCard;
```

In the parent component, `provide` is converted to the `Provider` component:

```tsx
// provide conversion in App.tsx
import { Provider, useVRef } from '@vureact/runtime-core';

const App = memo(() => {
  const theme = useVRef<'ocean' | 'forest'>('ocean');
  // ...

  return (
    // provide('theme', theme) converted to Provider component
    <Provider name={'theme'} value={theme}>
      {/* ... */}
      <ThemeCard>{/* Child component content */}</ThemeCard>
    </Provider>
  );
});
```

### 5. Style Transformation: Sass to CSS

`src/styles/app.scss`:

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

// Generate all themes in a loop
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

`.vureact/react-app/src/styles/app.css`:

```css
/* Converted CSS */
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

## Compilation Configuration

```javascript
// vureact.config.js
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: 'src',
  exclude: [
    'src/main.ts', // Exclude Vue entry file
  ],
  output: {
    workspace: '.vureact',
    outDir: 'react-app',
    bootstrapVite: true, // Automatically create React Vite project
  },
  format: {
    enabled: false, // Disable formatting to observe raw output
    formatter: 'prettier',
  },
});
```

## Transformation Steps

### Step 1: Install Dependencies and Compile

Run the following commands in the root directory of this example:

```bash
# Install dependencies
npm install

# Execute compilation
npm run vr:build
# Or use watch mode
npm run vr:watch
```

### Step 2: Adjust Routing Configuration (Critical Step)

> It is recommended to go to the [Router Adaptation](/guide/router-adaptation) chapter.

Since routing requires manual adjustment, after compilation you need to:

- **1. Modify routing file extension from .ts to .tsx**:

```bash
mv .vureact/react-app/src/router/index.ts .vureact/react-app/src/router/index.tsx
```

- **2. Update routing configuration file**:

`.vureact/react-app/src/router/index.tsx`:

```tsx
import { createRouter, createWebHashHistory } from '@vureact/router';
import App from '../App';
import Dashboard from '../pages/Dashboard';
// ... Other imports

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: <App />, // Note: Use JSX syntax
      children: [
        { path: 'dashboard', component: <Dashboard /> },
        // ... Other routes
      ],
    },
  ],
});

export default router;
```

- **3. Update entry file**:

`.vureact/react-app/src/main.tsx`:

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

- **4. Update compilation configuration exclusions**:

Add the following to `vureact.config.js`:

```javascript
exclude: [
  'src/main.ts',
  'src/router/**',  // Exclude router directory to prevent overwriting
],
```

### Step 3: Run the React Application

```bash
# Enter the output directory
cd .vureact/react-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Transformation Highlights

### 1. Complete Routing Adaptation

- `<router-link>` → `<RouterLink>`
- `<router-view>` → `<RouterView>`
- Route guards automatically converted
- Route meta field support

### 2. Style Processing

- Sass/Less compiled to CSS
- Scoped styles automatically hashed
- CSS variable theme system fully preserved

### 3. Component API Transformation

- `defineProps` → TypeScript interfaces
- `defineEmits` → Callback function props
- `provide/inject` → Context API
- `computed` → `useComputed`
- `ref` → `useVRef`

### 4. Template Syntax Transformation

- `v-for` → `map()` loops
- `v-if` → Conditional rendering
- `v-bind` → JSX attribute binding
- `v-on` → React event handling
- `v-model` → Two-way binding adaptation

## Frequently Asked Questions

### Q1: Blank Routing Pages

**Problem**: Routing pages do not display content after compilation
**Solution**:

1. Confirm the routing file has been renamed to `.tsx` extension
2. Check if components use `<Component />` JSX syntax
3. Verify that `<RouterView />` is correctly placed in the layout

### Q2: Missing or Distorted Styles

**Problem**: Styles display abnormally after conversion
**Solution**:

1. Check if Sass/Less preprocessing is enabled
2. Confirm scoped style hashes are generated correctly
3. Verify that CSS variable themes are converted properly

### Q3: State Updates Not Triggering Re-renders

**Problem**: `ref` values update but the interface does not refresh
**Solution**:

1. Check if `ref.value` is converted to `.value` access
2. Confirm `useVRef` is used correctly
3. Verify reactive dependency tracking works properly

## Best Practices Summary

### 1. Routing Configuration Specifications

- Use named routes for easier maintenance
- Use lazy loading for all route components
- Type route meta fields

### 2. Component Design Principles

- Single Responsibility: Each component does one thing
- Clear Interfaces: Define props with TypeScript
- Style Isolation: Use scoped styles appropriately

### 3. State Management Strategies

- Use `ref`/`computed` for local state
- Use `provide`/`inject` for cross-component state
- Consider Pinia for complex state (additional adaptation required)

### 4. Style Writing Recommendations

- Define themes using CSS variables
- Avoid deep selectors
- Use CSS preprocessors appropriately

## Next Steps

After completing this project, you can:

1. **Apply to real projects**: Create your own admin backend by referring to this [project source code](https://github.com/vureact-js/core/tree/master/packages/compiler-core/examples/crm-ops-portal)
2. **Online Demo**: [CodeSandbox Link](xxx)
3. **Router Adaptation Guide**: [Router Adaptation Documentation](/guide/router-adaptation)
4. **Explore Advanced Features**: Learn the [Mind Control](/guide/mind-control-readme) chapter to master hybrid development
5. **In-depth Learning**: Check the [Capability Matrix](/guide/capabilities-overview) to understand fully supported features
6. **API Reference**: Refer to the [API Documentation](/api/) for detailed configuration options
7. **Feedback**: [GitHub Issues](https://github.com/vureact-js/core/issues)
