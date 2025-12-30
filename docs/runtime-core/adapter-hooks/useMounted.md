# useMounted

`useMounted` 对应 Vue 3 中的 `onMounted` 生命周期 Hook。

它在 React 组件首次渲染到 DOM 并完成浏览器绘制后异步执行一次，是 React 中最自然的"挂载完成"语义实现。

## 核心特性

- **浏览器绘制后执行**：基于 `useEffect` 实现，在 DOM 挂载且浏览器完成首次绘制后异步调用，确保不会阻塞视觉呈现，适合非紧急初始化任务。
- **仅执行一次**：空依赖数组 (`[]`) 保证回调函数在组件整个生命周期中仅运行一次，精确匹配 Vue `onMounted` 的"挂载后单次执行"语义。
- **异步操作友好**：支持传入 `async` 函数，但需注意回调的同步部分会立即执行，而异步操作在后续事件循环中完成。
- **与 `useBeforeMount` 的本质差异**：`useBeforeMount` 使用 `useLayoutEffect`（绘制前同步执行），而本 Hook 使用 `useEffect`（绘制后异步执行），两者间隔一次浏览器绘制周期，形成"挂载前→挂载后"的完整生命周期。

## 使用方法

`useMounted` 接收一个同步或异步回调函数，该函数将在组件完成首次渲染并绘制到屏幕后执行。

### 1. 异步数据获取

在组件挂载后立即启动异步数据请求，获取初始数据：

```jsx
import { useMounted } from 'react-vue3-hooks';
import { useState } from 'react';

const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useMounted(async () => {
  // 在组件渲染后获取初始数据，避免阻塞首次渲染
  const response = await fetch('/api/initial-data');
  const result = await response.json();
  setData(result);
  setLoading(false);
});
```

### 2. 第三方库初始化

在 DOM 可用且视觉呈现完成后，初始化需要 DOM 引用的第三方库（如图表、地图）：

```jsx
import { useMounted } from 'react-vue3-hooks';
import { useRef } from 'react';
import Chart from 'some-charting-library';

const chartRef = useRef(null);

useMounted(() => {
  // DOM 已稳定，图表库可安全初始化
  const chart = new Chart(chartRef.current);
  chart.render();
});
```

### 3. 非阻塞日志记录

记录组件挂载事件，不影响渲染性能：

```jsx
useMounted(() => {
  // 异步执行，不阻塞首次渲染
  console.log('Component mounted');
  analytics.track('component_lifecycle', { event: 'mounted' });
});
```

## 与 Vue 的差异说明

**核心差异**：本 Hook 与 Vue `onMounted` 在时序上存在细微差异，但行为对绝大多数场景无影响。

| 阶段 | Vue `onMounted` | `useMounted` |
|------|----------------|-------------|
| DOM 状态 | 已挂载到文档 | 已挂载到文档 |
| 执行时机 | 挂载后，**同步** | 挂载后、**绘制后异步**（关键区别） |
| 访问 DOM | **可访问** | **可访问** |
| 阻塞性 | 阻塞后续初始化 | **不阻塞绘制**（性能优势） |

**实际影响**：Vue 的 `onMounted` 是同步的，若在回调中执行耗时操作，会延迟组件完成挂载的时间点；而 `useMounted` 的异步特性确保组件视觉呈现不受阻塞，更适合需要保持交互流畅的现代 Web 应用。

## 注意事项

- **避免 DOM 测量**：由于执行时机在浏览器绘制后，此时测量 DOM 可能已出现短暂闪烁。若需在绘制前完成测量或布局调整，应优先使用 `useBeforeMount`。
- **SSR 环境**：在服务端渲染时，`useEffect` 不会执行，需确保服务端与客户端的初始状态一致性，避免水合错误。
- **与 `useBeforeMount` 的选择**：若操作需要**在视觉呈现前完成**（如计算布局、恢复滚动位置），优先使用 `useBeforeMount`。本 Hook 适用于**不阻塞绘制**的后置初始化（如数据获取、日志记录）。
- **异步操作风险管理**：虽然支持 `async` 函数，但组件可能在异步操作完成前卸载，建议配合 `AbortController` 或取消令牌机制，避免内存泄漏。