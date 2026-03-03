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

## 2. 宏：`defineProps` / `defineEmits` / `defineSlots`

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

## 5. `defineAsyncComponent`：映射到 `React.lazy`

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

## 6. `provide`/`inject`

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

// 由于被 fn2 调用，因此被追加为 useCallback
const fn = useCallback(() => {}, []);

const fn2 = useCallback(() => {
  // 对初始值进行溯源，并收集 foo.value
  const value = foo.value;

  // 忽略对局部箭头函数的优化
  const fn4 = () => {
    value + state.bar.c--;
  };

  // 调用普通函数
  fn();
}, [foo.value, state.bar.c, fn]);
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

## 9. 强约束与常见失败点

1. 宏只能在 SFC 顶层，且必须赋值给变量
2. 将被转为 Hook 的调用必须满足 React 顶层规则
3. 动态/不可分析写法会告警、报错或被保守处理
4. 事件名建议稳定字符串，避免动态 `emit(eventName)`
5. 没有对路由配置内容进行手动调校，如没有将 `component` 选项的值改为 JSX 标签写法

## 下一步

- 查看 [Style 转换指南](./conversion-style) - 了解样式转换规则
- 查看 [运行时 Hooks 文档](https://runtime.vureact.top/guide/hooks/reactive.html) - 了解运行时 API 详细用法
