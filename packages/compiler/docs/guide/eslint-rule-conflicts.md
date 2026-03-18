# ESLint 规则冲突

在使用 VuReact 的响应式 hooks（`useVRef`、`useComputed`、`useReactive` 等）时，会遇到 ESLint 的 React Hooks 规则冲突警告。这是因为 Vue 3 的响应式模式与 React Hooks 的设计理念不同。

## 问题表现

### 1. 修改 `.value` 属性时报错

```js
const count = useVRef(0);

// ❌ ESLint 错误：This value cannot be modified
count.value = 2;
```

### 2. 依赖数组不完整警告

```js
useEffect(() => {
  console.log(count.value);
  // ⚠️ ESLint 警告：missing dependency: 'count'
}, [count?.value]);
```

## 解决方案

### 方案一：使用 ESLint 注释（推荐）

在代码中添加注释来禁用特定行的 ESLint 检查：

```js
const count = useVRef(0);

// eslint-disable-next-line react-hooks/immutability
count.value = 2;

useEffect(() => {
  console.log(count.value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [count?.value]);
```

### 方案二：禁用整个文件的规则

在文件顶部添加注释，禁用特定规则：

```js
/* eslint-disable react-hooks/exhaustive-deps */

const count = useVRef(0);
count.value = 2; // ✅ 不再警告

useEffect(() => {
  console.log(count.value);
}, [count?.value]); // ✅ 不再警告
```

### 方案三：修改 ESLint 配置

修改项目的 ESLint 配置文件：

```js
// eslint.config.js 或 .eslintrc.js
rules: {
  'react-hooks/exhaustive-deps': ['off'],
  'react-hooks/rules-of-hooks': ['off'],
},
```

## 为什么会出现这个问题？

VuReact 的响应式 hooks 返回的是 Vue 3 风格的响应式对象，它们通过 `.value` 属性进行读写。而 ESLint 的 React Hooks 规则期望 hooks 返回值是不可变的。

## 注意事项

1. **方案一**（使用注释）最灵活，可以精确控制哪些代码需要例外
2. **方案二**（禁用文件规则）适合 Vue Reactivity hooks 密集使用的文件
3. **方案三**（修改配置）最简单，但会完全禁用相关规则检查

## 示例代码

### 修改前（有警告）

```ts
const count = useVRef(1);
const add = useCallback(() => {
  // Error: This value cannot be modified
  count.value += 1;
  // Warning: missing dependency: 'count'
}, [count?.value]);
```

### 修改后（无警告）

```ts
const count = useVRef(1);
const toggleTheme = useCallback(() => {
  count.value += 1;
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [count?.value]);
```

## 总结

VuReact 的响应式 hooks 与 ESLint 的 React Hooks 规则存在设计理念上的冲突。通过添加 ESLint 注释或修改配置，可以解决这些警告，让代码正常运行。
