# v-model 语义对照

解析 Vue 中常见的 `v-model` 指令经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中的 v-model 指令用法。

## `v-model` → React 受控组件

`v-model` 是 Vue 中用于实现表单输入元素双向数据绑定的语法糖，它结合了 `v-bind` 和 `v-on` 的功能。

- Vue 代码：

```vue
<input v-model="keyword" />
```

- VuReact 编译后 React 代码：

```jsx
<input
  value={keyword.value}
  onChange={(value) => {
    keyword.value = value;
  }}
/>
```

从示例可以看到：Vue 的 `v-model` 指令被编译为 React 的受控组件模式。VuReact 采用 **受控组件编译策略**，将模板指令转换为 `value` 和 `onChange` 的组合，**完全保持 Vue 的双向绑定语义**——实现数据与视图的同步更新。

这种编译方式的关键特点在于：

1. **语义一致性**：完全模拟 Vue `v-model` 的行为，实现双向数据绑定
2. **受控组件模式**：使用 React 标准的受控组件实现
3. **事件处理**：自动处理输入事件和值更新
4. **响应式集成**：与 Vue 的响应式系统无缝集成

## 复选框

Vue 的 `v-model` 会根据输入元素的类型自动适配，VuReact 也保持了这种智能适配能力。

- Vue 代码：

```vue
<input type="checkbox" v-model="checked" />
<input type="checkbox" value="vue" v-model="frameworks" />
```

- VuReact 编译后 React 代码：

```jsx
<input
  type="checkbox"
  checked={checked.value}
  onChecked={(e) => {
    checked.value = e.target.checked;
  }}
/>
<input
  type="checkbox"
  value="vue"
  checked={frameworks.value}
  onChange={(e) => {
    frameworks.value = e.target.checked;
  }}
/>
```

## 单选按钮

- Vue 代码：

```vue
<input type="radio" value="male" v-model="gender" />
<input type="radio" value="female" v-model="gender" />
```

- VuReact 编译后 React 代码：

```jsx
<input
  type="radio"
  value="male"
  checked={gender.value === 'male'}
  onChange={() => { gender.value = 'male' }}
/>

<input
  type="radio"
  value="female"
  checked={gender.value === 'female'}
  onChange={() => { gender.value = 'female' }}
/>
```

## 下拉选择框

- Vue 代码：

```vue
<select v-model="selected">
  <option value="a">选项A</option>
  <option value="b">选项B</option>
</select>
```

- VuReact 编译后 React 代码：

```jsx
<select
  value={selected.value}
  onChange={(e) => {
    selected.value = e.target.value;
  }}
>
  <option value="a">选项A</option>
  <option value="b">选项B</option>
</select>
```

## `v-model.lazy` → React 事件处理函数

Vue 的 `v-model` 支持多种修饰符，用于控制数据更新的时机和格式。

- Vue 代码：

```vue
<input v-model.lazy="message" />
```

- VuReact 编译后 React 代码：

```jsx
<input
  value={message.value}
  onBlur={(e) => {
    message.value = e.target.value;
  }}
/>
```

## `v-model.number` 修饰符

- Vue 代码：

```vue
<input v-model.number="age" />
```

- VuReact 编译后 React 代码：

```jsx
<input
  value={age.value}
  onChange={(e) => {
    age.value = Number(e.target.value);
  }}
/>
```

## `v-model.trim` 修饰符

- Vue 代码：

```vue
<input v-model.trim="username" />
```

- VuReact 编译后 React 代码：

```jsx
<input
  value={username.value}
  onChange={(e) => {
    username.value = e.target.value?.trim();
  }}
/>
```

## 修饰符组合

- Vue 代码：

```vue
<input v-model.lazy.trim="search" />
```

- VuReact 编译后 React 代码：

```jsx
<input
  value={search.value}
  onBlur={(e) => {
    search.value = e.target.value?.trim();
  }}
/>
```

## 组件 `v-model` → React `props` 双向绑定

Vue 3 对组件的 `v-model` 进行了重大改进，支持多个 `v-model` 绑定和自定义修饰符。

- Vue 代码：

```vue
<!-- 父组件 -->
<CustomInput v-model="inputValue" />

<!-- 子组件 CustomInput.vue -->
<script setup lang="ts">
const props = defineProps(['modelValue']);
const emits = defineEmits(['update:modelValue']);
</script>

<template>
  <input :value="props.modelValue" @input="(e) => emits('update:modelValue', e.target.value)" />
</template>
```

- VuReact 编译后 React 代码：

```tsx
// 父组件
<CustomInput
  modelValue={inputValue.value}
  onUpdateModelValue={(value) => {
    inputValue.value = value;
  }}
/>;

// 子组件 CustomInput.tsx
type ICustomInputProps = {
  modelValue?: any;
  onUpdateModelValue?: (...args: any[]) => any;
};

function CustomInput(props: ICustomInputProps) {
  return (
    <input value={props.modelValue} onChange={(e) => props.onUpdateModelValue?.(e.target.value)} />
  );
}
```

## 带参数的 `v-model` → React `props` + 事件回调

- Vue 代码：

```vue
<UserForm v-model:name="userName" v-model:email="userEmail" />
```

- VuReact 编译后 React 代码：

```jsx
<UserForm
  name={userName.value}
  onUpdateName={(value) => {
    userName.value = value;
  }}
  email={userEmail.value}
  onUpdateEmail={(value) => {
    userEmail.value = value;
  }}
/>
```

## 总结

VuReact 的 v-model 编译策略展示了**完整的双向绑定转换能力**：

1. **基础表单元素**：将各种输入类型的 `v-model` 转换为对应的受控组件
2. **修饰符支持**：完整支持 `.lazy`、`.number`、`.trim` 等修饰符
3. **组件 v-model**：支持组件级别的双向绑定，包括多个 `v-model` 和自定义修饰符
4. **事件映射**：智能映射 Vue 事件到 React 事件（`input` → `onChange` 等）
5. **类型安全**：保持 TypeScript 类型定义的完整性

**不同类型元素的编译映射**：

| 元素类型                 | Vue 事件 | React 事件 | 值属性    |
| ------------------------ | -------- | ---------- | --------- |
| `input[type="text"]`     | `input`  | `onChange` | `value`   |
| `textarea`               | `input`  | `onChange` | `value`   |
| `input[type="checkbox"]` | `change` | `onChange` | `checked` |
| `input[type="radio"]`    | `change` | `onChange` | `checked` |
| `select`                 | `change` | `onChange` | `value`   |

VuReact 的编译策略确保了从 Vue 到 React 的平滑迁移，开发者无需手动重写表单绑定逻辑。编译后的代码既保持了 Vue 的语义和便利性，又符合 React 的表单处理最佳实践，让迁移后的应用保持完整的表单交互能力。
