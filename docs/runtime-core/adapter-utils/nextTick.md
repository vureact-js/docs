# nextTick

在 React 中，我们不需要像 Vue 那样等待一个由框架控制的 DOM 更新队列。我们只需要等待当前的同步代码执行完毕，让 React 的调度器有机会运行，`Promise.resolve()` 提供的微任务时机正好满足这一要求。

## 核心特性

- **等待 DOM 更新：** 主要功能是确保在执行回调时，DOM 已经反映了最新的状态变化。
- **支持 Promise：** 如果不提供回调函数，`nextTick` 会返回一个 `Promise`，允许使用 `async/await` 语法。
- **时机精确：** 内部会优雅地降级使用 `Promise.resolve()`、`requestAnimationFrame`、`MutationObserver`，最终退回到 `setTimeout(0)`，以保证最快的异步时机。

## 使用方法

### 1. 等待 DOM 更新

常用于状态更新后，需要立即访问或操作更新后的 DOM 元素。

```jsx
import { $useState, nextTick } from 'react-vue3-hooks';

const [items, setItems] = useState$([]);
const listRef = useRef(null);

const addItem = async () => {
  // 1. 状态更新，触发重新渲染
  setItems(draft => {
    draft.push('New Item');
  });
  // 2. 等待 DOM 更新完成
  await nextTick(); 

  // 3. 在 DOM 确保更新后操作元素
  listRef.current.scrollTop = listRef.current.scrollHeight;
};
```

### 2. 使用回调函数

也可以传入一个回调函数，等待 DOM 更新完成后执行。

```jsx
setItems(draft => {
  draft.push('New Item');
});

nextTick(() => {
  // 此时 DOM 已经更新
  listRef.current.scrollTop = listRef.current.scrollHeight;
});
```
