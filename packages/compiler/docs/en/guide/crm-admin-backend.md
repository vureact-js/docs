# CRM Backend Migration Practice

A hands-on migration tutorial for migrating a Vue 3-based CRM Customer and Sales Operations Portal to React using VuReact.

## Overview

This is a follow-along migration guide designed to help you complete a full VuReact migration cycle independently, based on a `Vue3 + Vite + Vue Router` project.

VuReact not only supports processing Single-File Components (SFCs) but also standalone Script and Style files, with automatic copying of static asset files.

**Intended Audience**:

1. Developers maintaining Vue 3 business projects who want to incrementally migrate to the React ecosystem.
2. Those who appreciate Vue's intuitive mental model and wish to write React code with similar ergonomics.
3. Anyone looking to experience true cross-framework hybrid development (Vue + React) and generate production-ready React code.

Before getting started, you can preview and interact with the tutorial's [playground](https://codesandbox.io/p/github/vureact-js/example-crm-admin-backend/master) at [this link](https://r862dm-5173.csb.app).

## Pre-Migration Checklist

### Applicable Scenarios

- Your project uses Vue 3 (including `<script setup>` syntax).
- You accept a "controlled migration" approach (not "one-click, zero-modification fully automated").
- You want to validate a real-world case before migrating your own business repository.
- You plan to **collaborate with AI** to migrate Vue projects to React (`recommended`).

### Capability Boundaries (Please Confirm First)

- Routing is automatically adapted but may require manual correction of entry points and routing files in certain project structures.
- The migration goal is "runnable, maintainable, and evolvable code"—not "character-by-character identical output".
- Unsupported APIs or type interfaces will be preserved as-is in the React output.
- The example covers common backend scenarios but does not include full integration with backend APIs or permission platforms (mock APIs are used instead).

### Prerequisites

- Node.js 20+ (this project uses Vite 8.x as the build tool)
- npm 9+
- Cloned and installed dependencies for the [crm-admin-backend](https://github.com/vureact-js/example-crm-admin-backend) repository

## Step 1: Prepare the Example and Configuration

### Commands

```bash
cd crm-admin-backend
npm install
```

### Expected Outcomes

- Dependencies are installed successfully, and the `package.json` in the project directory includes a runnable `vr:build` script:

```json
"scripts": {
  "vr:watch": "vureact watch",
  "vr:build": "vureact build"
}
```

- A `vureact.config.ts` file exists in the root directory, along with a `src/` folder.

### Troubleshooting Failed Installations

- `npm` command unavailable: Verify Node.js/npm installation.
- Installation failures: Resolve lock file conflicts first, then retry.
- Unresolved issues: Copy the error message and consult AI tools for assistance.

### Success Criteria

- `npm install` completes without blocking errors.

## Step 2: Execute VuReact Compilation

### Command

```bash
npm run vr:build
```

### Expected Outcomes

- The console outputs compilation statistics (number of SFC/script/style files processed):

<img src="/guide/crm-admin-backend/images/1.png" />

- A `.vureact/react-app` directory is generated, mirroring the structure of the original Vue source code:

<div style="display: flex;">
  <div style="font-size: 14px; text-align: center;">
    <img src="/guide/crm-admin-backend/images/2.png" />
    <p>(Vue Directory)</p>
  </div>
 <div style="font-size: 14px; text-align: center; margin-left: 46px">
    <img src="/guide/crm-admin-backend/images/2-1.png" style="width: 172px; height: 482px" />
    <p>(.vureact Directory)</p>
 </div>
</div>

- Warnings (if any) will display the specific file path.

### Troubleshooting Compilation Failures

- Npm/Network errors: Verify internet connectivity.
- SFC syntax errors: Fix the original Vue files before recompiling.
- Routing-related warnings: Proceed to [Step 3](#step-3-handle-routing-integration-critical) to correct routing integration.

### Success Criteria

- The output directory exists and contains React project files such as `src/main.tsx` and `src/router`.

## Step 3: Handle Routing Integration (Critical)

> For detailed background, see: [Router Adaptation Guide](/guide/router-adaptation)

### Command

```bash
cd .vureact/react-app
npm install
```

If manual correction is needed, focus on verifying:

- Whether `src/main.tsx` renders `<router.RouterProvider />`
- Whether routing configurations are imported from `@vureact/router`

### Expected Outcomes

- The app entry point is uniformly managed by `RouterProvider`:

```tsx
// src/main.tsx
import RouterInstance from './router/index';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterInstance.RouterProvider />
  </StrictMode>,
);
```

- Imports of `'vue-router'` are replaced with `'@vureact/router'`:

```ts
// src/router/index.ts
import { createRouter, createWebHashHistory } from '@vureact/router';
import { isAuthed } from '../data/mock-api';
import routes from './routes';

const router = createRouter({ history: createWebHashHistory(), routes });

router.beforeEach((to, _from, next) => {
  if (to.meta.public) {
    next();
    return;
  }
  if (!isAuthed()) {
    next({ name: 'login', query: { redirect: to.fullPath } });
    return;
  }
  next();
});

export default router;
```

- Page routes (e.g., Dashboard/Customers/Leads/Tasks) are accessible:

<img src="/guide/crm-admin-backend/images/4.png"  />

### Troubleshooting Routing Issues

- Blank page: Typically caused by `main.tsx` directly rendering `<App />` instead of the router provider.
- Routing component errors: Verify correct exports in `router/index`.
- Persistent issues: Follow the "Manual Adaptation Plan" in the Router Adaptation Guide step-by-step.

### Success Criteria

- Routes switch normally after startup, with no global blank screens.

## Step 4: Launch the React Build

### Command

```bash
npm run dev
```

### Expected Outcomes

- The Vite dev server starts successfully (on the default local port):

<img src="/guide/crm-admin-backend/images/5.png"  />

- The browser opens to the login page, then navigates to the CRM main interface:

<img src="/guide/crm-admin-backend/images/6.png"  />

### Troubleshooting Launch Failures

- Missing dependencies: Install missing packages per the installation logs and restart.
- TypeScript errors: Prioritize checking routing entry points and import paths.
- Vite errors: Verify Node.js version compatibility with Vite 8.x.
- Consider upgrading to the latest version of VuReact.

### Success Criteria

- The React build is accessible, supports hot reloading, and starts without blocking errors.
- Modifications to Vue source files trigger synchronous updates in the React build and UI.

## Step 5: Page Acceptance (Business Cycle Validation)

Manually validate the following paths in the running application:

### Expected Outcomes

- **Notification Center**: Filtering, keyword search, single notification handling, mark all as read.
- **Approval Center**: Initiate approvals, approve/reject requests, track approval history.
- **Lead Pipeline**: High-value leads trigger approval workflows.
- **Task Board**: Blocked tasks trigger collaborative notifications.
- **Dashboard**: Collaborative summaries (unread/awaiting approval/today’s tasks) update interactively.

### Troubleshooting Business Logic Issues

- Failed workflow triggers: Check if rule entry points in `mock-api` are called by the page.
- Stale data: Verify page reload/watch logic.

### Success Criteria

- The full "Lead/Task Action → Collaboration Center → Dashboard Summary" workflow functions end-to-end.

## Step 6: Nearby Debugging (By Symptom)

### Commands

```bash
# Recompile
npm run vr:build

# Restart the build
cd .vureact/react-app && npm run dev

# Or delete the build and recompile
rm -rf .vureact
npm run vr:build
cd .vureact/react-app && npm install && npm run dev
```

### Expected Outcomes

- Most issues fall into these categories: routing entry errors, missing dependencies, source file syntax issues, type constraints, version incompatibility.

### Troubleshooting Guidance

- Blank routing page: Refer to the [Router Adaptation Guide](/guide/router-adaptation) first.
- Compilation failures: Fix the source file and recompile.
- Type errors: Verify correct imports of routing/runtime packages in the generated build, or skip type checking temporarily.

### Success Criteria

- Common blocking errors can be identified and resolved within 10 minutes.

## Step 7: Migrate to Your Business Repository (Minimal Template)

### Commands

- Install the compiler in your Vue project:

```bash
npm i -D @vureact/compiler-core
```

- Create a configuration file in the project root directory:

```ts
// vureact.config.ts
import { defineConfig } from '@vureact/compiler-core';

// Minimal example configuration (adjust for your project needs)
export default defineConfig({
  input: 'src',
  exclude: ['src/main.ts'],
  output: {
    workspace: '.vureact',
    outDir: 'react-app',
    bootstrapVite: true,
  },
});
```

For detailed configuration, see the [Config API](/api/config) documentation.

- Execute the migration:

```bash
npx vureact build

# Optional: Compile a specific directory
npx vureact build -i src/components

# Optional: Compile a specific file
npx vureact build -i src/pages/Home.vue
```

### Expected Outcomes

- A corresponding React build directory is generated in your business repository.
- You can reuse the acceptance criteria from [Step 3](#step-3-handle-routing-integration-critical) to [Step 6](#step-6-nearby-debugging-by-symptom) of this tutorial.

### Troubleshooting Business Repository Migration

- Start with a narrow migration scope (incremental directory-level migration) instead of migrating the entire repository at once.
- For complex routing scenarios, implement "manual adaptation" first to ensure the build runs.

### Success Criteria

- At least one core business workflow in your project runs successfully in the React build.

## Appendix A: Command Cheat Sheet

```bash
# Vue example directory
cd crm-ops-portal
npm install
npm run vr:build

# React build directory
cd .vureact/react-app
npm install
npm run dev
```

## Appendix B: Capability Mapping (This Case)

- Templates: Covers common directives, events, etc.
- Components: `defineProps` / `defineEmits` / slots
- Scripts: `ref` / `computed` / `watch`, etc.
- Dependency Injection: `provide` / `inject`
- Routing: `createRouter` / `router-link` / `router-view`, and navigation guards
- Styles: `scoped` / Sass syntax

## Appendix C: Troubleshooting Index

- Blank routing page: First check the [Router Adaptation Guide](/guide/router-adaptation)
- Syntax coverage: See [Capability Matrix](/guide/capabilities-overview)
- Compilation warning handling: See [Best Practices](/guide/best-practices)
- Feedback Channels:
  - [Compiler Issues](https://github.com/vureact-js/core/issues)
  - [Router Issues](https://github.com/vureact-js/vureact-router/issues)

## Appendix D: Next Learning Path

After finishing this tutorial, continue in this order:

1. [CLI Guide](/en/guide/cli): learn `build/watch`, input scope control, and command workflow.
2. [Config API](/en/api/config): understand `input/exclude/output/router` and other core options.
3. [Compilation Specification](/en/guide/specification): align with compiler conventions and boundary rules.
4. [Best Practices](/en/guide/best-practices): establish a migration process that is rollback-friendly and verifiable.
