# Progressive Migration

The goal of progressive migration is not to "translate" the entire Vue project into React at once, but to first establish a stable closed loop, then gradually expand the scope by directory, page, and module.

The recommended approach can be summed up in one sentence: **Get it running first, then expand the scope; migrate the business closed loop first, then fill in the edge details.**

## Minimal Strategy

For a typical Vue 3 + Vite project, the recommended approach is:

1. Compile only `src`
2. Exclude the Vue entry file `src/main.ts`
3. If the project uses Vue Router, [declare the route entry](/en/guide/router-adaptation)
4. Use `watch` to get a single page or directory working
5. After verifying the React output, continue expanding the migration scope

The minimal configuration usually looks like this:

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: './src',
  exclude: ['src/main.ts'],
  router: {
    configFile: 'src/router/index.ts',
  },
});
```

## Recommended Steps

### 1. Establish a Compilation Closed Loop First

Don't rush to modify business code right away. First, confirm that the project can build stably:

```bash
npx vureact build
```

Passing criteria:

- `.vureact/react-app` is generated successfully
- The output directory contains `src/main.tsx`
- Running `build` again can properly hit the cache

### 2. Then Switch to Watch Mode for Development

Once the initial build passes, switch to watch mode:

```bash
npx vureact watch
```

At the same time, start the React development server in the output directory:

```bash
cd .vureact/react-app
npm install
npm run dev
```

From here, you can continue writing Vue as usual, and VuReact will continuously sync the React output.

> If you run into issues, you can refer to the [FAQ](/en/guide/faq).

### 3. Start Migration from a Small Scope

Don't try to migrate everything at once. Prioritize targets like these for the first batch:

- An independent page
- A business directory
- A low-risk module

It is not recommended to start with:

- Global entry points
- The most complex permission flows
- Large amounts of legacy compatibility code

### 4. Verify the Main Flow First

After each batch of migration, only verify the most important business flows, such as:

- Whether the page renders correctly
- Whether route navigation works properly
- Whether forms, lists, and button events function correctly
- Whether state changes drive UI updates

Don't aim to polish every visual detail in the first pass.

## Recommended Migration Order

If you're unsure where to start, the recommended order is:

1. Pages and ordinary components
2. Style files
3. State and side-effect logic
4. Routes and guards
5. Edge-case pages, complex interactions, legacy code

The core reason for this order: the earlier items help build confidence quickly, while the later items are better handled after the closed loop is already working.

## A Few Key Conventions

To make progressive migration more stable, it's recommended to always follow these rules:

- Keep the original Vue directory structure — don't restructure directories while migrating
- Exclude the Vue entry file first — don't let the compiler take over `createApp(...).mount(...)`
- For projects with routing, configure `router.configFile` as a priority
- Continuously use `watch` — don't manually trigger full recompilation after every change
- When encountering issues, first narrow down the scope to determine whether it's a single-file problem or a full-pipeline issue

## Common Misconceptions

### Migrating Everything at Once

This usually mixes "compilation issues, routing issues, style issues, and business issues" all together, making debugging very costly.

### Modifying React First, Then Going Back to Vue

VuReact's recommended approach is to continue maintaining the Vue source code and treat the React output as a compilation result to verify, rather than modifying the output as the primary source.

### Compiling the Entry Point as Well

Most progressive migration projects should first exclude `src/main.ts`, otherwise it can easily conflict with the existing Vue mounting logic.

## One-Page Checklist

Before you begin, confirm:

- `@vureact/compiler-core` is installed
- A `vureact.config.ts` file exists in the project root
- `exclude` excludes `src/main.ts`
- For routing projects, `router.configFile` is configured

During execution, confirm:

- `npx vureact build` succeeds
- `npx vureact watch` is running
- `.vureact/react-app` can start with `npm run dev`

During verification, confirm:

- At least one page is accessible normally
- At least one core interaction flow is working
- After modifying a Vue source file, the React page updates accordingly
