# Changelog

`vureact` adheres to the [Semantic Versioning 2.0.0](http://semver.org/) specification.

---

- The latest version is at the top
- Historical versions are listed in reverse chronological order
- For more complete release details, please refer to `core/packages/compiler-core/CHANGELOG.md` in the repository

## v1.5.0

`2026-03-30`

### ✨ Features

- Added `output.packageJson` option: Supports custom configuration of the generated `package.json` content for more flexible package management.

### 🐞 Bug Fixes

- Fixed the issue where some event names were not normalized and event handlers were not properly wrapped: Improved event handling logic to ensure consistent event name formatting.
- Fixed the issue where top-level slot type rewriting was not skipped for non-SFC script files: Optimized type handling logic to avoid unnecessary type modifications for non-SFC files.
- Fixed the issue where `React.memo` imports were incorrectly injected into script files: Improved import injection logic to prevent erroneous injection of unnecessary React APIs.
- Fixed the issue where the terminal process did not exit after Vite initialization failure: Improved error handling flow to ensure proper process exit on failure.
- Fixed the issue where `dir` utility imports were incorrectly injected into script files: Optimized import analysis to avoid injecting unnecessary utility packages.
- Fixed the issue where the adapter mistook local variables with the same name as Vue APIs: Improved Vue API detection logic to avoid conflicts with local variables.
- Fixed the formatting error when dynamic HTML attribute values were string types: Improved attribute value processing to ensure correct conversion of string types.
- Fixed the issue where HTML `data-*` attributes were not converted to camelCase when used as dynamic attributes: Improved dynamic attribute processing to ensure correct camelCase conversion of `data-*` attributes.
- Fixed the issue where HTML attribute values using template literals were compiled as plain text: Improved attribute value processing logic to ensure template literals are preserved correctly.

### 🚀 Optimizations

- No longer warn about `@import` in SFC style blocks: Simplified style processing and reduced unnecessary warning messages.
- Added error alerts for unsupported Vue APIs: Provided clearer error prompts to help users identify unsupported APIs.
- Replaced all imported Vue type interfaces with `any`: Simplified type handling to avoid type compatibility issues.
- Optimized processing logic for runtime import injection: Improved runtime import injection mechanism to enhance compilation efficiency.
- `vue-router` imports are no longer removed; they are mapped to `@vureact-router` while preserving type imports: Improved route import processing to ensure type integrity.
- Bumped the runtime adapter package version to the latest 1.5.0: Kept the runtime package synchronized with the compiler version.
- Optimized scoped style ID injection logic: Avoid injecting `scopeId` into unnecessary elements such as pure structural elements that don't require styles.

## v1.4.0

`2026-03-22`

### ✨ Features

- Added React product entry file injection of route provider: Automatically inject route provider into compiled React projects to simplify route configuration
- Added file lock read/write mechanism: Implemented cross-process file locks based on `proper-lockfile` to resolve data inconsistency issues in concurrent compilation scenarios
- Added support for specifying Vite and React versions in `bootstrapVite` options: Allows users to customize the installed versions of Vite and React
- Added automatic removal of workspace products after full compilation failure: Automatically cleans incomplete outputs when compilation fails to keep the workspace clean
- Added support for TypeScript-typed vureact configuration files: Supports `vureact.config.ts` configuration files to provide better type hints
- Added batch cache update functionality: Optimized cache management to support batch updating and cleaning of cache records
- Added SetupManager architecture: Refactored compiler manager dependency injection to provide clearer dependency management
- Added configuration loader and merger: Separated configuration loading logic to support more flexible configuration merging strategies

### 🐞 Bug Fixes

- Fixed project build failure caused by uninitialized Vite: Improved Vite initialization process with better error handling
- Fixed imprecise internal dependency collection for top-level variable declarations optimized to `useMemo`: Improved dependency analyzer to only collect referenced root variables
- Fixed top-level variable declarations optimized to `useMemo` not being recognized as collectible dependencies when used elsewhere: Optimized dependency identification logic
- Fixed compiler CLI options always overriding user configurations: Improved configuration merging strategy where CLI options only override necessary path-related configurations
- Fixed JSON parsing errors during initial compilation: Improved cache file reading with better error recovery
- Fixed data inconsistency caused by multiple processes operating on the same file in concurrent compilation scenarios: Ensured data consistency through file lock mechanism
- Fixed partial cache data loss during each full compilation, leading to invalid incremental compilation: Improved cache persistence logic
- Fixed workspace directory not being created when Vite initialization is disabled: Ensured workspace directory is always created correctly
- Fixed static asset copying not being optimized with caching during each compilation: Improved asset manager cache logic
- Fixed corresponding product files not being deleted after removing original style files: Enhanced cleanup manager to support style file cleanup
- Fixed cache records not being updated after deleting files and recompiling: Improved cache update mechanism
- Fixed repeated build showing processed file count even when static assets have no changes, and unchanged assets not being counted in cache: Optimized asset processing statistics
- Fixed failure to synchronously delete corresponding product files and cache records after deleting style files: Improved style file cleanup process

### 🚀 Optimizations

- Optimized external imports to no longer be collected as dependencies: Reduced unnecessary dependency collection to improve compilation performance
- Optimized internal function dependency collection to no longer unconditionally collect all external functions: Only collect analyzed functions to reduce misjudgment
- Optimized dependency collection for object access patterns by adding an optional chaining layer of protection: Prevent runtime crashes caused by null value access
- Optimized CLI to only retain necessary path-related options: Simplified CLI interface and removed behavior-related configurations
- Optimized cache maintenance process for static assets: Improved asset cache management to enhance performance
- Optimized CLI statistics after full compilation: Provided clearer compilation statistics reports
- Optimized dependency analyzer: Refactored route configuration to improve compilation quality and reduce unnecessary `useCallback` wrapping
- Optimized compiler architecture: Introduced modular types and functional configurations to improve code maintainability

### ♻️ Removals

- Removed the function of automatically outputting route adaptation guides in project engineering: Simplified output, as route configuration is now implemented via injected providers
- Removed all behavior-related configuration options from CLI: Simplified CLI interface, retaining only necessary path configurations
- Removed compiler templates directory: Deleted unused route configuration template files
- Removed a large number of verbose comments and simplified class/method documentation: Kept code concise and improved readability

## v1.3.0

`2026-03-17`

### ✨ Features

- Added CLI update check functionality to automatically check for new versions on startup
- Added route configuration documentation that automatically generates configuration guides when using routes
- Added support for the `update-notifier` dependency

### 🐞 Bug Fixes

- Fixed ref variable access in `v-for` loops by automatically adding the `.value` suffix
- Fixed event call conversion to uniformly use optional calls (`onClick?.()`)
- Fixed optional chaining protection in dependency analysis to avoid runtime errors caused by ref.value access
- Fixed cache management to avoid storing style source code and reduce cache volume
- Fixed CLI build configuration to ensure correct shebang injection

### 🚀 Optimizations

- Optimized sample project structure by removing old sample projects
- Updated README documentation to improve project description and badge layout
- Updated FAQ documentation to supplement answers to common questions
- Optimized compilation pipeline execution flow with improved error handling and progress display

## v1.2.1

`2026-03-15`

### 🐞 Bug Fixes

- Fixed `provide` conversion logic and improved property handling of Provider components
- Fixed event call conversion to uniformly make event calls optional (`onClick?.()`)
- Fixed event name generation logic in `v-model` conversion
- Fixed issue where `scopeId` should not be injected into `template` and `slot` exit nodes in templates
- Fixed slot scope parameter type definitions to support fields with illegal identifiers such as hyphens
- Fixed imports of types like `ReactNode` to ensure the `type` modifier is added correctly
- Fixed adaptation mapping for Vue Router history mode API
- Fixed `emit` event name formatting to support `update:xxx` -> `onUpdateXxx` conversion
- Fixed `provide` processing order to ensure original calls are collected and removed before renaming
- Fixed style scoped attribute injection logic to avoid incorrect injection on specific nodes

## v1.2.0

`2026-03-06`

### ✨ Features

- Added conversion handling for the `defineExpose` macro API
- Added wrapping of components with `React.forwardRef` when `defineExpose` is used

### 🚀 Optimizations

- Optimized API adaptation processing
- Optimized handling of component refs

## v1.1.1

`2026-03-05`

### 🐞 Bug Fixes

- Fixed issue where the suffix of imported `.less`/`.scss` files in style files was not replaced with `.css` when style preprocessing is enabled

## v1.1.0

`2026-03-05`

### ✨ Features

- Added separate compilation processing for style files such as `.less` and `.sass`
- Supported replacing imported style files (e.g., `.scss`) in files with `.css`

### 🐞 Bug Fixes

- Fixed exclusion of the `yarn-lock` file in the project root directory

## v1.0.4

`2026-03-05`

### 🐞 Bug Fixes

- Fixed use of ReactNode type for default slots without parameters or non-scoped slots (no parameters)
- Fixed preset exclusion list not taking effect when ignoreAssets option is not configured

## v1.0.3

`2026-03-04`

### 🐞 Bug Fixes

- Fixed compiled TSX components only returning component function parameters when Vue components have props
- Fixed special characters in text not being handled correctly when compiling Vue templates to JSX

## v1.0.2

`2026-03-04`

### 🐞 Bug Fixes

- Fixed VUE_PACKAGES constant configuration by adding `@vureact/compiler-core` to the exclusion list to avoid including it in React projects

## v1.0.1

`2026-03-04`

### ✨ Features

- chore: bump version to 1.0.1

### 🐞 Bug Fixes

- Fixed incorrect reference to CLI entry file in production environment

## v1.0.0

`2026-03-03`

### 🎉 Milestone

- First preview release, codenamed "Mind Control"
- Marks the transition of Vue -> React compilation from proof of concept to engineering practice

### ⚡ Core Capabilities

- Complete compilation chain for converting Vue SFC (`<template>` / `<script setup>` / `<style>`) to React
- Main mapping capabilities from Composition API to React Hooks
- Compile-time style processing (scoped/module) and static CSS output
- Basic CLI (`build` / `watch`), caching, Vite initialization, and hybrid development support

> v1.0.0 includes numerous detailed items (including conversion details, engineering capabilities, known limitations, and plans). For full details, please refer to the repository release log: `core/packages/compiler-core/CHANGELOG.md`.
