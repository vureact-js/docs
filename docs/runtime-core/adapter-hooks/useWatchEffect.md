# useWatchEffect 系列

`useWatchEffect`、`useWatchPostEffect` 和 `useWatchSyncEffect` 是**手动依赖**版本的即时监听 Hook，设计上参考 Vue 3 的 `watchEffect`、`watchPostEffect` 和 `watchSyncEffect` API，**但不存在自动依赖追踪能力**。

它们用于在**手动指定的依赖数组**变化时执行副作用，并根据执行时机的不同提供异步/同步两种模式。

## 核心特性

- **手动依赖声明**：**必须显式提供 `deps` 数组**，Hook 不会自动追踪回调函数内部访问的响应式值。这是与 Vue `watchEffect` 的根本区别，源于 React 运行时缺乏响应式系统的本质限制。
- **三种执行时机**：
  -  **`useWatchEffect` / `useWatchPostEffect`**  ：使用 `useEffect`，在浏览器绘制**后异步执行**（默认，对应 Vue `flush: 'post'`）
  -  **`useWatchSyncEffect`**  ：使用 `useLayoutEffect`，在浏览器绘制**前同步执行**（对应 Vue `flush: 'sync'`）
- **自动清理管理**：回调可返回清理函数，在下次重新执行或组件卸载时自动调用，遵循与 `useWatch` 一致的清理模式。
- **手动停止控制**：均返回 `WatchStopHandle` 函数，可在任意时刻调用以停止监听并清理资源。

## 使用方法

### 1. 基础使用（必须提供 deps）

```jsx
import { useWatchEffect } from 'react-vue3-hooks';
import { useState } from 'react';

const [count, setCount] = useState(0);
const [name, setName] = useState('Alice');

// 必须显式声明 deps，否则不会触发
useWatchEffect(() => {
  console.log(`Count: ${count}, Name: ${name}`);
}, [count, name]); // ⚠️ 手动提供依赖数组

// 当 count 或 name 变化时才会重新执行
```

### 2. 无依赖的即时监听

若希望回调仅在挂载时执行一次，提供空数组 `[]`：

```jsx
useWatchEffect(() => {
  console.log('Component mounted');
}, []); // 仅挂载时执行一次
```

### 3. 同步执行（useWatchSyncEffect）

在需要同步执行、阻塞绘制的场景使用：

```jsx
import { useWatchSyncEffect } from 'react-vue3-hooks';

useWatchSyncEffect(() => {
  // 同步执行，浏览器绘制前完成
  // 适合需要精确测量布局或避免闪烁的场景
  const height = elementRef.current?.offsetHeight;
  setLayoutHeight(height || 0);
}, [items.length]); // 必须声明依赖
```

### 4. 手动停止监听

返回的 stop 函数可在任意条件满足时停止监听：

```jsx
const stop = useWatchEffect(() => {
  syncData();
}, [userId]);

// 用户登出后停止数据同步
useEffect(() => {
  if (userLoggedOut) {
    stop();
  }
}, [userLoggedOut]);
```

## 与 Vue 的本质区别

**⚠️ 重要警告：不存在自动依赖追踪**

这是本系列 Hook 与 Vue `watchEffect` 的本质差异：

| 特性 | Vue `watchEffect` | `useWatchEffect` |
|------|------------------|-----------------|
| **依赖声明** | **无需声明**（自动追踪） | **必须手动提供 `deps`** |
| **追踪机制** | **Proxy 代理**（运行时劫持） | **无追踪**（纯 useEffect 封装） |
| **使用方式** | `watchEffect(() => { ... })` | `useWatchEffect(() => { ... }, deps)` |
| **易错点** | 无 | **遗漏 deps 导致不触发** |
| **开发体验** | **声明式** | **命令式**（需手动维护）|

**React 的限制**：React 没有响应式系统，无法在运行时自动追踪函数内部访问了哪些状态。任何声称"自动追踪依赖"的 React Hook 都是伪概念，实际仍需手动提供依赖数组。

## 注意事项

- **依赖数组是强制性的**：若省略 `deps`，Hook 将仅在挂载时执行一次。任何希望响应的状态变化**必须显式声明**在 deps 数组中。
- **依赖稳定性**：确保 deps 数组中的值在组件生命周期内保持稳定引用。频繁创建新对象（如内联对象/数组）会导致不必要的重新执行。
- **与 `useWatch` 的选择**：
  - `useWatch`：需要**精确控制监听源**、**访问旧值**时使用
  - `useWatchEffect`：需要 **"deps 变化就执行"** 的简单模式时使用
- **执行时机选择**：默认使用 `useWatchEffect`（post），仅在需要避免闪烁或精确测量布局时使用 `useWatchSyncEffect`。滥用 sync 模式会阻塞浏览器绘制，影响性能。
- **SSR 兼容性**：在服务端渲染时，`useEffect` 和 `useLayoutEffect` 均不会执行，因此本系列 Hook 在 SSR 阶段无效。