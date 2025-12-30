# useBeforeUnMount

`useBeforeUnMount` 对应 Vue 3 中的 `onBeforeUnmount` 生命周期 Hook。

它在组件卸载前、DOM 节点已从文档移除后、浏览器绘制前同步执行一次清理逻辑，是 React 中最接近 Vue `onBeforeUnmount` 时机的实现。

## 核心特性

- **精确的时机控制**：利用 `useLayoutEffect` 的清理函数，在 DOM 变更后、浏览器绘制前同步执行。此时 React 已完成 DOM 卸载操作，但浏览器尚未将变更渲染到屏幕，适合执行与 DOM 存在性相关的最终清理。
- **同步执行**：阻塞浏览器绘制流程，确保在视觉更新前完成状态保存、资源释放等关键操作，避免竞态条件。
- **与 `useUnmounted` 的本质差异**：`useUnmounted` 使用 `useEffect`（绘制后异步执行），而 `useBeforeUnMount` 使用 `useLayoutEffect`（绘制前同步执行）。两者间隔一次浏览器绘制周期，对需要精确控制 DOM 生命周期边界的场景至关重要。
- **DOM 存在性**：执行时，组件 DOM 已从文档树中移除，但尚未被浏览器垃圾回收，此时读取 DOM 尺寸或位置将返回 `null` 或 `0`。

## 使用方法

`useBeforeUnMount` 接收一个同步或异步回调函数，该函数将在组件卸载、DOM 移除后但尚未绘制前执行。

### 1. 同步资源清理

适用于在组件卸载前释放必须同步处理的资源（如移除事件监听器、取消动画帧）：

```jsx
import { useBeforeUnMount } from 'react-vue3-hooks';

useBeforeUnMount(() => {
  // 在浏览器绘制前取消动画，避免下一帧出现已卸载组件的残留动画
  cancelAnimationFrame(animationRef.current);
  
  // 移除 document 上的全局事件监听器
  document.removeEventListener('scroll', handleScroll);
});
```

### 2. 持久化状态保存

在组件彻底销毁前，将最终状态同步写入本地存储或发送到服务端：

```jsx
useBeforeUnMount(() => {
  // 组件卸载前立即保存用户输入进度到 localStorage
  localStorage.setItem('draft', JSON.stringify(formData));
  
  // 同步记录埋点（需在视觉消失前完成）
  analytics.track('component_unmount', { timestamp: Date.now() });
});
```

### 3. 异步清理操作

支持 `async` 函数，但需理解其同步调用特性——发起异步任务后，浏览器才会继续绘制：

```jsx
useBeforeUnMount(async () => {
  // 在组件消失前启动异步数据同步
  // 虽然异步操作在后台完成，但清理函数的同步部分已阻塞绘制
  await syncUnsavedChanges();
});
```

## 与 Vue 的差异说明

**重要**：React 的 `useLayoutEffect` cleanup 与 Vue `onBeforeUnmount` 存在本质时序差异：

| 阶段 | Vue `onBeforeUnmount` | `useBeforeUnMount` |
|------|---------------------|-------------------|
| DOM 状态 | 仍存在于文档树中 | **已从文档移除**（关键区别） |
| 执行时机 | 卸载前，同步 | DOM 移除后、绘制前，同步 |
| 访问 DOM | **可访问**（测量、读取最后状态） | 不可访问（读取返回 `null`）|

因此，`useBeforeUnMount` 更接近 Vue 的 **"DOM 已卸载但未视觉确认"** 阶段。对于需要"最后看一眼 DOM"的场景（如记录卸载前滚动位置），应使用 `useUnmounted` 并配合 `ref` 提前捕获状态。

## 注意事项

- **避免重计算**：`useLayoutEffect` 会阻塞绘制，清理函数应轻量，避免同步执行耗时操作。
- **SSR 环境**：在服务端渲染时，`useLayoutEffect` 及其 cleanup 均不会执行，需自行处理水合差异。
- **与 `useUnmounted` 的选择**：若清理逻辑**不依赖 DOM 存在性**（如取消订阅、清除定时器），优先使用 `useUnmounted` 以避免阻塞绘制。仅在需要"确保在视觉消失前完成"的强同步场景下使用本 Hook。
