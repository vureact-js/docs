# v-html 与 v-text 语义对照

解析 Vue 模板中高频使用的 `v-html` 与 `v-text` 指令，经过语义编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中的 v-html 和 v-text 指令用法。

## `v-html` → React `dangerouslySetInnerHTML`

`v-html` 是 Vue 中用于将 HTML 字符串动态渲染为 DOM 元素的指令，它会替换元素内的所有内容，并解析 HTML 标签。

- Vue 代码：

```vue
<div v-html="htmlContent"></div>
```

- VuReact 编译后 React 代码：

```jsx
<div dangerouslySetInnerHTML={{ __html: htmlContent }} />
```

从示例可以看到：Vue 的 `v-html` 指令被编译为 React 的 `dangerouslySetInnerHTML` 属性。VuReact 采用 **HTML 注入编译策略**，将模板指令转换为 React 的特殊属性，**完全保持 Vue 的 HTML 渲染语义**——将 `htmlContent` 字符串解析为 HTML 并插入到 DOM 中。

这种编译方式的关键特点在于：

1. **语义一致性**：完全模拟 Vue `v-html` 的行为，直接渲染 HTML 字符串
2. **安全警告**：React 的 `dangerouslySetInnerHTML` 属性名本身就提醒开发者注意 XSS 攻击风险
3. **内容替换**：与 Vue 一样，会替换元素内的所有现有内容

## `v-text` → React `JSX 插值表达式`

`v-text` 是 Vue 中用于将纯文本内容设置到元素内的指令，它会替换元素内的所有内容，但不会解析 HTML 标签。

- Vue 代码：

```vue
<p v-text="message"></p>
```

- VuReact 编译后 React 代码：

```jsx
<p>{message}</p>
```

从示例可以看到：Vue 的 `v-text` 指令被编译为 React 的 JSX 插值表达式。VuReact 采用 **文本插值编译策略**，将模板指令转换为 JSX 的大括号表达式，**完全保持 Vue 的文本渲染语义**——将 `message` 作为纯文本内容插入到元素中。

这种编译方式的关键特点在于：

1. **语义一致性**：完全模拟 Vue `v-text` 的行为，渲染纯文本内容
2. **自动转义**：React 的 JSX 插值会自动转义 HTML 特殊字符，防止 XSS 攻击
3. **内容替换**：与 Vue 一样，会替换元素内的所有现有内容

VuReact 的编译策略确保了从 Vue 到 React 的平滑迁移，开发者无需手动重写内容渲染逻辑。编译后的代码既保持了 Vue 的语义，又符合 React 的安全最佳实践。
