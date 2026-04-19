# TransitionGroup 语义对照

解析 Vue 中内置的 `<TransitionGroup>` 组件经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 `<TransitionGroup>` 组件的用法。

## `TransitionGroup` → React `TransitionGroup` 适配组件

`<TransitionGroup>` 是 Vue 中用于为列表项的插入、移除和重排提供过渡动画的内置组件，是 `<Transition>` 的列表版本。

- Vue 代码：

```vue
<template>
  <TransitionGroup name="list" tag="ul">
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </TransitionGroup>
</template>
```

- VuReact 编译后 React 代码：

```tsx
import { TransitionGroup } from '@vureact/runtime-core';

<TransitionGroup name="list" tag="ul">
  {items.map((item) => (
    <li key={item.id}>{item.name}</li>
  ))}
</TransitionGroup>;
```

从示例可以看到：Vue 的 `<TransitionGroup>` 组件被编译为 VuReact Runtime 提供的 [TransitionGroup](https://runtime.vureact.top/guide/components/transition-group.html) **适配组件**，可理解为「React 版的 Vue TransitionGroup」。

这种编译方式的关键特点在于：

1. **语义一致性**：完全模拟 Vue `<TransitionGroup>` 的行为，实现列表过渡动画
2. **列表支持**：专门为列表项的进入、离开和移动提供动画支持
3. **容器标签**：通过 `tag` 属性指定列表容器元素
4. **key 要求**：列表项必须提供稳定的 `key` 属性

**对应的 CSS 样式**：

```css
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.5s ease;
}

.list-leave-active {
  opacity: 0;
  transform: translateX(30px);
  transition: all 0.5s ease;
}
```

## `moveClass` → React `moveClass` 属性

`<TransitionGroup>` 支持列表项重排时的平滑移动动画，通过 `moveClass` 属性实现。

- Vue 代码：

```vue
<template>
  <TransitionGroup name="list" tag="ul" move-class="list-move">
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </TransitionGroup>
</template>
```

- VuReact 编译后 React 代码：

```tsx
<TransitionGroup name="list" tag="ul" moveClass="list-move">
  {items.map((item) => (
    <li key={item.id}>{item.name}</li>
  ))}
</TransitionGroup>
```

**移动动画 CSS**：

```css
/* 移动动画类 */
.list-move {
  transition: all 0.5s ease;
}

/* 离开动画需要绝对定位 */
.list-leave-active {
  position: absolute;
}
```

**移动动画原理**：

1. **FLIP 技术**：使用 First-Last-Invert-Play 技术实现平滑移动
2. **位置计算**：计算元素新旧位置差异，应用反向变换
3. **平滑过渡**：通过 CSS 过渡实现位置变化的动画效果
4. **性能优化**：使用 transform 属性实现高性能动画

## `tag` → React `tag` 属性

通过 `tag` 属性可以指定列表的容器元素类型。

- Vue 代码：

```vue
<template>
  <TransitionGroup name="fade" tag="div" class="item-list">
    <div v-for="item in items" :key="item.id" class="item">
      {{ item.name }}
    </div>
  </TransitionGroup>
</template>
```

- VuReact 编译后 React 代码：

```tsx
<TransitionGroup name="fade" tag="div" className="item-list">
  {items.map((item) => (
    <div key={item.id} className="item">
      {item.name}
    </div>
  ))}
</TransitionGroup>
```

**tag 属性作用**：

1. **容器类型**：指定渲染的 HTML 元素类型（div、ul、ol 等）
2. **语义化**：使用合适的语义化标签
3. **样式控制**：方便应用容器样式
4. **结构清晰**：保持清晰的 DOM 结构

## 继承 `Transition` 功能 → React 属性继承

`<TransitionGroup>` 继承了 `<Transition>` 的所有功能，支持相同的属性和钩子。

- Vue 代码：

```vue
<template>
  <TransitionGroup name="slide" tag="div" :duration="500" @enter="onEnter" @leave="onLeave">
    <div v-for="item in items" :key="item.id">
      {{ item.name }}
    </div>
  </TransitionGroup>
</template>
```

- VuReact 编译后 React 代码：

```tsx
<TransitionGroup name="slide" tag="div" duration={500} onEnter={onEnter} onLeave={onLeave}>
  {items.map((item) => (
    <div key={item.id}>{item.name}</div>
  ))}
</TransitionGroup>
```

**继承的功能**：

1. **自定义类名**：支持 enter/leave 相关的自定义类名
2. **JavaScript 钩子**：支持所有过渡生命周期钩子
3. **持续时间**：支持 duration 属性控制动画时长
4. **CSS 控制**：支持 css 属性控制是否应用 CSS 过渡

## 总结

VuReact 的 TransitionGroup 编译策略展示了**完整的列表过渡转换能力**：

1. **组件直接映射**：将 Vue `<TransitionGroup>` 直接映射为 VuReact 的 `<TransitionGroup>`
2. **属性完全支持**：支持 `name`、`tag`、`moveClass` 等所有属性
3. **列表渲染转换**：将 `v-for` 转换为 `map` 函数调用
4. **动画功能继承**：继承所有 `<Transition>` 的动画功能

注意事项：

1. **key 必须**：列表项必须提供稳定的 `key`，否则动画可能异常
2. **CSS 要求**：必须在 `*-enter-active` 和 `*-leave-active` 中设置过渡外观
3. **移动动画**：离开动画需要设置 `position: absolute`

VuReact 的编译策略确保了从 Vue 到 React 的平滑迁移，开发者无需手动实现列表过渡动画逻辑。编译后的代码既保持了 Vue 的列表过渡语义和动画效果，又符合 React 的组件设计模式，让迁移后的应用保持完整的列表过渡能力。
