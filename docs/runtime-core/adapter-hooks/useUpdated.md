# useUpdated

`useUpdated` 对应 Vue 3 中的 `onUpdated` 生命周期 Hook。

它在指定依赖项发生变化导致组件重新渲染后，于 DOM 更新且浏览器绘制完成后异步执行回调函数，用于响应特定依赖变化引起的更新行为。

## 核心特性

- **依赖驱动的更新**：必须显式声明依赖数组（`deps`），仅在依赖变化时触发。这是 Vue `onUpdated` 自动依赖追踪与 React 显式数据流之间的重要折衷，相比无依赖版本避免了无关状态变化导致的过度触发。
- **跳过首次挂载**：确保回调不会在组件初始渲染时执行，严格匹配 Vue `onUpdated` "只在更新后触发"的语义。
- **异步执行**：基于 `useEffect` 实现，在 DOM 更新且浏览器完成绘制后异步调用，确保不会阻塞视觉更新，适合响应式副作用。
- **与 `useBeforeUpdate` 的时序关系**：本 Hook 在 `useBeforeUpdate` 之后执行，两者间隔一次完整的浏览器绘制周期，形成"更新前→更新后"的异步闭环。`useBeforeUpdate` 可访问更新后但未显示的 DOM，而 `useUpdated` 面对的是已呈现给用户的新 DOM 状态。

## 使用方法

`useUpdated` 接收一个无参回调函数和一个依赖数组，回调将在依赖变化导致组件重新渲染（首次除外）后执行。

### 1. 响应特定状态更新

仅在 `count` 变化导致的更新后执行逻辑，避免无关状态变化触发：

```jsx
import { useUpdated } from 'react-vue3-hooks';
import { useState } from 'react';

const [count, setCount] = useState(0);

useUpdated(() => {
  // 仅在 count 变化导致组件更新后执行
  console.log('Count updated, DOM painted');
  analytics.track('count_changed', { newValue: count });
}, [count]); // 显式声明依赖
```

### 2. 第三方库状态同步

在特定数据更新后，同步更新外部托管的第三方库实例：

```jsx
const [markers, setMarkers] = useState([]);

useUpdated(() => {
  // markers 数组变化导致组件更新后，同步到地图实例
  mapInstance.setMarkers(markers);
}, [markers]); // 精确控制触发时机
```

### 3. 操作更新后的 DOM

在依赖变化完成视觉呈现后，执行需要用户感知到新内容的操作：

```jsx
import { useUpdated } from 'react-vue3-hooks';
import { useRef } from 'react';

const listRef = useRef();
const [items, setItems] = useState([]);

useUpdated(() => {
  // items 更新并显示后，滚动到新增的最后一个元素
  const lastElement = listRef.current?.lastElementChild;
  lastElement?.scrollIntoView({ behavior: 'smooth' });
}, [items.length]); // 仅在列表长度变化时触发
```

### 4. 异步操作

支持 `async` 函数，在特定依赖更新后启动异步任务：

```jsx
useUpdated(async () => {
  // formData 变化后重新验证表单状态
  const validation = await validateForm(formData);
  setValidationErrors(validation);
}, [formData]); // 避免无关状态变化导致的重复验证
```

## 与 Vue 的差异说明

**核心差异**：本 Hook 并非 Vue `onUpdated` 的精确复刻，而是 React 约束下的行为模拟。

| 特性 | Vue `onUpdated` | `useUpdated` |
|------|----------------|-------------|
| **触发条件** | **任何响应式数据变化**导致更新 | **仅依赖数组变化**（显式声明） |
| **依赖追踪** | 自动追踪所有响应式引用 | **无追踪**（需手动声明） |
| **执行时机** | DOM 更新后，**同步** | DOM 更新后、**绘制后异步** |
| **访问 DOM** | **可访问新 DOM** | **可访问新 DOM** |
| **性能影响** | 精确触发，无多余调用 | **避免过度触发** |

**核心差异**：Vue 的 `onUpdated` 由响应式系统精准驱动，只在相关数据变化时触发；而 `useUpdated` 的触发条件是"显式指定的依赖数组变化"。这更符合 React 的显式数据流哲学，但需要开发者准确声明依赖。

## 注意事项

- **依赖准确性**：必须准确声明所有依赖项，遗漏会导致回调不触发，多余会导致不必要的执行。建议使用 ESLint `react-hooks/exhaustive-deps` 规则辅助检查。
- **与 `useBeforeUpdate` 的选择**：若操作需要**在视觉呈现前完成**（如计算布局、对比新旧 DOM 差异），优先使用 `useBeforeUpdate`。本 Hook 适用于**不阻塞绘制**的后置响应（如日志、同步外部状态）。
- **SSR 环境**：在服务端渲染时，`useEffect` 不会执行，因此 `useUpdated` 不会在 SSR 过程中触发，需确保客户端与服务端的初始渲染结果一致，避免水合错误。
- **性能优化**：对于高频变化的依赖（如鼠标位置），应考虑防抖或节流，避免在回调中执行重计算操作。
