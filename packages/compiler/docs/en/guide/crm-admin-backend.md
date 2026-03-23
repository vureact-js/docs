# CRM Admin Migration Guide

A hands-on migration guide for a CRM customer and sales operations dashboard built with Vue 3.

## Overview

This is a **step-by-step, follow-along tutorial** designed to help you complete a full VuReact migration cycle independently, starting from a `Vue 3 + Vite + Vue Router` project.

VuReact supports not only SFC files, but also standalone **Script** and **Style** files, and automatically copies static assets.

### Who is this for?

1. Developers maintaining Vue 3 projects who want to migrate progressively to the React ecosystem
2. Developers who enjoy Vue’s mental model but want to write React
3. Developers exploring true cross-framework development with Vue + React, producing React output

Before starting, you can preview the tutorial via the **online demo**:
[https://codesandbox.io/p/devbox/compiler-examples-n8yg68](https://codesandbox.io/p/devbox/compiler-examples-n8yg68)

## Prerequisites

### Applicable Scenarios

- Your project uses Vue 3 (including `<script setup>`)
- You accept **controlled migration**, not “one-click zero-change automation”
- You want to validate a real case before migrating your own project
- You plan to collaborate with AI tools to migrate Vue to React (recommended)

### Capability Boundaries (Important)

- Routing is auto-adapted, but may require manual adjustments depending on project structure
- The goal is **runnable, maintainable, and evolvable code**, not exact 1:1 output
- Unsupported APIs/types are preserved as-is in the React output
- The example covers common admin scenarios, but uses mock APIs instead of real backend integration

### Requirements

- Node.js 20+ (Vite 8.x is used)
- npm 9+
- Clone and install dependencies from the [core repo](https://github.com/vureact-js/core)

## Step 1: Setup Example Project

### Command

```bash
cd core/packages/compiler-core/examples/crm-ops-portal
npm install
```

### Expected

- Dependencies installed successfully
- Project is ready to run `vr:build`
- `vureact.config.ts` and `src/` exist

### Troubleshooting

- npm not found → check Node/npm installation
- install fails → clear lockfile conflicts and retry
- stuck → copy error logs and ask AI

### Success Criteria

- `npm install` completes without blocking errors

## Step 2: Run VuReact Compilation

### Command

```bash
npm run vr:build
```

### Expected

- `.vureact/react-app` is generated
- Directory structure mirrors the Vue project

<img src="/guide/crm-admin-backend/images/3.png"  />

- Compilation stats are printed (SFC/script/style)
- Warnings (if any) show file locations

<img src="/guide/crm-admin-backend/images/1.png"  />

### Troubleshooting

- SFC syntax error → fix source Vue file
- Router warnings → proceed to Step 3

### Success Criteria

- Output contains `src/main.tsx`, `src/router`, etc.

## Step 3: Router Integration (Critical)

For details: Router Adaptation Guide

### Command

```bash
cd .vureact/react-app
npm install
```

### Key Checks

- `src/main.tsx` renders `<RouterProvider />`
- Router imports come from `@vureact/router`

### Expected

- App entry uses RouterProvider
- `vue-router` replaced with `@vureact/router`
- Pages like Dashboard / Customers / Leads / Tasks are accessible

### Troubleshooting

- Blank page → likely still rendering `<App />`
- Router errors → check router export
- still broken → follow manual adaptation guide

### Success Criteria

- Routing works without blank screen

## Step 4: Run React Output

### Command

```bash
npm run dev
```

### Expected

- Vite dev server starts
- App opens to login page → CRM dashboard

<img src="/guide/crm-admin-backend/images/2.png"  />

### Troubleshooting

- Missing deps → install and restart
- TS errors → check router/imports
- Vite errors → verify Node version
- consider upgrading VuReact

### Success Criteria

- App runs, hot reload works, no blocking errors

## Step 5: Feature Validation

Manually verify the following flows:

### Expected

- Notification center: filtering, search, mark as read
- Approval center: submit / approve / reject / history
- Lead pipeline: triggers approval flow
- Task board: blocked tasks trigger notifications
- Dashboard: synced summary updates

### Troubleshooting

- No trigger → check mock API usage
- Data not updating → check reload/watch logic

### Success Criteria

- Full flow works:
  **Lead/Task → Collaboration → Dashboard**

## Step 6: Debug by Symptoms

### Commands

```bash
npm run vr:build

cd .vureact/react-app && npm run dev

rm .vureact
npm run vr:build
cd .vureact/react-app && npm install && npm run dev
```

### Common Issues

- Router entry
- Missing dependencies
- Syntax errors
- Type issues
- Version mismatch

### Success Criteria

- Can locate and fix common issues within 10 minutes

## Step 7: Migrate Your Own Project

### Commands

```bash
npm i -D @vureact/compiler-core

npx vureact build

npx vureact build -i src/components
npx vureact build -i src/pages/Home.vue
```

### Expected

- React output generated for your project
- Same validation steps apply

### Troubleshooting

- Start small (directory-level migration)
- Complex routing → use manual adaptation

### Success Criteria

- At least one core business flow runs in React

## Appendix A: Quick Commands

```bash
cd core/packages/compiler-core/examples/crm-ops-portal
npm install
npm run vr:build

cd .vureact/react-app
npm install
npm run dev
```

## Appendix B: Feature Coverage

- Templates: directives, events
- Components: `defineProps`, `defineEmits`, slots
- Script: `ref`, `computed`, `watch`
- DI: `provide` / `inject`
- Router: guards, links, views
- Styles: scoped, Sass

## Appendix C: Troubleshooting Index

- Router blank → Router Adaptation Guide
- Syntax coverage → Capabilities Overview
- Warnings → Best Practices
- Issues:
  - Compiler Issues
  - Router Issues
