# v-bind 语义对照

解析 Vue 中常见的 `v-bind`/`:` 指令经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中的 v-bind 指令用法。

## `v-bind` → React `JSX 属性`

`v-bind`（简写为 `:`）是 Vue 中用于动态绑定 HTML 属性、组件 `props`、`class` 和 `style` 的指令。

- Vue 代码：

```vue
<img :src="imageUrl" :class="imageCls" />
```

- VuReact 编译后 React 代码：

```jsx
<img src={imageUrl} className={imageCls} />
```

从示例可以看到：Vue 的 `:src` 和 `:class` 指令被编译为 React 的标准属性语法。VuReact 采用 **属性直接编译策略**，将模板指令转换为 React 的 JSX 属性，**完全保持 Vue 的属性绑定语义**——动态地将变量值绑定到元素属性。

## `:class` → React `dir.cls()`

Vue 支持复杂的 `class` 绑定表达式，VuReact 通过运行时辅助函数处理这些复杂场景。

- Vue 代码：

```vue
<div :class="['card', active && 'is-active', error ? 'has-error' : '']" />
```

- VuReact 编译后 React 代码：

```jsx
import { dir } from '@vureact/runtime-core';

<div className={dir.cls(['card', active && 'is-active', error ? 'has-error' : ''])} />;
```

## `:style` → React `dir.style()` 辅助函数

Vue 支持复杂的 `style` 绑定表达式，VuReact 通过运行时辅助函数处理这些复杂场景。

- Vue 代码：

```vue
<div :style="{ color: textColor, fontSize: size + 'px', 'background-color': bgColor }" />
```

- VuReact 编译后 React 代码：

```jsx
import { dir } from '@vureact/runtime-core';

<div style={dir.style({ color: textColor, fontSize: size + 'px', backgroundColor: bgColor })} />;
```

从示例可以看到：复杂的 class 和 style 绑定被编译为使用 `dir.cls()` 和 `dir.style()` 辅助函数。VuReact 采用 **复杂绑定运行时处理策略**，将 Vue 的复杂表达式转换为运行时函数调用，**完全保持 Vue 的动态样式语义**。

**运行时辅助函数的工作原理**：

1. **`dir.cls()`**：
   - 处理数组、对象、字符串等多种 class 格式
   - 自动过滤 falsy 值（false、null、undefined、''）
   - 合并重复的 class 名称
   - 生成最终的 className 字符串

2. **`dir.style()`**：
   - 处理对象格式的样式
   - 自动转换 kebab-case 为 camelCase（`background-color` → `backgroundColor`）
   - 处理带单位的数值（自动添加 `px` 等）
   - 生成 React 兼容的 style 对象

**编译策略详解**：

```jsx
// Vue: :class="{ active: isActive, 'text-danger': hasError }"
// React: className={dir.cls({ active: isActive, 'text-danger': hasError })}

// Vue: :class="[isActive ? 'active' : '', errorClass]"
// React: className={dir.cls([isActive ? 'active' : '', errorClass])}

// Vue: :style="style"
// React: style={dir.style(style)}
```

### 无参数 `v-bind` → React 对象展开语法

Vue 支持无参数的 `v-bind`，用于将整个对象展开为元素的属性。

- Vue 代码：

```vue
<Comp v-bind="props">点击</Comp>
```

- VuReact 编译后 React 代码：

```jsx
import { dir } from '@vureact/runtime-core';

<Comp {...dir.keyless(props)}>点击</Comp>;
```

从示例可以看到：无参数的 `v-bind` 被编译为使用 `dir.keyless()` 辅助函数和对象展开语法。VuReact 采用 **对象展开编译策略**，将 Vue 的对象绑定转换为 React 的对象展开，**完全保持 Vue 的对象属性绑定语义**。

**`dir.keyless()` 辅助函数的作用**：

1. **属性冲突处理**：处理对象属性与已有属性的冲突
2. **特殊属性转换**：自动转换 `class` → `className`、`for` → `htmlFor` 等
3. **样式对象处理**：识别并正确处理 style 对象
4. **事件处理**：识别并转换事件属性（`@click` → `onClick`）

## 动态属性名绑定 → React 计算属性名

Vue 支持使用动态表达式作为属性名，但不建议这么做，不过 VuReact 也能正确处理。

- Vue 代码：

```vue
<div :[dynamicAttr]="value">内容</div>
```

- VuReact 编译后 React 代码：

```jsx
<div {...{ [dynamicAttr]: value }}>内容</div>
```

**编译策略**：

1. **计算属性名**：使用对象计算属性语法 `{ [key]: value }`
2. **对象展开**：通过对象展开语法应用到元素上

## 总结

VuReact 的 v-bind 编译策略展示了**完整的属性绑定转换能力**：

1. **基础属性映射**：将 Vue 属性绑定精确映射到 React JSX 属性
2. **复杂样式处理**：通过运行时辅助函数支持复杂的 class 和 style 绑定
3. **对象展开支持**：完整支持无参数 v-bind 的对象展开语义
4. **布尔属性处理**：正确处理布尔属性的特殊行为
5. **动态属性名**：支持动态表达式作为属性名
6. **组件 props 转换**：正确处理组件间的 props 传递

**性能优化策略**：

1. **按需导入**：只有使用复杂绑定时才导入 `dir` 辅助函数
2. **缓存优化**：智能缓存相同表达式的处理结果
3. **编译期优化**：对于简单表达式，直接生成内联逻辑

VuReact 的编译策略确保了从 Vue 到 React 的平滑迁移，开发者无需手动重写属性绑定逻辑。编译后的代码既保持了 Vue 的语义和功能，又符合 React 的属性处理最佳实践，让迁移后的应用保持完整的 UI 表现能力。
