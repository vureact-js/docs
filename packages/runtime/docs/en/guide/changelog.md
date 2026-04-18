# Changelog

`@vureact/runtime-core` adheres to the [Semantic Versioning 2.0.0](http://semver.org/) specification, and versions are listed in reverse chronological order.

## v1.1.0 (2026-04-17)

### ✨ Features

- Added `defineAsyncComponent` async component adapter utility (including type definitions and test cases)
- Refactored the `Suspense` component into a modular structure with added context support
- Added `Suspense/Content.tsx` and `Suspense/Fallback.tsx` subcomponents

## v1.0.1 (2026-03-05)

### 🚀 Improvements

- Restructured the README documentation, with Chinese as the primary language and English as the alternative
- Optimized project homepage links by removing language suffixes and unifying with the main domain name

### 🐞 Bug Fixes

- Corrected GitHub repository directory path configuration (repository.directory)

## v1.0.0 (2026-03-04)

### 🚩 Milestone

The first official release, completing the upgrade from Beta to production-ready version.

### ⚡ Core Features

- Reactive System: Adapted to Vue 3's complete reactive API (implemented based on Valtio), providing hooks such as `useReactive`/`useVRef`/`useComputed`
- Built-in Components: Adapted Vue-style components like `<KeepAlive>`/`<Transition>`/`<Teleport>`/`<Suspense>`
- Directive Utilities: Provided Vue-style binding utilities such as `vCls`/`vStyle`/`vOn`/`vKeyless`
- Modular Architecture: Split into main package, adapter components/hooks/utilities and other modules

### 🚀 Improvements

- Upgraded version number from 1.0.0-beta to 1.0.0
- Optimized dependencies (using valtio as the reactive engine, react-transition-group for animation support)
- Standardized API naming (e.g., `useRefState` → `useVRef`, `useCtx` → `useInject`, etc.)

### 🐞 Bug Fixes

- Fixed shallow proxy circular reference and proxy metadata processing issues
- Improved type definitions for all reactive APIs

### Technology Stack

- Core Dependencies: valtio, react-transition-group
- Development Tools: TypeScript, Rollup, Jest
- Compatibility: React 18+, TypeScript 4.9+, supporting both ESM/CJS formats

> For full details of 1.0.0, refer to: [runtime-core CHANGELOG.md](https://github.com/vureact-js/core/blob/master/packages/runtime-core/CHANGELOG.md)
