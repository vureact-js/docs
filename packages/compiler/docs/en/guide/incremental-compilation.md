# Incremental Compilation

VuReact's incremental compilation is not the same as watch mode. Even if you repeatedly run `build`, as long as the cache is enabled, the compiler will automatically skip unchanged files.

This is also one of the key capabilities that keeps VuReact highly efficient in gradual migration scenarios.

## Most Common Usage

```bash
npx vureact build
```

You can also add it to `package.json` like any regular frontend project:

```json
{
  "scripts": {
    "vr:build": "vureact build"
  }
}
```

```bash
npm run vr:build
```

When a reusable cache exists, you'll see output similar to this:

```bash
VUREACT x.x.x

✔ Build completed in 120 ms
↷ Cached: 24 unchanged file(s)

📦 Output: .vureact/react-app
```

Here, `Cached: 24 unchanged file(s)` means: 24 files were determined to have "no actual changes" and were therefore skipped without recompilation.

## What Does "Incremental" Mean

Incremental compilation essentially means:

- On the first compilation, record file metadata and cache information
- On subsequent compilations, only process files that have actually changed
- For unchanged files, directly reuse the previous compilation result

VuReact handles several types of inputs separately:

- `.vue` single-file components
- `.js` / `.ts` and other script files
- `.css` / `.less` / `.scss` / `.sass` and other style files
- Static asset files that need to be copied

That is, incremental capabilities cover not only Vue components but also scripts, styles, and asset synchronization.

## How Cache Hits Are Determined

VuReact first compares basic file metadata:

- File size
- Modification time

If neither of these has changed, the file is skipped directly.

If the metadata has changed, the compiler will further compare the content hash to avoid triggering unnecessary recompilation for files that "appear modified but haven't actually changed."

You can think of it as a two-tier check:

1. First, quickly filter using metadata
2. Then, when necessary, verify precisely using content hash

This gives it both speed and accuracy.

## Where Cache Files Are Stored

By default, the cache is written to:

```txt
.vureact/cache/_metadata.json
```

If your configuration is:

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  output: {
    workspace: '.vureact',
  },
});
```

Then:

- The React output is typically located at `.vureact/react-app`
- The compilation cache is located at `.vureact/cache/_metadata.json`

As long as this cache file still exists and the source files have not actually changed, the next `build` or `watch` startup can reuse it directly.

## A Typical Workflow

### First Execution

```bash
npx vureact build
```

The first run typically processes all input files, since no cache is available yet.

### Modify a Few Files and Run Again

For example, if you only changed:

- `src/App.vue`
- `src/styles/app.scss`

Run again:

```bash
npx vureact build
```

At this point, the compiler usually only reprocesses these two files, while other unchanged files are counted under `Cached`.

This is why in medium-to-large projects, build times often decrease significantly after multiple runs.

## Relationship with Watch Mode

The relationship between the two can be understood as follows:

- `build`: Performs a one-time compilation, but by default also supports incremental caching
- `watch`: First runs `build`, then stays resident to listen for file changes, incrementally processing individual files afterward

In other words:

- Incremental compilation is a capability
- `watch` is simply another way to run using this capability

If you'd like to learn more about the behavior during continuous file watching, continue reading [Watch Mode](/en/guide/watch-mode).

## When the Benefits Are Most Obvious

Incremental compilation provides the greatest benefit in the following scenarios:

- The project has many files and a full compilation is costly
- You only change a few pages or components each day
- You are in the process of gradual migration and need to frequently run builds
- There are many asset files and you don't want to copy all of them every time

## How to Explicitly Control the Cache

By default, `cache` is set to `true` and usually requires no additional configuration:

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: 'src',
  cache: true,
});
```

If you want to disable caching, you can also turn it off explicitly:

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: 'src',
  cache: false,
});
```

Disabling it will have the following effects:

- `build` will no longer reuse previous cache
- The `Cached: ...` statistic will no longer appear
- Every change will force reprocessing of all files

It is generally only recommended to temporarily disable caching in these cases:

- You are debugging cache-related issues
- You want a completely fresh build for a specific one-time build
- You have manually cleared the local workspace cache and want to explicitly verify behavior

## What About Deletions and Renames

VuReact not only caches "additions and modifications" but also handles "deletions":

- When a source file is deleted, the corresponding React output is also removed
- The related cache records are cleaned up as well

Therefore, during gradual migration, the output directory won't become cluttered with historical files.

When renaming a file, you can think of it as:

1. The old path is deleted
2. The new path is added and compiled fresh

## Performance Tips

If you want incremental compilation to be as stable and fast as possible, consider the following:

1. Avoid manually deleting `.vureact/cache` frequently
2. Keep the `input` as focused as possible on the directories that actually need compilation
3. Use `exclude` to exclude Vue entry points, build outputs, and irrelevant directories
4. In gradual migration projects, keep the workspace directory stable and avoid switching output locations repeatedly

## Frequently Asked Questions

### Why do I see `Cached` when running `build`

This is normal behavior because `build` itself supports incremental caching — you don't need to enter watch mode to benefit from it.

### What happens after deleting `.vureact`

Once the cache and output directories are cleared, the next build will fall back to a full compilation and then rebuild the cache.

### Can incremental compilation miss changes

Under normal circumstances, no. VuReact does not just compare file modification times and sizes; when necessary, it also compares content hashes to minimize the chance of false negatives.
