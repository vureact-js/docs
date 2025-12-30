# useUnmounted

`useUnmounted` 对应 Vue 3 中的 `onUnmounted` 生命周期 Hook。

它在组件卸载、DOM 节点已从文档移除且浏览器完成绘制后异步执行一次清理逻辑，是 React 中对 Vue "卸载后"阶段的标准实现。

## 核心特性

- **最终的清理时机**：基于 `useEffect` 清理函数实现，在 DOM 卸载且浏览器完成绘制后异步执行。此时组件已从视图层彻底消失，适合执行与 DOM 无关联的最终资源释放。
- **异步执行**：不会阻塞浏览器绘制流程，卸载的视觉反馈优先呈现，清理逻辑在后台事件循环中完成，确保用户体验流畅。
- **与 `useBeforeUnMount` 的本质差异**：`useBeforeUnMount` 使用 `useLayoutEffect`（绘制前同步执行），而本 Hook 使用 `useEffect`（绘制后异步执行），两者间隔一次完整的浏览器绘制周期，形成"卸载前→卸载后"的异步闭环。对于需要精确控制 DOM 生命周期的场景，二者不可互换。
- **DOM 不可访问性**：执行时，组件 DOM 节点不仅已从文档树移除，且浏览器已完成布局计算和绘制，此时访问任何 DOM 引用将返回 `null` 或触发错误。

## 使用方法

`useUnmounted` 接收一个同步或异步回调函数，该函数将在组件卸载且浏览器绘制完成后执行。

### 1. 异步资源清理

适用于无需阻塞卸载视觉反馈的资源释放（如取消定时器、清理 WebSocket 连接）：

```jsx
import { useUnmounted } from 'react-vue3-hooks';
import { useRef } from 'react';

const socketRef = useRef(null);

useUnmounted(() => {
  // 在组件完全消失后关闭 WebSocket，不影响卸载动画流畅度
  socketRef.current?.close();
  
  // 清除所有未完成的定时器
  timers.forEach(clearTimeout);
});
```

### 2. 最终日志记录

在组件生命周期彻底结束后，记录性能指标或用户行为数据：

```jsx
useUnmounted(() => {
  // 组件卸载后异步发送埋点，不阻塞主线程
  analytics.track('component_destroy', {
    duration: Date.now() - mountTime,
    finalState,
  });
});
```

### 3. 跨组件状态清理

在父级组件卸载后，清理全局或共享状态中的残留引用：

```jsx
useUnmounted(() => {
  // 从全局状态管理器中移除当前组件的注册
  store.unregister(componentId);
  
  // 清理 Context 中保存的引用（如果存在）
  context.setActiveComponent(null);
});
```

### 4. 异步操作支持

支持 `async` 函数，在组件卸载后启动异步清理任务：

```jsx
useUnmounted(async () => {
  // 在组件消失后异步保存未完成的草稿
  await saveDraftToServer(draftData);
  
  // 延迟清理 IndexedDB 中的临时数据
  await cleanupTemporaryStorage();
});
```

## 与 Vue 的差异说明

**核心差异**：本 Hook 与 Vue `onUnmounted` 在时序上存在细微差异，但行为对绝大多数场景无影响。

| 阶段 | Vue `onUnmounted` | `useUnmounted` |
|------|------------------|---------------|
| DOM 状态 | 已从文档移除 | 已从文档移除 |
| 执行时机 | 卸载后，**同步** | 卸载后、**绘制后异步** |
| 访问 DOM | **不可访问** | **不可访问** |
| 阻塞性 | 阻塞后续清理流程 | **不阻塞**（性能优势） |

**实际影响**：Vue 的 `onUnmounted` 是同步的，若在回调中执行耗时操作，会延迟组件完全销毁的时间点；而 `useUnmounted` 的异步特性确保卸载视觉反馈优先完成，清理逻辑在后台执行，更适合需要保持交互流畅的现代 Web 应用。

## 与 `useBeforeUnMount` 的选择指南

| 场景特征 | `useBeforeUnMount` | `useUnmounted` |
|----------|-------------------|---------------|
| **需要"最后看一眼"DOM** | ✅ 绘制前执行，DOM 刚移除但未清理 | ❌ DOM 已彻底回收 |
| **清理必须视觉消失前完成** | ✅ 同步阻塞，确保顺序 | ❌ 异步，无法保证时序 |
| **资源释放可延迟** | ❌ 阻塞绘制 | ✅ 异步执行，性能最优 |
| **保存 DOM 相关状态** (如滚动位置) | ✅ 可在清理前读取 | ❌ 读取 DOM 返回 null |
| **操作** | 移除全局事件、取消动画帧 | 关闭连接、清理缓存 |

**决策原则**：若清理逻辑**依赖 DOM 存在性**或**必须在视觉消失前完成**，使用 `useBeforeUnMount`；若清理逻辑**纯资源释放**且**可异步延迟**，使用 `useUnmounted` 以获得更佳性能。

## 注意事项

- **避免 DOM 访问**：执行时组件 DOM 已彻底移除，访问 `ref.current` 将返回 `null`，任何 DOM 操作都将无效或报错。
- **SSR 环境**：在服务端渲染时，`useEffect` 及其 cleanup 均不会执行，需确保服务端与客户端的初始状态一致性，避免水合错误。
- **异步操作风险管理**：虽然支持 `async` 函数，但组件可能在异步操作完成前完全释放内存。建议对异步清理操作进行容错处理，并避免在 `useUnmounted` 中发起新的状态更新或副作用。
- **清理顺序**：在同一个组件中，`useBeforeUnMount` 的回调会先于 `useUnmounted` 执行，形成"同步清理→异步清理"的顺序。若存在资源依赖关系，应确保清理顺序正确。