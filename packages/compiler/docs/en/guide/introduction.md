# Introduction

## What is VuReact

VuReact (pronounced `/vjuːˈriːækt/`) is a **Vue-to-React** compiler that turns Vue 3 SFCs, scripts, and styles into code that runs on React 18+ without runtime bridging. It also covers the common patterns used in `<script setup>`.

It does more than rewrite syntax. VuReact understands Vue semantics and generates readable, maintainable React code that follows best practices. Our goal is not to “convert any Vue code to React with one click”; it is to provide a clear, predictable migration path that is easy to analyze and maintain, helping teams move across frameworks in a controlled way.

VuReact is made up of three cooperating parts: compile-time transformation, the [Runtime](https://runtime.vureact.top/en), and the [Router](https://router.vureact.top/en):

- **Compile-time transformation**: generates structured, maintainable React code from Vue code that follows our conventions, and automatically injects the runtime dependencies you need;
- **Runtime**: handles semantic adaptation and behavior compatibility, keeping transformed components stable in a React environment;
- **Router**: provides Vue Router-style routing support when needed, making route migration easier.

These three parts work together to protect conversion quality, improve runtime stability, and help deliver a working engineering solution.

---

<video controls preload="metadata" width="100%" style="border-radius: 4px; margin: 2rem 0;">
  <source src="/static/hero_demo_3MB.mp4" type="video/mp4" />
  Your browser does not support HTML5 video.
</video>

<p style="text-align: center; color: #666; font-size: 0.9em;">
  <em>Watch a 30-second demo to get a quick feel for the VuReact compilation flow.</em>
</p>

## What problems does it solve?

VuReact is designed to address a few recurring engineering pain points:

- **Stack migration**: teams want the React ecosystem, but already have Vue habits, components, and conventions they do not want to discard overnight
- **Progressive refactoring**: existing Vue systems need to move to React gradually, without a risky rewrite or business disruption
- **Unified developer experience**: developers want to author React components with Vue’s reactive mental model, without manually managing hook dependencies and render optimizations
- **Cross-ecosystem tooling**: teams need a standardized path for mixed-stack development and framework migration

The core challenge is this: if the input code cannot be statically analyzed, the compiler cannot reliably generate output that obeys the rules of React Hooks.

That is why VuReact takes a **convention-first** approach. It first defines a convertible subset of Vue through explicit [compilation conventions](/en/guide/specification), and then focuses on making conversion inside that boundary efficient and reliable.

## Project positioning

VuReact is best suited for the following scenarios:

- **New project development**: write Vue-style components and related script files under VuReact conventions, and output React code
- **Modern Vue syntax**: primarily targets Vue 3 Composition API and `<script setup>`
- **Controlled progressive migration**: migrate by directory or module, allowing Vue and React components to coexist during the transition
- **Developer experience optimization**: ideal for teams that want Vue’s mental model while building for React, or need controlled cross-framework collaboration

VuReact does **not** currently prioritize:

- **Complex legacy projects** that expect a zero-touch, one-click migration
- **Mixed historical codebases** with large amounts of legacy Options API or non-standard patterns that are difficult to normalize in the short term

Its value is not limited to migration. More broadly, it aims to combine Vue’s authoring experience with the React ecosystem and produce React code that is maintainable, evolvable, and production-ready.

## What it is / what it is not

**VuReact is:**

- a compilation toolchain that turns Vue SFCs and `<script setup>` code into React output
- a **constraint-based compilation platform** that uses explicit conventions to protect output quality and maintainability
- an engineering-focused developer tool that reports clear warnings or errors when input violates those conventions, and guides you toward a fix

**VuReact is not:**

- a universal migration wizard that can handle arbitrary legacy code
- a runtime interpreter that tries to paper over non-conforming code at execution time
- a commercial migration product that promises to move old projects wholesale with zero manual adjustment

## Core capabilities

VuReact provides the following key capabilities:

**🧠 Semantic awareness**: deeply understands Vue semantics across templates, `script setup`, Composition API usage, and TypeScript types, then generates React code that aligns with established best practices

**⚖️ Progressive migration**: supports controlled migration from a single file to an entire codebase, reducing the technical and organizational risk of big-bang rewrites

**🧭 Convention-driven compilation**: compiles according to explicit syntax conventions rather than heuristics, so conversion remains deterministic, analyzable, and maintainable, with strong support for modern Vue syntax

**⚛️ Comprehensive feature adaptation**: adapts core Vue capabilities such as reactivity, lifecycle, built-ins, and routing into React, while handling scoped styles, CSS Modules, and style preprocessors entirely at compile time with zero runtime overhead

**⚡ Strong developer experience**: preserves the Vue mental model while targeting React; offers both `build` and `watch` CLI workflows, with fast incremental compilation and file watching that feel close to native development

**🌀 Exploratory cross-framework architecture**: explores a compiler-bridge model in which Vue and React can coexist at the compilation layer, validating the technical feasibility of end-to-end Vue-to-React compilation

**👽 Intelligent compilation pipeline**: covers syntax transformation, template analysis, style handling, type preservation, and engineering optimizations

### Intelligent compilation features

- **Smart syntax transformation**: maps Vue 3 Composition API patterns to React Hooks
- **Smart template analysis**: converts Vue template directives into JSX
- **Smart style handling**: transforms scoped CSS and related style features into React-ready CSS output
- **Smart type preservation**: carries TypeScript types forward during migration
- **Smart engineering optimizations**: handles dependency analysis, caching, and code optimization automatically

## Getting started

For the full guided walkthrough, see the [Quick Start](/en/guide/quick-start) guide.

### Installation

Inside your Vue 3 project, install VuReact with your preferred package manager:

```bash
npm i -D @vureact/compiler-core
```

### Create a config file

Create `vureact.config.ts` in the project root:

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  // accept a single file or a directory
  input: '', 
  // exclude the Vue entry and any files that should not be compiled
  exclude: ['src/main.ts'], 
  output: {
    workspace: '.vureact',
    outDir: 'react-app',
    bootstrapVite: true,
  },
  onSuccess: async () => {
    console.log('Compilation succeeded!');
    // You can do extra work here, 
    // such as filesystem updates or calling external tools
  },
});
```

> 💡 For more options, see the [Config API](/en/api/config).

### Option 1: convert a single Vue component

```ts
{
  // Single-SFC pilot, must use <script setup>
  input: './src/your-component.vue',
}
```

### Option 2: convert the entire project

```ts
{
  // Recursively handles nested directories
  // Note: all components must use <script setup>, otherwise compilation will fail
  input: './src',
}
```

> 💡 If your project uses Vue Router, see the [Router Adaptation Guide](/en/guide/router-adaptation) for the required setup.

### Run the compiler

```bash
npx vureact build
```

VuReact will generate a `.vureact/react-app` directory containing the converted components along with the related dependency and project configuration.

An example project layout looks like this:

```txt
vue-project/
├── .vureact/              # generated workspace
│   ├── cache/             # compilation cache
│   ├── react-app/         # generated React app
│   │   ├── src/           # converted React source
│   │   ├── package.json   # React app dependencies
│   │   ├── vite.config.ts # Vite config
│   │
├── src/                   # original Vue source
├── package.json           # original project dependencies
└── vureact.config.ts      # config file
```

> 💡 If you see compilation warnings, follow the suggestions and adjust the source. Reading the [Compilation Conventions](/en/guide/specification) and [Best Practices](/en/guide/best-practices) will help you write Vue code that converts more cleanly.

## CLI commands

```bash
# full / incremental build
npx vureact build

# watch mode for development
npx vureact watch

# show version
npx vureact -v

# show help
npx vureact --help
```

👉 For the two CLI workflows, see: [Incremental Compilation](/en/guide/incremental-compilation) | [Watch Mode](/en/guide/watch-mode)

## Ecosystem integration

- **[VuReact Runtime](https://runtime.vureact.top/en/)**: lightweight React-side implementations of core Vue components and APIs
- **[VuReact Router](https://router.vureact.top/en/)**: a Vue Router-style adaptation layer built on React Router DOM

> You can also opt into [☣️ hybrid authoring](/en/guide/mind-control-readme) if you want a Vue project to use React ecosystem capabilities directly.

## Feedback and support

- Running into issues? Check the [FAQ](/en/guide/faq) or [open an Issue](https://github.com/vureact-js/core/issues)
- Questions about routing? Read the [Router Adaptation Guide](/en/guide/router-adaptation)
- Seeing broken or missing page styles? See the [recommended fix](/en/guide/faq#q35-how-to-fix-missing-or-broken-page-styles)
- Want to share feedback? Join the conversation in [Discussions](https://github.com/vureact-js/core/discussions)
- Want to support the project? Give it a ⭐ on [GitHub](https://github.com/vureact-js/core)
