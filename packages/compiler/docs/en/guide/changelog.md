# CHANGELOG

`vureact` follows [Semantic Versioning 2.0.0](sslocal://flow/file_open?url=http%3A%2F%2Fsemver.org%2F&flow_extra=eyJsaW5rX3R5cGUiOiJjb2RlX2ludGVycHJldGVyIn0=). Versions are in descending chronological order.

## v1.6.0 (2026-04-13)

### ✨ Features

- Add SFC metadata collection: Collect props, emits, and options metadata during parsing
- Add `useAttrs` transformation: Convert Vue `useAttrs()` to React props; automatically assert as `Record` type in TypeScript to isolate original props type hints
- Add TypeScript intersection type support: Automatically append `Record` intersection type to props when `useAttrs` is used to ensure type integrity

### 🐞 Bug Fixes

- Fix import injection conflicting with top comments, align comments and import statements
- Fix incorrect migration of `<template>` nodes with specific directives
- Fix `:key` not properly transferred from `<template>` node to its first child
- Fix function fields in SFC top-level TypeScript declarations incorrectly converted to `ReactNode` type

### 🚀 Optimizations

- Refactor script metadata collection logic; modularize for better maintainability and extensibility

## v1.5.2 (2026-04-08)

### 🐞 Bug Fixes

- Fixed non-functional output from incomplete traditional `<script>` syntax conversion; now throws clear compile-time error

### 🚀 Optimizations

- Removed incomplete handling logic for traditional syntax to prevent runtime errors

## v1.5.1 (2026-04-04)

### 🐞 Bug Fixes

- Fixed messy comment alignment in output; optimized code generation
- Fixed missing import quotes when Babel minified is off; adjusted config handling
- Fixed incorrect static hoisting of non-const simple literals; refined hoisting logic
- Fixed collision between injected top imports and top comments; adjusted injection logic

### 🚀 Optimizations

- Removed unused `@vr` special comments from output
- Disabled default script minification to preserve readability

## v1.5.0 (2026-03-30)

### ✨ Features

- Added `output.packageJson` option for customizing output package.json

### 🐞 Bug Fixes

- Fixed non-standard event names and handler wrapping; standardized processing
- Fixed incorrect slot type rewriting for non-SFC scripts; adjusted type handling scope
- Fixed unwanted `React.memo` / `dir` import injection; controlled injection precisely
- Fixed hanging process on Vite init failure; improved error exit
- Fixed Vue API misdetection with local variables; refined matching logic
- Fixed HTML dynamic attribute issues (string values, `data-*`, template literals); corrected conversion

### 🚀 Optimizations

- Removed warnings for `@import` in SFC style blocks
- Added clear errors for unsupported Vue APIs
- Replaced imported Vue type interfaces with `any` to avoid compatibility issues
- Optimized runtime import injection for better performance
- Mapped `vue-router` imports to `@vureact-router` and preserved type imports
- Updated runtime adapter to latest version; synced with compiler
- Optimized scoped style ID injection; skipped non-styled elements

## v1.4.0 (2026-03-22)

### ✨ Features

- Auto-inject router provider in React entry
- Added cross-process file lock via `proper-lockfile` for concurrent builds
- Supported custom Vite / React versions in `bootstrapVite`
- Auto-clean workspace on full build failure
- Supported TS config file `vureact.config.ts` with type hints
- Added batch cache update / cleanup
- Added SetupManager for dependency injection
- Added config loader & merger for flexible strategy

### 🐞 Bug Fixes

- Fixed build failure due to uninitialized Vite; improved init flow
- Fixed inaccurate dependency collection for top-level `useMemo` variables; collected root refs only
- Fixed CLI options overriding user config; merged strategically (paths only)
- Fixed JSON parse error on first build; improved cache reading
- Fixed concurrent file conflicts; ensured consistency via file lock
- Fixed cache loss breaking incremental build; optimized persistence
- Fixed missing workspace dir when Vite init is off; enforced creation
- Fixed static asset copy without cache; optimized asset cache & stats
- Fixed unremoved output / cache when style files deleted; improved cleanup

### 🚀 Optimizations

- Stopped collecting external imports as dependencies; reduced overhead
- Optimized inner dependency collection; avoided unconditional external function collection
- Added optional chaining for object access; prevented runtime crashes
- Simplified CLI to path-only options
- Improved CLI build statistics
- Refactored dependency analyzer; reduced unnecessary `useCallback`
- Modularized compiler architecture; functional config for better maintainability

### Removals

- Removed auto router guide output
- Removed behavior-related CLI options
- Removed templates directory
- Removed verbose comments

## v1.3.0 (2026-03-17)

### ✨ Features

- Added CLI version check on startup (using `update-notifier`)
- Auto-generated router setup guide

### 🐞 Bug Fixes

- Fixed missing `.value` for ref access in `v-for`
- Fixed event calls; standardized to optional `onClick?.()`
- Fixed missing optional chaining in dependency analysis
- Fixed cache bloat; stopped storing style source in cache
- Fixed missing shebang in CLI build

### 🚀 Optimizations

- Cleaned up example projects
- Updated README & FAQ
- Optimized build pipeline; better error handling & progress

## v1.2.1 (2026-03-15)

### 🐞 Bug Fixes

- Fixed `provide` conversion; improved Provider props
- Standardized event calls to optional invocation
- Fixed `v-model` event name generation
- Fixed wrong `scopeId` on `<template>` / `<slot>`
- Fixed slot scope param types; supported hyphenated fields
- Fixed missing `type` modifier for `ReactNode` imports
- Fixed Vue Router history API mapping
- Fixed `emit` formatting; supported `update:xxx` → `onUpdateXxx`
- Fixed `provide` processing order

## v1.2.0 (2026-03-06)

### ✨ Features

- Added `defineExpose` macro conversion
- Auto-wrapped components with `React.forwardRef` for `defineExpose`

### 🚀 Optimizations

- Optimized API adaptation
- Optimized component ref handling

## v1.1.1 (2026-03-05)

### 🐞 Bug Fixes

- Fixed un-renamed `.less`/`.scss` imports to `.css` with style preprocessors

## v1.1.0 (2026-03-05)

### ✨ Features

- Added standalone style compilation (Less, Sass)
- Auto-replaced style import extensions (e.g. `.scss` → `.css`)

### 🐞 Bug Fixes

- Fixed unexcluded root `yarn.lock`

## v1.0.4 (2026-03-05)

### 🐞 Bug Fixes

- Fixed slot typing; used `ReactNode` for default / non-scoped slots
- Fixed default exclude list not working when `ignoreAssets` unset

## v1.0.3 (2026-03-04)

### 🐞 Bug Fixes

- Fixed TSX component params; only included props when present
- Fixed special character escaping in template-to-JSX text

## v1.0.2 (2026-03-04)

### 🐞 Bug Fixes

- Added `@vureact/compiler-core` to exclude list in `VUE_PACKAGES`

## v1.0.1 (2026-03-04)

### 🐞 Bug Fixes

- Fixed production CLI entry path reference

## v1.0.0 (2026-03-03)

### 🎉 Milestone

- Initial release (code-name: Mind Control); Vue-to-React compilation ready for production

### ⚡ Core

- Full Vue SFC → React conversion (template / script setup / style)
- Composition API → React Hooks mapping
- Compile-time scoped / module CSS output
- Basic CLI (build / watch), cache, Vite init, hybrid development

> Details for 1.0.0: <https://github.com/vureact-js/core/blob/master/packages/compiler-core/CHANGELOG.md>
> Details for 1.0.0: <https://github.com/vureact-js/core/blob/master/packages/compiler-core/CHANGELOG.md>

- Basic CLI (build / watch), cache, Vite init, hybrid development

> Details for 1.0.0: <https://github.com/vureact-js/core/blob/master/packages/compiler-core/CHANGELOG.md>
> Details for 1.0.0: <https://github.com/vureact-js/core/blob/master/packages/compiler-core/CHANGELOG.md>
