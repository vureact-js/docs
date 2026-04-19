# 插槽语义对照

解析 Vue 中常见的 `<slot>` 插槽经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中的插槽用法。

## 默认插槽 → React `children`

默认插槽是 Vue 中最基本的插槽形式，用于接收父组件传递的默认内容。

- Vue 代码：

```html
<!-- 子组件 Child.vue -->
<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<!-- 父组件使用 -->
<Child>
  <p>这是插槽内容</p>
</Child>
```

- VuReact 编译后 React 代码：

```jsx
// 子组件 Child.jsx
function Child(props) {
  return <div className="container">{props.children}</div>;
}

// 父组件使用
<Child>
  <p>这是插槽内容</p>
</Child>;
```

从示例可以看到：Vue 的 `<slot>` 元素被编译为 React 的 `children` prop。VuReact 采用 **children 编译策略**，将插槽出口转换为 React 的标准 children 接收方式，**完全保持 Vue 的默认插槽语义**——接收父组件传递的子内容并渲染。

这种编译方式的关键特点在于：

1. **语义一致性**：完全模拟 Vue 默认插槽的行为，实现内容分发
2. **React 原生支持**：使用 React 标准的 children 机制，无需额外适配
3. **语法简洁**：Vue 的 `<slot>` 简化为 `{children}` 表达式
4. **性能优化**：直接使用 React 的原生机制，无运行时开销

## 具名插槽 → React `props`

具名插槽允许组件定义多个插槽出口，父组件可以通过名称指定内容插入位置。

- Vue 代码：

```html
<!-- 子组件 Layout.vue -->
<template>
  <div class="layout">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<!-- 父组件使用 -->
<Layout>
  <template #header>
    <h1>页面标题</h1>
  </template>

  <p>主要内容</p>

  <template #footer>
    <p>版权信息</p>
  </template>
</Layout>
```

- VuReact 编译后 React 代码：

```jsx
// 子组件 Layout.jsx
function Layout(props) {
  return (
    <div className="layout">
      <header>{props.header}</header>
      <main>{props.children}</main>
      <footer>{props.footer}</footer>
    </div>
  );
}

// 父组件使用
<Layout header={<h1>页面标题</h1>} footer={<p>版权信息</p>}>
  <p>主要内容</p>
</Layout>;
```

从示例可以看到：Vue 的具名插槽 `<slot name="xxx">` 被编译为 React 的 props。VuReact 采用 **props 编译策略**，将具名插槽出口转换为组件的命名 props，**完全保持 Vue 的具名插槽语义**——通过不同的 prop 名称区分不同的插槽内容。

**编译规则**：

1. **插槽名映射**：`<slot name="header">` → `header` prop
2. **默认插槽**：`<slot>` → `children` prop
3. **props 接收**：在组件函数参数中解构接收所有插槽 props

## 作用域插槽 → React 带参数的函数 `children`

作用域插槽允许子组件向插槽内容传递数据，实现更灵活的渲染控制。

- Vue 代码：

```html
<!-- 子组件 List.vue -->
<template>
  <ul>
    <li v-for="(item, i) in props.items" :key="item.id">
      <slot :item="item" :index="i"></slot>
    </li>
  </ul>
</template>

<!-- 父组件使用 -->
<List :items="users">
  <template v-slot="slotProps">
    <div class="user-item">{{ slotProps.index + 1 }}. {{ slotProps.item.name }}</div>
  </template>
</List>
```

- VuReact 编译后 React 代码：

```jsx
// 子组件 List.jsx
function List(props) {
  return (
    <ul>
      {props.items.map((item, index) => (
        <li key={item.id}>{props.children?.({ item, index })}</li>
      ))}
    </ul>
  );
}

// 父组件使用
<List
  items={users}
  children={(slotProps) => (
    <div className="user-item">
      {slotProps.index + 1}. {slotProps.item.name}
    </div>
  )}
/>;
```

从示例可以看到：Vue 的作用域插槽被编译为 React 的函数 children。VuReact 采用 **函数 children 编译策略**，将作用域插槽出口转换为接收参数的函数，**完全保持 Vue 的作用域插槽语义**——子组件通过函数调用向父组件传递数据，父组件通过函数参数接收数据并渲染。

**编译规则**：

1. **插槽属性转换**：`<slot :item="item" :index="i">` → 函数参数 `{ item, index }`
2. **函数调用**：在渲染位置调用 `children()` 函数并传递数据
3. **可选链保护**：使用 `?.` 避免未提供插槽内容时的错误

## 具名作用域插槽 → React 带参数的函数 `props`

具名作用域插槽结合了具名插槽和作用域插槽的特性。

- Vue 代码：

```html
<!-- 子组件 Table.vue -->
<template>
  <table>
    <thead>
      <tr>
        <slot name="header" :columns="props.columns"></slot>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in props.data" :key="row.id">
        <slot name="body" :row="row" :columns="props.columns"></slot>
      </tr>
    </tbody>
  </table>
</template>

<!-- 父组件使用 -->
<table :columns="tableColumns" :data="tableData">
  <template #header="headerProps">
    <th v-for="col in headerProps.columns" :key="col.id">{{ col.title }}</th>
  </template>

  <template #body="bodyProps">
    <td v-for="col in bodyProps.columns" :key="col.id">{{ bodyProps.row[col.field] }}</td>
  </template>
</table>
```

- VuReact 编译后 React 代码：

```jsx
// 子组件 Table.jsx
function Table(props) {
  return (
    <table>
      <thead>
        <tr>{props.header?.({ columns: props.columns })}</tr>
      </thead>
      <tbody>
        {props.data.map((row) => (
          <tr key={row.id}>{props.body?.({ row: props.row, columns: props.columns })}</tr>
        ))}
      </tbody>
    </table>
  );
}

// 父组件使用
<Table
  columns={tableColumns}
  data={tableData}
  header={(headerProps) => (
    <>
      {headerProps.columns.map((col) => (
        <th key={col.id}>{col.title}</th>
      ))}
    </>
  )}
  body={(bodyProps) => (
    <>
      {bodyProps.columns.map((col) => (
        <td key={col.id}>{bodyProps.row[col.field]}</td>
      ))}
    </>
  )}
/>;
```

**编译策略**：

1. **具名函数 props**：具名作用域插槽转换为函数 props
2. **参数传递**：正确传递作用域参数
3. **Fragment 包装**：多个元素使用 Fragment 包装
4. **类型安全**：保持 TypeScript 类型定义的完整性

## 插槽默认内容 → React 条件渲染

Vue 支持在插槽定义处提供默认内容，当父组件没有提供插槽内容时显示。

- Vue 代码：

```html
<!-- 子组件 Button.vue -->
<template>
  <button class="btn">
    <slot>
      <span class="default-text">点击我</span>
    </slot>
  </button>
</template>
```

- VuReact 编译后 React 代码：

```jsx
// 子组件 Button.jsx
function Button(props) {
  return (
    <button className="btn">
      {props.children || <span className="default-text">点击我</span>}
    </button>
  );
}
```

**默认内容处理规则**：

1. **条件渲染**：使用 `||` 运算符检查 children 是否存在
2. **默认值提供**：当 children 为 falsy 值时渲染默认内容
3. **React 模式**：使用标准的 React 条件渲染模式

## 动态插槽名 → React 计算属性

Vue 支持动态的插槽名称，用于更灵活的插槽选择。

- Vue 代码：

```html
<!-- 子组件 DynamicSlot.vue -->
<template>
  <div>
    <slot :name="dynamicSlotName"></slot>
  </div>
</template>
```

- VuReact 编译后 React 代码：

```jsx
// 子组件 DynamicSlot.jsx
function DynamicSlot(props) {
  return <div>{props[dynamicSlotName]}</div>;
}
```

**动态插槽处理**：

1. **计算属性名**：使用对象计算属性语法接收动态插槽
2. **运行时确定**：插槽名在运行时确定

## 总结

VuReact 的 `<slot>` 编译策略展示了**完整的插槽系统转换能力**：

1. **默认插槽**：转换为 React 的 `children`
2. **具名插槽**：转换为组件的命名 props
3. **作用域插槽**：转换为函数 children 或函数 props
4. **默认内容**：支持插槽默认内容
5. **动态插槽**：支持动态插槽名称

**插槽类型映射表**：

| Vue 插槽类型                      | React 对应形式  | 说明                           |
| --------------------------------- | --------------- | ------------------------------ |
| `<slot>`                          | `children`      | 默认插槽，作为组件的子元素     |
| `<slot name="xxx">`               | `xxx` prop      | 具名插槽，作为组件的属性       |
| `<slot :prop="value">`            | 函数 `children` | 作用域插槽，作为接收参数的函数 |
| `<slot name="xxx" :prop="value">` | 函数 `xxx` prop | 具名作用域插槽，作为函数属性   |

性能优化策略：

1. **静态插槽优化**：对于静态插槽内容，编译为静态 JSX
2. **函数缓存**：对于作用域插槽，智能缓存渲染函数
3. **按需生成**：根据实际使用情况生成最简化的代码
4. **类型推导**：支持在 `TypeScript` 中智能推导插槽的类型定义

VuReact 的编译策略确保了从 Vue 到 React 的平滑迁移，开发者无需手动重写插槽逻辑。编译后的代码既保持了 Vue 的语义和灵活性，又符合 React 的组件设计模式，让迁移后的应用保持完整的内容分发能力。
