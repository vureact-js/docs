# Customer Support Hub (Hybrid Development)

This is a practical migration walkthrough for a multi-channel customer support admin app, designed to show VuReact’s hybrid and transformation capabilities in a realistic backend scenario.

In this guide, you will learn:

- how to clone and launch the example repository
- how to inspect the project structure and find the key migration files quickly
- how to use `build` and `watch` to inspect the generated output
- how to start the React output and verify business flows

Key hybrid technology stack:

- Vue 3
- Vue Router 4
- Ant Design 6（React）
- Zustand（React）

If you want to try it online first, use these links:

- Repository: <https://github.com/vureact-js/example-customer-support-hub>
- Live demo: <https://codesandbox.io/p/github/vureact-js/example-customer-support-hub/master?import=true>
- Preview: <https://skx7pn-5173.csb.app/>

## Project structure overview

Before you start, get a high-level picture of the project layout. The source structure looks roughly like this:

```text
customer-support-hub/
├─ package.json
├─ vureact.config.ts
├─ vite.config.ts
├─ index.html
└─ src/
   ├─ main.ts
   ├─ App.vue
   ├─ styles/
   │  └─ app.scss
   ├─ data/
   │  ├─ mock.ts
   │  └─ mock-api.ts
   ├─ store/
   │  └─ useAppStore.ts
   ├─ components/
   │  ├─ ConversationPanel.vue
   │  ├─ TicketFilterBar.vue
   │  ├─ TicketTimeline.vue
   │  └─ ...
   ├─ pages/
   │  ├─ Dashboard.vue
   │  ├─ TicketsList.vue
   │  ├─ TicketDetail.vue
   │  ├─ Customers.vue
   │  ├─ Agents.vue
   │  ├─ ConversationCenter.vue
   │  ├─ KnowledgeBase.vue
   │  ├─ SlaBoard.vue
   │  ├─ Settings.vue
   │  └─ auth/Login.vue
   └─ router/
      ├─ index.ts
      └─ routes.ts
```

Three files are especially important:

- `src/main.ts` is the source entry point that will be compiled into the React entry.
- `src/router/index.ts` is the routing adaptation entry.
- `src/store/useAppStore.ts` manages cross-page state and is one of the most important files for validating business flows.

## Step 1: Clone the repo and install dependencies

Clone the repository and install dependencies:

```bash
git clone https://github.com/vureact-js/example-customer-support-hub.git
cd customer-support-hub
npm install
```

After installation, confirm that `package.json` contains these scripts:

```json
{
  "scripts": {
    "vr:watch": "vureact watch",
    "vr:build": "vureact build"
  }
}
```

### Key points

- this example follows a workflow where you maintain the Vue source and verify the React output
- the migration starts with getting the build loop working, not by editing the generated output
- if installation fails, first check Node.js, npm, and network connectivity

### Success criteria

- `npm install` completes without blocking errors
- the repository root recognizes `vureact.config.ts`
- you can proceed to `npm run vr:build`

## Step 2: Run a full build cycle

Run a complete build first:

```bash
npm run vr:build
```

If you want to keep seeing updated output while you edit source files, start watch mode:

```bash
npm run vr:watch
```

### What to expect

- build statistics appear in the console
- a `.vureact/react-app` directory is generated at the project root
- the generated React output keeps a directory structure similar to the Vue source

### Key points

- this step is about verifying the compiler can consistently produce the React app, not about checking the UI yet
- if the output directory is missing, verify that `vureact.config.ts` exists and is correct
- this example may apply post-build output adjustments, so rely on the final generated entry and stylesheet imports

### Troubleshooting

- if the build fails, inspect the source for syntax or configuration issues
- if the output folder is missing, confirm the command ran from the project root
- if watch mode doesn’t sync, check that the watcher process is still running

### Success criteria

- `.vureact/react-app` is generated successfully
- repeated runs of `npm run vr:build` produce stable output

## Step 3: Understand the key files

This step is not about reading every file in detail; it is about knowing which files to watch during migration.

### 1. Routing entry

`src/router/index.ts` should be your first stop because it defines how the app transitions from Vue routing into the React output:

```ts
router: {
  configFile: 'src/router/index.ts',
}
```

### 2. State entry

`src/store/useAppStore.ts` manages session state, filter conditions, activity streams, and other cross-page data. When the state flow works, page interactions usually work too.

### 3. Page entry points

The pages under `src/pages/` define the main business surface you will validate:

- `Dashboard.vue`
- `TicketsList.vue`
- `TicketDetail.vue`
- `Customers.vue`
- `Agents.vue`
- `KnowledgeBase.vue`
- `SlaBoard.vue`
- `Settings.vue`
- `auth/Login.vue`

### Key points

- inspect routing first, then state, then pages
- in migration scenarios, problems are more often caused by page/state interaction than by a single component
- if you can explain which page reads which state and which actions update it, validation becomes much easier

## Step 4: Start the React output

Open the generated React project and start the dev server:

```bash
cd .vureact/react-app
npm install
npm run dev
```

### What to expect

- the Vite dev server starts successfully
- the browser opens to the login page first
- after logging in, you can access the customer support workspace
- changes to the Vue source continue to sync into the React output

### Key points

- this step verifies whether the generated output can run independently
- in a hybrid project, Vue source and React output exist in parallel but serve different roles
- treat the React output as generated artifacts for validation, not as the main source to edit

### Success criteria

- `npm run dev` launches successfully
- the app navigates from login into the business interface
- source edits continue to reflect in the generated output

## Step 5: Complete the business validation

Once the app is running, validate it using this flow:

### What you should be able to do

- sign in from the login page and enter the system
- open Dashboard, Tickets, Customers, KnowledgeBase, SlaBoard, and Settings pages
- filter, switch, and view ticket details in the ticket list
- view risk information on the customer page and observe state updates
- see risk status changes on the SLA board
- browse and search knowledge base content

### What to pay attention to

- whether session state drives login and route guards correctly
- whether ticket filters refresh the list as expected
- whether activity records update when ticket actions occur
- whether SLA board data updates after `slaConfig` changes

### Troubleshooting

- if the app returns to login after signing in, check route guards and session state first
- if list filters do not work, verify the filter state is written correctly to the store
- if the activity stream does not update, confirm the action calls the correct mock API

### Success criteria

- core flows for login, routing, filtering, details, SLA, and knowledge base all work
- you can clearly explain which state and actions each page depends on
- you have completed a full validation cycle from Vue source to React output

## Summary

This example is not about memorizing the file tree; it is about following the steps to complete a real migration cycle.

If you complete clone, install, build, launch, and validate in that order, you have established the minimum VuReact workflow: get the build working first, then get the generated output running, then verify it through business flows.

## Appendix: Troubleshooting references

- routing errors: [Router Adaptation Guide](/en/guide/router-adaptation)
- build warning guidance: [Compilation Specification](/en/guide/specification)
- report issues:
  - [Compiler Issues](https://github.com/vureact-js/core/issues)
  - [Router Issues](https://github.com/vureact-js/vureact-router/issues)
