# v-for 语义对照

解析 Vue 模板中高频使用的 `v-for` 指令，经过语义编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中的 v-for 指令用法。

## `v-for` → React `map()`

最简单的 `v-for` 指令，用于遍历数组并渲染列表项。

- Vue 代码：

```vue
<li v-for="(item, i) in list" :key="item.id">{{ i }} - {{ item.name }}</li>
```

- VuReact 编译后 React 代码：

```jsx
{
  list.map((item, i) => (
    <li key={item.id}>
      {i} - {item.name}
    </li>
  ));
}
```

从示例可以看到：Vue 的 `v-for` 指令被编译为 React 的 `map` 函数。VuReact 采用 **数组映射编译策略**，将模板指令转换为 JSX 数组表达式，**完全保持 Vue 的列表渲染语义**——遍历数组中的每个元素，生成对应的 JSX 元素，并自动处理 `key` 属性以保证 React 的渲染性能。

## 对象遍历 → React `Object.entries().map()`

`v-for` 也可以用于遍历对象的属性和值。

- Vue 代码：

```vue
<li v-for="(val, key, i) in obj" :key="key">{{ i }} - {{ key }}: {{ val }}</li>
```

- VuReact 编译后 React 代码：

```jsx
{
  Object.entries(obj).map(([key, val], i) => (
    <li key={key}>
      {i} - {key}: {val}
    </li>
  ));
}
```

对于对象遍历，VuReact 采用 **Object.entries 转换策略**，将 Vue 的对象遍历语法转换为 `Object.entries(obj).map()` 形式。这种编译方式**完全模拟 Vue 的对象遍历语义**——按顺序遍历对象的键值对，保持 `(值, 键, 索引)` 的参数顺序，确保数据渲染的一致性。

## 嵌套 `v-for` → React 嵌套 `map()`

复杂的嵌套列表渲染，使用多层 `v-for` 循环。

- Vue 代码：

```vue
<div v-for="category in categories" :key="category.id">
  <h3>{{ category.name }}</h3>
  <ul>
    <li v-for="product in category.products" :key="product.id">
      {{ product.name }} - ${{ product.price }}
    </li>
  </ul>
</div>
```

- VuReact 编译后 React 代码：

```jsx
{
  categories.map((category) => (
    <div key={category.id}>
      <h3>{category.name}</h3>
      <ul>
        {category.products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  ));
}
```

对于嵌套循环，VuReact 采用 **嵌套 map 函数编译策略**，将 Vue 的嵌套 `v-for` 转换为嵌套的 `map` 函数调用。这种编译方式**完全保持 Vue 的嵌套循环语义**——外层循环的每个迭代都会创建内层循环的完整列表，保持组件结构的层次关系。

### `v-if` + `v-for` → React 三元表达式 + `map()`

实际业务中经常需要结合条件进行列表渲染。

- Vue 代码：

```vue
<template v-if="cond" v-for="user in users" :key="user.id">
  <img :src="user.avatar" :alt="user.name" />
  <div class="user-info">
    <h4>{{ user.name }}</h4>
    <p>{{ user.email }}</p>
    <span class="role-badge">{{ user.role }}</span>
  </div>
  <div class="user-actions">
    <button @click="editUser(user.id)">编辑</button>
    <button @click="deleteUser(user.id)" class="danger">删除</button>
  </div>
</template>
```

- VuReact 编译后 React 代码：

```jsx
{
  cond
    ? users.map((user) => (
        <div key={user.id} className="user-card">
          <img src={user.avatar} alt={user.name} />
          <div className="user-info">
            <h4>{user.name}</h4>
            <p>{user.email}</p>
            <span className="role-badge">{user.role}</span>
          </div>
          <div className="user-actions">
            <button onClick={() => editUser(user.id)}>编辑</button>
            <button onClick={() => deleteUser(user.id)} className="danger">
              删除
            </button>
          </div>
        </div>
      ))
    : null;
}
```

对于带条件的列表渲染，VuReact 展示了**智能的条件编译能力**：

1. **优先条件编译**：将 `v-if` 转换为三元表达式，包裹整个 `v-for` 渲染结果
2. **自动提取 key**：当 `<template>` 标签上存在 `:key` 属性时，会自动将其传递给内部的第一个子元素

VuReact 的编译策略**完全保持 Vue 的列表渲染语义**，同时生成符合 React 最佳实践的代码。

## v-for 范围值 → React `Array.from()`

Vue 的 `v-for` 也支持使用数字范围进行迭代。

- Vue 代码：

```vue
<span v-for="n in 5" :key="n">{{ n }}</span>
```

- VuReact 编译后 React 代码：

```jsx
{
  Array.from({ length: 5 }, (_, n) => <span key={n + 1}>{n + 1}</span>);
}
```

对于范围值迭代，VuReact 采用 **Array.from 转换策略**，将 Vue 的数字范围语法转换为数组生成和映射。这种编译方式**完全模拟 Vue 的范围迭代语义**——从 1 开始到指定数字结束（包含），保持迭代顺序和数值的一致性。
