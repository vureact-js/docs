# 编译约定

本页是必读规范。若不遵守，编译结果可能不符合 React 规则。

若你希望采用 AI 工具辅助和接管本编译器的前后流程，将获得显著优势。

编译器会尽量提供所有违规情况的友好提示，遵守约定是确保成功迁移的关键。

## A. 文件与入口约定

1. 建议只把可控目录纳入 `input` 编译器选项
2. 强烈建议把 Vue 入口（如 `src/main.ts`）加入 `exclude`
3. 先在小目录验证，再扩大范围
4. 清理 Vite 生成 React 工程时可能残留的无用文件（如 `src/index.css`、`src/App.css` 等），React `main.ts` 中也要删除对这些文件的引用

## B. Script 约定

1. 组件必须使用 Vue 3 `<script setup>` 语法
2. 宏/响应式/生命周期/钩子 API 必须位于顶层，禁止使用在条件、循环、嵌套函数、单导出
3. 其他 JavaScript 文件应遵守第 2 条约定，但允许在顶层函数内使用

### `<script setup>` 约定

#### ✅ 正确示例

```vue
<script setup>
 /* 宏/响应式/生命周期/钩子 API 仅在 <script setup> 顶层使用 */

 defineProps(...);

 const refValue  = ref();
 const state = reactive();
 const computedValue = computed();
 
 watch(...);
 onMounted(...);
 watchEffect(...);
</script>
```

#### ❌ 错误示例

```vue
<script setup>
 /* 
   在条件、循环、嵌套函数内使用会导致
   转换后的 React hook 不符合位置规范，最终引发运行时错误
  */

 if (condition) {
   defineProps(...); 
   const refValue  = ref(); 
 }

 function nested() {
   const state = reactive(); 
   watchEffect(...);
 }

 onMounted(() => {
   const computedValue = computed(); 
 });

 /* 单导出会导致在 React 组件函数内嵌套 export */
 export const singleExport = ref();
</script>
```

### `JavaScript` 文件约定

#### ✅ 正确示例

```ts
/* 仅在文件级顶层函数内使用：宏/响应式/生命周期/钩子 API */

export function customHook() {
  const refValue  = ref();
  const computedValue = computed();
 
  onMounted(...);
  watchEffect(...);
}
```

#### ❌ 错误示例

```ts
/* 在非在顶层函数内使用，如条件、循环、嵌套函数 */

export function customHook() {
  if (condition) {
    const refValue  = ref(); 
    onMounted(...);
  }

  const nested = () => {
    const computedValue = computed(); 
  }
}

/* 独立导出会导致转换后的 hook 脱离 React 组件作用域 */
export const state = reactive();
```

---

> 💡 关于 script 转换对照，详见 [Script 语义对照](/guide/semantic-comparison/script/ref)。

## C. Template 约定

1. 仅支持 Vue 官方提供的模板指令，未知指令不支持
2. 禁止使用 Vue 运行时魔法属性（如 `$attrs`、`$props`、`$emits` 等）
3. props/emits/slots/attrs 需通过 `defineProps`/`defineEmits`/`defineSlots`/`useAttrs` 显式声明，禁止隐式使用

### `props`/`emits`/`slots`/`attrs` 约定

#### ✅ 正确示例

```vue
<script setup lang="ts">
 /* 注：示例以 ts 方式编写，但也支持 js 方式 */
 const props = defineProps<Props>();
 const emits = defineEmits<Emits>();
 const attrs = useAttrs<Attrs>();
</script>

<template>
  <!-- 使用显式声明 -->
  <div v-if="props.condition" @click="emits('event')">
    {{ props.value }}
  </div>
  <button v-bind="attrs"></button>
</template>
```

#### ❌ 错误示例

```vue
<!-- 使用 Vue 运行时魔法属性 -->
<div v-if="$props.condition" @click="$emit('event')">
  {{ $props.value }}
</div>
<button v-bind="$attrs"></button>
```

---

> 💡 关于模板转换对照，详见 [Template 语义对照](/guide/semantic-comparison/template/v-bind)。

## D. Style 约定

1. 仅支持首个 `style` 块，多 `style` 不支持
2. 不使用 `cssVars`
3. 其他 CSS 文件约定遵守第 2 条

#### ✅ 正确示例

```vue
<style>
 /* 仅支持首个 style 块，不使用 cssVars */
 .class { ... }
</style>
```

#### ❌ 错误示例

```vue
<style>
  .class {
    /* 使用 cssVars */
    color: v-bind('color');
  }
</style> 

<!-- 多个 style 块 -->
<style></style>
<style></style>
```

---

> 💡 关于样式转换对照，详见 [Style 语义对照](/guide/semantic-comparison/style/basic)。

## E. 路由约定

我们提供了 [@vureact/router](https://router.vureact.top/) 路由适配包，该包完全复刻 Vue Router 4.x，在大部分场景下无需改动 Vue 端的路由代码，编译器将自动完成适配。要求路由入口文件必须使用 `export default` 导出路由实例，并在 `vureact.config.ts` 中指定路由入口文件路径。

详见[路由适配](/guide/router-adaptation)。

#### ✅ 正确示例

```ts
/* 
  假设路由入口文件：src/router/index.ts，
  需用 export default 导出如 createRouter 函数返回的路由实例
 */
export default createRouter( ... );
```

```ts
// vureact.config.ts
export default defineConfig({
  router: {
    /* 指定路由入口文件，编译器会自动处理路由适配 */
    configFile: 'src/router/index.ts',
  },
});
```

#### ❌ 错误示例

不按路由约定改造路由入口文件，或不指定路由入口文件，导致编译器无法正确处理路由适配。

---

> 💡 关于路由转换对照，详见[路由语义对照](/guide/semantic-comparison/script/vue-router)。
