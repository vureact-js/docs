# 动态组件语义对照

解析 Vue 中常见的 `is` 和 `:is` 属性经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 is 属性的用法和适用场景。

## `:is` → React `<Component>` 适配组件

`:is` 属性用于动态渲染组件，它允许根据数据动态决定要渲染哪个组件。

- Vue 代码：

```vue
<component :is="currentComponent" />
```

- VuReact 编译后 React 代码：

```jsx
import { Component } from '@vureact/runtime-core';

<Component is={currentComponent} />;
```

从示例可以看到：Vue 的 `:is` 属性被编译为 [Component](https://runtime.vureact.top/guide/components/dynamic-components.html) **适配组件**的 `is` 属性，可理解为「React 版的 Vue 动态组件」。

这种编译方式的关键特点在于：

1. **语义一致性**：完全模拟 Vue 动态组件的行为，实现组件动态切换
2. **组件映射**：将 Vue 的 `<component>` 元素转换为 VuReact Runtime 的 `<Component>` 组件
3. **属性传递**：保持 `is` 属性的动态绑定能力

## 带 `props` 的动态组件

动态组件通常需要传递 props，VuReact 也能正确处理。

- Vue 代码：

```vue
<component :is="currentView" :title="pageTitle" :data="pageData" @custom-event="handleCustom" />
```

- VuReact 编译后 React 代码：

```jsx
<Component is={currentView} title={pageTitle} data={pageData} onCustomEvent={handleCustom} />
```

**props 传递规则**：

1. **属性映射**：将 Vue 属性转换为 React props
2. **事件转换**：将 Vue 事件转换为 React 事件属性
3. **类型保持**：保持 props 的类型定义完整性
4. **默认值处理**：正确处理组件的默认 props

## 普通字符串

- Vue 代码：

```vue
<div is="my-tag"></div>
```

- VuReact 编译后 React 代码：

```jsx
<div is="my-tag" />
```

从示例可以看到：Vue 的 `is` 属性在编译后保持不变，因为 React 同样支持 `is` 属性。

这种处理方式的关键特点在于：

1. **属性保留**：保持 `is` 属性的原始值
2. **DOM 兼容**：确保在 React 中也能正确渲染
3. **语义一致**：保持与 Vue 相同的语义

## 带 `'vue:'` 前缀 → React 组件直接替换

- Vue 代码：

```vue
<div is="vue:user-info"></div>
```

- VuReact 编译后 React 代码：

```jsx
<UserInfo />
```

**编译策略**：

1. **组件替换**：将 `is="vue:user-info"` 替换为 `<UserInfo />`
2. **Vue 前缀处理**：自动移除 `vue:` 前缀

## 动态组件与 `v-bind` 结合

动态组件经常与 `v-bind` 结合使用，实现更灵活的组件配置。

- Vue 代码：

```vue
<component :is="componentType" v-bind="componentProps" />
```

- VuReact 编译后 React 代码：

```jsx
import { dir } from '@vureact/runtime-core';

<Component is={componentType} {...dir.keyless(componentProps)} />;
```

**对象展开处理**：

1. **属性合并**：正确处理 `v-bind` 对象与显式属性的合并
2. **冲突解决**：处理属性名称冲突
3. **特殊属性转换**：自动转换 `class`、`style` 等特殊属性

## 总结

VuReact 的 `is`/`:is` 编译策略展示了**完整的动态组件转换能力**：

1. **动态组件渲染**：将 `<component :is>` 转换为 `<Component is>`
2. **DOM 限制解决**：将 `is="vue:component-name"` 直接替换为组件
3. **props 传递**：正确处理动态组件的 props 传递
4. **组件缓存**：支持 `<KeepAlive>` 组件缓存
5. **动画支持**：支持 `<Transition>` 组件动画

**`is` 和 `:is` 的区别**：

| 特性         | `is` 属性                 | `:is` 属性                  |
| ------------ | ------------------------- | --------------------------- |
| **用途**     | 解决 DOM 内模板限制       | 动态切换组件                |
| **语法**     | `is="vue:component-name"` | `:is="componentName"`       |
| **元素**     | 用于特定 HTML 元素内部    | 用于 `<component>` 元素     |
| **编译结果** | 直接替换为组件            | 使用 `<Component is={...}>` |

VuReact 的编译策略确保了从 Vue 到 React 的平滑迁移，开发者无需手动重写动态组件逻辑。编译后的代码既保持了 Vue 的语义和灵活性，又符合 React 的组件渲染模式，让迁移后的应用保持完整的动态组件能力。
