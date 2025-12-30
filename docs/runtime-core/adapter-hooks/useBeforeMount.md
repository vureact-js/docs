# useBeforeMount

`useBeforeMount` 对应 Vue 3 中的 `onBeforeMount` 生命周期 Hook。

它在 React 组件中提供 **最接近** Vue `onBeforeMount` 执行时机的 Hook，于 DOM 挂载完成后、浏览器绘制前同步执行一次。

## 核心特性

- **最接近的语义映射**：利用 React `useLayoutEffect` 在 DOM 更新后、浏览器绘制前的执行时机，模拟 Vue 的"挂载前"阶段。需注意 React 中 DOM 已存在于内存，但尚未呈现到屏幕。
- **同步执行**：阻塞浏览器绘制流程，确保在视觉更新前完成 DOM 测量或状态计算，避免布局闪烁。
- **仅执行一次**：空依赖数组 (`[]`) 保证回调函数在组件整个生命周期中仅运行一次。
- **与 useMounted 的本质差异**：`useMounted` 使用 `useEffect`（绘制后异步执行），而 `useBeforeMount` 使用 `useLayoutEffect`（绘制前同步执行），两者间隔一次浏览器绘制周期。

## 使用方法

`useBeforeMount` 接收一个同步或异步回调函数，该函数将在组件初始渲染、DOM 挂载后但尚未绘制前执行。

### 1. 同步 DOM 测量

适用于在浏览器绘制前读取 DOM 几何属性的场景，避免用户看到中间状态：

```jsx
import { useBeforeMount } from 'react-vue3-hooks';

useBeforeMount(() => {
  const height = ref.current?.offsetHeight;
  // 基于 DOM 尺寸计算状态，确保首次渲染即正确
  setComponentHeight(height || 0);
});
```

### 2. 异步初始化

支持 `async` 函数，但需注意**同步阻塞**特性仍适用，异步操作发起后才会释放绘制：

```jsx
useBeforeMount(async () => {
  // 虽然回调是 async，但 Hook 本身同步执行
  // 适合在绘制前启动关键数据请求
  const data = await fetchCriticalData();
  setInitialData(data);
});
```

### 3. 与 Vue 的差异说明

**重要**：React 的 `useLayoutEffect` 与 Vue `onBeforeMount` 存在本质时序差异：

| 阶段 | Vue `onBeforeMount` | `useBeforeMount` |
|------|-------------------|------------------|
| DOM 状态 | 未挂载到文档 | 已挂载，未绘制 |
| 执行时机 | 挂载前，同步 | DOM 更新后、绘制前，同步 |
| 访问 DOM | 不可访问 | **可访问**（关键区别）|

因此，`useBeforeMount` 更接近 Vue 的 **"DOM 就绪但未显示"** 阶段，而非严格意义上的"挂载前"。在绝大多数场景下（如 SSR 水合后测量、初始化布局），其行为与 Vue 预期一致。

## 注意事项

- **避免重计算**：`useLayoutEffect` 会阻塞绘制，回调函数应轻量，避免长时间同步计算。
- **SSR 环境**：在服务端渲染时，`useLayoutEffect` 不会执行，需自行处理水合（hydration）差异。
- **与 `useMounted` 的选择**：若操作无需阻塞绘制（如日志、外部库初始化），优先使用 `useMounted`。
