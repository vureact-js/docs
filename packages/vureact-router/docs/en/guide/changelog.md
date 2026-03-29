# Changelog

`vureact` adheres to the [Semantic Versioning 2.0.0](http://semver.org/) specification.

---

- The latest version is at the top
- Historical versions are listed in reverse chronological order
- For more complete release details, please refer to `packages/router/CHANGELOG.md` in the repository

---

## v1.2.0 - 2026-03-29

### ✨ New Features

- Added subpath export `@vureact/router/type-compat` to provide type aliases compatible with Vue Router 4.x
- Added Vue Router compatible type aliases such as `RouteRecordRaw`, `Router`, `RouterOptions`

## v1.1.1 - 2026-03-20

### 🐞 Bug Fixes

- Fixed the issue where the `component` option in route configuration could not correctly recognize React higher-order components such as `memo`, `forwardRef`, `lazy`

## v1.1.0 - 2026-03-20

### ✨ New Features

- The `component` option in route configuration now supports direct use of React component functions (e.g., `component: App`)

### 🚀 Improvements

- Refactored the `convertRoute` function to improve the processing logic for component types
- Updated the `RouteConfig` type definition; `ComponentType` now supports the `FunctionComponent` type
- Improved the `buildResolvedTo` function to enhance the robustness and null value handling of path resolution
- Improved the code organization structure to enhance maintainability and readability

### 🐞 Bug Fixes

- Fixed type import paths to ensure correct module dependencies
- Improved route matching logic to ensure more accurate route resolution
- Fixed component rendering logic to correctly handle various component types
