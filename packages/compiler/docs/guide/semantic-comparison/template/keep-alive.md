# KeepAlive 语义对照

解析 Vue 中内置的 `<KeepAlive>` 组件经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 `<KeepAlive>` 组件的用法。

## `KeepAlive` → React `KeepAlive` 适配组件

`<KeepAlive>` 是 Vue 中用于缓存组件实例的内置组件，可以在动态切换组件时保留组件状态，避免重新渲染和数据丢失。

- Vue 代码：

```vue
<template>
  <KeepAlive>
    <component :is="currentView" />
  </KeepAlive>
</template>
```

- VuReact 编译后 React 代码：

```tsx
import { KeepAlive } from '@vureact/runtime-core';

<KeepAlive>
  <Component is={currentView} />
</KeepAlive>;
```

从示例可以看到：Vue 的 `<KeepAlive>` 组件被编译为 VuReact Runtime 提供的 [KeepAlive](https://runtime.vureact.top/guide/components/keep-alive.html) **适配组件**，可理解为「React 版的 Vue KeepAlive」。

这种编译方式的关键特点在于：

1. **语义一致性**：完全模拟 Vue `<KeepAlive>` 的行为，实现组件实例缓存
2. **状态保持**：缓存被移除的组件实例，避免状态丢失
3. **性能优化**：减少不必要的组件重新渲染
4. **React 适配**：在 React 环境中实现 Vue 的缓存语义

## 带 `key` → React `key` 属性传递

为了确保缓存正确工作，建议为动态组件提供稳定的 `key`。

- Vue 代码：

```vue
<template>
  <KeepAlive>
    <component :is="currentComponent" :key="componentKey" />
  </KeepAlive>
</template>
```

- VuReact 编译后 React 代码：

```tsx
<KeepAlive>
  <Component is={currentComponent} key={componentKey} />
</KeepAlive>
```

**key 的重要性**：

1. **缓存标识**：`key` 用于标识和匹配缓存实例
2. **稳定切换**：确保组件切换时能正确命中缓存
3. **性能优化**：避免不必要的缓存创建和销毁
4. **最佳实践**：始终为动态组件提供稳定的 `key`

## `include` / `exclude` → React `include`/`exclude` 属性

`<KeepAlive>` 支持通过 `include` 和 `exclude` 属性精确控制哪些组件需要缓存。

- Vue 代码：

```vue
<template>
  <KeepAlive :include="['ComponentA', 'ComponentB']">
    <component :is="currentView" />
  </KeepAlive>
</template>
```

- VuReact 编译后 React 代码：

```tsx
<KeepAlive include={['ComponentA', 'ComponentB']}>
  <Component is={currentView} />
</KeepAlive>
```

**匹配规则**：

1. **字符串匹配**：精确匹配组件名
2. **正则表达式**：匹配符合模式的组件名
3. **数组组合**：支持字符串和正则的数组组合
4. **key 匹配**：同时尝试匹配组件名和缓存 key

## `max` → React `max` 属性限制

通过 `max` 属性可以限制最大缓存数量，避免内存过度使用。

- Vue 代码：

```vue
<template>
  <KeepAlive :max="3">
    <component :is="currentTab" />
  </KeepAlive>
</template>
```

- VuReact 编译后 React 代码：

```tsx
<KeepAlive max={3}>
  <Component is={currentTab} />
</KeepAlive>
```

**缓存淘汰策略**：

1. **LRU 算法**：淘汰最久未访问的缓存实例
2. **内存管理**：自动清理超出限制的缓存
3. **性能平衡**：在内存使用和性能之间取得平衡
4. **智能管理**：根据访问频率智能管理缓存

## 缓存生命周期 → React `useActived`/`useDeactivated`

被 `<KeepAlive>` 缓存的组件有特殊的生命周期，可以通过相应的 Hook 监听。

- Vue 代码：

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue';

onActivated(() => {
  console.log('组件被激活');
});

onDeactivated(() => {
  console.log('组件被停用');
});
</script>
```

- VuReact 编译后 React 代码：

```tsx
import { useActived, useDeactivated } from '@vureact/runtime-core';

function MyComponent() {
  useActived(() => {
    console.log('组件被激活');
  });

  useDeactivated(() => {
    console.log('组件被停用');
  });

  return <div>组件内容</div>;
}
```

**生命周期事件**：

1. **useActived**：组件从缓存中恢复显示时触发
2. **useDeactivated**：组件被缓存时触发
3. **首次渲染**：组件首次渲染时也会触发 activated
4. **最终卸载**：组件最终被销毁时触发 deactivated

## 总结

VuReact 的 KeepAlive 编译策略展示了**完整的组件缓存转换能力**：

1. **组件直接映射**：将 Vue `<KeepAlive>` 直接映射为 VuReact 的 `<KeepAlive>`
2. **属性完全支持**：支持 `include`、`exclude`、`max` 等所有属性
3. **生命周期适配**：将 Vue 生命周期 Hook 转换为 React Hook
4. **缓存语义保持**：完全保持 Vue 的缓存行为和语义

注意事项：

1. **单一子节点**：`<KeepAlive>` 只能有一个直接子节点
2. **组件类型**：只能缓存组件元素，不能缓存普通元素
3. **key 要求**：缺少稳定 key 时会降级为非缓存渲染

VuReact 的编译策略确保了从 Vue 到 React 的平滑迁移，开发者无需手动实现组件缓存逻辑。编译后的代码既保持了 Vue 的缓存语义和性能优势，又符合 React 的组件设计模式，让迁移后的应用保持完整的组件缓存能力。
