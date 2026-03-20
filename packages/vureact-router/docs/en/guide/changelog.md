# Changelog

## v1.1.0 - 2026-03-20

### Added

- The `component` option in route configuration now supports direct use of React component functions (e.g., `component: App`)

### Changed

- Refactored the `convertRoute` function to improve handling logic for component types
- Updated the `RouteConfig` type definition; `ComponentType` now supports `FunctionComponent` type
- Improved the `buildResolvedTo` function to enhance robustness of path resolution and null value handling
- Improved code organization structure to increase maintainability and readability

### Fixed

- Fixed type import paths to ensure correct module dependencies
- Improved route matching logic to ensure more accurate route resolution
- Fixed component rendering logic to correctly handle various component types

---
