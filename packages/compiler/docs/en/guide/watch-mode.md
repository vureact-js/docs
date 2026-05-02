# Watch Mode

Watch mode is suitable for local development: it first performs a build, then stays resident to listen for file changes, continuously syncing Vue-side changes to the React output directory.

If you haven't completed the basic installation and configuration yet, it's recommended to read [Quick Start](/en/guide/quick-start) first.

## Basic Usage

```bash
npx vureact watch
```

You can also add it to `package.json` like any regular frontend project:

```json
{
  "scripts": {
    "vr:watch": "vureact watch"
  }
}
```

```bash
npm run vr:watch
```

## What Happens After Starting

`watch` does not mean "only listen, don't compile." Instead, it works in the following order:

1. First, executes a `build` process to generate the latest React output.
2. Reuses the cache, skipping unchanged files.
3. Enters a resident listening state, waiting for subsequent file changes.

Typical output looks like this:

```bash
# Example
10:53:49 [hrm] Watching for file changes...
```

This means:

- The first startup is not necessarily a "full" compilation — if the cache is still reusable, it will directly use [incremental](/guide/incremental-compilation) compilation.
- Before listening starts, the React output directory is already prepared and can be used directly with `npm run dev`.

## Watch Scope

The watcher only monitors the directory or files specified by `input`.

For example, with this configuration:

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: './src',
});
```

Then during watch mode, it will monitor the `src` directory in real time.

This is important to note:

- Changes to Vue files, scripts, styles, and assets under `src` will be processed immediately.
- Files outside the `input` scope, such as `public/` in the project root, will not be monitored in real time.
- Resources in such directories will still be scanned and copied during the initial `build` on startup, but subsequent modifications will typically require re-running `npx vureact build` or adjusting your directory structure.

## What Triggers After a Change

In watch mode, saving a file triggers the corresponding incremental processing.

### Vue / Script / Style Files

When `.vue`, `.js`, `.ts`, `.less`, `.scss`, or `.sass` files under `input` change, the corresponding output is regenerated.

```bash
# Example
10:56:51 [vureact] Compiled src/App.vue (20 ms)
10:57:52 [vureact] Compiled src/components/Card.vue (24 ms)
10:58:53 [vureact] Compiled src/app.scss (32 ms)
10:59:54 [vureact] Compiled src/router/index.ts (12 ms)
```

The key feature here is "single-file incremental":

- Only the file that changed is processed.
- Modifying one component will not trigger a full project recompilation.

### Asset Files

For static assets that do not go through the compilation pipeline, watch will copy them to the output directory.

```bash
# Example
11:01:56 [vureact] Copied Asset src/images/avatar.svg
11:02:17 [vureact] Copied Asset src/mock/banner.json
```

Common scenarios include:

- Image assets
- Font files
- JSON data files
- Other files that need to be copied as-is to the output directory

## Behavior When Deleting Files

When a file or directory is deleted, watch will **clean up the corresponding output and cache records synchronously**, rather than leaving stale files in the output directory.

```bash
11:03:40 [vureact] Removed src/images/avatar.svg
11:04:22 [vureact] Removed src/components/Card.vue
```

This is especially important for progressive migration, as the output directory will always try to stay in sync with the source directory.

## Recommended Workflow

During local development, you typically run two terminals:

1. Run `npx vureact watch` in the Vue source project root
2. Run the React development server in the output directory

```bash
cd .vureact/react-app
npm install
npm run dev
```

Your workflow will then be:

1. Write Vue code in `src/`
2. VuReact generates the corresponding React output in real time
3. The Vite React dev server automatically hot-reloads the page

## Optional: Execute Custom Logic After Changes

If you want to perform notifications, logging, additional syncing, or other operations after watch successfully processes a compiled file, you can use `onChange`:

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: './src',
  onChange: async (event, unit) => {
    console.log(`[${event}] ${unit.file}`);
  },
});
```

Suitable for:

- Printing custom logs
- Triggering external scripts
- Integrating with internal team development tools

## When to Prefer Watch

Scenarios where `watch` is recommended:

- You are doing local development and need to continuously see React-side results
- You are doing progressive migration and want to verify changes as you go
- You want to split "compilation" and "running the React app" into two long-running processes

Scenarios where `build` alone is more appropriate:

- CI / release pipelines
- One-time output generation
- No need for persistent file watching

## Common Troubleshooting

### File changes are not syncing

First check the following:

1. Whether the modified file is located within the `input` directory.
2. Whether the file is excluded by `exclude`.
3. Whether the `vr:watch` process is still running.
4. Whether you are looking at the latest output in `.vureact/react-app`.

### Why does watch also show `Cached` on startup

Because watch performs a build first, and build has caching enabled by default. So if the previous compilation result is still reusable, you will see:

```bash
# Example
↷ Cached: 24 unchanged file(s)
```

This is normal behavior — it means startup is faster, not that something was missed.
