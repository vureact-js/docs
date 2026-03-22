# Router Adaptation Guide

The router adaptation uses the complete solution provided by the `@vureact/router` adaptation package.

## Overview

The compiler provides full automatic adaptation from Vue Router to React Router. **When the compiler detects the use of router-related features in SFCs or script files of the project**, it will automatically perform the following conversions:

### Automatically Converted Parts

- `<router-link>` → `<RouterLink>`
- `<router-view>` → `<RouterView>`
- Router API calls: `createRouter`, `useRouter()`, `useBeforeRouteUpdate()`, etc.
- Global router guards: Navigation guards such as `router.beforeEach()` retain the same behavior
- Router meta fields: Access to metadata such as `to.meta` remains unchanged
- Nested routes: Full support for nested routes
- Automatic injection of the `@vureact/router` dependency

For more supported adaptation content, please refer to the [VuReact Router Official Documentation](https://router.vureact.top).

### Automatic Dependency Injection

The compiler automatically detects and injects necessary dependencies, for example:

```javascript
// Before compilation (Vue project)
import { useRouter, createRouter, createWebHistory } from 'vue-router';

// After compilation (React project)
import { useRouter, createRouter, createWebHistory } from '@vureact/router';
```

## Automatic Compiler Injection

To achieve automatic adaptation of Vue Router, complete the configuration according to the following steps. The core is to let the compiler identify and process the router configuration file, thereby automatically completing dependency replacement, entry file adjustment and other adaptation work:

### 1. Configure Compiler Router Parameters (vureact.config.js)

In the `vureact.config.js` (or .ts) file in the root directory of the project, specify the path of the Vue Router configuration file, which is the key for the compiler to implement automatic injection:

Example:

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  // ...other configurations
  router: {
    /**
     * Required: Replace with the actual path of your Vue Router configuration file
     * This file must export the result of the createRouter call via export default
     */
    configFile: 'src/router/index.ts',
  },
});
```

> ⚠ If the `output.bootstrapVite` option is set to `false`, the automatic injection function will not take effect. Please refer to the [Manual Adaptation Solution](#manual-adaptation-solution) below.

### 2. Adjust the Export Method of the Vue Router Configuration File

Ensure that your Vue Router configuration file (e.g., `src/router/index.ts`) exports the result of the `createRouter` call via `export default`, instead of only exporting the router instance:

Example:

```tsx
// Original Vue Router configuration example (before adjustment)
import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    // Other routing rules...
  ],
});

// After adjustment: Must export the result of createRouter call with export default
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    // Other routing rules...
  ],
});
export default router;
```

### 3. Verify the Automatic Compiler Injection Result

After completing the configuration, execute the compilation. The compiler will automatically complete the following operations without manual modification:

- Automatic dependency replacement:
  - `import ... from 'vue-router'` in the product's router configuration file will be automatically replaced with `import ... from '@vureact/router'`;
- Automatic entry file adjustment:
  - The product's entry file (e.g., `main.tsx`) will automatically import the router instance and replace the original `<App />` with `<RouterInstance.RouterProvider />`;

Example is as follows:

```tsx
// Automatically generated React entry file after compilation (main.tsx)
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import RouterInstance from './router/index'; // Automatically import router configuration

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterInstance.RouterProvider /> {/* Automatically replace App component */}
  </StrictMode>,
);
```

- In the corresponding router configuration file product, you will see the following content:

```ts
import { createRouter } from '@vureact/router';
export default createRouter({ ... });
```

> 🏄🏻‍♂️ Except that `vue-router` is replaced with `@vureact/router`, all other APIs and behaviors remain unchanged, which is the core advantage of the router adaptation package.

### Key Notes

1. If `output.bootstrapVite` is set to `false`, the automatic injection function will fail, and you need to switch to the [「Manual Adaptation Solution」](#manual-adaptation-solution);
2. The router configuration file must be in the standard `Vue Router` format, and routing rules are only defined through `createRouter`;
3. Automatic adaptation only replaces router-related APIs and components (such as `<router-link>→<RouterLink>`, `useRouter`, etc.), and no modification is required for other business logic.

### Verify Whether Automatic Adaptation Takes Effect

Refer to [Verification and Testing](#verification-and-testing) in the chapter.

## Manual Adaptation Solution

When the compiler's automatic injection function cannot be used (e.g., `output.bootstrapVite: false`), you need to complete the adaptation from Vue Router to React Router (VuReact Router) through manual adjustment. The core idea is: retain the Vue Router configuration logic, replace the dependency with `@vureact/router`, and adjust the rendering method of the React entry file.

### 1. Adaptation Prerequisites

1. Compilation from Vue project to React project has been completed (execute `npx vureact build`);
2. The `@vureact/router` dependency has been installed in the compiled React project;
3. Your Vue Router configuration file is in standard format (defined based on `createRouter`).

### 2. Core Steps

#### Step 1: Adjust the Export Logic of the Vue Router Configuration File

Locate your Vue Router configuration file (e.g., `src/router/index.ts`) and ensure that it exports the router instance created by `createRouter` (supports any export method, no strict requirement for `export default`):

```ts
// Vue Router configuration file before compilation (src/router/index.ts)
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Dashboard from '../views/Dashboard.vue';

// 1. Define routing rules (retain original logic, no modification required)
const routes = [
  {
    path: '/',
    component: Home,
    children: [
      { path: 'dashboard', component: Dashboard }, // Nested routes are also retained
    ],
  },
];

// 2. Create router instance
const router = createRouter({
  history: createWebHistory(), // Retain history mode configuration
  routes,
});

// 3. Export router instance (any export method is acceptable)
export { router };
// Or export default router;
```

#### Step 2: Modify the Rendering Method of the React Entry File

Locate the compiled React entry file (e.g., `src/main.tsx`), remove the original `<App />` rendering, and instead render the `RouterProvider` of VuReact Router:

```tsx
// Compiled React entry file (src/main.tsx)
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// Import manually exported router instance
import { router } from './router/index';

// Render RouterProvider instead of the original App component
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Core modification: Use RouterProvider to render routes */}
    <router.RouterProvider />
    {/* Note: If the App component contains <RouterView />, App needs to be mounted to the root route of the routing configuration instead of being rendered directly */}
    {/* <App />  // Comment out or delete the original App rendering */}
  </StrictMode>,
);
```

**Key Explanation**:

- The example is for reference only. Please adjust according to the actual routing structure, React entry file and the specific implementation of the `<App />` component.
- If your `<App />` component contains a route outlet component, you need to configure `<App />` as the `component` of the root route in the routing rules instead of rendering it directly;
- `<RouterProvider />` is a routing context component provided by `@vureact/router`, which replaces the native `RouterProvider` of React Router and is fully compatible with Vue Router logic.

### Summary

Core points for manually adapting Vue Router to React Router:

1. Ensure that the router configuration file exports a valid router instance;
2. Adjust the React entry file to use `RouterProvider` instead of the original `<App />` rendering;
3. Verify whether API calls and `<RouterView />`/`<RouterLink>` components in routing components work normally.

Manual adaptation fully retains Vue Router usage habits (such as route guards, meta fields, nested routes), and only needs to adjust dependencies and rendering methods without reconstructing routing logic.

## Verification and Testing

After compilation, enter the product directory (e.g., `.vureact/react-app`) and verify according to the following steps:

1. **Install dependencies**: Execute the `npm install` command.
2. **Start the project**: Execute the `npm run dev` command.
3. **Test route jumps**: Access the application in the browser and test whether the route jump function between pages is normal.
4. **Verify nested routes**: Check whether the view rendering and hierarchical relationship of nested routes are correct.

## Next Steps

- [VuReact Router Official Documentation](https://router.vureact.top/en)
- [CRM Project Router Example](/en/guide/crm-admin-backend)
- [Compilation Issue Feedback](https://github.com/vureact-js/core/issues)
- [Router Issue Feedback](https://github.com/vureact-js/vureact-router/issues)
