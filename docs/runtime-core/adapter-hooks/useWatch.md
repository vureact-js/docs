# useWatch

`useWatch` 对应 Vue 3 中的 `watch` API，用于监听响应式数据源并在变化时执行副作用。

它提供了 Vue `watch` 的核心功能，包括监听单个/多个源、深度监听、立即执行、一次性监听等选项，并返回手动停止句柄。

## 核心特性

- **灵活的监听源**：支持直接监听值、getter 函数返回值、数组（多源监听），自动识别源类型并提取依赖。
- **深度监听**：通过 `deep: true` 选项对非原始值（对象、数组）进行深度比较，检测深层嵌套属性的变化。内部自动选择深度比较策略，避免不必要的重渲染。
- **立即执行**：`immediate: true` 使回调在组件挂载时立即执行一次，模拟 Vue 的立即触发行为。
- **一次性监听**：`once: true` 使回调仅执行一次后自动停止监听，适用于仅需响应首次变化的场景。
- **自动清理管理**：支持回调返回清理函数（同步或异步），在下次触发或组件卸载时自动调用，避免内存泄漏。
- **手动停止监听**：返回 `WatchStopHandle` 函数，可在任意时刻调用以停止监听并清理资源。

## 使用方法

### 1. 监听单个响应式值

监听基本类型或对象引用，当值变化时执行回调：

```jsx
import { useWatch } from 'react-vue3-hooks';
import { useState } from 'react';

const [count, setCount] = useState(0);

// 监听单个值
const stop = useWatch(count, (newVal, oldVal) => {
  console.log(`Count changed: ${oldVal} → ${newVal}`);
  // 返回可选的清理函数
  return () => {
    console.log('Cleanup from last effect');
  };
});

// 手动停止监听
// stop();
```

### 2. 监听 getter 函数

通过函数形式监听计算值或特定属性，实现更精确的依赖控制：

```jsx
const [state, setState] = useState({ nested: { value: 1 } });

// 只监听深层属性
useWatch(
  () => state.nested.value,
  (newVal, oldVal) => {
    console.log('Nested value changed');
  }
);
```

### 3. 监听多个源

传入数组同时监听多个值，任一变化都会触发回调：

```jsx
const [foo, setFoo] = useState(1);
const [bar, setBar] = useState(2);

useWatch([foo, bar], ([newFoo, newBar], [oldFoo, oldBar]) => {
  console.log('Multi-source change detected');
});
```

### 4. 深度监听对象

监听对象深层变化，配合 `deep: true` 检测嵌套属性变更：

```jsx
const [user, setUser] = useState({ name: 'Alice', profile: { age: 25 } });

useWatch(
  user,
  (newUser) => {
    console.log('User object changed deeply');
  },
  { deep: true }
);

// 深层更新会触发
setUser(prev => ({ ...prev, profile: { age: 26 } }));
```

### 5. 立即执行与一次性监听

`immediate` 让回调在挂载时立即执行一次，`once` 使其仅触发一次：

```jsx
// 挂载时立即获取初始数据
useWatch(
  userId,
  (id) => {
    fetchUserData(id);
  },
  { immediate: true }
);

// 只响应第一次变化
useWatch(
  config,
  () => {
    console.log('Config changed for the first time');
  },
  { once: true }
);
```

### 6. 手动停止监听

返回的 stop 函数可在任意时刻停止监听：

```jsx
const stopWatch = useWatch(value, callback);

// 条件停止监听（如用户登出后停止同步）
useEffect(() => {
  if (userLoggedOut) {
    stopWatch();
  }
}, [userLoggedOut]);
```

## 与 Vue 的差异说明

**核心差异**：本 Hook 在 React 运行时约束下实现了 Vue `watch` 的 API 形态，但底层机制存在根本不同。

| 特性 | Vue `watch` | `useWatch` |
|------|------------|-----------|
| **依赖追踪** | **自动追踪响应式引用** | **手动声明源**（函数/值/数组） |
| **执行时机** | **同步**（响应式变化立即触发） | **异步**（`useEffect` 调度） |
| **深度监听** | **深度递归**（Proxy 代理） | **深度比较**（序列化对比） |
| **清理函数** | 下次触发前调用 | **下次触发前 + 卸载时**均调用 |
| **停止监听** | `stop()` 立即停止 | `stop()` 在下一次调度后生效 |
| **旧值获取** | **准确捕获**（内部追踪） | **过时引用**（React 闭包限制）|

**关键限制**：

1. **旧值准确性**：由于 React 函数组件的闭包特性，`oldValue` 在异步执行时可能已过时。对于对象类型，获取的是上一次渲染的引用，而非 Vue 式的精确快照。
2. **深度监听性能**：`deep: true` 依赖深度序列化比较，对大型对象或深层嵌套结构可能产生性能开销。Vue 的 Proxy 代理在性能上更优。
3. **停止时机**：调用 `stop()` 后，当前已调度的 effect 仍会执行一次，在下一次渲染周期才真正停止。Vue 的 `stop()` 是同步立即生效。

## 注意事项

- **依赖源稳定性**：监听数组或对象时，确保源引用在不需要触发回调时保持稳定。频繁创建新引用（如内联对象）会导致意外触发。
- **清理函数必要性**：若回调中注册了全局事件、定时器等，必须返回清理函数以避免内存泄漏。清理函数将在下次触发或组件卸载时自动调用。
- **深度监听慎用**：对频繁变化的深层对象使用 `deep: true` 可能引发性能问题。考虑将监听粒度细化到具体叶节点，或使用 `useMemo` 手动计算可比值。
- **SSR 兼容性**：在服务端渲染时，`useLayoutEffect` 不会执行，因此 `immediate` 选项在 SSR 阶段无效。需确保客户端水合后的状态一致性。
- **与 `useEffect` 的选择**：若仅需简单的依赖响应，优先使用原生 `useEffect`。本 Hook 的价值在于提供 Vue 风格的 API 和高级选项（`deep`, `once`, `stop`）。
