# Teleport 语义对照

解析 Vue 中内置的 `<Teleport>` 组件经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 `<Teleport>` 组件的用法。

## `Teleport` → React `Teleport` 适配组件

`<Teleport>` 是 Vue 中用于将组件内容渲染到 DOM 树中其他位置的内置组件，常用于模态框、通知、浮层等需要脱离当前组件层级渲染的场景。

- Vue 代码：

```vue
<template>
  <Teleport to="body">
    <Modal />
  </Teleport>
</template>
```

- VuReact 编译后 React 代码：

```tsx
import { Teleport } from '@vureact/runtime-core';

<Teleport to="body">
  <Modal />
</Teleport>;
```

从示例可以看到：Vue 的 `<Teleport>` 组件被编译为 VuReact Runtime 提供的 [Teleport](https://runtime.vureact.top/guide/components/teleport.html) **适配组件**，可理解为「React 版的 Vue Teleport」。

这种编译方式的关键特点在于：

1. **语义一致性**：完全模拟 Vue `<Teleport>` 的行为，实现内容传送
2. **DOM 操作**：将子内容渲染到指定的 DOM 位置
3. **React 集成**：在 React 的虚拟 DOM 系统中实现传送功能
4. **性能优化**：智能管理 DOM 节点的挂载和卸载

## `disabled` → React `disabled` 属性

通过 `disabled` 属性可以临时禁用传送功能，让内容在原位置渲染。

- Vue 代码：

```vue
<template>
  <Teleport to="body" :disabled="isMobile">
    <Notification />
  </Teleport>
</template>
```

- VuReact 编译后 React 代码：

```tsx
<Teleport to="body" disabled={isMobile}>
  <Notification />
</Teleport>
```

## 多个 `Teleport` 到同一目标 → React 多组件顺序追加

多个 `<Teleport>` 组件可以指向同一个目标容器，内容会按渲染顺序追加。

- Vue 代码：

```vue
<template>
  <Teleport to="#modal-container">
    <ModalA />
  </Teleport>

  <Teleport to="#modal-container">
    <ModalB />
  </Teleport>
</template>
```

- VuReact 编译后 React 代码：

```tsx
<Teleport to="#modal-container">
  <ModalA />
</Teleport>

<Teleport to="#modal-container">
  <ModalB />
</Teleport>
```

## `defer` → React `defer` 属性

通过 `defer` 属性可以延迟传送，直到组件挂载完成后再执行。

- Vue 代码：

```vue
<template>
  <Teleport to="#dynamic-container" :defer="true">
    <DynamicContent />
  </Teleport>
</template>
```

- VuReact 编译后 React 代码：

```tsx
<Teleport to="#dynamic-container" defer>
  <DynamicContent />
</Teleport>
```

## 总结

VuReact 的 Teleport 编译策略展示了**完整的传送门转换能力**：

1. **组件直接映射**：将 Vue `<Teleport>` 直接映射为 VuReact 的 `<Teleport>`
2. **属性完全支持**：支持 `to`、`disabled`、`defer` 等所有属性
3. **DOM 操作封装**：封装 React 的 Portal 功能实现传送
4. **错误处理**：处理目标容器不存在等异常情况

VuReact 的编译策略确保了从 Vue 到 React 的平滑迁移，开发者无需手动实现传送门逻辑。编译后的代码既保持了 Vue 的传送语义和功能，又符合 React 的组件设计模式，让迁移后的应用保持完整的传送门能力。
