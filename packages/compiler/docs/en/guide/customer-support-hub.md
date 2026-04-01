# Customer Support Collaboration Hub

A hands-on migration tutorial for a mixed-code project based on the Vue + React ecosystem.

## Overview

This is a hands-on migration tutorial that helps you implement **full ecosystem enablement** and finish a closed-loop **controllable mixed-coding migration** with VuReact in real-world business scenarios, using:
**Vue + Vue Router + Ant Design (React) + Zustand (React)**.

### Playground

Before getting started, you can preview and experience the tutorial in advance via the [playground](https://codesandbox.io/p/github/vureact-js/example-customer-support-hub/master?import=true) and [preview](https://skx7pn-5173.csb.app/).

### Video Demonstration

You can also quickly understand the entire migration process through the following video:

<video muted controls>
  <source src="/videos/customer-support-hub.mp4" type="video/mp4" />
  Your browser does not support video playback.
</video>

### Prerequisites

- Node.js 19+
- Cloned the [customer-support-hub](https://github.com/vureact-js/example-customer-support-hub) repository and installed dependencies

## Step 1: Prepare the Example and Configuration

### 1.1 Commands

```bash
cd customer-support-hub
npm install
```

### 1.2 What You'll See

- Dependencies installed successfully, with `vr:watch` and `vr:build` executable in the project's `package.json`.

```json
"scripts": {
  "vr:watch": "vureact watch",
  "vr:build": "vureact build"
}
```

- `vureact.config.ts` exists in the root directory, along with the `src/` folder.

- The routing configuration entry is declared as `src/router/index.ts` in `vureact.config.ts`.

```ts
router: {
  configFile: 'src/router/index.ts',
},
```

### 1.3 Troubleshooting Failed Installations

- `npm` command unavailable: Check Node/npm installation.
- Installation failed: Prioritize resolving lock file conflicts and retry.
- Unresolved issues: Copy the error message and seek help from AI.

### 1.4 Pass Criteria

- `npm install` completes without blocking errors.
- `npm run vr:build` can be executed in the root directory.

## Step 2: Execute VuReact Compilation

### 2.1 Commands

```bash
npm run vr:build
```

Optional: Use watch mode for incremental migration.

```bash
npm run vr:watch
```

### 2.2 What You'll See

- Console output showing compilation statistics (number of SFC/script/style processed).

<img src="../../public/images/customer-support-hub/console.png"  />

- A `.vureact/react-app` directory is generated, mirroring the structure of the Vue source code.

<img src="../../public/images/customer-support-hub/menus.png"  />

- After successful compilation, React entry style imports are automatically processed according to `vureact.config.ts` configuration (completed by the `onSuccess` hook).

```ts
{
  onSuccess: async () => {
    /*
      Inject missing styles/app.css import into main.tsx
    */
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const entryFile = path.resolve(__dirname, './.vureact/react-app/src/main.tsx');
    const data = fs.readFileSync(entryFile, 'utf-8');
    const newData = data.replace('index.css', 'styles/app.css');
    fs.writeFileSync(entryFile, newData, 'utf-8');
  };
}
```

### 2.3 Troubleshooting Compilation Failures

- Network/NPM errors: Check internet connectivity.
- SFC syntax errors: Fix source Vue files before recompiling.
- Missing output directory: Confirm commands are executed in the project root and `vureact.config.ts` exists.

### 2.4 Pass Criteria

- Output directory exists and contains React project files such as `src/main.tsx` and `src/router`.
- Re-executing `npm run vr:build` consistently generates the output.

## Step 3: Inspect the Output Routing

### 3.1 What You'll See

- The React output app entry `main.tsx` is uniformly hosted by `RouterProvider`.

```tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterInstance.RouterProvider />
  </StrictMode>,
);
```

- Route guards allow access to `meta.public` pages (e.g., login page); other pages redirect to login if no session exists.

```ts
// react-app/src/router/index.ts
router.beforeEach((to, _from, next) => {
  if (to.meta.public) {
    next();
    return;
  }
  const session = appStore.getState().session;
  if (!session.user) {
    next({ name: 'login', query: { redirect: to.fullPath } });
    return;
  }
  next();
});
```

- Page routes (e.g., Dashboard/Tickets/Customers/Agents/Knowledge/SLA/Settings) are accessible.

<img src="../../public/images/customer-support-hub/pages.png"  />

### 3.2 Troubleshooting Routing Issues

- Blank page: Usually caused by `main.tsx` still directly rendering `<App />`.
- Route component errors: Check if `router/index` exports and `routes` imports are correct.
- Redirection after login: Verify session read/write logic (synchronization between `localStorage` and store).

### 3.3 Pass Criteria

- Login page is accessible after launch; business routes switch normally after login with no global blank screen.

## Step 4: Observe Vue + Zustand

In this section, we'll examine the usage of Zustand from the perspective of Vue source code.

### 4.1 What You'll See

- State is centralized in `src/store/useAppStore.ts`, with `appStore` created using `zustand/vanilla`

```ts
import { createStore } from 'zustand/vanilla';

// Core: Create store + actions
export const appStore = createStore<AppState>((set) => ({...}));
```

- Key state fields to focus on: `session`, `ticketFilters`, `slaConfig`, `activities`

```ts
{
  session: { ... },
  ticketFilters: { ... },
  slaConfig: { ... },
  activities: [],
}
```

- Key actions to focus on: `login/logout`, `setTicketFilters`, `setSlaConfig`, `appendActivity`

```ts
{
  login: (user) => set((state) => ({ ... })),
  setTicketFilters: (patch) => set((state) => ({ ... })),
  appendActivity: (text) => set((state) => ({ ... }))
  // ...
}
```

- Route guards read `session.user` from the store; unauthenticated users are redirected to login

```ts
// src/router/index.ts
import { appStore } from './store/useAppStore';

router.beforeEach((to, _from, next) => {
  // ...
  const session = appStore.getState().session;
  // ...
});
```

- Business pages trigger filtering/refresh via `appStore.subscribe(...)` or `getState()`, driving page data updates

```ts
// src/App.vue
appStore.subscribe((state) => {
  userName.value = state.session.user?.name || 'Guest';
});
```

### 4.2 Troubleshooting State Issues

- Redirection after login: Prioritize checking if `router.beforeEach` correctly reads `session.user`
- Filtering not working: Verify if the page subscribes to `ticketFilters` and if `setTicketFilters` is called with refresh after clicking filters
- Activity feed not updating: Check if the trigger chain calls `appendActivity`

### 4.3 Pass Criteria

- You can clearly map: `session -> route guards`, `ticketFilters -> page list refresh`, and `appendActivity -> dynamic/activity feed display`

## Step 5: Observe Vue + Ant Design

In this section, we'll examine the usage of Ant Design from the perspective of Vue source code.

### 5.1 What You'll See

- Ticket processing main area: `AntTable` + `AntSelect` + `AntButton` (table/filter/claim/escalate)

```vue
<!-- src/pages/TicketsList.vue -->
<AntTable
  :columns="columns"
  :data-source="rows"
  :pagination="pagination"
  row-key="id"
  :loading="loading"
  @change="onTableChange"
/>
...
```

- Customer details: `AntDrawer` (drawer) for information display and "quick ticket creation"

```vue
<!-- src/pages/Customers.vue -->
<AntDrawer :open="drawerOpen" width="560" title="Customer Details" @close="onCloseDrawer">
 ...
</AntDrawer>
```

- Customer risk display: `AntDescriptions/AntTag/AntProgress` (profile trends, risk scores, risk factor progress bars)

```vue
<!-- src/pages/Customers.vue -->
...
<AntProgress :percent="point.score" :stroke-color="point.color" :show-info="false" />
```

- SLA dashboard: `AntRadioGroup + AntTable` (switch filter results for "All/Risk/Overdue")

```vue
<!-- src/pages/SlaBoard.vue -->
<AntRadioGroup :value="riskFilter" @change="onFilterChange">
  ...
</AntRadioGroup>
...
```

- Verification method: Locate component imports from `antd` in the output or source code to quickly map to corresponding page areas

### 5.3 Troubleshooting UI Issues

- Table not displaying/incorrect columns: Prioritize checking if `columns` `dataIndex` matches `rows` fields and if `row-key` is still `id`
- Selector unresponsive: Verify if the bound `:value` field and callbacks (e.g., `onActiveTicketChange`) are correct
- Drawer/form not working: Check if the drawer `open` state toggles correctly and if submission actions call mock APIs (e.g., ticket creation)

### 5.4 Pass Criteria

- You can complete key interactions in the page such as "filter/claim/escalate/create ticket", and observe changes in page data and state updates

## Step 6: Launch the React Output

### 6.1 Commands

In the `.vureact/react-app` directory:

```bash
npm run dev
```

### 6.2 What You'll See

- Vite dev server starts successfully (default local port).
- Browser opens to the login page.

<img src="../../public/images/customer-support-hub/login.png"  />

- After login, enter the customer support collaboration main interface.

<img src="../../public/images/customer-support-hub/dashboard.png"  />

- Hot reload is available: Modify Vue source files and React output pages update synchronously.

In the `customer-support-hub` root directory:

```bash
npm run vr:watch
```

### 6.3 Troubleshooting Launch Failures

- Missing dependencies: Install missing packages from the installation log and restart.
- TS errors: Prioritize checking route entries, runtime package imports, and path aliases.
- Vite errors: Verify compatibility with the current Node.js version.

### 6.4 Pass Criteria

- React output is accessible, supports hot reload, and launches without blocking errors.

## Step 7: Page Acceptance (Business Closure)

Manually verify the following paths in the running page.

### 7.1 What You'll See

- Login and guards: Accessing business pages without login redirects to login; after login, redirect back to the target page.
- Ticket list and details: Filter/search tickets; view timeline and SLA snapshots after entering details page.

<img src="../../public/images/customer-support-hub/tickets.png"  />

- Ticket action linkage: After performing claim, assign, escalate, or status update actions, corresponding records are added to the activity feed.

<img src="../../public/images/customer-support-hub/ticket-detail.png"  />

- SLA dashboard linkage: After ticket escalation or approaching deadline, dashboard risk status updates synchronously; SLA configuration updates take effect immediately.
- Customer page linkage: View customer risk scores, create new tickets via "quick ticket creation", and retrieve them in the ticket list.

<img src="../../public/images/customer-support-hub/customer-detail.png"  />

- Knowledge base search: Filter articles by keywords or tags with normal pagination data.

<img src="../../public/images/customer-support-hub/knowledge.png"  />

### 7.2 Troubleshooting Business Linkage Issues

- Linkage not triggering: Check if mock API methods are called by the page (e.g., `claimTicket/escalateTicket/updateTicketStatus`).
- Activity feed not updating: Verify if `appendActivity` in the store is executed.
- Abnormal search results: Check for conflicts between Fuse.js keyword fields and filter conditions.

### 7.3 Pass Criteria

- Complete end-to-end flow: "Ticket actions -> Activity feed/SLA -> Dashboard or dashboard".
- Complete end-to-end flow: "Customer ticket creation -> Ticket list retrieval -> Detail processing".

## Step 8: Proximity Debugging (By Symptom)

### 8.1 Commands

```bash
# Recompile
npm run vr:build

# Restart output
cd .vureact/react-app && npm run dev
```

Or delete output and recompile:

```bash
rm -rf .vureact
npm run vr:build
cd .vureact/react-app && npm install && npm run dev
```

### 8.2 What You'll See

- Most issues fall into categories: route entry, missing dependencies, source file syntax, type constraints, version incompatibility.

### 8.3 Troubleshooting Persistent Issues

- Blank route page: Review Step 3 routing integration checks first.
- Compilation failure: Go back to the error file, fix source code, and recompile.
- Type errors: Check if route/runtime package imports in generated output are correct.
- Watch mode not syncing: Confirm `npm run vr:watch` is running in the root directory.

### 8.4 Pass Criteria

- Can locate and fix common blocking errors within 10 minutes.

## Appendix A: Command Quick Reference

```bash
# Vue example directory
cd customer-support-hub
npm install
npm run vr:build

# React output directory
cd .vureact/react-app
npm install
npm run dev
```

## Appendix B: Capability Mapping (This Case)

- Templates: Covers common directives, events, etc.
- Components: `defineProps` / `defineEmits` / slot
- Scripts: `ref` / `computed` / `watch`, etc.
- UI Library: Full use of Ant Design for layout, tables, forms, etc.
- State: Zustand store for cross-page state management
- Routing: `createRouter` / guards / nested routes / dynamic routes
- Styles: `scoped` / Sass syntax
- Business: Ticket flow, SLA risk, knowledge base search, customer risk scoring

## Appendix C: Troubleshooting Index

- Blank route page: First check [Router Adaptation Guide](/en/guide/router-adaptation)
- Syntax coverage: See [Capability Matrix](/en/guide/capabilities-overview)
- Compilation warning handling: See [Best Practices](/en/guide/best-practices)
- Issue feedback:
  - [Compiler Issues](https://github.com/vureact-js/core/issues)
  - [Router Issues](https://github.com/vureact-js/vureact-router/issues)

## Appendix D: Continued Learning Navigation

After completing this tutorial, we recommend continuing with the following sequence:

1. [CLI Guide](/en/guide/cli): Master usage of `build/watch`, input scope, and engineering commands.
2. [Configuration API](/en/api/config): Systematically understand core configuration items like `input/exclude/output/router`.
3. [Compilation Conventions](/en/guide/specification): Clarify compiler behavior boundaries and code conventions to reduce migration deviations.
4. [Best Practices](/en/guide/best-practices): Establish a rollbackable, verifiable, and extensible migration process.
