# Suspense 语义对照

解析 Vue 中内置的 `<Suspense>` 组件经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 `<Suspense>` 组件的用法。

## `Suspense` → React `Suspense` 适配组件

`<Suspense>` 是 Vue 中用于处理异步组件加载的内置组件，可以在异步依赖未完成时展示回退内容，提升用户体验。

- Vue 代码：

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>加载中...</div>
    </template>
  </Suspense>
</template>
```

- VuReact 编译后 React 代码：

```tsx
import { Suspense } from '@vureact/runtime-core';

<Suspense fallback={<div>加载中...</div>}>
  <AsyncComponent />
</Suspense>;
```

从示例可以看到：Vue 的 `<Suspense>` 组件被编译为 VuReact Runtime 提供的 [Suspense](https://runtime.vureact.top/guide/components/suspense.html) **适配组件**，可理解为「React 版的 Vue Suspense」。

这种编译方式的关键特点在于：

1. **语义一致性**：完全模拟 Vue `<Suspense>` 的行为，处理异步加载
2. **回退内容**：在异步组件加载期间显示指定的回退内容
3. **React 集成**：在 React 环境中实现 Vue 的 Suspense 语义
4. **用户体验**：提升异步加载时的用户体验

## `timeout` → React `timeout` 属性

通过 `timeout` 属性可以控制回退内容的显示时机，避免短请求导致的闪烁。

- Vue 代码：

```vue
<template>
  <Suspense :timeout="1000">
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>超过1秒，显示加载态...</div>
    </template>
  </Suspense>
</template>
```

- VuReact 编译后 React 代码：

```tsx
<Suspense timeout={1000} fallback={<div>超过1秒，显示加载态...</div>}>
  <AsyncComponent />
</Suspense>
```

**timeout 作用**：

1. **防闪烁**：避免快速加载时的回退内容闪烁
2. **用户体验**：只在加载时间较长时显示加载状态
3. **性能优化**：减少不必要的 UI 切换
4. **配置灵活**：可根据不同场景设置不同的超时时间

## 嵌套异步依赖 → React 多组件同步

当一个 Suspense 边界内有多个异步组件时，会等待所有异步依赖都完成后再切换到内容区。

- Vue 代码：

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponentA />
      <AsyncComponentB />
    </template>
    <template #fallback>
      <div>正在同步多个异步组件...</div>
    </template>
  </Suspense>
</template>
```

- VuReact 编译后 React 代码：

```tsx
<Suspense fallback={<div>正在同步多个异步组件...</div>}>
  <AsyncComponentA />
  <AsyncComponentB />
</Suspense>
```

**同步加载**：

1. **统一管理**：等待所有异步组件都加载完成
2. **避免部分显示**：防止部分组件先显示造成的布局跳动
3. **整体体验**：提供更一致的用户体验
4. **错误处理**：统一处理加载错误情况

## 生命周期回调 → React `props` 回调

通过生命周期回调可以监听 Suspense 的不同状态。

- Vue 代码：

```vue
<template>
  <Suspense @pending="onPending" @fallback="onFallback" @resolve="onResolve">
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>加载中...</div>
    </template>
  </Suspense>
</template>
```

- VuReact 编译后 React 代码：

```tsx
<Suspense
  fallback={<div>加载中...</div>}
  onPending={onPending}
  onFallback={onFallback}
  onResolve={onResolve}
>
  <AsyncComponent />
</Suspense>
```

**生命周期事件**：

1. **onPending**：开始等待异步依赖时触发
2. **onFallback**：开始显示回退内容时触发
3. **onResolve**：所有异步依赖完成时触发
4. **状态跟踪**：适合记录异步边界状态

## 总结

VuReact 的 Suspense 编译策略展示了**完整的异步加载转换能力**：

1. **组件直接映射**：将 Vue `<Suspense>` 直接映射为 VuReact 的 `<Suspense>`
2. **属性完全支持**：支持 `fallback`、`timeout`、生命周期回调等所有属性
3. **插槽转换**：将 Vue 的插槽语法转换为 React 的 props 语法
4. **异步语义保持**：完全保持 Vue 的异步加载语义

VuReact 的编译策略确保了从 Vue 到 React 的平滑迁移，开发者无需手动实现异步加载逻辑。编译后的代码既保持了 Vue 的异步加载语义和用户体验，又符合 React 的组件设计模式，让迁移后的应用保持完整的异步加载能力。
