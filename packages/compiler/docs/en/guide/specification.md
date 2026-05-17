# Compilation Conventions

This page contains mandatory conventions. If not followed, the compilation output may not comply with React rules.

Using AI tools to assist and manage the compiler workflow can provide a significant advantage.

The compiler will try to offer friendly warnings for violations, and following these conventions is key to a successful migration.

## A. File and Entry Conventions

1. It is recommended to include only controllable directories in the `input` compiler option.
2. It is strongly recommended to add the Vue entry file (such as `src/main.ts`) to `exclude`.
3. Verify in a small directory first, then expand the scope.
4. Remove any unused files that Vite may leave behind when generating a React project (such as `src/index.css`, `src/App.css`, etc.), and also remove references to those files from the React `main.ts`.

## B. Script Conventions

1. Components must use Vue 3 `<script setup>` syntax.
2. Macros / reactivity / lifecycle / hook APIs must be used at the top level and are prohibited inside conditionals, loops, nested functions, or single exports.
3. Other JavaScript files should follow rule #2, but usage is allowed inside top-level functions.

### `<script setup>` Conventions

#### ✅ Valid Example

```vue
<script setup>
 /* 
   Macros / reactivity / lifecycle / hook APIs must 
   only be used at the top level of <script setup> 
  */

 defineProps(...);

 const refValue = ref();
 const state = reactive();
 const computedValue = computed();
 
 watch(...);
 onMounted(...);
 watchEffect(...);
</script>
```

#### ❌ Invalid Example

```vue
<script setup>
 /* 
   Using these APIs inside conditionals, loops, or nested functions
   causes the transformed React hooks to violate positional rules 
   and eventually trigger runtime errors.
  */

 if (condition) {
   defineProps(...);
   const refValue = ref();
 }

 function nested() {
   const state = reactive();
   watchEffect(...);
 }

 onMounted(() => {
   const computedValue = computed();
 });

 /* 
   A single export can cause nested export 
   inside a React component function 
  */
 export const singleExport = ref();
</script>
```

### `JavaScript` File Conventions

#### ✅ Valid Example

```ts
/* 
  Macros / reactivity / lifecycle / hook APIs should 
  only be used inside top-level functions in the file 
 */

export function customHook() {
  const refValue = ref();
  const computedValue = computed();
 
  onMounted(...);
  watchEffect(...);
}
```

#### ❌ Invalid Example

```ts
/* 
  Using these APIs outside a top-level function, 
  such as inside conditionals, loops, or nested functions 
 */

export function customHook() {
  if (condition) {
    const refValue = ref();
    onMounted(...);
  }

  const nested = () => {
    const computedValue = computed();
  }
}

/* 
  An independent export can cause the transformed hook 
  to be detached from the React component scope 
 */
export const state = reactive();
```

---

> 💡 For script conversion reference, see [Script Semantic Comparison](/en/guide/semantic-comparison/script/ref).

## C. Template Conventions

1. Only Vue's official template directives are supported; unknown directives are not supported.
2. Do not use Vue runtime magic properties such as `$attrs`, `$props`, `$emits`, etc.
3. Props / emits / slots / attrs must be explicitly declared using `defineProps` / `defineEmits` / `defineSlots` / `useAttrs`; implicit usage is prohibited.

### Props / Emits / Slots / Attrs Conventions

#### ✅ Valid Example

```vue
<script setup lang="ts">
 /* Note: the example is written in TS, but JS is also supported */
 const props = defineProps<Props>();
 const emits = defineEmits<Emits>();
 const attrs = useAttrs<Attrs>();
</script>

<template>
  <!-- Use explicit declarations -->
  <div v-if="props.condition" @click="emits('event')">
    {{ props.value }}
  </div>
  <button v-bind="attrs"></button>
</template>
```

#### ❌ Invalid Example

```vue
<!-- Using Vue runtime magic properties -->
<div v-if="$props.condition" @click="$emit('event')">
  {{ $props.value }}
</div>
<button v-bind="$attrs"></button>
```

---

> 💡 For template conversion reference, see [Template Semantic Comparison](/en/guide/semantic-comparison/template/v-bind).

## D. Style Conventions

1. Only the first `style` block is supported; multiple `style` blocks are not supported.
2. Do not use `cssVars`.
3. Other CSS file conventions should follow rule #2.

#### ✅ Valid Example

```vue
<style>
 /* 
   Only the first style block is supported, 
   and cssVars are not allowed 
  */
 .class { ... }
</style>
```

#### ❌ Invalid Example

```vue
<style>
  .class {
    /* Using cssVars */
    color: v-bind('color');
  }
</style> 

<!-- Multiple style blocks -->
<style></style>
<style></style>
```

> 💡 For style conversion reference, see [Style Semantic Comparison](/en/guide/semantic-comparison/style/basic).

## E. Routing Conventions

We provide the [@vureact/router](https://router.vureact.top/en) routing adaptation package, which fully mirrors Vue Router 4.x. In most cases, you do not need to change the Vue-side routing code, and the compiler will automatically handle adaptation. The routing entry file must export the router instance with `export default`, and the route entry file path must be specified in `vureact.config.ts`.

See [Routing Adaptation](/en/guide/router-adaptation) for details.

#### ✅ Valid Example

```ts
/* 
  Assume the routing entry file is src/router/index.ts.
  It must export the router instance returned 
  by createRouter using export default.
 */
export default createRouter( ... );
```

```ts
// vureact.config.ts
export default defineConfig({
  router: {
    /* 
      Specify the route entry file, 
      and the compiler will automatically handle route adaptation 
     */
    configFile: 'src/router/index.ts',
  },
});
```

#### ❌ Invalid Example

If the routing entry file is not adapted according to the routing conventions, or if the routing entry file is not specified, the compiler cannot correctly handle route adaptation.

---

> 💡 For routing conversion reference, see [Routing Semantic Comparison](/en/guide/semantic-comparison/script/vue-router).
