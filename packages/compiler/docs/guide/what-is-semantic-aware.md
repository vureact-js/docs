# 什么是语义感知

**语义感知编译** 不是把 Vue 语法机械替换成 React 语法，而是先理解代码的运行语义（如响应式、生命周期与数据流），再生成符合 React 模型的代码。

如果你只记住一个结论，请记住这句：

> **VuReact 解决的不是“代码怎么改”，而是“这些代码在 React 中应如何成立”。**

## 1. 核心概念：它和“语法级转换”有什么本质区别？

最直观的区别是：

- 语法级转换看“长得像什么”
- 语义级转换看“它到底在做什么”

### 对照示例 A：`ref` 不是简单改名

Vue 输入：

```vue
<script setup lang="ts">
import { ref } from 'vue';
const count = ref(0);
const inc = () => count.value++;
</script>
```

常见机械转换（示意）：

```tsx
const [count, setCount] = useState(0); // 语法上类似，但响应式语义已改变
const inc = () => count++; // 行为已经不对
```

语义级转换输出（示意）：

```tsx
const count = useVRef(0); // 适配响应式语义，与 Vue 的 ref 行为对齐
const inc = useCallback(() => {
  count.value++;
}, [count.value]); // 依赖可分析、可收集
```

**重点**：这里不是简单地把 `ref` 改成 `useState`，而是保留“可变响应式引用”的行为语义，并生成符合 React 规则的结构。

## 2. 它解决了什么问题？优势是什么？

Vue -> React 迁移最痛的通常不是语法，而是 **语义丢失**。

常见问题：

1. 指令与结构转换后行为偏移（条件、列表、插槽、双向绑定）
2. 产物不稳定，同类代码输出风格漂移
3. 代码可读性差，后续维护困难
4. 依赖丢失或漏收集（如回调、计算值、侦听逻辑漏依赖），导致闭包过期、状态不同步或行为偶发异常

语义感知模式的价值：

- **稳定性**：同类输入更容易得到一致输出
- **可维护性**：产物结构更贴近 React 工程实践
- **心智一致性**：可以按“输入行为 -> 输出行为”理解结果
- **依赖可靠性**：通过自动依赖分析与收集，显著降低“漏依赖”导致的隐性问题

**阅读建议**：如果你最关心“依赖为什么会漏、怎么避免漏”，可以直接跳到 [第 5 章](#_5-自动依赖分析与收集-关键能力)，再回来看这一节会更容易串起来。

## 3. 与常见工具的思路差异

行业常见路径大致有三类：

1. 语法替换：快，但复杂场景容易失真
2. AST 映射：更严谨，但缺少语义阶段时仍可能机械化
3. 运行时代理：短期省事，长期复杂度可能转移到运行时

VuReact 的路线是：

- 分阶段处理（先解析、再理解、再生成）
- 先建立语义上下文，再生成代码
- 能在编译期确定的，尽量不推迟到运行期

**重点**：这让结果更可预测，更适合长期维护与团队协作。

## 4. Template / Script 两个维度：为什么说它在“重建逻辑”？

## 4.1 Template：理解结构、作用域、指令语义

模板层会重点处理：

- 条件分支关系（`v-if / v-else-if / v-else`）
- 列表语义（`v-for` 的源、值、索引、key）
- 事件修饰语义（`v-on`）
- 插槽作用域（`v-slot`）
- 不同目标下的 `v-model` 行为

### 对照示例 B：`v-model` 不是只改事件名

Vue 输入：

```vue
<ChildPanel v-model="title" />
```

语义编译输出（示意）：

```tsx
<ChildPanel
  modelValue={title.value}
  onUpdateModelValue={(value) => {
    title.value = value;
  }}
/>
```

**重点**：这里重建的是“数据流协议”，且保证子组件内得到了相应 `prop` 与 `emit`，不是单纯把 `v-model` 换成一个属性。

### 对照示例 C：复杂嵌套条件指令 -> JSX 三元结构

这类场景最能体现“语义编译”的价值：重点不是把 `v-if` 改成 `? :`，而是保留 **分支关系** 和 **兜底顺序**。

Vue 输入（示意）：

```vue
<template>
  <div v-if="user">
    <AdminPanel v-if="user.role === 'admin'" />
    <GuestPanel v-else-if="user.role === 'guest'" />
    <MemberPanel v-else />
  </div>
  <EmptyState v-else />
</template>
```

语义编译输出（示意）：

```tsx
{
  user ? (
    user.role === 'admin' ? (
      <AdminPanel />
    ) : user.role === 'guest' ? (
      <GuestPanel />
    ) : (
      <MemberPanel />
    )
  ) : (
    <EmptyState />
  );
}
```

### 对照示例 D：`v-for` -> `map / Object.entries`

`v-for` 的重建会根据数据类型区分处理：  
数组通常走 `map`，对象通常走 `Object.entries(...).map(...)`。

Vue 输入（示意）：

```vue
<template>
  <li v-for="(item, i) in list" :key="item.id">{{ i }} - {{ item.name }}</li>
  <li v-for="(val, key, i) in obj" :key="key">{{ i }} - {{ key }}: {{ val }}</li>
</template>
```

语义编译输出（示意）：

```tsx
{
  list.map((item, i) => (
    <li key={item.id}>
      {i} - {item.name}
    </li>
  ));
}
{
  Object.entries(obj).map(([key, val], i) => (
    <li key={key}>
      {i} - {key}: {val}
    </li>
  ));
}
```

### Template 可读性建议（更稳定、也更利于迁移）

1. 条件链尽量保持扁平，避免跨层交叉 `v-if`/`v-else`
2. `v-for` 总是提供稳定 `:key`，避免用临时随机值
3. 模板表达式尽量简洁，把复杂逻辑放回 script
4. 插槽参数命名清晰，避免多层嵌套解构
5. 同一片模板内尽量保持一种主要数据流风格，减少混杂

## 4.2 Script：对齐响应式、生命周期、setup 逻辑

脚本层会处理：

- 响应式 API 语义映射（`ref/computed/watch` 等）
- 宏语义（`defineProps`、`defineEmits`、`defineExpose` 等）
- 生命周期和依赖关系
- setup 逻辑如何落地成 React 组件结构

简化理解：  
**Script 层是在“可分析、可执行、可维护”的前提下完成语义对齐。**

## 5. 自动依赖分析与收集（关键能力）

这一章的亮点不是“自动把变量塞进依赖数组”，而是：  
**按目标触发分析、按作用域过滤噪声、按引用链做朔源收集**，最终生成可维护的 React 依赖表达。

分析能力覆盖从基础读取到复杂嵌套，再到别名/解构朔源。  
也就是说，它并不是“看见语句就收集”，而是有明确触发条件与边界。

### 5.1 什么时候会触发依赖分析？

依赖分析只在“会被重建为依赖型结构”的目标上触发，常见包括：

1. 顶层箭头函数（通常重建为 `useCallback`）
2. 顶层对象/数组/表达式（通常重建为 `useMemo`）
3. 以上目标里读取到的响应式来源（如 `ref.value`、`reactive` 等访问）
4. 可追踪的别名、解构、跨变量引用（会继续朔源到上游来源）

**重点**：先确定“分析目标”，再做依赖收集，而不是全文件无差别扫描。

### 5.2 哪些场景不会收集（有意设计的边界）

为了避免误判，以下场景会采取保守策略：

1. 普通 `function` 声明（非依赖型重建目标）
2. 作为参数传入的临时回调、类方法、对象方法中的局部函数
3. 函数内部新建的响应式变量，或同名变量对外层变量的遮蔽
4. 高动态访问路径（如动态索引）仅做有限收集，不做激进推断

**重点**：这是为了保证结果 **可预测、可解释、可维护**，不是“能力缺失”。

### 5.3 复杂嵌套示例：对象 + 数组 + 函数互相引用

Vue 输入（示意）：

```vue
<script setup lang="ts">
const fooRef = ref(0);
const reactiveState = reactive({ foo: 'bar', bar: { c: 1 } });

const memoizedObj = {
  title: 'test',
  bar: fooRef.value,
  add: () => {
    reactiveState.bar.c++;
  },
};

const reactiveList = [fooRef.value, 1, 2];
const mixedList = [
  { name: reactiveState.foo, age: fooRef.value },
  { name: 'A', age: 20 },
];

const nestedObj = {
  a: {
    b: {
      c: reactiveList[0],
      d: () => memoizedObj.bar,
    },
    e: mixedList,
  },
};

const computeFn = () => {
  memoizedObj.add();
  return nestedObj.a.b.d();
};
</script>
```

语义编译输出（示意）：

```tsx
const memoizedObj = useMemo(
  () => ({
    title: 'test',
    bar: fooRef.value,
    add: () => {
      reactiveState.bar.c++;
    },
  }),
  [fooRef.value, reactiveState.bar?.c],
);

const reactiveList = useMemo(() => [fooRef.value, 1, 2], [fooRef.value]);
const mixedList = useMemo(
  () => [
    { name: reactiveState.foo, age: fooRef.value },
    { name: 'A', age: 20 },
  ],
  [reactiveState.foo, fooRef.value],
);

const nestedObj = useMemo(
  () => ({
    a: {
      b: { c: reactiveList[0], d: () => memoizedObj.bar },
      e: mixedList,
    },
  }),
  [reactiveList[0], memoizedObj.bar, mixedList],
);

const computeFn = useCallback(() => {
  memoizedObj.add();
  return nestedObj.a.b.d();
}, [memoizedObj, nestedObj.a?.b]);
```

**你可以重点观察**：  
`nestedObj` 的依赖并不是“拍脑袋加几个变量”，而是能把跨层引用（`reactiveList[0]`、`memoizedObj.bar`、`mixedList`）稳定收集出来。

### 5.4 朔源依赖收集示例：别名链与解构

Vue 输入（示意）：

```vue
<script setup lang="ts">
const state = reactive({ foo: 'bar' });
const listRef = ref([1, 2, 3]);

const aliasA = state.foo;
const aliasB = aliasA;
const aliasC = aliasB;

const { foo: stateFoo } = state;
const [first] = listRef.value;

const traceFn = () => {
  aliasC;
  stateFoo;
  first;
};
</script>
```

语义编译输出（示意）：

```tsx
const aliasA = useMemo(() => state.foo, [state.foo]);
const aliasB = useMemo(() => aliasA, [aliasA]);
const aliasC = useMemo(() => aliasB, [aliasB]);

const { foo: stateFoo } = useMemo(() => state, [state]);
const [first] = useMemo(() => listRef.value, [listRef.value]);

const traceFn = useCallback(() => {
  aliasC;
  stateFoo;
  first;
}, [aliasC, stateFoo, first]);
```

**重点**：从结果上看，编译器并不会停在“变量名表面”，而是能沿着别名链和解构路径继续追踪依赖来源。

### 5.5 给开发者的写法建议（让依赖分析更稳）

1. 把关键回调、视图模型放在顶层，便于稳定触发分析
2. 尽量减少“动态路径 + 深层匿名回调”混用，降低边界不确定性
3. 允许别名与解构，但保持链路清晰，避免过度绕行
4. 把“很动态”的逻辑隔离到局部函数中，主流程保持可分析

## 6. 静态提升（Static Hoisting）

当编译器确认某些顶层值是静态且不会随渲染变化时，会把它们提升到组件外，避免重复创建。

Vue 输入（示意）：

```vue
<script setup lang="ts">
const TITLE = 'User Panel';
const RETRY_LIMIT = 3;
</script>
```

语义编译输出（示意）：

```tsx
const TITLE = 'User Panel';
const RETRY_LIMIT = 3;

const UserPanel = memo(() => {
  return <h3>{TITLE}</h3>;
});
```

## 7. 宏语义：`defineProps`、`defineEmits`、`defineSlots`、`defineExpose`

这四个宏是 Vue 组件“接口语义”的核心来源。  
语义编译的目标不是把它们保留为原样调用，而是把它们重建成 React 世界里更自然的接口形态。

先看一个组合示意：

Vue 输入（示意）：

```vue
<script setup lang="ts">
const props = defineProps<{ title: string }>();
const emit = defineEmits<{ (e: 'save', id: number): void }>();
const slots = defineSlots<{ default?: () => any; footer?: (p: { count: number }) => any }>();

const count = ref(0);
defineExpose({ count });
</script>
```

语义编译输出（示意）：

```tsx
type IComponentProps = {
  title: string;
  onSave?: (id: number) => void;
  children?: React.ReactNode;
  footer?: (p: { count: number }) => React.ReactNode;
};

const Component = memo(
  forwardRef<any, IComponentProps>((props, expose) => {
    const count = useVRef(0);

    useImperativeHandle(expose, () => ({ count }));

    return <>{props.children}</>;
  }),
);
```

### 7.1 defineProps：从“宏声明”重建为“组件参数契约”

`defineProps` 的核心价值是声明输入契约。  
语义编译会把这个契约重建为 React 组件参数类型与 `props` 访问路径。
**重点**：关注的是“输入边界”是否清晰，不是宏调用是否原样存在。

### 7.2 defineEmits：从事件声明重建为回调协议

`defineEmits` 本质上是“组件输出事件协议”。  
语义编译会将其重建为 `onXxx` 回调接口，并把 `emit(...)` 调用映射到 `props.onXxx?.(...)` 语义。
**重点**：它保留的是“组件如何向外通信”的协议语义。

### 7.3 defineSlots：从插槽声明重建为函数型/节点型 props

`defineSlots` 描述的是“子内容如何注入组件”。  
语义编译会按插槽类型重建为 React 中可维护的 `children` 或函数型 props 形态。
**重点**：它保留的是“插槽作用域与调用关系”，而不只是模板语法表面形态。

### 7.4 defineExpose：从暴露对象重建为 `ref` 能力边界

`defineExpose` 的语义是“对父组件暴露哪些能力”。  
语义编译会重建为 `forwardRef + useImperativeHandle`，让暴露边界在 React 中可预测、可维护。
**重点**：它保留的是“组件公开能力接口”，而不是特定 API 名称。

一句话总结这一章：  
**这四个宏共同定义了组件的输入、输出、插槽与暴露边界；语义编译的工作就是把这套边界语义稳定迁移到 React。**

## 8. 编译产物大致长什么样？

通常会看到这样的形态（示意）：

```tsx
import { memo, useMemo, useCallback } from 'react';
import { useVRef, useComputed } from '@vureact/runtime-core';

const LABEL = 'Counter'; // 静态提升
const Counter = memo((props) => {
  const count = useVRef(0);
  const double = useComputed(() => count.value * 2);

  const meta = useMemo(() => ({ label: LABEL, value: count.value }), [count.value]);

  const onAdd = useCallback(() => {
    count.value++;
  }, [count.value]);

  return (
    <div>
      {meta.label}: {double.value}
    </div>
  );
});

export default Counter;
```

产物特征可以概括为：

- **React 组件结构**清晰
- **runtime 适配层**负责保留 Vue 语义
- **原生 React 可维护性**保留，后续可以直接人工修改

## 9. 为什么“语义感知 + AI 协作”在迁移中更有优势？

1. **AI 更容易理解结构**：组件职责和数据流更清晰
2. **AI 二次修改更稳定**：同类改动更容易批量一致
3. **渐进迁移更顺畅**：可以按模块并行推进
4. **大型项目更高效**：稳定、可读、可批处理比“魔法式转换”更重要

> **一句话总结**：语义越清晰，AI 协作成本越低。

## 10. 小结

语义感知编译真正的价值，不在于改写速度，而在于：

- **输出是否稳定**
- **团队是否看得懂**
- **后续是否改得动**

VuReact 的选择是工程化路线：  
在编译阶段做足理解与约束，换来更可靠的 React 产物。
