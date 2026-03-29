# Changelog

`vureact` adheres to the [Semantic Versioning 2.0.0](http://semver.org/) specification.

---

- The latest version is at the top
- Historical versions are listed in reverse chronological order
- For more complete release details, please refer to `packages/router/CHANGELOG.md` in the repository

---

## v2.0.0 - 2026-03-29

### ✨ New Features

- Removed the `@vureact/router/type-compat` subpath export. All Vue Router-style types are now exported from `@vureact/router`.
- Renamed types: `CreateRouterOptions` -> `RouterOptions`, `RouterInstance` -> `Router`, `RouteConfig` -> `RouteRecordRaw`.
- `useRouter()` now returns the main `Router` type, aligning semantically with the return value of `createRouter()`.
- Added `RouteLocationOptions` and standardized `RouteLocationRaw = string | RouteLocationOptions`.

### Migration Guide

Upgrading from v1.x to v2.0.0:

1. Change all `import type { ... } from '@vureact/router/type-compat'` to import from `@vureact/router`.
2. Update type names: `RouterInstance` -> `Router`, `CreateRouterOptions` -> `RouterOptions`, `RouteConfig` -> `RouteRecordRaw`.
3. Check usage of `useRouter()` to ensure no dependency on the old return type name.

## v1.1.1 - 2026-03-20

### 🐞 Bug Fixes

- Fixed the issue where the `component` option in route configuration could not correctly recognize React higher-order components such as `memo`, `forwardRef`, `lazy`

## v1.1.0 - 2026-03-20

### ✨ New Features

- The `component` option in route configuration now supports direct use of React component functions (e.g., `component: App`)

### 🚀 Improvements

- Refactored the `convertRoute` function to improve the processing logic for component types
- Updated the `RouteRecordRaw` type definition; `ComponentType` now supports the `FunctionComponent` type
- Improved the `buildResolvedTo` function to enhance the robustness and null value handling of path resolution
- Improved the code organization structure to enhance maintainability and readability

### 🐞 Bug Fixes

- Fixed type import paths to ensure correct module dependencies
- Improved route matching logic to ensure more accurate route resolution
- Fixed component rendering logic to correctly handle various component types
