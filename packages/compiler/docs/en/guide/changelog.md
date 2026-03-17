# Changelog

## v1.3.0 - 2026-03-17

### Added

- Added CLI update check feature, automatically checks for new versions on startup
- Added routing configuration documentation, automatically generates configuration guide when using routing
- Added support for `update-notifier` dependency

### Fixed

- Fixed ref variable access in `v-for` loops, automatically adds `.value` suffix
- Fixed event call conversion, uniformly changed to optional calls (`onClick?.()`)
- Fixed optional chaining protection in dependency analysis, avoids runtime errors caused by ref.value access
- Fixed cache management, avoids storing style source code, reduces cache size
- Fixed CLI build configuration, ensures correct shebang injection

### Changed

- Optimized example project structure, removed old example projects
- Updated README documentation, improved project description and badge layout
- Updated FAQ documentation, added common Q&A
- Optimized compilation pipeline execution flow, improved error handling and progress display

---

## v1.2.1 - 2026-03-15

### Fixed

- Fixed the conversion logic of `provide` and improved the property handling of the Provider component
- Fixed event call conversion, uniformly making event calls optional (`onClick?.()`)
- Fixed the event name generation logic in `v-model` conversion
- Fixed the issue where `scopeId` should not be injected into `template` and `slot` exit nodes in templates
- Fixed the type definition of slot scope parameters to support fields containing illegal identifiers such as hyphens
- Fixed type imports such as `ReactNode` to ensure the `type` modifier is added correctly
- Fixed the adaptation mapping of Vue Router history mode APIs
- Fixed `emit` event name formatting to support the conversion of `update:xxx` -> `onUpdateXxx`
- Fixed the processing order of `provide` to ensure original calls are collected and removed before renaming
- Fixed the style scoped attribute injection logic to avoid incorrect injection on specific nodes

---

## v1.2.0 - 2026-03-06

### Added

- Added transformation processing for the `defineExpose` macro API
- Added `React.forwardRef` wrapper for components when `defineExpose` is used
- Optimized API adaptation processing
- Optimized handling of component refs

---

## v1.1.1 - 2026-03-05

### Fixes

- Fixed the issue where the suffix of imported `.less`/`.scss` files in style files was not replaced with `.css` when style preprocessing was enabled

## v1.1.0 - 2026-03-05

### New Features

- Added separate compilation processing for style files (e.g., `.less` and `.sass`)
- Supported replacing imported style files (e.g., `.scss`) within files with `.css`

### Fixes

- Fixed the exclusion of the `yarn-lock` file in the project root directory

## v1.0.4 - 2026-03-05

### Fixes

- Fixed the type definition to use ReactNode for default slots without parameters or non-scoped slots (without parameters)
- Fixed the preset exclusion list not taking effect when the ignoreAssets option was not configured

## v1.0.3 - 2026-03-04

### Fixes

- Fixed the compiled TSX component to return component function parameters only when the Vue component has props
- Fixed special characters in text not being properly handled when compiling Vue templates to JSX

## v1.0.2 - 2026-03-04

### Fixes

- Fixed the VUE_PACKAGES constant configuration by adding `@vureact/compiler-core` to the exclusion list to prevent it from being included in React projects

## v1.0.1 - 2026-03-04

### Added

- chore: bump version to 1.0.1

### Fixes

- Fixed incorrect reference to the CLI entry file in production environment

## v1.0.0 - 2026-03-03

### 🚩 Milestone Release: VuReact 1.0.0 — "Mind Control"

> "There is only one true mind." — Yuri

This is the first preview release of VuReact, codenamed "Mind Control". This version marks a significant milestone in advancing Vue-to-React compilation from proof-of-concept to engineering practice.

### ✨ Core Breakthroughs

#### 🧠 Mind Control Architecture

- **Dual Mental Model Support**: Developers can seamlessly switch between Vue and React programming paradigms
- **Semantic Partitioning Capability**: The compiler can clearly identify and process code regions of different mental models
- **Controlled Mixed Writing Mode**: Supports mixing Vue and React semantics in the same project

#### ⚡ Intelligent Compilation Engine

- **Complete Compilation Pipeline**: Implements a full parse → transform → generate compilation architecture
- **Deep Syntax Transformation**: Intelligent mapping from Vue 3 Composition API to React Hooks
- **Template Directive Transformation**: Precise conversion of Vue template syntax to JSX

### 🚀 New Features

#### Compilation Capabilities

- ✅ **Full Vue SFC Support**: Compilation support for `<template>`, `<script setup>`, and `<style>` sections
- ✅ **Seamless TypeScript Migration**: Preserves complete type definitions and automatically generates React component types
- ✅ **Zero Runtime Styles**: Processes scoped/module styles at compile time to generate static CSS
- ✅ **Reactivity System Adaptation**: React adaptation for APIs such as `ref`, `computed`, and `watch`

#### Engineering Support

- ✅ **CLI Toolchain**: Provides `build` and `watch` dual-mode compilation
- ✅ **Incremental Compilation**: Intelligent caching mechanism based on file hashing
- ✅ **Vite Integration**: Automatically initializes standard React project structure
- ✅ **Hybrid Development**: Supports coexistence of Vue and React components in the same project

#### Template Transformation

- ✅ **Basic Directives**: `v-bind`, `v-on`, `v-if`, `v-for`, `v-show`
- ✅ **Conditional Rendering**: Chained conversion of `v-if`/`v-else-if`/`v-else`
- ✅ **List Rendering**: Intelligent conversion of `v-for` to JSX `map`
- ✅ **Event Handling**: Adaptation of events like `@click` to React event system

#### Script Transformation

- ✅ **Composition API**: `ref`, `computed`, `watch`, and lifecycle functions
- ✅ **Component Definition**: `defineProps`, `defineEmits`, `defineExpose`
- ✅ **Reactivity Utilities**: Utility functions such as `toRef`, `toRefs`, `unref`
- ✅ **Dependency Injection**: React Context adaptation of `provide` and `inject`

### 🛠️ Technical Architecture

#### Core Modules

- **Parsing Layer**: Vue SFC parsing based on `@vue/compiler-sfc`
- **Transformation Layer**: Custom AST transformer to generate React intermediate representation
- **Generation Layer**: Babel-based code generation with TypeScript support
- **Style Processing**: PostCSS pipeline with support for Less/Sass preprocessors

#### Runtime Adaptation

- **Reactivity Runtime**: `@vureact/runtime-core` provides Vue-style APIs
- **Router Adaptation**: `@vureact/router` supports Vue Router to React Router conversion
- **Built-in Components**: React implementations of components like `Transition` and `KeepAlive`

### 📋 Compilation Conventions (First Official Definition)

To ensure conversion quality, the 1.0.0 version clearly defines the following compilation conventions:

#### Files and Entries

- It is recommended to include only controllable directories in `input`
- It is strongly recommended to add Vue entry files to `exclude`
- Verify in small directories first, then expand the scope

#### Script Conventions

- Prefer `<script setup>` syntax
- Macro functions must be at the top level
- Hook calls must comply with React rules

#### Template Conventions

- Use only supported directives
- Conditional branches must be correctly nested
- Avoid complex dynamic expressions

#### Style Conventions

- Only the first `style` block is supported
- `scoped` and `module` should be used in accordance with specifications
- Avoid global style side effects

### 🎯 Applicable Scenarios

#### ✅ Recommended Use Cases

- **New Project Development**: Write Vue-style components directly following VuReact conventions
- **Progressive Migration**: Supports gradual migration by directory and module
- **Hybrid Development**: Allows coexistence of Vue and React components in the project
- **Technology Stack Exploration**: Verify the technical feasibility of Vue-to-React compilation

#### ⚠️ Notes

- **Experimental Tool**: The current version prioritizes serving controlled engineering scenarios
- **Convention-Driven**: Strict adherence to compilation conventions is required
- **Modern Syntax**: Focus on Vue 3 Composition API

### 🔧 Technology Stack

- **Compilation Engine**: Hybrid architecture based on Babel and Vue's official compiler
- **Style Processing**: PostCSS pipeline with support for Less/Sass preprocessors
- **Build Tool**: Tsup build with ESM and CJS support
- **Development Experience**: TypeScript 4.9+, ESLint, Prettier

### 🤝 Ecosystem

- **[Runtime Core](https://runtime.vureact.top)**: Provides React-based implementations of Vue core APIs
- **[Router Adaptation](https://router.vureact.top)**: Vue Router → React Router conversion
- **[Complete Documentation](https://vureact.top/)**: Detailed usage guides and API documentation

### 🚨 Known Limitations

#### Current Version Limitations

- Only supports Vue 3 Composition API, not compatible with Options API
- Only processes the first `<style>` block for styles
- Complex dynamic template expressions may be degraded
- Limited support for custom directives
- Limited support for macro APIs
- Does not support processing Vue entry files and routing configuration files for the time being

#### Future Roadmap

- Conversion/adaptation of more Vue APIs
- Conversion support for state management libraries
- Compatibility layer for UI component libraries
- Performance optimization and compilation speed improvement

### 🙏 Acknowledgements

Thanks to all developers who participated in early testing and feedback, your valuable opinions have helped VuReact continuously improve.

Special thanks to:

- The excellent ecosystems provided by the Vue.js and React communities
- Maintainers of all open-source dependency libraries
- Trust and support from early adopters

### 🔮 Future Outlook

The 1.0.0 "Mind Control" release is the starting point of VuReact's journey. In the future, we will continue to explore:

- **Deeper Conversion Capabilities**: Support for more Vue features and complex scenarios
- **Better Development Experience**: Improved error prompts and debugging tools
- **Wider Ecosystem Integration**: Integration with more tools and frameworks
- **Stronger Performance Optimization**: Improved compilation speed and runtime performance
