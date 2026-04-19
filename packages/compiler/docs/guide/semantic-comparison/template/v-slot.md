# v-slot 语义对照

[VuReact](https://vureact.top/guide/introduction.html) 是一个能将 Vue 3 代码编译为标准、可维护 React 代码的工具。今天就带大家直击核心：Vue 中常见的 `v-slot` 指令经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中的 v-slot 指令用法。

### `v-slot` → React `children` / `props`

`v-slot`（简写为 `#`） 是 Vue 中用于定义和使用插槽的指令，用于实现组件的内容分发和复用。

- Vue 代码：

```vue
<!-- 父组件 -->
<MyComponent>
  <template #default>
    <p>默认插槽内容</p>
  </template>
</MyComponent>

<!-- 或简写 -->
<MyComponent>
  <p>默认插槽内容</p>
</MyComponent>
```

- VuReact 编译后 React 代码：

```jsx
// 父组件
<MyComponent>
  <p>默认插槽内容</p>
</MyComponent>
```

从示例可以看到：Vue 的默认插槽被直接编译为 React 的 children。VuReact 采用 **children 编译策略**，将模板插槽转换为 React 的标准 children 传递方式，**完全保持 Vue 的默认插槽语义**——将内容作为子元素传递给组件。

这种编译方式的关键特点在于：

1. **语义一致性**：完全模拟 Vue 默认插槽的行为，实现内容分发
2. **React 原生支持**：使用 React 标准的 children 机制，无需额外适配
3. **语法简化**：Vue 的 `<template #default>` 简化为直接传递子元素
4. **性能优化**：直接使用 React 的原生机制，无运行时开销

## 具名插槽 → React `props`

Vue 支持多个具名插槽，用于更灵活的内容分发。

- Vue 代码：

```vue
<!-- 父组件 -->
<Layout>
  <template #header>
    <h1>页面标题</h1>
  </template>

  <template #main>
    <p>主要内容区域</p>
  </template>

  <template #footer>
    <p>页脚信息</p>
  </template>
</Layout>
```

- VuReact 编译后 React 代码：

```jsx
// 父组件
<Layout header={<h1>页面标题</h1>} main={<p>主要内容区域</p>} footer={<p>页脚信息</p>} />
```

从示例可以看到：Vue 的具名插槽被编译为 React 的 props。VuReact 采用 **props 编译策略**，将具名插槽转换为组件的 props 属性，**完全保持 Vue 的具名插槽语义**——通过不同的 prop 名称区分不同的插槽内容。

## 作用域插槽 → React `函数 props`

Vue 的作用域插槽允许子组件向父组件传递数据，实现更灵活的渲染控制。

- Vue 代码：

```vue
<!-- 父组件 -->
<datalist :items="users">
  <template #item="slotProps">
    <div class="user-item">
      <span>{{ slotProps.user.name }}</span>
      <span>{{ slotProps.user.age }}岁</span>
    </div>
  </template>
</datalist>

<!-- 子组件 DataList.vue -->
<template>
  <ul>
    <li v-for="item in props.items" :key="item.id">
      <slot name="item" :user="item"></slot>
    </li>
  </ul>
</template>
```

- VuReact 编译后 React 代码：

```jsx
// 父组件
<DataList
  items={users}
  item={(slotProps) => (
    <div className="user-item">
      <span>{slotProps.user.name}</span>
      <span>{slotProps.user.age}岁</span>
    </div>
  )}
/>;

// 子组件 DataList.jsx
function DataList(props) {
  return (
    <ul>
      {props.items.map((itemData) => (
        <li key={itemData.id}>{props.item?.({ user: itemData })}</li>
      ))}
    </ul>
  );
}
```

从示例可以看到：Vue 的作用域插槽被编译为 React 的函数 props。VuReact 采用 **函数 props 编译策略**，将作用域插槽转换为接收参数的函数 prop，**完全保持 Vue 的作用域插槽语义**——子组件通过函数调用向父组件传递数据，父组件通过函数参数接收数据并渲染。

## 动态插槽名 → React 计算属性

Vue 支持动态的插槽名称，用于更灵活的插槽选择。

- Vue 代码：

```vue
<BaseLayout>
  <template #[dynamicSlotName]> 动态插槽内容 </template>
</BaseLayout>
```

- VuReact 编译后 React 代码：

```jsx
<BaseLayout {...{ [dynamicSlotName]: '动态插槽内容' }} />
```

**编译策略**：

1. **计算属性名**：使用对象计算属性语法 `{ [key]: value }`
2. **对象展开**：通过对象展开语法应用到组件上
3. **运行时处理**：动态插槽名需要在运行时确定

## 插槽默认内容 → React 条件渲染

Vue 支持在插槽定义处提供默认内容，当父组件没有提供插槽内容时显示。

- Vue 代码：

```vue
<!-- 子组件 Button.vue -->
<template>
  <button class="btn">
    <slot>
      <span>默认按钮文本</span>
    </slot>
  </button>
</template>
```

- VuReact 编译后 React 代码：

```jsx
// 子组件 Button.jsx
function Button(props) {
  return <button className="btn">{props.children || <span>默认按钮文本</span>}</button>;
}
```

**默认内容处理规则**：

1. **children 检查**：检查 children 是否存在
2. **默认值渲染**：当 children 为 falsy 值时渲染默认内容
3. **React 兼容**：使用标准的 React 条件渲染模式

## 总结

VuReact 的 `v-slot` 编译策略展示了**完整的插槽系统转换能力**：

1. **默认插槽**：转换为 React 的 children
2. **具名插槽**：转换为组件的 props
3. **作用域插槽**：转换为函数 props
4. **动态插槽**：支持动态插槽名称
5. **默认内容**：支持插槽默认内容

**插槽类型映射表**：

| Vue 插槽类型 | React 对应形式 | 说明                   |
| ------------ | -------------- | ---------------------- |
| 默认插槽     | `children`     | 作为组件的子元素       |
| 具名插槽     | `prop`         | 作为组件的属性         |
| 作用域插槽   | `函数prop`     | 作为接收参数的函数属性 |
| 动态插槽     | `计算属性`     | 使用对象计算属性语法   |

性能优化策略：

1. **静态插槽优化**：对于静态插槽内容，编译为静态 JSX
2. **函数缓存**：对于作用域插槽，智能缓存渲染函数
3. **按需生成**：根据实际使用情况生成最简化的代码
4. **类型推导**：智能推导插槽的类型定义

VuReact 的编译策略确保了从 Vue 到 React 的平滑迁移，开发者无需手动重写插槽逻辑。编译后的代码既保持了 Vue 的语义和灵活性，又符合 React 的组件设计模式，让迁移后的应用保持完整的内容分发能力。
