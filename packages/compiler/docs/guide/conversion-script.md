# 脚本转换指南

本页按“Vue 输入 -> React 输出（示意）”展示 Script 层常见与进阶转换。

> 说明：示例为简化对照，具体导入名、类型名、包装结构以本地编译产物为准。

## 1. 响应式 API 映射（核心）

| Vue API                                               | 输出适配 API                                                   |
| ----------------------------------------------------- | -------------------------------------------------------------- |
| `ref`                                                 | `useVRef`                                                      |
| `reactive`                                            | `useReactive`                                                  |
| `computed`                                            | `useComputed`                                                  |
| `readonly`                                            | `useReadonly`                                                  |
| `toRef` / `toRefs`                                    | `useToVRef` / `useToVRefs`                                     |
| `watch`                                               | `useWatch`                                                     |
| `watchEffect` / `watchPostEffect` / `watchSyncEffect` | `useWatchEffect` / `useWatchPostEffect` / `useWatchSyncEffect` |
| `onMounted` / `onUnmounted`                           | `useMounted` / `useUnmounted`                                  |
| `onBeforeUpdate` / `onUpdated`                        | `useBeforeUpdate` / `useUpdated`                               |

更多详细内容请移步 [运行时 Hooks 文档](https://runtime.vureact.top/guide/hooks/reactive.html)

### 示例：`ref` + `computed`

Vue 输入：

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';

const state = ref(1);
const double = computed(() => state.value * 2);
</script>
```

React 输出（示意）：

```tsx
import { useComputed, useVRef } from '@vureact/runtime-core';

const state = useVRef(1);
const double = useComputed(() => state.value * 2);
```

## 2. 宏 API

### `defineProps`（类型参数 + 运行时写法）

Vue 输入：

```vue
<script setup lang="ts">
const props = defineProps<{ id: string; enabled?: boolean }>();
</script>
```

React 输出（示意）：

```tsx
type ICompProps = {
  id: string;
  enabled?: boolean;
};

const Comp = (props: ICompProps) => {
  // ...
};
```

补充：`defineProps(['foo', 'bar'])`、`defineProps({ ... })` 也会做类型推导，但建议优先类型参数形式。

### `defineEmits` 与事件名映射

Vue 输入：

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'save-item', payload: { id: string }): void;
  (e: 'update:name', value: string): void;
}>();

const submit = () => {
  emit('save-item', { id: '1' });
  emit('update:name', 'next');
};
</script>
```

React 输出（示意）：

```tsx
type ICompProps = {
  onSaveItem?: (payload: { id: string }) => void;
  onUpdateName?: (value: string) => void;
};

const submit = useCallback(() => {
  props.onSaveItem?.({ id: '1' });
  props.onUpdateName?.('next');
}, [props.onSaveItem, props.onUpdateName]);
```

### `defineSlots` 与 slot 类型

Vue 输入：

```vue
<script setup lang="ts">
const slots = defineSlots<{
  default?(): any;
  footer(props: { count: number }): any;
}>();
</script>
```

React 输出（示意）：

```tsx
type ICompProps = {
  children?: React.ReactNode;
  footer?: (props: { count: number }) => React.ReactNode;
};
```

### `defineOptions` 与组件名

Vue 输入：

```vue
<script setup lang="ts">
defineOptions({
  name: 'MyComponent',
  inheritAttrs: false,
});
</script>
```

React 输出（示意）：

```tsx
const MyComponent = () => {};
// inheritAttrs 在 React 中无直接对应概念，会被忽略
```

说明：

- 其他选项如 `inheritAttrs`、`customOptions` 等，在 React 中无直接对应概念，会被忽略或警告
- 建议优先使用特殊注释 `// @vr-name: Xxxx` 定义组件名

### `defineExpose` 与组件数据暴露

Vue 输入：

```vue
<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ title: string }>();

const count = ref(0);
const increment = () => count.value++;

defineExpose({
  count,
  increment,
});
</script>
```

React 输出（示意）：

```tsx
import { forwardRef, useImperativeHandle, memo } from 'react';
import { useVRef } from '@vureact/runtime-core';

type IComponentProps = { title: string };

const Component = memo(
  forwardRef<any, IComponentProps>((props, expose) => {
    const count = useVRef(0);

    const increment = () => count.value++;

    useImperativeHandle(expose, () => ({
      count,
      increment,
    }));

    return <div>{count.value}</div>;
  }),
);

export default Component;
```

说明：

- `defineExpose` 转换为 `forwardRef` + `useImperativeHandle` 组合
- 暴露的 ref 对象保持 `.value` 访问方式，与 Vue 保持一致
- 父组件通过 `ref.current.count.value` 访问暴露的值
- ref 类型使用 `any`，props 类型正常添加，开发者可手动添加具体类型

父组件使用示例：

```tsx
// 父组件
const Parent = () => {
  const childRef = useRef<{ count: { value: number }; increment: () => void }>();

  useEffect(() => {
    // 访问子组件暴露的内容
    console.log(childRef.current?.count.value); // 0
    childRef.current?.increment(); // 调用子组件方法
    console.log(childRef.current?.count.value); // 1
  }, []);

  return <Component ref={childRef} />;
};
```

### `defineAsyncComponent` 与动态异步组件导入

Vue 输入：

```vue
<script setup lang="ts">
const AsyncPanel = defineAsyncComponent(() => import('./Panel.vue'));
</script>
```

React 输出（示意）：

```tsx
const AsyncPanel = lazy(() => import('./Panel.jsx'));
```

约束：仅支持 ESM 动态 `import('...')` 形式。

## 3. `useTemplateRef`：`useRef` + `.current`

Vue 输入：

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue';

const pRef = useTemplateRef<HTMLParagraphElement>('p');
</script>
```

React 输出（示意）：

```tsx
import { useRef } from 'react';

const pRef = useRef<HTMLParagraphElement | null>(null);
```

同时，脚本中该 ref 的访问会从 `.value` 转为 `.current`（如 `pRef.value` -> `pRef.current`）。

## 4. `watchEffect` / 生命周期：补充依赖参数

Vue 输入：

```vue
<script setup lang="ts">
watchEffect(() => {
  console.log(state.value);
});

onUpdated(() => {
  console.log(state.value);
});
</script>
```

React 输出（示意）：

```tsx
useWatchEffect(() => {
  console.log(state.value);
}, [state.value]);

useUpdated(() => {
  console.log(state.value);
}, [state.value]);
```

转换为 Provider 适配结构与 useInject 钩子

Vue 输入：

```vue
父组件

<script setup lang="ts">
provide('theme', theme);
</script>

子组件

<script setup lang="ts">
const theme = inject<string>('theme');
</script>
```

React 输出（示意）：

```tsx
父组件

<Provider name={'theme'} value={theme}>
  {/* children */}
</Provider>

子组件

const theme = useInject<string>('theme');
```

## 7. 静态提升与优化

### 静态提升

### `const`

针对**顶层常量声明** ，若其初始值为 JavaScript 基础数据类型的字面量（如字符串、数字、布尔值等），则会被提升至组件外部。

Vue 输入：

```vue
<script setup lang="ts">
const defaultValue = 1;
const isEnabled = true;
</script>
```

React 输出（示意）：

```tsx
const defaultValue = 1;
const isEnabled = true;

// 示例组件
const Component = memo(() => {
  return <></>;
});
```

### 优化：自动依赖分析

编译器内置了强大的依赖分析器，遵循 React 规则，智能分析`顶层箭头函数`与`顶层变量声明`的依赖关系。

### `useCallback`

针对**顶层箭头函数**，若其函数体中存在可分析依赖，则会自动进行优化

Vue 输入：

```vue
<script setup lang="ts">
const inc = () => {
  count.value++;
};

const fn = () => {};

const fn2 = () => {
  const value = foo.value;
  const fn4 = () => {
    value + state.bar.c--;
  };

  fn();
};
</script>
```

React 输出（示意）：

```tsx
const inc = useCallback(() => {
  count.value++;
}, [count.value]);

const fn = () => {};

const fn2 = useCallback(() => {
  // 对初始值进行溯源，并收集 foo.value
  const value = foo.value;

  // 忽略对局部箭头函数的优化
  const fn4 = () => {
    value + state.bar.c--;
  };

  fn();
}, [foo.value, state.bar.c]);
```

### `useMemo`

针对**顶层变量声明**且带有初始值的，若其初始值表达式中存在可分析依赖，则会自动进行优化

Vue 输入：

```vue
<script setup lang="ts">
const fooRef = ref(0);
const reactiveState = reactive({ foo: 'bar', bar: { c: 1 } });

const memoizedObj = {
  title: 'test',
  bar: fooRef.value,
  add: () => {
    reactiveState.bar.c++;
  },
};

const staticObj = {
  foo: 1,
  state: { bar: { c: 1 } },
};

const staticList = [1, 2, 3];

const reactiveList = [fooRef.value, 1, 2];

const mixedList = [
  { name: reactiveState.foo, age: fooRef.value },
  { name: 'A', age: 20 },
];

const nestedObj = {
  a: {
    b: {
      c: reactiveList[0],
      d: () => {
        return memoizedObj.bar;
      },
    },
    e: mixedList,
  },
};

const computeFn = () => {
  memoizedObj.add();
  return nestedObj.a.b.d();
};

const formattedValue = memoizedObj.bar.toFixed(2);
</script>
```

React 输出（示意）：

```tsx
const memoizedObj = useMemo(
  () => ({
    title: 'test',
    bar: fooRef.value,
    add: () => {
      reactiveState.bar.c++;
    },
  }),
  [fooRef.value, reactiveState.bar.c],
);

// 无依赖
const staticObj = {
  foo: 1,
  state: {
    bar: {
      c: 1,
    },
  },
};

const reactiveList = useMemo(() => [fooRef.value, 1, 2], [fooRef.value]);

// 无依赖
const staticList = [1, 2, 3];

const mixedList = useMemo(
  () => [
    {
      name: reactiveState.foo,
      age: fooRef.value,
    },
    {
      name: 'A',
      age: 20,
    },
  ],
  [reactiveState.foo, fooRef.value],
);

const nestedObj = useMemo(
  () => ({
    a: {
      b: {
        c: reactiveList[0],
        d: () => {
          return memoizedObj.bar;
        },
      },
      e: mixedList,
    },
  }),
  [reactiveList[0], memoizedObj.bar, mixedList],
);

const computeFn = useMemo(
  () => () => {
    memoizedObj.add();
    return nestedObj.a.b.d();
  },
  [memoizedObj, nestedObj.a.b],
);

const formattedValue = useMemo(() => memoizedObj.bar.toFixed(2), [memoizedObj.bar]);
```

## 8. 路由 API（在 router 生态接入时）

| Vue Router API                                                      | 输出适配 API                                                           |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `createRouter`                                                      | `createRouter`                                                         |
| `useRoute` / `useRouter` / `useLink`                                | `useRoute` / `useRouter` / `useLink`                                   |
| `onBeforeRouteLeave` / `onBeforeRouteUpdate` / `onBeforeRouteEnter` | `useBeforeRouteLeave` / `useBeforeRouteUpdate` / `useBeforeRouteEnter` |
| `createWebHistory` / `createWebHashHistory` / `createMemoryHistory` | `createWebHistory` / `createWebHashHistory` / `createMemoryHistory`    |

## 9. `useAttrs`：透传属性处理

Vue 的 `useAttrs()` 用于获取未在 `defineProps` / `defineProps` 中声明的透传属性（如 `class`、`style`、自定义属性等）。在 React 中，所有属性都通过 `props` 传递，因此 `useAttrs()` 被转换为对 `props` 的引用。

> 透传 Attribute 本质上是一个无类型约束的 JavaScript 运行时对象，它会与已声明的 props 合并，共同构成组件的最终属性集合。

### 基本转换

Vue 输入：

```vue
<script setup lang="ts">
const attrs = useAttrs();
</script>
```

React 输出（示意）：

```tsx
const attrs = props as Record<string, unknown>;
```

### TypeScript 类型处理

编译器会根据不同情况自动添加适当的类型断言：

1. **默认类型**：若未指定类型，使用 `Record<string, unknown>`
2. **类型断言**：若已有类型断言，会保留类型注解
3. **变量类型注解**：若变量有类型注解，会使用该类型
4. **Props 类型处理**：若组件未声明 `props`，则自动添加 props 参数并应用默认类型；若已声明 props，则将其与默认类型进行交叉合并。

#### 示例：多种类型用法

Vue 输入：

```vue
<script setup lang="ts">
interface Attrs {
  class?: string;
  style?: string;
  [key: string]: unknown;
}

// 基本用法
const attrs = useAttrs();

// 解构 + 类型断言
const { style, class: cls } = useAttrs() as Attrs;

// 带类型注解
const typeAnnotation: Attrs = useAttrs();
</script>
```

React 输出（示意）：

```tsx
interface Attrs {
  class?: string;
  style?: string;
  [key: string]: unknown;
}

// 基本用法
const attrs = props as Record<string, unknown>;

// 解构 + 类型断言
const { style, class: cls } = props as Attrs;

// 带类型注解
const typeAnnotation = props as Attrs;
```

### 模板中的使用

在模板中访问 `attrs` 的属性时，编译器会正确处理可选链操作符和动态属性访问：

Vue 输入：

```vue
<template>
  <div
    :class="[
      'red',
      attrs.class,
      attrs.xx.class,
      attrs['class'],
      attrs.xx['class'],
      attrs?.['class'],
    ]"
  >
    {{ attrs?.xxx?.['class'] }}
  </div>
</template>
```

React 输出（示意）：

```tsx
<div
  className={dir.cls([
    'red',
    attrs.class,
    attrs.xx.class,
    attrs['class'],
    attrs.xx['class'],
    attrs?.['class'],
  ])}
>
  {attrs?.xxx?.['class']}
</div>
```

### JavaScript 环境

在纯 JavaScript 环境中，`useAttrs()` 会直接替换为 `props` 引用：

Vue 输入：

```vue
<script setup>
const attrs = useAttrs();
</script>
```

React 输出（示意）：

```tsx
const attrs = props;
```

### 注意事项

1. **属性合并**：在 React 中，`props` 包含了所有传入的属性，包括已声明的和未声明的
2. **类型安全**：建议为 `useAttrs()` 添加明确的类型注解，以获得更好的类型提示
3. **属性访问**：在模板中访问 `attrs` 属性时，可选链操作符会被正确保留
4. **与 `defineProps` 的关系**：`useAttrs()` 获取的是未在 `defineProps` 中声明的属性，但在 React 转换后，所有属性都通过 `props` 访问

### 完整示例

Vue 输入：

```vue
<template>
  <div :class="attrs.class" :style="attrs.style">
    {{ attrs.title }}
  </div>
</template>

<script setup lang="ts">
interface CustomAttrs {
  class?: string;
  style?: string;
  title?: string;
}

const props = defineProps<{ id: string }>();
const attrs = useAttrs() as CustomAttrs;
</script>
```

React 输出（示意）：

```tsx
interface CustomAttrs {
  class?: string;
  style?: string;
  title?: string;
}

type ICompProps = {
  id: string;
};

const Comp = memo((props: ICompProps & Record<string, unknown>) => {
  const attrs = props as CustomAttrs;

  return (
    <div className={attrs.class} style={attrs.style}>
      {attrs.title}
    </div>
  );
});
```

## 10. 强约束与常见失败点

1. 宏只能在 SFC 顶层，且必须赋值给变量
2. 将被转为 Hook 的调用必须满足 React 顶层规则
3. 动态/不可分析写法会告警、报错或被保守处理
4. 事件名建议使用稳定的字符串，避免动态 `emit(eventName)` 写法
5. 透传 Attribute 应使用显式的 `useAttrs()`，并手动使用其返回值

## 下一步

- 查看 [Style 转换指南](./conversion-style) - 了解样式转换规则
- 查看 [运行时 Hooks 文档](https://runtime.vureact.top/guide/hooks/reactive.html) - 了解运行时 API 详细用法
