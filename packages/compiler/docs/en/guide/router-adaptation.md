# Router Adaptation Guide

## Overview

VuReact provides full conversion support for Vue Router. However, since routing is an engineering-level context, some manual adjustments are still required after compilation.

### Automatically Converted Parts

- `<router-link>` → `<RouterLink>`
- `<router-view>` → `<RouterView>`
- Routing API calls: `useRouter()`, `useRoute()`, etc.
- Automatic injection of the `@vureact/router` dependency

### Parts Requiring Manual Adjustment

- Routing configuration file format conversion
- Entry file rendering method
- Exclusion configuration settings

## Configuration Steps

### Step 1: Pre-compilation Preparation

Ensure your Vue project uses the standard Vue Router configuration.

### Step 2: Execute Compilation

```bash
npx vureact build

# Or manually configure the npm command
npm run vr:build
```

### Step 3: Adjust the Output React Project (Critical Step)

#### 3.1 Update the Entry File (src/main.tsx)

Example:

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

**Important Changes**:

- Import the router provider; there is no need to render `<App />` because `App` should be mounted in the routing configuration.

#### 3.2 Convert the Routing Configuration File

The actual structure shall be based on the routing configuration output by your project.

Rename `src/router/index.ts` to `src/router/index.tsx`.

Example:

```tsx
import { createRouter, createWebHashHistory } from '@vureact/router';
import App from '../App';
import Dashboard from '../pages/Dashboard';
import Customers from '../pages/Customers';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: <App />,
      children: [
        { path: 'dashboard', component: <Dashboard /> },
        { path: 'customers', component: <Customers /> },
      ],
    },
  ],
});

export default router;
```

**Important Changes**:

- File extension: `.ts` → `.tsx`
- Export the `createRouter` router instance
- Component syntax: `component: Dashboard` → `component: <Dashboard />`
- Import method: Keep React component imports unchanged

#### 3.3 Configure Exclusions

Add exclusion configurations to `vureact.config.js` to prevent manually adjusted files from being overwritten during recompilation.

If these files need to be modified later, you must **synchronize the changes manually**.

Example:

```js
export default defineConfig({
  exclude: [
    'src/main.ts',
    'src/router/**', // Exclude the entire routing directory
  ],
});
```

### Step 4: Verification and Testing

1. Install dependencies: `npm install`
2. Start the project: `npm run dev`
3. Test route navigation
4. Verify nested routes

## FAQ

### Q1: Blank Page with Console Errors

**Possible Cause**: The routing configuration file has not been converted to JSX syntax.
**Solution**:

1. Confirm the file extension is `.tsx` or `.jsx`
2. Check if components use the `<Component />` syntax
3. Ensure React components are imported correctly

### Q2: 404 Error on Route Navigation

**Possible Cause**: Incorrect history mode configuration.
**Solution**:

- Check the use of `createWebHashHistory` vs `createWebHistory`
- Verify the base path configuration

### Q3: Nested Routes Not Displaying Content

**Possible Cause**: The parent component is missing `<RouterView />`.
**Solution**:
Add a route outlet in the layout component:

```vue
<!-- Original Vue Code -->
<template>
  <div>
    <header>...</header>
    <router-view />
  </div>
</template>
```

### Q4: Manual Adjustments Overwritten After Compilation

**Possible Cause**: Files are not added to the `exclude` list.
**Solution**:
Update `vureact.config.js` and add the adjusted files to the exclusion list.

## Best Practices

### 1. Routing Configuration Standards

- Export the router instance: `export default createRouter({})`
- Use named routes: `{ name: 'dashboard', path: '/dashboard', ... }`
- Configure route lazy loading:

  ```tsx
  const Dashboard = lazy(() => import('../pages/Dashboard'));
  ```

- Centralize management of route meta fields

### 2. File Management Strategy

- Manage routing configuration files in a separate directory
- Separate type definitions into `src/router/types.ts`
- Unify route guards in `src/router/guards.ts`

### 3. Testing Strategy

- Unit test routing configurations
- E2E test route navigation flows
- Functional comparison testing before and after compilation

## Next Steps

- [VuReact Router Official Documentation](https://router.vureact.top)
- [CRM Project Routing Example](/guide/crm-admin-backend)
- [Compilation Issue Feedback and Support](https://github.com/vureact-js/core/issues)
- [Routing Issue Feedback and Support](https://github.com/vureact-js/vureact-router/issues)
