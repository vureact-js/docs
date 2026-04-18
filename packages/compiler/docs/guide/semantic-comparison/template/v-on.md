# v-on 语义对照

[VuReact](https://vureact.top/guide/introduction.html) 是一个能将 Vue 3 代码编译为标准、可维护 React 代码的工具。今天就带大家直击核心：Vue 中常见的 `v-on`/`@` 指令经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中的 v-on 指令用法。

## `v-on` → React 事件属性

`v-on`（简写为 `@`）是 Vue 中用于绑定事件监听器的指令，用于响应用户交互。

- Vue 代码：

```vue
<button @click="increment">+1</button>
```

- VuReact 编译后 React 代码：

```jsx
<button onClick={increment}>+1</button>
```

从示例可以看到：Vue 的 `@click` 指令被编译为 React 的 `onClick` 属性。VuReact 采用 **事件属性编译策略**，将模板指令转换为 React 的标准事件属性，**完全保持 Vue 的事件绑定语义**——当按钮被点击时，调用 `increment` 函数。

这种编译方式的关键特点在于：

1. **语义一致性**：完全模拟 Vue `v-on` 的行为，实现事件监听功能
2. **命名转换**：Vue 的 `@click` 转换为 React 的 `onClick`（camelCase 命名）
3. **函数传递**：直接传递函数引用，保持事件处理逻辑
4. **React 原生支持**：使用 React 标准的事件系统，无需额外适配

## 带事件修饰符 → React `dir.on()`

Vue 的事件系统支持丰富的修饰符，用于控制事件行为。VuReact 通过运行时辅助函数处理这些修饰符。

- Vue 代码：

```vue
<button @click.stop.prevent="submit">Submit</button>
```

- VuReact 编译后 React 代码：

```jsx
import { dir } from '@vureact/runtime-core';

<button onClick={dir.on('click.stop.prevent', submit)}>Submit</button>;
```

从示例可以看到：带修饰符的 Vue 事件被编译为使用 `dir.on()` 辅助函数。VuReact 采用 **修饰符运行时处理策略**，将复杂的修饰符组合转换为运行时函数调用，**完全保持 Vue 的事件修饰符语义**。

**编译策略详解**：

```jsx
// Vue: @click.stop.prevent="handler"
// React: onClick={dir.on('click.stop.prevent', handler)}

// Vue: @keyup.enter="search"
// React: onKeyUp={dir.on('keyup.enter', search)}

// Vue: @click.capture="captureHandler"
// React: onClickCapture={dir.on('click.capture', captureHandler)}
```

**运行时辅助函数 `dir.on()` 的工作原理**：

1. **解析修饰符**：解析事件名称和修饰符字符串
2. **创建包装函数**：根据修饰符创建事件处理包装函数
3. **应用修饰符逻辑**：在包装函数中实现修饰符对应的行为
4. **调用原始处理器**：最终调用开发者提供的事件处理函数

## 内联事件处理 → React 箭头函数

Vue 支持在模板中直接编写内联事件处理逻辑，VuReact 也能正确处理。

- Vue 代码：

```vue
<button @click="count++">增加</button>
<button @click="sayHello('world')">打招呼</button>
<button @click="handleEvent($event, 'custom')">带事件对象</button>
```

- VuReact 编译后 React 代码：

```jsx
<button onClick={() => count.value++}>增加</button>
<button onClick={() => sayHello('world')}>打招呼</button>
<button onClick={(event) => handleEvent(event, 'custom')}>带事件对象</button>
```

**编译策略**：

1. **表达式转换**：将 Vue 模板表达式转换为 JSX 箭头函数
2. **事件对象处理**：Vue 的 `$event` 转换为 React 的事件参数
3. **参数传递**：保持函数调用的参数顺序和值
4. **响应式更新**：自动处理 `.value` 访问（对于 ref/computed 等变量）

## `defineEmits()` 事件 → React `props` 回调

对于组件自定义事件，VuReact 也有相应的编译策略。

- Vue 代码：

```vue
<!-- 父组件 -->
<Child @custom-event="handleCustom" />

<!-- 子组件 Child.vue -->
<template>
  <button @click="emits('custom-event', data)">触发事件</button>
</template>

<script setup>
const emits = defineEmits(['custom-event']);
</script>
```

- VuReact 编译后 React 代码：

```jsx
// 父组件使用
<Child onCustomEvent={handleCustom} />;

// 子组件 Child.jsx
function Child(props) {
  return <button onClick={() => props.onCustomEvent?.(data)}>触发事件</button>;
}
```

**编译规则**：

1. **事件名转换**：`kebab-case` 转换为 `camelCase`（`custom-event` → `onCustomEvent`）
2. **emits 调用转换**：`emits()` 转换为 props 回调调用
3. **可选链保护**：添加 `?.` 可选链操作符，避免未定义错误
4. **类型安全**：保持 TypeScript 类型定义的一致性

### 总结

VuReact 的事件编译策略展示了**完整的事件系统转换能力**：

1. **基础事件映射**：将 Vue 事件指令精确映射到 React 事件属性
2. **修饰符支持**：通过运行时辅助函数完整支持 Vue 事件修饰符
3. **内联处理**：正确处理模板中的内联事件表达式
4. **自定义事件**：支持组件间的自定义事件通信
5. **类型安全**：保持 TypeScript 类型定义的完整性

VuReact 的编译策略确保了从 Vue 到 React 的平滑迁移，开发者无需手动重写事件处理逻辑。编译后的代码既保持了 Vue 的语义和功能，又符合 React 的事件处理最佳实践，让迁移后的应用保持完整的交互能力。
