# Getting Started

## What is VuReact

VuReact (a blend of Vue + React, pronounced /vjuːˈriːækt/) is an intelligent compilation toolchain for migrating from Vue 3 to React, designed to deliver an efficient and reliable development experience for new projects and controlled progressive migration.

It does more than just syntax-level conversion—it deeply understands the semantics of Vue code and generates high-quality React code that adheres to React best practices.

VuReact’s core goal is not to "unconditionally auto-convert arbitrary Vue code to React code", but to provide a **predictable, analyzable, and maintainable** upgrade path, enabling developers to smoothly advance cross-framework evolution under the premise of engineering control.

Furthermore, VuReact is not an isolated code rewriting tool. It consists of two synergistic components: **compile-time transformation** and **[runtime adaptation](https://vureact-runtime.vercel.app/)**:

- **Compile-time**: Converts Vue code that complies with conventions into clean, maintainable React code, and automatically injects necessary runtime dependencies;
- **Runtime**: Provides critical semantic adaptation and behavior compatibility layers to ensure converted components run stably in React environments.

These two components work closely together to balance conversion quality, runtime stability, and project implementation efficiency.

## Problems Solved

VuReact aims to address the following typical development pain points:

- **Tech Stack Migration**: Teams want to adopt the React ecosystem but have accumulated Vue syntax habits and component assets, expecting a smooth transition rather than a complete relearning process
- **Progressive Refactoring**: Legacy Vue systems need to be gradually migrated to React, avoiding high-risk one-time rewrites and business interruptions
- **Unified Development Experience**: Write React components using Vue’s reactive mental model while eliminating the hassle of manually managing dependencies and rendering optimizations
- **Ecosystem Expansion**: Enrich cross-framework development toolchains and provide standardized solutions for multi-tech-stack coexistence or migration

The core challenge is: if the semantics of input code cannot be statically analyzed, the compiler cannot stably generate output that complies with React Hooks rules.
Therefore, VuReact adopts a **"convention-first"** strategy: first define the scope of convertible code through clear compilation conventions, then implement efficient and reliable conversion within that scope.

## Project Positioning

In its current phase, VuReact is positioned as an **experimental toolchain**, prioritizing support for the following scenarios:

- **New Project Development**: Write Vue-style components directly following VuReact conventions and output React code
- **Modern Syntax Support**: Focus on Vue 3 Composition API and `<script setup>` syntax
- **Controlled Progressive Migration**: Support gradual migration by directory/module, allowing Vue and React components to coexist in the same project

It does not prioritize support for:

- **Complex Legacy Projects**: Historical codebases expecting "zero-modification one-click migration"
- **Mixed Historical Syntax**: Projects containing a large amount of traditional Options API or non-standard patterns that are difficult to unify in the short term

## What It Is / What It Is Not

**What It Is**:

- A compilation toolchain for converting Vue Single-File Components (SFCs) and `<script setup>` syntax to React code
- A **constrained compilation platform** that ensures conversion quality and maintainability through clear conventions
- An engineering-capable development tool that provides clear warnings or error prompts for non-compliant input and guides corrections

**What It Is Not**:

- A "universal migration magician" that can handle arbitrary historical code
- An interpreter that provides runtime fallbacks for non-conventional syntax
- A commercial product promising full migration of old projects without any adjustments

## Core Features

VuReact offers the following key capabilities:

- **Deep `<script setup>` Support**: Full support for Vue 3 Composition API, delivering a near-native development experience
- **Complete TypeScript Support**: Preserves type definitions in Vue SFCs and automatically generates precise React component types
- **Zero-Runtime Styling Solution**: Fully processes `scoped` and `module` styles (even Less and Sass) at compile time to generate production-ready static CSS
- **Mixed Development Support**: Allows Vue and React code to coexist in the same project, supporting progressive migration
- **Complete Engineering Compilation**: More than just code conversion—it’s a complete project compilation solution
- **Intelligent Compilation**: Covers syntax conversion, template parsing, style processing, type preservation, and engineering optimization

### Intelligent Compilation Features

- **Intelligent Syntax Conversion**: Intelligently maps Vue 3 Composition API to React Hooks
- **Intelligent Template Parsing**: Intelligently converts Vue template directives to JSX
- **Intelligent Style Processing**: Intelligently adapts Scoped CSS and other styles to React-runnable CSS output
- **Intelligent Type Preservation**: Intelligently migrates TypeScript type systems
- **Intelligent Engineering Optimization**: Intelligently handles dependency analysis, caching mechanisms, and code optimization

## Quick Start

This section guides you through creating, compiling, and running your first VuReact project.

### Prerequisites

- Node.js 18+ or higher
- Package manager (npm, yarn, or pnpm)
- Basic knowledge of Vue 3 and React

### 1. Installation

Install the VuReact compiler in your Vue project:

```bash
# Using npm
npm install -D @vureact/compiler-core

# Using yarn
yarn add -D @vureact/compiler-core

# Using pnpm
pnpm add -D @vureact/compiler-core
```

### 2. Create a Sample Project

Assume you have a clean and simple Vue 3 project structure:

```txt
my-vue-app/
├── src/
│   ├── components/
│   │   └── Counter.vue
│   └── main.ts
├── package.json
└── vureact.config.js
```

Create a simple counter component `src/components/Counter.vue`:

```vue
<template>
  <div class="counter">
    <h2>Counter Example</h2>
    <p>Current count: {{ count }}</p>
    <button @click="increment">Increment</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<script setup>
// @vr-name: Counter (Note: This comment tells the compiler the generated component name)
import { ref } from 'vue';

const count = ref(0);

const increment = () => {
  count.value++;
};

const reset = () => {
  count.value = 0;
};
</script>

<style>
.counter {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  max-width: 300px;
}
</style>
```

### 3. Configure the Compiler

Create `vureact.config.js` in the project root directory (assumed to be my-vue-app):

```javascript
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  // Input path containing Vue files to compile; single file 'xxx.vue' is allowed
  input: 'src',

  // Enable compilation cache
  cache: true,

  // Exclude Vue entry file to avoid semantic conflicts
  exclude: ['src/main.ts'],

  output: {
    // Workspace directory for compilation artifacts and cache
    workspace: '.vureact',

    // Output directory name
    outDir: 'react-app',

    // Automatically initialize Vite React environment
    bootstrapVite: true,
  },
});
```

In practice, except for `exclude` which needs to be specified manually, other options use default values from the sample configuration and require no additional setup.

### 4. Run the Compilation

Execute the compilation command in the project root directory:

```bash
# One-time compilation
npx vureact build

# Or use watch mode (recommended for development)
npx vureact watch
```

### 5. View the Output

After compilation, you will see a structure similar to the following:

```txt
my-vue-app/
├── .vureact/           # Workspace
│   ├── react-app/      # Generated React code
│   │   └── src/
│   │       └── components/
│   │           ├── Counter.tsx
│   │           └── counter-[hash].css
│   └── cache/          # Compilation cache
├── src/                # Original Vue code
└── vureact.config.js   # Configuration file
```

### 6. Run the React Application

If `bootstrapVite: true` is enabled, VuReact will automatically initialize a standard Vite React project:

```bash
# Enter the generated React project
cd .vureact/react-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

You can now visit `http://localhost:5173` in your browser to view the converted React application.

### Compilation Result Example

The generated `Counter.tsx` file will look roughly like this:

```tsx
import { memo, useCallback } from 'react';
import { useVRef } from '@vureact/runtime-core';
import './counter.css';

const Counter = memo(() => {
  const count = useVRef(0);

  const increment = useCallback(() => {
    count.value++;
  }, [count.value]);

  const reset = useCallback(() => {
    count.value = 0;
  }, [count.value]);

  return (
    <div className="counter">
      <h2>Counter Example</h2>
      <p>Current count: {count.value}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
});

export default Counter;
```

The accompanying counter.css file generated:

```css
.counter {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  max-width: 300px;
}
```

## Migration Strategy Recommendations

### Progressive Migration Path

1. **Coexistence Phase**: Introduce VuReact into the Vue project and write new components using Vue
2. **Mixed Phase**: Gradually convert old components, with Vue and React components coexisting
3. **Unification Phase**: Complete conversion of all components and remove Vue dependencies

### Risk Assessment and Mitigation

- **Technical Risks**: Ensure controllable conversion through compilation conventions
- **Team Risks**: Maintain consistent development experience and reduce learning costs
- **Time Risks**: Support gradual migration by module to avoid one-time rewrites

### Annotations for Code Examples

You can optionally add comments to the generated Counter.tsx example to explain conversion logic:

```tsx
// Automatically converted from Vue's ref() to useVRef() provided by @vureact/runtime-core
const count = useVRef(0);

// Automatically converted from @click to onClick, with intelligent dependency analysis and useCallback optimization added
const increment = useCallback(() => {
  count.value++;
}, [count.value]);

// Automatically add scoped style markers
<div className="counter" data-css-a1b2c3>
```

### Secondary Recommendations

### Version Compatibility

- Vue 3
- React 18+
- Node.js 18+

### Performance

In benchmark tests, the converted React application:

- First screen load time: Comparable to native React applications
- Runtime memory usage: Increase < 5%
- Build artifact size: Increase < 10%

### Ecosystem Integration

- **[Vue Core Adaptation Package](https://vureact-runtime.vercel.app/)**: Provides React versions of Vue's commonly used built-in components, core Composition API, etc.
- **[Vue Router Adaptation Package](https://router-vureact.vercel.app/)**: Supports conversion from Vue Router 4.x -> React Router DOM 7.9+
- **State Management**: None yet
- **UI Libraries**: None yet

If necessary, you can choose [☣️Mixed Writing](/guide/mind-control-readme) to directly use the React ecosystem.

## Next Steps

1. **Read the Philosophy**: Understand [VuReact's Design Philosophy](./philosophy) and grasp the core principle of "control first"
2. **Evaluate Applicability**: Check [Why Choose VuReact](./why) to confirm if the project is suitable for use
3. **Try Examples**: Explore more conversion patterns through [Compilation Examples](./basic-tutorial)
4. **Learn Specifications**: Before official use, be sure to read through the [Compilation Conventions](./specification)
