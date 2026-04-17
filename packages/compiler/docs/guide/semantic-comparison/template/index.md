# 模板编译对照

本页基于 `compiler-core` 当前实现，展示 Template 层从 Vue 到 React 的常见与进阶转换。

> 说明：示例为简化对照，最终输出以本地编译产物为准。

## 1. 关键规则：模板里的 `ref` 会自动补 `.value`

在 Vue 模板里，`ref` 变量通常直接写变量名，不需要手写 `.value`。VuReact 在转换模板表达式时会自动补上 `.value`。

Vue 输入：

```vue
<script setup lang="ts">
import { ref } from 'vue';

const count = ref(1);
</script>

<template>
  <p>{{ count }}</p>
  <button @click="count++">+1</button>
</template>
```

React 输出（示意）：

```tsx
<p>{count.value}</p>
<button onClick={() => count.value++; }>+1</button>
```

## 2. 条件分支：`v-if / v-else-if / v-else`

Vue 输入：

```vue
<template>
  <div v-if="a">A</div>
  <div v-else-if="b">B</div>
  <div v-else>C</div>
</template>
```

React 输出（示意）：

```tsx
{
  a ? <div>A</div> : b ? <div>B</div> : <div>C</div>;
}
```

约束：`v-else` / `v-else-if` 必须紧邻有效分支。

## 3. 列表：`v-for`

### 数组遍历

Vue 输入：

```vue
<li v-for="(item, i) in list" :key="item.id">{{ i }} - {{ item.name }}</li>
```

React 输出（示意）：

```tsx
{
  list.map((item, i) => (
    <li key={item.id}>
      {i} - {item.name}
    </li>
  ));
}
```

### 对象遍历

Vue 输入：

```vue
<li v-for="(val, key, i) in obj" :key="key">{{ i }} - {{ key }}: {{ val }}</li>
```

React 输出（示意）：

```tsx
{
  Object.entries(obj).map(([key, val], i) => (
    <li key={key}>
      {i} - {key}: {val}
    </li>
  ));
}
```

## 4. 事件：`v-on` / `@`

### 基础事件

Vue 输入：

```vue
<button @click="increment">+1</button>
```

React 输出（示意）：

```tsx
<button onClick={increment}>+1</button>
```

### 带修饰符（示意）

Vue 输入：

```vue
<button @click.stop.prevent="submit">Submit</button>
```

React 输出（示意）：

```tsx
<button onClick={dir.on('click.stop.prevent', submit)}>Submit</button>
```

说明：带修饰符时会走 [runtime](https://runtime.vureact.top/guide/utils/adapter-utils.html) 指令辅助；`.capture` 会映射到 `onClickCapture`。

## 5. 绑定：`v-bind` / `:prop` / `class` / `style`

### 普通绑定

Vue 输入：

```vue
<img :src="url" :alt="title" />
```

React 输出（示意）：

```tsx
<img src={url} alt={title} />
```

### class/style 复杂表达式

Vue 输入：

```vue
<div :class="['card', active && 'is-active']" :style="{ color, fontSize: size + 'px' }" />
```

React 输出（示意）：

```tsx
<div
  className={dir.cls(['card', active && 'is-active'])}
  style={dir.style({ color, fontSize: size + 'px' })}
/>
```

说明：复杂 `class/style` 合并会走 [runtime](https://runtime.vureact.top/guide/utils/adapter-utils.html) 辅助函数。

### 无参数 `v-bind`

Vue 输入：

```vue
<button v-bind="btnProps">Go</button>
```

React 输出（示意）：

```tsx
<button {...dir.keyless(btnProps)}>Go</button>
```

说明：无参数 `v-bind` 会覆盖同名 props，编译期会给出提示。

## 6. `v-model`（部分能力）

### 原生输入

Vue 输入：

```vue
<input v-model="keyword" />
<input type="checkbox" v-model="checked" />
```

React 输出（示意）：

```tsx
<input value={keyword.value} onInput={(value) => { keyword.value = value; }} />
<input checked={checked.value} onChecked={(value) => { checked.value = value; }} />
```

### 组件 `v-model`

Vue 输入：

```vue
<CounterPanel v-model="count" />
```

React 输出（示意）：

```tsx
<CounterPanel
  modelValue={count.value}
  onUpdateCount={(value) => {
    count.value = value;
  }}
/>
```

说明：不同元素/组件上的 `v-model` 语义不同，接入时务必做产物校验。

## 7. 插槽：默认插槽与作用域插槽

### 默认插槽

Vue 输入：

```vue
<MyPanel>
  <span>Inner</span>
</MyPanel>
```

React 输出（示意）：

```tsx
<MyPanel>
  <span>Inner</span>
</MyPanel>
```

### 作用域插槽

Vue 输入：

```vue
<ListBox>
  <template #item="{ row }">
    <span>{{ row.name }}</span>
  </template>
</ListBox>
```

React 输出（示意）：

```tsx
<ListBox item={({ row }) => <span>{row.name}</span>} />
```

### 子组件 `<slot>` 出口

Vue 输入：

```vue
<slot name="footer" :count="count"></slot>
```

React 输出（示意）：

```tsx
{
  props.footer?.({ count: count.value });
}
```

说明：动态 slot key/动态 slot prop 可能触发警告并走保守策略。

## 8. `ref` 属性：`ref="x"` 与 `:ref`

Vue 输入：

```vue
<p ref="p"></p>
<span :ref="(el) => (domRef = el)"></span>
```

React 输出（示意）：

```tsx
<p ref={pRef} />
<span ref={(el) => (domRef.value = el)} />
```

说明：`useTemplateRef` 对应变量会映射到 `.current` 语义。

## 9. 动态组件：`is` / `:is`

Vue 输入：

```vue
<component :is="currentView" />
```

React 输出（示意）：

```tsx
<Component is={currentView} />
```

## 10. 其他指令

### `v-show`

```vue
<div v-show="open">Content</div>
```

```tsx
<div style={{ display: open ? '' : 'none' }}>Content</div>
```

### `v-text`

```vue
<p v-text="message"></p>
```

```tsx
<p>{message}</p>
```

### `v-html`

```vue
<div v-html="htmlContent"></div>
```

```tsx
<div dangerouslySetInnerHTML={{ __html: htmlContent }} />
```

### `v-memo`

```vue
<div v-memo="[id, status]"></div>
```

```tsx
{
  /* 生成 memo 相关包裹（依赖数组要求可分析） */
}
```

## 11. 组件规则（模板后处理）

1. `Transition` 子节点必须满足结构要求，且建议配合 `v-if` / `v-show`
2. `Transition` 场景会补充 `key` 以保证切换稳定
3. `RouterLink` 的 `v-slot` 会转换为 `customRender` 形式

## 12. 常见告警与限制

1. 未知指令会告警
2. 出现不可分析的 Vue 运行时 `$xxx` 变量会报错
3. 动态 prop key、动态 slot key 可能降级处理
4. 模板表达式越"可分析"，转换结果越稳定

## 13. 内置组件转换支持

### Vue 内置组件

VuReact 支持以下 Vue 内置组件的转换：

| Vue 组件          | React 对应组件    | 说明         |
| ----------------- | ----------------- | ------------ |
| `KeepAlive`       | `KeepAlive`       | 缓存组件状态 |
| `Suspense`        | `Suspense`        | 异步组件加载 |
| `Teleport`        | `Teleport`        | 传送门组件   |
| `Transition`      | `Transition`      | 过渡动画     |
| `TransitionGroup` | `TransitionGroup` | 列表过渡     |
| `Component`       | `Component`       | 动态组件容器 |

### Vue Router 组件

| Vue Router 组件 | React 对应组件 | 说明     |
| --------------- | -------------- | -------- |
| `RouterLink`    | `RouterLink`   | 路由链接 |
| `RouterView`    | `RouterView`   | 路由视图 |

## 14. 运行时辅助函数

在转换过程中，VuReact 会使用以下运行时辅助函数：

### `dir.cls(className: string | Array<string | boolean>)`

处理复杂的 `class` 绑定表达式，支持数组、条件表达式等。

```tsx
// Vue: :class="['card', active && 'is-active']"
// React: className={dir.cls(['card', active && 'is-active'])}
```

### `dir.style(styleObject: object)`

处理复杂的 `style` 绑定表达式，支持对象表达式。

```tsx
// Vue: :style="{ color, fontSize: size + 'px' }"
// React: style={dir.style({ color, fontSize: size + 'px' })}
```

### `dir.on(eventName: string, handler: Function)`

处理带修饰符的事件绑定。

```tsx
// Vue: @click.stop.prevent="submit"
// React: onClick={dir.on('click.stop.prevent', submit)}
```

### `dir.keyless(propsObject: object)`

处理无参数的 `v-bind`。

```tsx
// Vue: v-bind="btnProps"
// React: {...dir.keyless(btnProps)}
```

## 15. 编译流程概述

VuReact 的模板转换遵循以下流程：

### 1. 解析阶段

- 使用 `@vue/compiler-sfc` 解析 Vue SFC
- 分离 template、script、style 部分
- 生成 Vue AST

### 2. 转换阶段

- 遍历 Vue AST，转换为中间表示（IR）
- 处理指令、属性、事件等
- 收集响应式变量引用

### 3. 生成阶段

- 将 IR 转换为 Babel AST
- 生成 JSX 代码
- 应用代码格式化

### 4. 后处理阶段

- 优化生成的 JSX 结构
- 添加必要的运行时导入
- 处理样式和资源引用

## 16. 特殊场景处理

### 动态 Slot Key

```vue
<template #[dynamicSlotName]>Content</template>
```

动态 slot key 会触发警告，并采用保守的转换策略。

### 动态 Prop Key

```vue
<component :[dynamicProp]="value" />
```

动态 prop key 可能无法完全分析，编译期会给出提示。

### Vue 运行时变量

模板中出现 `$xxx` 形式的 Vue 运行时变量会报错，因为这些变量在 React 环境中不存在。

### 表达式可分析性

模板表达式越简单、越可静态分析，转换结果越稳定。建议：

- 避免复杂的链式表达式
- 避免使用 Vue 特有的全局变量
- 尽量使用明确的变量引用

## 17. 编译警告与错误

### 警告级别

1. **信息级**：不影响编译的提示信息
2. **警告级**：可能影响功能但继续编译
3. **错误级**：无法继续编译的严重问题

### 常见警告

- 未知指令或属性
- 结构错误（如 v-else 没有相邻 v-if）
- 动态内容无法完全分析
- 潜在的运行时问题

### 错误处理

- 语法错误：立即停止编译
- 类型错误：根据配置决定是否继续
- 运行时依赖缺失：提示用户安装

## 18. 最佳实践建议

### 模板编写

1. **保持简单**：避免过于复杂的模板逻辑
2. **明确引用**：使用明确的变量名，避免歧义
3. **结构清晰**：合理使用组件和插槽

### 转换准备

1. **类型检查**：确保 TypeScript 类型定义完整
2. **依赖管理**：检查所有 Vue 特性的 React 对应实现
3. **测试验证**：转换后务必进行功能测试

### 调试技巧

1. **逐步转换**：先转换简单组件，再处理复杂逻辑
2. **产物对比**：对比转换前后的功能行为
3. **运行时检查**：关注控制台警告和错误信息
