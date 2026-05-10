# Getting Started

## What is VuReact

VuReact (pronounced `/vjuːˈriːækt/`) is a **Vue-to-React** compiler that **fully compiles** Vue 3 SFC, scripts & styles into **pure React 18+ code** (no runtime bridge), covering core `<script setup>` features.

It goes beyond syntax-level transformation to deeply understand Vue code semantics, generating high-quality code following React best practices. Its core goal is not "unconditionally convert any Vue code to React," but to provide a **predictable, analyzable, maintainable** upgrade path for smooth cross-framework evolution under engineering control.

VuReact is not an isolated code rewriting tool. It consists of three parts working together: **Compile-time Transformation**, **[Runtime](https://runtime.vureact.top/en/)**, and **[Router](https://router.vureact.top/en/)**:

- **Compile-time** converts Vue code that meets conventions into well-structured, maintainable React code, automatically injecting necessary runtime dependencies;
- **Runtime** provides a critical semantic adaptation and behavior compatibility layer to ensure stable operation in the React environment.

Together, they balance conversion quality, operational stability, and project delivery efficiency.

<video controls preload="metadata" width="100%" style="border-radius: 4px; margin: 2rem 0;">
  <source src="/static/hero_demo_3MB.mp4" type="video/mp4" />
  Your browser does not support video playback.
</video>

<p style="text-align: center; color: #666; font-size: 0.9em; margin-top: 0.5rem;">
  <em>Watch a 30s demo to quickly understand VuReact's compilation workflow</em>
</p>

## Problems Solved

VuReact aims to address the following typical development pain points:

- **Tech Stack Migration**: Teams want to adopt the React ecosystem but have accumulated Vue syntax habits and component assets, expecting a smooth transition rather than a complete relearning process
- **Progressive Refactoring**: Legacy Vue systems need to be gradually migrated to React, avoiding high-risk one-time rewrites and business interruptions
- **Unified Development Experience**: Write React components using Vue's reactive mental model, while eliminating the tedious work of manually managing dependencies and rendering optimizations
- **Ecosystem Expansion**: Enrich cross-framework development toolchains and provide standardized solutions for multi-tech-stack coexistence or migration

The core challenge is: if the semantics of the input code cannot be statically analyzed, the compiler cannot stably generate output that complies with React Hooks rules.
Therefore, VuReact adopts a **"convention-first"** strategy: first define the scope of convertible code through clear [compilation conventions](/en/guide/specification), then achieve efficient and reliable conversion within that scope.

## Project Positioning

VuReact precisely serves the following scenarios:

- **New Project Development**: Write Vue components (including script files, etc.) following VuReact conventions and output them as React code
- **Modern Syntax Support**: Focus on Vue 3 Composition API and `<script setup>` syntax
- **Controlled Progressive Migration**: Support gradual migration by directory or module, allowing Vue and React components to coexist in the project
- **Developer Experience**: Enables teams to leverage Vue’s mental model while writing React, with support for cross-framework development

It does not prioritize supporting:

- **Complex Legacy Projects**: Historical codebases that expect "zero-modification one-click migration"
- **Mixed Historical Syntax**: Projects containing a large number of traditional Options API or non-standard patterns that are difficult to unify in the short term

Its core value extends beyond project migration, seamlessly combining Vue's development experience with React's ecosystem capabilities to produce maintainable, evolvable, production-ready React code.

## What It Is / What It Is Not

**What It Is**:

- A compilation toolchain for converting Vue SFC and `<script setup>` syntax to React code
- A **constrained compilation platform** that ensures conversion quality and maintainability through clear conventions
- An engineering-capable development tool that can provide clear warnings or error prompts for non-conforming input and guide corrections

**What It Is Not**:

- A "universal migration magician" that can handle arbitrary historical code
- An interpreter that provides runtime fallback for non-conventional syntax
- A commercial product that promises full migration of old projects without any adjustments

## Core Features

VuReact offers the following key capabilities:

**🧠 Semantic-aware**：Understand Vue 3 like a compiler, generate maintainable React 18+ like a pro

**⚖️ Incremental Migration**：Start small, scale to full projects—no risky rewrites

**🧭 Convention-driven**：Predictable transforms powered by clear conventions, not guesses

**⚛️ Complete Feature Adaptation**：Vue features, fully mapped to React—zero runtime cost

**⚡ Excellent Developer Experience**：Vue mental model, seamless React dev; CLI build/watch, fast incremental compile, native-like

**🌀 Innovative Exploration**：A new bridge between Vue and React at compile time

**👽 Intelligent Compilation**: Covering syntax conversion, template parsing, style processing, type preservation, and engineering optimization

### Intelligent Compilation Features

- **Intelligent Syntax Conversion**: Intelligently map Vue 3 Composition API to React Hooks
- **Intelligent Template Parsing**: Intelligently convert Vue template directives to JSX
- **Intelligent Style Processing**: Intelligently adapt Scoped CSS etc. to React-runnable CSS output
- **Intelligent Type Preservation**: Intelligently migrate TypeScript type systems
- **Intelligent Engineering Optimization**: Intelligently handle dependency analysis, caching mechanisms, and code optimization

## Quick Start

For a detailed tutorial, please refer to the [Quick Start](/en/guide/quick-start) section.

### Configuration Example

`vureact.config.ts`

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: './src',
  exclude: ['src/main.ts'],
  output: {
    workspace: '.vureact',
    outDir: 'react-app',
    bootstrapVite: true,
  },
});
```

### Commands

```bash
npx vureact build      # Build project
npx vureact watch      # Watch mode
```

## Ecosystem Integration

- **[VuReact Runtime Core](https://runtime.vureact.top/en)**: Provides React versions of Vue's commonly used built-in components, core Composition API, etc.
- **[VuReact Router](https://router.vureact.top/en)**: Supports conversion from Vue Router 4.x to React Router DOM 7.9+
- **State Management**: None yet
- **UI Libraries**: None yet

If necessary, you can choose [☣️Mixed Writing](/en/guide/mind-control-readme) to directly use the React ecosystem.

## FAQ

Please visit [FAQ](/en/guide/faq.html) section.
