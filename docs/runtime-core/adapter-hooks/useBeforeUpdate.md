# useBeforeUpdate

`useBeforeUpdate` 对应 Vue 3 中的 `onBeforeUpdate` 生命周期 Hook。

它在指定依赖项发生变化导致组件重新渲染时，于 DOM 更新完成后、浏览器绘制前同步执行回调函数，是 React 中对 Vue "更新前"阶段的最接近模拟。

## 核心特性

- **依赖驱动的更新**：必须显式声明依赖数组（`deps`），仅在依赖变化时触发。这与 Vue 响应式系统自动追踪依赖的行为存在本质差异，是 React 显式数据流哲学的体现。
- **跳过首次挂载**：确保回调不会在组件初始渲染时执行，严格匹配 Vue `onBeforeUpdate` "只在更新时触发"的语义。
- **同步执行**：利用 `useLayoutEffect` 在浏览器绘制前同步执行，可在此阶段读取 DOM 的更新后状态（如新的布局尺寸），但需注意避免长时间阻塞。
- **与 `useUpdated` 的时序关系**：在 `useUpdated` 之前执行，两者间隔一次浏览器绘制周期，形成"更新前→更新后"的完整生命周期闭环。

## 使用方法

`useBeforeUpdate` 接收一个回调函数和一个依赖数组，回调将在依赖变化导致的组件更新前执行。

### 1. 响应式数据更新前处理

在特定状态变化导致 DOM 更新前，执行预处理逻辑（如计算衍生状态）：

```jsx
import { useBeforeUpdate } from 'react-vue3-hooks';

const [count, setCount] = useState(0);
const [derived, setDerived] = useState(0);

useBeforeUpdate(() => {
  // count 变化导致组件重渲染前，同步计算衍生值
  // 确保 DOM 更新时直接使用最新 derived 值
  setDerived(count * 2);
}, [count]);
```

### 2. DOM 更新前测量

在依赖变化导致布局改变前，读取当前 DOM 状态以进行对比或保存：

```jsx
const [list, setList] = useState([]);
const scrollRef = useRef();

useBeforeUpdate(() => {
  // 列表数据变化前，记录当前滚动位置
  // 更新后可基于此值恢复滚动
  scrollPosition.current = scrollRef.current?.scrollTop;
}, [list.length]);
```

### 3. 异步操作

支持 `async` 函数，但需理解其同步发起特性——异步任务在回调返回后执行：

```jsx
useBeforeUpdate(async () => {
  // 在 DOM 更新前启动异步验证
  // 虽然验证异步完成，但同步部分已记录日志/设置标记
  const isValid = await validateForm(formData);
  setValidation(isValid);
}, [formData]);
```

## 与 Vue 的差异说明

**关键差异**：并非 Vue `onBeforeUpdate` 的精确复刻，而是 React 约束下的最佳实践映射。

| 特性 | Vue `onBeforeUpdate` | `useBeforeUpdate` |
|------|---------------------|-------------------|
| **触发条件** | 任何响应式数据变化导致更新 | **仅依赖数组变化**（显式声明） |
| **依赖追踪** | 自动追踪所有响应式引用 | **必须手动指定** `deps` |
| **首次渲染** | 不触发 | **跳过首次** |
| **执行时机** | DOM 更新前，同步 | DOM 更新后、绘制前，同步 |
| **访问 DOM** | **可访问旧 DOM**（变更前） | 可访问新 DOM（已更新，未显示）|

**核心差异**：Vue 的 `onBeforeUpdate` 在 DOM **变更前**执行，此时可读取变更前的 DOM 状态；而 `useBeforeUpdate` 在 DOM **变更后**执行，实际访问的是更新后的 DOM。这是 React 渲染机制的根本限制。

## 注意事项

- **显式依赖要求**：必须准确声明所有依赖项，遗漏会导致回调不触发，多余会导致不必要的执行。建议使用 ESLint `react-hooks/exhaustive-deps` 规则辅助检查。
- **阻塞风险**：`useLayoutEffect` 会阻塞浏览器绘制，回调中避免复杂计算或同步 API 调用，否则将显著降低交互流畅度。
- **SSR 兼容性**：在服务端渲染时，`useLayoutEffect` 不会执行，需确保服务端与客户端的初始状态一致性，避免水合错误。
- **与 `useUpdated` 的选择**：若逻辑**不依赖 DOM 存在性**（如日志记录、数据同步），优先使用 `useUpdated`。仅在需要"在视觉更新前完成"的强同步场景，或需读取更新后 DOM 时，使用本 Hook。
