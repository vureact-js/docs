# v-for Semantic Comparison

How does Vue's frequently used `v-for` directive in templates transform into React code after semantic compilation?

## Prerequisites

To avoid redundancy in example code and ensure clear understanding, let's establish two conventions:

1. Vue/React code examples in this document are simplified core logic, omitting full component wrappers and unrelated configurations.
2. Readers are assumed to be familiar with the usage of the v-for directive in Vue 3.

## `v-for` → React `map()`

The simplest `v-for` directive, used for iterating over arrays and rendering list items.

- Vue code:

```vue
<li v-for="(item, i) in list" :key="item.id">{{ i }} - {{ item.name }}</li>
```

- VuReact compiled React code:

```jsx
{
  list.map((item, i) => (
    <li key={item.id}>
      {i} - {item.name}
    </li>
  ));
}
```

As shown in the example: Vue's `v-for` directive is compiled into React's `map` function. VuReact adopts an **array mapping compilation strategy**, converting template directives to JSX array expressions, **fully preserving Vue's list rendering semantics**—iterating over each element in the array, generating corresponding JSX elements, and automatically handling the `key` property to ensure React's rendering performance.

## Object Iteration → React `Object.entries().map()`

`v-for` can also be used to iterate over object properties and values.

- Vue code:

```vue
<li v-for="(val, key, i) in obj" :key="key">{{ i }} - {{ key }}: {{ val }}</li>
```

- VuReact compiled React code:

```jsx
{
  Object.entries(obj).map(([key, val], i) => (
    <li key={key}>
      {i} - {key}: {val}
    </li>
  ));
}
```

For object iteration, VuReact adopts an **Object.entries conversion strategy**, converting Vue's object iteration syntax to `Object.entries(obj).map()` form. This compilation approach **fully mimics Vue's object iteration semantics**—iterating over object key-value pairs in order, maintaining the `(value, key, index)` parameter order, ensuring data rendering consistency.

## Nested `v-for` → React Nested `map()`

Complex nested list rendering using multiple layers of `v-for` loops.

- Vue code:

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

- VuReact compiled React code:

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

For nested loops, VuReact adopts a **nested map function compilation strategy**, converting Vue's nested `v-for` to nested `map` function calls. This compilation approach **fully preserves Vue's nested loop semantics**—each iteration of the outer loop creates a complete list for the inner loop, maintaining the hierarchical relationship of component structures.

### `v-if` + `v-for` → React Ternary Expression + `map()`

Real-world business scenarios often require conditional list rendering.

- Vue code:

```vue
<template v-if="cond" v-for="user in users" :key="user.id">
  <img :src="user.avatar" :alt="user.name" />
  <div class="user-info">
    <h4>{{ user.name }}</h4>
    <p>{{ user.email }}</p>
    <span class="role-badge">{{ user.role }}</span>
  </div>
  <div class="user-actions">
    <button @click="editUser(user.id)">Edit</button>
    <button @click="deleteUser(user.id)" class="danger">Delete</button>
  </div>
</template>
```

- VuReact compiled React code:

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
            <button onClick={() => editUser(user.id)}>Edit</button>
            <button onClick={() => deleteUser(user.id)} className="danger">
              Delete
            </button>
          </div>
        </div>
      ))
    : null;
}
```

For conditional list rendering, VuReact demonstrates **intelligent conditional compilation capability**:

1. **Priority conditional compilation**: Converts `v-if` to ternary expression, wrapping the entire `v-for` rendering result
2. **Automatic key extraction**: When `:key` attribute exists on `<template>` tag, automatically passes it to the first child element inside

VuReact's compilation strategy **fully preserves Vue's list rendering semantics** while generating code that adheres to React best practices.

## v-for Range Values → React `Array.from()`

Vue's `v-for` also supports iteration using numeric ranges.

- Vue code:

```vue
<span v-for="n in 5" :key="n">{{ n }}</span>
```

- VuReact compiled React code:

```jsx
{
  Array.from({ length: 5 }, (_, n) => <span key={n + 1}>{n + 1}</span>);
}
```

For range value iteration, VuReact adopts an **Array.from conversion strategy**, converting Vue's numeric range syntax to array generation and mapping. This compilation approach **fully mimics Vue's range iteration semantics**—starting from 1 up to the specified number (inclusive), maintaining iteration order and numerical consistency.
