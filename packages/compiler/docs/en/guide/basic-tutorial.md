# Counter Component

This tutorial demonstrates a standard workflow: compiling a Vue 3 Single-File Component (SFC) into a React component.

Since there is no online Playground available at present, this page adopts:

- Side-by-side comparison of code before and after generation
- Directory tree structure diagram

## Tutorial Objectives

Upon completion, you will clearly understand three key points:

1. Under what conventions input SFCs can be stably converted
2. The structure of the compiled directory
3. The semantic correspondence between the output TSX and the original SFC

## Step 0: Prepare the Directory

First, set up a minimal project (illustrative):

```txt
my-app/
├─ src/
│  ├─ components/
│  │  └─ Counter.vue
│  ├─ main.ts
│  └─ index.css
├─ package.json
└─ vureact.config.js
```

## Step 1: Write the Input SFC

`src/components/Counter.vue`

```vue
<template>
  <section class="counter-card">
    <h2>{{ title }}</h2>
    <p>Count: {{ count }}</p>
    <button @click="increment">+1</button>
    <button @click="methods.decrease">-1</button>
  </section>
</template>

<script setup lang="ts">
// @vr-name: Counter (Note: Tells the compiler what component name to generate)
import { computed, ref } from 'vue';

// Component name can also be defined using macros
defineOptions({ name: 'Counter' });

const step = ref(1);
const count = ref(0);
const title = computed(() => `Counter x${step.value}`);

const increment = () => {
  count.value += step.value;
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

## Step 2: Configure the Compiler

`vureact.config.js`

```js
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: 'src',
  // Key: Exclude the Vue entry file to avoid entry semantic conflicts
  exclude: ['src/main.ts'],
  output: {
    workspace: '.vureact',
    outDir: 'react-app',
    // Disable environment initialization for tutorial purposes to easily inspect pure compilation output
    bootstrapVite: false,
  },
});
```

## Step 3: Execute Compilation

```bash
npx vureact build
```

## Step 4: Inspect the Output Directory Tree

Compiled directory (illustrative):

```txt
my-app/
├─ .vureact/
│  ├─ cache/
│  │  └─ _metadata.json
│  └─ react-app/
│     └─ src/
│        └─ components/
│           ├─ Counter.tsx
│           └─ counter-<hash>.css
├─ src/
│  └─ ...
└─ vureact.config.js
```

## Step 5: Compare the Generated Results

Below is a typical formatted output (slightly simplified for explanation; actual hashes and property names are subject to local build artifacts):

```tsx
import { memo, useCallback, useMemo } from 'react';
import { useComputed, useVRef } from '@vureact/runtime-core';
import './counter-a1b2c3.css';

// Components are always wrapped with memo
const Counter = memo(() => {
  // ref/computed are converted to equivalent adaptation APIs
  const step = useVRef(1);
  const count = useVRef(0);
  const title = useComputed(() => `Counter x${step.value}`);

  // Automatically analyze dependencies of top-level arrow functions and add useCallback optimization
  const increment = useCallback(() => {
    count.value += step.value;
  }, [count.value, step.value]);

  // Automatically analyze dependencies in top-level objects and add useMemo optimization
  const methods = useMemo(
    () => ({
      decrease() {
        count.value -= step.value;
      },
    }),
    [count.value],
  );

  return (
    <>
      <section className="counter-card" data-css-a1b2c3>
        <h2 data-css-a1b2c3>{title.value}</h2>
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
2. Components are wrapped with `memo` by default
3. `ref` / `computed` are converted to runtime adaptation APIs (`useVRef` / `useComputed`)
4. Template event callbacks are generated as React-semantic `onClick`
5. Dependencies of top-level arrow functions are automatically analyzed and `useCallback` is added for optimization
6. Dependencies in top-level objects are automatically analyzed and `useMemo` is added for optimization
7. `.value` is appended to original `ref` state values in JSX
8. Less styles are compiled to CSS code
9. Scoped styles generate CSS files with hashes and annotate elements with scoped attributes

## Common Failure Points

- Failure to exclude `src/main.ts`
- Calling APIs that will be converted to Hooks outside the top level
- Unanalyzable expressions appearing in templates (triggering warnings)
- Disabling style preprocessing while using `scoped`, leading to scoping failure
