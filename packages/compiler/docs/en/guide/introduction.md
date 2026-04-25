# Getting Started

## What is VuReact

VuReact (pronounced `/vjuːˈriːækt/`) is a compiler that allows you to write React 18+ applications using Vue 3 syntax. Its core value extends beyond project migration, focusing on seamlessly integrating Vue's development experience with React's ecosystem capabilities, producing maintainable, evolvable, and production-ready React code.

It not only performs syntax-level conversions but also deeply understands the semantics of Vue code, generating high-quality React code that adheres to React best practices.

<video controls preload="metadata" width="100%" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin: 2rem 0;">
  <source src="/static/hero_demo_3MB.mp4" type="video/mp4" />
  Your browser does not support video playback.
</video>

<p style="text-align: center; color: #666; font-size: 0.9em; margin-top: 0.5rem;">
  <em>Watch a 30s demo to quickly understand VuReact's compilation workflow</em>
</p>

The core goal of VuReact is not to "unconditionally convert arbitrary Vue code to React code automatically", but to provide a **predictable, analyzable, and maintainable** upgrade path, enabling developers to smoothly advance cross-framework evolution under the premise of engineering control.

Furthermore, VuReact is not an isolated code rewriting tool. It consists of two synergistic components: **compile-time conversion** and **[runtime core](https://runtime.vureact.top/en)**:

- **Compile-time**: Converts Vue code that complies with conventions into clear, maintainable React code, and automatically injects necessary runtime dependencies;
- **Runtime**: Provides critical semantic adaptation and behavior compatibility layers to ensure converted components run stably in the React environment.

These two parts work closely together to balance conversion quality, runtime stability, and project implementation efficiency.

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

After completion, you will clearly understand three things:

1. Under what conventions input SFCs can be stably converted
2. What the compiled directory structure looks like
3. The semantic correspondence between the output TSX and the original SFC
4. The compiler automatically analyzes and appends dependencies, eliminating the need to manually manage React hooks dependencies

### Step 0: Prepare the Directory

First, set up a minimal project (illustration):

```txt
my-app/
├─ src/
│  ├─ components/
│  │  └─ Counter.vue
│  ├─ App.vue
│  ├─ main.ts
│  └─ index.css
├─ package.json
├─ tsconfig.json
└─ vureact.config.ts
```

### Step 1: Installation

Install the VuReact compiler in your Vue project:

```bash
# Using npm
npm install -D @vureact/compiler-core

# Using yarn
yarn add -D @vureact/compiler-core

# Using pnpm
pnpm add -D @vureact/compiler-core
```

### Step 2: Write the Input SFC

`src/components/Counter.vue`

```html
<template>
  <section class="counter-card">
    <h2>{{ props.title || title }}</h2>
    <p>Count: {{ count }}</p>
    <button @click="increment">+1</button>
    <button @click="methods.decrease">-1</button>
  </section>
</template>

<script setup lang="ts">
  // @vr-name: Counter (Note: Tells the compiler what component name to generate)
  import { computed, ref } from 'vue';

  // You can also use macros to define component names
  defineOptions({ name: 'Counter' });

  // Define props
  const props = defineProps<{ title?: string }>();

  // Define emits
  const emits = defineEmits<{
    (e: 'change'): void;
    (e: 'update', value: number): number;
  }>();

  const step = ref(1);
  const count = ref(0);
  const title = computed(() => `Counter x${step.value}`);

  const increment = () => {
    count.value += step.value;
    emits('update', count.value);
  };

  const methods = {
    decrease() {
      count.value -= step.value;
    },
  };
</script>

<style lang="less" scoped>
  @border-color: #ddd;
  @border-radius: 8px;
  @padding-base: 12px;

  .counter-card {
    border: 1px solid @border-color;
    border-radius: @border-radius;
    padding: @padding-base;
  }
</style>
```

### Step 3: Configure the Compiler

`vureact.config.ts`

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  // Input path containing Vue files to compile; single file 'xxx.vue' is allowed
  input: './src',

  // Exclude Vue entry files to avoid semantic conflicts
  exclude: ['src/main.ts'],

  output: {
    // Workspace directory to store compilation output and cache
    workspace: '.vureact',

    // Output directory name
    outDir: 'react-app',

    // Automatically initialize Vite React environment
    bootstrapVite: true,
  },
});
```

### Step 4: Execute Compilation

#### Method 1: Use the npx command

Run in the root directory:

```bash
npx vureact build
```

#### Method 2: Use npm scripts

Add script commands to `package.json`:

```json
"scripts": {
  "watch": "vureact watch",
  "build": "vureact build"
}
```

```bash
npm run build
```

### Step 5: View the Output Directory Tree

Compiled directory (illustration):

```txt
my-project/
├── .vureact/              # Workspace (generated)
│   ├── cache/             # Compilation cache
│   ├── react-app/         # Generated React code
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Counter.tsx
│   │   │   │   └── counter-[hash].css
│   │   │   └── App.tsx
│   │   │   └── index.css
│   │   │   └── main.tsx
│   │   └── package.json
│   │   └── tsconfig.json
│   │   └── vite.config.ts
│   │   └── ...
│   │
├── src/                   # Original Vue code
│   ├── components/
│   │   └── Counter.vue
│   └── main.ts            # Vue entry file
├── ...
└── vureact.config.js      # VuReact configuration file
```

### Step 6: Compare the Generated Results

Below is a typical formatted output (slightly simplified for illustration; the actual hash and property names are subject to local output):

```tsx
import { memo, useCallback, useMemo } from 'react';
import { useComputed, useVRef } from '@vureact/runtime-core';
import './Counter-a1b2c3.css';

// Derived from defineProps and defineEmits
type ICounterType = {
  title?: string;
  onChange: () => void;
  onUpdate: (value: number) => number;
};

// Component wrapped with memo
const Counter = memo((props: ICounterType) => {
  // ref/computed converted to equivalent adaptation APIs
  const step = useVRef(1);
  const count = useVRef(0);
  const title = useComputed(() => `Counter x${step.value}`);

  // Automatically analyze dependencies of top-level arrow functions and append useCallback optimization
  const increment = useCallback(() => {
    count.value += step.value;
    props.onUpdate?.(count.value); // emits conversion
  }, [count.value, step.value, props.onUpdate]);

  // Automatically analyze dependencies in top-level objects and append useMemo optimization
  const methods = useMemo(
    () => ({
      decrease() {
        count.value -= step.value;
      },
    }),
    [count.value, step.value],
  );

  return (
    <>
      <section className="counter-card" data-css-a1b2c3>
        <h2 data-css-a1b2c3>{props.title || title.value}</h2>
        <p data-css-a1b2c3>Count: {count.value}</p>
        <button onClick={increment} data-css-a1b2c3>
          +1
        </button>
        <button onClick={methods.decrease} data-css-a1b2c3>
          -1
        </button>
      </section>
    </>
  );
});

export default Counter;
```

CSS file content:

```css
.counter-card[data-css-a1b2c3] {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
}
```

## Key Observations

1. The special comment `// @vr-name: Counter` defines the component name
2. `defineProps` and `defineEmits` are converted to TS component types
3. Non-pure UI display components are wrapped with `memo` by default
4. `ref` / `computed` are converted to runtime adaptation APIs (`useVRef` / `useComputed`)
5. Template event callbacks generate React-semantic `onClick`
6. Top-level arrow functions have their dependencies automatically analyzed and `useCallback` is injected where applicable
7. Top-level variable declarations have their dependencies automatically analyzed and `useMemo` is injected where applicable
8. The `.value` suffix is added to original `ref` state values in JSX
9. Less styles are compiled to CSS code
10. Scoped styles generate hashed CSS files and add scoped attributes to elements

### Ecosystem Integration

- **[VuReact Runtime Core](https://runtime.vureact.top/en)**: Provides React versions of Vue's commonly used built-in components, core Composition API, etc.
- **[VuReact Router](https://router.vureact.top/en)**: Supports conversion from Vue Router 4.x to React Router DOM 7.9+
- **State Management**: None yet
- **UI Libraries**: None yet

If necessary, you can choose [☣️Mixed Writing](/en/guide/mind-control-readme) to directly use the React ecosystem.

## FAQ

Please visit [VuReact FAQ](https://vureact.top/en/guide/faq.html)!
