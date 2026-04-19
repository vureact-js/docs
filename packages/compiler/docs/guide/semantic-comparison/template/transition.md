# Transition 语义对照

[VuReact](https://vureact.top/guide/introduction.html) 是一个能将 Vue 3 代码编译为标准、可维护 React 代码的工具。今天就带大家直击核心：Vue 中内置的 `<Transition>` 组件经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 `<Transition>` 组件的用法。

## `Transition` → React `Transition` 适配组件

`<Transition>` 是 Vue 中用于为单个元素或组件的进入/离开过程添加过渡动画的内置组件。

- Vue 代码：

```vue
<template>
  <Transition name="fade">
    <div v-if="show">内容</div>
  </Transition>
</template>
```

- VuReact 编译后 React 代码：

```tsx
import { Transition } from '@vureact/runtime-core';

<Transition name="fade">{show ? <div>内容</div> : null}</Transition>;
```

从示例可以看到：Vue 的 `<Transition>` 组件被编译为 VuReact Runtime 提供的 [Transition](https://runtime.vureact.top/guide/components/transition.html) **适配组件**，可理解为「React 版的 Vue Transition」。

这种编译方式的关键特点在于：

1. **语义一致性**：完全模拟 Vue `<Transition>` 的行为，实现过渡动画
2. **CSS 类名**：自动生成和应用过渡相关的 CSS 类名
3. **条件渲染**：支持条件渲染元素的过渡效果
4. **React 集成**：在 React 环境中实现 Vue 的过渡语义

**对应的 CSS 样式**：

```css
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active {
  opacity: 1;
  transition: opacity 0.5s ease;
}

.fade-leave-active {
  opacity: 0;
  transition: opacity 0.5s ease;
}
```

## `mode` → React `mode` 属性

通过 `mode` 属性可以控制新旧内容切换的顺序，避免同时进行进入和离开动画。

- Vue 代码：

```vue
<template>
  <Transition name="slide-fade" mode="out-in">
    <button v-if="state" key="on">开启</button>
    <button v-else key="off">关闭</button>
  </Transition>
</template>
```

- VuReact 编译后 React 代码：

```tsx
<Transition name="slide-fade" mode="out-in">
  {state ? <button key="on">开启</button> : <button key="off">关闭</button>}
</Transition>
```

**过渡模式**：

1. **out-in**：先执行离开动画，完成后执行进入动画
2. **in-out**：先执行进入动画，完成后执行离开动画
3. **默认**：同时执行进入和离开动画

**key 的重要性**：

1. **节点识别**：帮助 Transition 识别不同的元素
2. **动画触发**：key 变化时会触发过渡动画
3. **状态保持**：确保动画能正确应用到对应元素
4. **多节点自动 key 处理**：当未显式指定 `key` 时，VuReact 会自动生成随机标识以确保过渡动画的正确触发

## 自定义过渡类名 → React 自定义类名属性

除了使用 `name` 自动生成类名，还可以直接指定自定义的过渡类名，方便集成第三方动画库。

- Vue 代码：

```vue
<template>
  <Transition
    enter-active-class="animate__animated animate__fadeIn"
    leave-active-class="animate__animated animate__fadeOut"
  >
    <div v-if="show">自定义动画</div>
  </Transition>
</template>
```

- VuReact 编译后 React 代码：

```tsx
<Transition
  enterActiveClass="animate__animated animate__fadeIn"
  leaveActiveClass="animate__animated animate__fadeOut"
>
  {show ? <div>自定义动画</div> : null}
</Transition>
```

**自定义类名属性**：

1. **enterFromClass**：进入开始时的类名
2. **enterActiveClass**：进入活动时的类名
3. **enterToClass**：进入结束时的类名
4. **leaveFromClass**：离开开始时的类名
5. **leaveActiveClass**：离开活动时的类名
6. **leaveToClass**：离开结束时的类名

## JavaScript 钩子函数 → React 事件属性

Transition 支持通过 JavaScript 钩子函数在动画的不同阶段执行自定义逻辑。

- Vue 代码：

```vue
<template>
  <Transition
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @leave="onLeave"
  >
    <div v-if="show">JS 控制动画</div>
  </Transition>
</template>
```

- VuReact 编译后 React 代码：

```tsx
<Transition
  onBeforeEnter={onBeforeEnter}
  onEnter={onEnter}
  onAfterEnter={onAfterEnter}
  onLeave={onLeave}
>
  {show ? <div>JS 控制动画</div> : null}
</Transition>
```

**JavaScript 钩子**：

1. **onBeforeEnter**：进入动画开始前触发
2. **onEnter**：进入动画进行时触发
3. **onAfterEnter**：进入动画完成后触发
4. **onLeave**：离开动画进行时触发
5. **onAfterLeave**：离开动画完成后触发

## `duration` → React `duration` 属性

通过 `duration` 属性可以显式指定过渡的持续时间。

- Vue 代码：

```vue
<template>
  <Transition :duration="800">
    <div v-if="show">指定时长动画</div>
  </Transition>
</template>
```

- VuReact 编译后 React 代码：

```tsx
<Transition duration={800}>{show ? <div>指定时长动画</div> : null}</Transition>
```

**duration 配置**：

- **数字**：统一设置进入和离开的持续时间
- **对象**：分别设置进入和离开的持续时间

```jsx
<Transition duration={{ enter: 300, leave: 500 }}>{show ? <div>内容</div> : null}</Transition>
```

## 总结

VuReact 的 Transition 编译策略展示了**完整的过渡动画转换能力**：

1. **组件直接映射**：将 Vue `<Transition>` 直接映射为 VuReact 的 `<Transition>`
2. **属性完全支持**：支持 `name`、`mode`、自定义类名、钩子函数等所有属性
3. **CSS 类名生成**：自动生成和应用过渡相关的 CSS 类名
4. **JavaScript 集成**：支持通过 JS 钩子控制动画过程

注意事项：

1. **单一子节点**：`<Transition>` 只能有一个直接子节点
2. **key 要求**：切换不同元素时建议提供稳定的 `key`
3. **CSS 要求**：必须在 `*-enter-active` 和 `*-leave-active` 中设置过渡外观
4. **性能考虑**：复杂的动画可能影响性能，建议合理使用

VuReact 的编译策略确保了从 Vue 到 React 的平滑迁移，开发者无需手动实现过渡动画逻辑。编译后的代码既保持了 Vue 的过渡语义和动画效果，又符合 React 的组件设计模式，让迁移后的应用保持完整的过渡动画能力。
