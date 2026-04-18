# v-show 语义对照

解析 Vue 模板中高频使用的 `v-show` 指令，经过语义编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中的 v-show 指令用法。

## `v-show` → React 内联样式条件显示

`v-show` 是 Vue 中用于根据条件控制元素显示/隐藏的指令，与 `v-if` 不同，`v-show` 不会移除 DOM 元素，而是通过 CSS 的 `display` 属性来控制可见性。

- Vue 代码：

```vue
<div v-show="active">Content</div>
```

- VuReact 编译后 React 代码：

```jsx
<div style={{ display: active ? '' : 'none' }}>Content</div>
```

从示例可以看到：Vue 的 `v-show` 指令被编译为 React 的内联样式对象。VuReact 采用 **样式条件编译策略**，将模板指令转换为 JSX 的 `style` 属性，**完全保持 Vue 的显示/隐藏语义**——当 `active` 为真时，元素正常显示（`display: ''` 使用默认值）；当 `active` 为假时，元素隐藏（`display: 'none'`）。

这种编译方式的关键优势在于：

1. **语义一致性**：完全模拟 Vue `v-show` 的行为，通过 CSS 控制可见性而非移除 DOM
2. **性能优化**：避免频繁的 DOM 创建/销毁，适合频繁切换显示状态的场景
3. **CSS 继承保持**：使用 `display: 'none'` 而非 `visibility: 'hidden'`，确保元素完全从文档流中移除
4. **状态保持**：隐藏时元素状态（如表单输入值、滚动位置等）得以保留

VuReact 的编译策略确保了从 Vue 到 React 的平滑迁移，开发者无需手动重写显示/隐藏逻辑，编译后的代码既保持了 Vue 的语义，又符合 React 的最佳实践。
