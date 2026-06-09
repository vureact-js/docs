# CRM Admin Backend

This is a hands-on migration walkthrough designed to take you from a standard **Vue 3 + Vue Router** admin project to a complete VuReact migration cycle.

In this guide, you will learn:

- how to clone and install the example repository
- how to locate the key migration files through the project structure
- how to run the build and inspect the generated React output
- how to start the generated application and verify business flows

If you want to try it online first, use the links below:

- Repository: <https://github.com/vureact-js/example-crm-admin-backend>
- Live demo: <https://codesandbox.io/p/github/vureact-js/example-crm-admin-backend/master>
- Preview: <https://r862dm-5173.csb.app>

## Project structure overview

Start by getting a high-level view of the admin project layout. The source tree looks roughly like this:

```text
crm-admin-backend/
├─ package.json
├─ vureact.config.ts
├─ vite.config.ts
├─ index.html
├─ public/
│  ├─ config.js
│  ├─ logo.png
│  └─ File
├─ git-shells/
│  ├─ git-sync-hub.sh
│  └─ git-sync-hub.en.sh
└─ src/
   ├─ main.ts
   ├─ App.vue
   ├─ styles/
   │  └─ app.scss
   ├─ data/
   │  ├─ mock.ts
   │  └─ mock-api.ts
   ├─ components/
   │  ├─ CustomerTable.vue
   │  ├─ ThemeCard.vue
   │  ├─ FilterBar.vue
   │  └─ ...
   ├─ pages/
   │  ├─ Dashboard.vue
   │  ├─ Customers.vue
   │  ├─ LeadsPipeline.vue
   │  ├─ TasksBoard.vue
   │  ├─ NotificationsCenter.vue
   │  ├─ ApprovalsCenter.vue
   │  ├─ Settings.vue
   │  └─ auth/
   │     ├─ Login.vue
   │     └─ Register.vue
   └─ router/
      ├─ index.ts
      └─ routes.ts
```

The files you should focus on first are:

- `src/main.ts` — it controls how the source app entry is compiled into a React entry
- `src/router/index.ts` — it determines how routing is wired into VuReact’s adapter layer
- `src/data/mock-api.ts` — it drives the simulated backend state changes used by the demo
- `src/pages/` — the pages here represent the main business flows you’ll verify

## Step 1: Clone the repo and install dependencies

Clone the repository and install dependencies:

```bash
git clone https://github.com/vureact-js/example-crm-admin-backend.git
cd crm-admin-backend
npm install
```

After installation, make sure the `package.json` scripts include:

```json
{
  "scripts": {
    "vr:watch": "vureact watch",
    "vr:build": "vureact build"
  }
}
```

### Key points

- This is a normal admin project, so it’s ideal for running the full source → output → launch → validation workflow.
- Unlike mixed Vue/React projects, this example is best for observing routing, pages, and state interactions in the generated React output.
- If installation fails, first check your Node.js version, npm setup, and network access.

### Success criteria

- `npm install` completes without blocking errors
- the repository root recognizes `vureact.config.ts`
- you can proceed to `npm run vr:build`

## Step 2: Run a full build cycle

Run a complete build first:

```bash
npm run vr:build
```

If you want to keep seeing updated output while editing source files, start watch mode instead:

```bash
npm run vr:watch
```

### What to expect

- build statistics appear in the console
- a `.vureact/react-app` directory is generated at the project root
- the produced React output preserves a structure similar to the original Vue source

### Key points

- this step is about verifying the compiler can consistently generate the output, not about checking the UI yet
- if the output directory doesn’t appear, first review `vureact.config.ts`
- the project includes common admin patterns like routing, forms, lists, and dashboards, so a successful build makes later validation much clearer

### Troubleshooting

- if the build fails, inspect the source for syntax or configuration issues
- if the output folder is missing, confirm the command ran from the project root
- if watch mode doesn’t sync, verify the watcher process is still running

### Success criteria

- `.vureact/react-app` is generated successfully
- repeated runs of `npm run vr:build` produce stable output

## Step 3: Understand the key files

This step helps you identify the entry points to watch during migration.

### 1. Routing entry

`src/router/index.ts` is one of the most important files. It handles route guards, page transitions, and the adapter entry, and it is often the first place to check during validation.

When route adaptation is enabled, the config usually points explicitly to it:

```ts
router: {
  configFile: 'src/router/index.ts',
}
```

### 2. Business state entry

`src/data/mock-api.ts` and `src/data/mock.ts` define the demo state and actions for the backend scenario. Understanding these files makes it much easier to follow page interactions.

### 3. Page entry points

The main business validation surface lives under `src/pages/`:

- `Dashboard.vue`
- `Customers.vue`
- `LeadsPipeline.vue`
- `TasksBoard.vue`
- `NotificationsCenter.vue`
- `ApprovalsCenter.vue`
- `Settings.vue`
- `auth/Login.vue`
- `auth/Register.vue`

### Key points

- review routing first, then state, then pages
- for admin-style projects, issues are often caused by page navigation, guards, or state update flow rather than a single component
- if you can clearly explain which page reads which state and which actions update it, validation becomes straightforward

## Step 4: Start the generated React app

Open the generated React project and start the dev server:

```bash
cd .vureact/react-app
npm install
npm run dev
```

### What to expect

- Vite dev server starts successfully
- the browser opens to the login page first
- after login, you can access the CRM main interface
- changes to the Vue source continue to sync into the React output

### Key points

- this step verifies that the generated output can run independently
- for a standard admin app, routing and page interaction are the first things to confirm
- treat the React output as generated artifacts for validation, not as the primary source to edit directly

### Success criteria

- `npm run dev` launches successfully
- the app navigates from login into the business interface
- source edits continue to reflect in the generated output

## Step 5: Complete the business validation

Once the app is running, validate it using the following flow:

### What you should be able to do

- sign in from the login page and enter the system
- open Dashboard, Customers, LeadsPipeline, TasksBoard, NotificationsCenter, ApprovalsCenter, and Settings pages
- perform filtering, keyword search, and single-item actions in the notifications center
- create, approve, reject, and review history in the approvals center
- observe approval updates in the leads pipeline
- observe blocking and collaboration notifications on the task board
- see summary data update on the dashboard

### What to pay attention to

- whether route guards allow the login page but block business pages when appropriate
- whether actions in `mock-api` drive page data changes
- whether lists, boards, and summary widgets update as state changes

### Troubleshooting

- if the app returns to login after signing in, check route guards and session state first
- if data does not refresh, confirm the page is calling the correct `mock-api` functions
- if a board does not update, verify the state is written correctly and subscribed by the page

### Success criteria

- core flows for login, routing, notifications, approvals, leads, tasks, and dashboard all work
- you can clearly explain which state and actions each page depends on
- you have completed a full validation cycle from Vue source to React output

## Summary

This example is not about memorizing the folder tree; it is about following a practical step-by-step workflow to run an admin project from source through validation.

If you complete clone, install, build, launch, and validate in that order, you have completed the standard VuReact migration workflow: get the build working first, then get the generated output running, then verify it through business flows.

## Appendix: Troubleshooting references

- Routing errors: [Router Adaptation Guide](/en/guide/router-adaptation)
- Build warning guidance: [Compilation Specification](/en/guide/specification)
- Report issues:
  - [Compiler Issues](https://github.com/vureact-js/core/issues)
  - [Router Issues](https://github.com/vureact-js/vureact-router/issues)
