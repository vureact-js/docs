# defineModel 语义对照

解析 Vue 中常见的 `defineModel` 宏经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 `defineModel` 的 API 用法与核心行为；
3. 仅支持 `type`、`default`、`required` 选项及自定义 prop name。
4. 不支持返回值使用数组解构方式。

## `defineModel` → `useVRef` + `useUpdated` 自动通知

`defineModel` 是 Vue 3 `<script setup>` 中用于简化 `v-model` 双向绑定声明的宏。Vue 中 `defineModel` 会在编译时自动创建一个 `ref` 并生成对应的 `modelValue` prop 和 `update:modelValue` 事件。VuReact 会将它编译为 [useVRef](https://runtime.vureact.top/guide/hooks/v-ref.html) 将 **prop 值转为响应式 ref**，同时配合 [useUpdated](https://runtime.vureact.top/guide/hooks/updated.html) 实现**值变化时自动触发 `onUpdate:xxx` 回调通知父组件**。

- Vue 代码：

```ts
// 声明 "state" prop，由父组件通过 v-model:state 使用
const state = defineModel<string>('state');

// 声明带选项的 "modelValue" prop，由父组件通过 v-model 使用
const modelValue = defineModel({ default: 'xxx' });
```

- VuReact 编译后 React 代码：

```tsx
type IChildProps = {
  state?: string;
  modelValue?: string;
} & {
  onUpdateState?: (arg: string) => void;
  onUpdateModelValue?: (arg: string) => void;
};

// 声明 "state" prop，由父组件通过 v-model:state 使用
const state = useVRef<string>(props.state);

// 声明带选项的 "modelValue" prop，由父组件通过 v-model 使用
const modelValue = useVRef<string>(props.modelValue ?? 'xxx');

// 值变化时自动通知父组件
useUpdated(() => {
  props.onUpdateState?.(state.value);
}, [state.value]);

useUpdated(() => {
  props.onUpdateModelValue?.(modelValue.value);
}, [modelValue.value]);
```

从示例可以看到：Vue 的 `defineModel` 被分解为三部分：

1. **prop 类型声明** → `IChildProps` 类型中的非事件字段（`state?`、`modelValue?`）；
2. **事件回调声明** → `IChildProps` 类型中的 `onUpdateXxx` 事件回调字段；
3. **运行时响应式** → `useVRef` 将 prop 初始值转为响应式 ref，`useUpdated` 监听值变化并自动调用父组件传入的回调。

**VuReact 保证组件内直接修改 `defineModel` ref 的 `.value` 就能触发父组件更新，与 Vue 开发体验完全一致。**

## `defineModel(name, options)` → 带默认值与类型约束的 prop 声明

`defineModel` 支持传入 `name` 指定 prop 名称，以及仅支持 `type`、`default`、`required` 选项。VuReact 会将这些选项转换为对应的 React 类型约束和默认值处理：

- Vue 代码：

```ts
// 声明带选项的 "count" prop，由父组件通过 v-model:count 使用
const count = defineModel<number>('count', {
  type: Number,
  default: 0,
  required: true,
});
```

- VuReact 编译后 React 代码：

```tsx
type IChildProps = {
  count: number;  // required: true → 非可选类型
} & {
  onUpdateCount?: (arg: number) => void;
};

const count = useVRef<number>(props.count ?? 0); // default: 0 → 默认值回退
```

从示例可以看到：

- `required: true` 使 `count` 在类型定义中变为必填（`count: number`），而非可选（`count?: number`）；
- `default: 0` 通过 `??` 空值合并运算符实现，在父组件未传递 prop 时使用默认值 `0`；
- `type: Number` 影响类型定义中的泛型参数（`<number>`），VuReact 会利用此信息生成准确的 TypeScript 类型。

## 不支持的 `defineModel` 用法

VuReact 明确不支持以下 `defineModel` 用法，编译时会跳过和报错：

### 1. 返回值数组解构

```vue
<script setup lang="ts">
// 不支持的写法（Vue 3.4+ 实验特性）
const [arg1, arg2] = defineModel();
</script>
```

Vue 3.4+ 支持将 `defineModel` 返回值解构为 `[model, modifiers]` 元组，用于获取修饰符状态。VuReact 暂不支持此语法，建议使用标准写法：

```vue
<script setup lang="ts">
// 支持的写法
const model = defineModel();
</script>
```

### 2. get / set / validator 选项

```vue
<script setup lang="ts">
// 不支持的写法
const modelValue = defineModel({
  get() {},
  set() {},
  validator() {},
});
</script>
```

Vue 中 `defineModel` 支持 `get`、`set` 自定义存取器和 `validator` 验证函数。VuReact 暂不支持这些选项，建议直接使用 `useVRef` 自行实现自定义逻辑。

## `modelValue` 属性覆盖赋值 → 保持与 Vue 一致的 `.value` 修改

在 Vue 中，`defineModel` 返回的是一个 `ref` 对象，需要通过 `.value` 访问和修改状态；在 React 中，VuReact 编译后依然保留 `.value` 的访问方式：

- Vue 代码：

```ts
const state = defineModel<string>('state');

const update = () => {
  state.value = 'hello'; // 直接赋值修改
};
```

- VuReact 编译后 React 代码：

```tsx
const state = useVRef<string>(props.state);

const update = useCallback(() => {
  state.value = 'hello'; // 直接赋值修改，自动触发 props.onUpdateState 回调
}, [state.value]);
```

VuReact 会为 `update` 等涉及 `state.value` 的函数自动包裹 `useCallback`，并在依赖数组中正确添加 `state.value`，**让开发者无需改变 Vue 中的赋值习惯**，`state.value = 'hello'` 即可同时完成组件内状态更新和父组件的双向绑定同步。

## `v-model` 模板绑定 → React 受控组件

在 Vue 模板中，可以直接使用 `v-model` 绑定由 `defineModel` 声明的 ref；在 React 中，VuReact 会编译为受控组件的 `value` + `onChange` 模式：

- Vue 模板：

```vue
<input v-model="modelValue" />
<div>Parent bound v-model is: {{ count }}</div>
<button @click="update">Increment</button>
```

- React 编译后 JSX：

```tsx
<input
  value={modelValue}
  onChange={(e) => {
    modelValue = e.target.value;
  }}
/>
<div>Parent bound v-model is:{count.value}</div>
<button onClick={update}>Increment</button>
```

`v-model` 在 VuReact 中被转换为受控组件的标准 React 模式：

- `value` 绑定 ref 的值；
- `onChange` 中直接修改 ref 值，触发 `useUpdated` 自动同步给父组件；

## defineModel 综合示例

完整的 `defineModel` 单文件组件编译前后对照，可参考以下代码：

- Vue 代码（`input.vue`）：

```vue
<script setup lang="ts">
// @vr-name: Child

// 声明 "state" prop，由父组件通过 v-model:state 使用
const state = defineModel<string>('state');

// 声明带选项的 "modelValue" prop，由父组件通过 v-model 使用
const modelValue = defineModel({ default: 'xxx' });

// 声明带选项的 "count" prop，由父组件通过 v-model:count 使用
const count = defineModel<number>('count', {
  type: Number,
  default: 0,
  required: true,
});

const update = () => {
  state.value = 'hello';
  count.value++;
};
</script>

<template>
  <input v-model="modelValue" />
  <div>Parent bound v-model is: {{ count }}</div>
  <button @click="update">Increment</button>
</template>
```

- VuReact 编译后 React 代码（`output.tsx`）：

```tsx
import { useCallback, memo } from 'react';
import { useVRef, useUpdated } from '@vureact/runtime-core';

export type IChildProps = {
  state?: string;
  modelValue?: string;
  count: number;
} & {
  onUpdateState?: (arg: string) => void;
  onUpdateModelValue?: (arg: string) => void;
  onUpdateCount?: (arg: number) => void;
};

const Child = memo((props: IChildProps) => {
  const state = useVRef<string>(props.state);
  const modelValue = useVRef<string>(props.modelValue ?? 'xxx');
  const count = useVRef<number>(props.count ?? 0);

  const update = useCallback(() => {
    state.value = 'hello';
    count.value++;
  }, [state.value, count.value]);

  useUpdated(() => {
    props.onUpdateState?.(state.value);
  }, [state.value]);

  useUpdated(() => {
    props.onUpdateModelValue?.(modelValue.value);
  }, [modelValue.value]);
  
  useUpdated(() => {
    props.onUpdateCount?.(count.value);
  }, [count.value]);

  return (
    <>
      <input
        value={modelValue}
        onChange={(e) => {
          modelValue = e.target.value;
        }}
      />
      <div>Parent bound v-model is:{count.value}</div>
      <button onClick={update}>Increment</button>
    </>
  );
});

export default Child;
```
