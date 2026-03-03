# Changelog

## [1.0.0-beta "Mind Control"] - 2026-03-03

### 🚩 Milestone Release: VuReact 1.0.0-beta — "Mind Control"

> "There is only one true mind." — Yuri

This is the first beta release of VuReact, codenamed "Mind Control". This version marks a crucial milestone in advancing Vue-to-React compilation from proof-of-concept to engineering practice.

### ✨ Core Breakthroughs

#### 🧠 Mind Control Architecture

- **Dual Mental Model Support**: Developers can seamlessly switch between Vue and React programming paradigms
- **Semantic Partitioning Capability**: The compiler can clearly identify and process code regions of different mental models
- **Controlled Mixed Writing Mode**: Supports mixing Vue and React semantics within the same project

#### ⚡ Intelligent Compilation Engine

- **Complete Compilation Pipeline**: Implements a full compilation architecture of parsing → transformation → generation
- **Deep Syntax Transformation**: Intelligent mapping from Vue 3 Composition API to React Hooks
- **Template Directive Transformation**: Precise conversion from Vue template syntax to JSX

### 🚀 New Features

#### Compilation Capabilities

- ✅ **Full Vue SFC Support**: Compiles `<template>`, `<script setup>`, and `<style>` sections
- ✅ **Seamless TypeScript Migration**: Preserves complete type definitions and automatically generates React component types
- ✅ **Zero Runtime Styles**: Processes scoped/module styles at compile time to generate static CSS
- ✅ **Reactivity System Adaptation**: React adaptations for APIs like `ref`, `computed`, and `watch`

#### Engineering Support

- ✅ **CLI Toolchain**: Provides `build` and `watch` dual-mode compilation
- ✅ **Incremental Compilation**: Intelligent caching mechanism based on file hashing
- ✅ **Vite Integration**: Automatically initializes standard React project structure
- ✅ **Hybrid Development**: Allows Vue and React components to coexist in the same project

#### Template Transformation

- ✅ **Basic Directives**: `v-bind`, `v-on`, `v-if`, `v-for`, `v-show`
- ✅ **Conditional Rendering**: Chain conversion of `v-if`/`v-else-if`/`v-else`
- ✅ **List Rendering**: Intelligent conversion from `v-for` to JSX `map`
- ✅ **Event Handling**: Adaptation of events like `@click` to React event system

#### Script Transformation

- ✅ **Composition API**: `ref`, `computed`, `watch`, and lifecycle functions
- ✅ **Component Definition**: `defineProps`, `defineEmits`, `defineExpose`
- ✅ **Reactivity Utilities**: Utility functions such as `toRef`, `toRefs`, `unref`
- ✅ **Dependency Injection**: React Context adaptation for `provide` and `inject`

### 🛠️ Technical Architecture

#### Core Modules

- **Parsing Layer**: Vue SFC parsing based on `@vue/compiler-sfc`
- **Transformation Layer**: Custom AST transformer that generates React intermediate representation
- **Generation Layer**: Babel-based code generation with TypeScript support
- **Style Processing**: PostCSS pipeline with Less/Sass preprocessor support

#### Runtime Adaptation

- **Reactivity Runtime**: `@vureact/runtime-core` provides Vue-style APIs
- **Router Adaptation**: `@vureact/router` supports Vue Router to React Router conversion
- **Built-in Components**: React implementations of components like `Transition` and `KeepAlive`

### 📋 Compilation Conventions (First Official Definition)

To ensure conversion quality, the 1.0.0 release clearly defines the following compilation conventions:

#### Files and Entry Points

- It is recommended to include only controllable directories in `input`
- It is strongly recommended to add Vue entry files to `exclude`
- Validate in small directories first, then expand the scope

#### Script Conventions

- Prefer `<script setup>` syntax
- Macro functions must be at the top level
- Hook calls must comply with React rules

#### Template Conventions

- Use only supported directives
- Conditional branches must be properly nested
- Avoid complex dynamic expressions

#### Style Conventions

- Only the first `style` block is supported
- `scoped` and `module` must be used according to specifications
- Avoid global style side effects

### 🎯 Applicable Scenarios

#### ✅ Recommended Use Cases

- **New Project Development**: Write Vue-style components directly following VuReact conventions
- **Progressive Migration**: Supports gradual migration by directory and module
- **Hybrid Development**: Allows Vue and React components to coexist in the project
- **Technology Stack Exploration**: Validate the technical feasibility of Vue-to-React compilation

#### ⚠️ Notes

- **Experimental Tool**: The current version prioritizes serving controlled engineering scenarios
- **Convention-Driven**: Strict adherence to compilation conventions is required
- **Modern Syntax**: Focus on Vue 3 Composition API

### 🔧 Technology Stack

- **Compilation Engine**: Hybrid architecture based on Babel and Vue's official compiler
- **Style Processing**: PostCSS + custom Scoped CSS processor
- **Build Tool**: Built with Tsup, supporting ESM and CJS
- **Development Experience**: TypeScript 4.9+, ESLint, Prettier

### 🤝 Ecosystem

- **[Runtime Core](https://runtime.vureact.top)**: Provides React implementations of Vue core APIs
- **[Router Adaptation](https://router.vureact.top)**: Vue Router → React Router conversion
- **[Complete Documentation](https://vureact.top)**: Detailed usage guides and API documentation

### 🚨 Known Limitations

#### Current Version Limitations

- Only supports Vue 3 Composition API, not compatible with Options API
- Only processes the first `<style>` block for styles
- Complex dynamic template expressions may be degraded
- Limited support for custom directives
- Limited support for macro APIs
- Does not yet support processing Vue entry files and route configuration files

#### Future Roadmap

- Conversion/adaptation for more Vue APIs
- Conversion support for state management libraries
- Compatibility layer for UI component libraries
- Performance optimization and compilation speed improvement

### 🙏 Acknowledgments

Thanks to all developers who participated in early testing and feedback—your valuable opinions have helped VuReact continuously improve.

Special thanks to:

- The excellent ecosystems provided by the Vue.js and React communities
- Maintainers of all open-source dependency libraries
- Trust and support from early adopters

### 🔮 Future Outlook

The 1.0.0-beta "Mind Control" release is the starting point of VuReact's journey. In the future, we will continue to explore:

- **Deeper Transformation Capabilities**: Support for more Vue features and complex scenarios
- **Better Developer Experience**: Improved error prompts and debugging tools
- **Wider Ecosystem Integration**: Integration with more tools and frameworks
- **Stronger Performance Optimization**: Improved compilation speed and runtime performance
