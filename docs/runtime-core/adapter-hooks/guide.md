# React Vue3 Hooks

## 简介

一款专为 **React 生态系统** 精心打造的 **Vue 3 生命周期与 Hook API 适配工具集**。

我们的核心目标是：在 React 的函数组件环境中，**最大程度地高度还原 Vue Composition API (组合式 API)** 的核心功能与使用范式，为进行跨框架设计、团队知识迁移以及组件重构提供 **Hook 级** 的解决方案。

通过这套工具集，你可以：

* **无缝迁移心智模型：** 轻松将 Vue 中直观的响应式思维和生命周期管理带入 React 项目。
* **统一开发体验：** 为同时维护 Vue 和 React 技术栈的团队，提供一致的逻辑组织和副作用管理规范。
* **简化逻辑重构：** 在组件逻辑复杂、需精细控制副作用的场景中，获得比纯 `useEffect` 等更强大、更聚焦的控制力。

## 核心特性

本库提供的 Hook 致力于在功能和语义上对标 Vue 3 的对应 API。

| Hook 名称 | 对应 Vue 3 API | 核心功能 |
| :--- | :--- | :--- |
| **`useWatch`** | `watch` | **数据监听和副作用。** 精准控制依赖项变化时执行的副作用，支持 `immediate`、`deep` 深度监听，并返回 `stop` 停止函数。 |
| **`useWatchEffect`** | `watchEffect` | **自动依赖追踪。** 自动追踪回调函数中使用的响应式依赖，并在依赖项变化时重新执行。 |
| **`useState$`** | `ref` 或 `reactive` | **增强的响应式状态。** 智能区分简单值 (`useState`) 和复杂对象 (`useImmer`，支持草稿修改)，提供 Vue 式的便捷状态管理。 |
| **`useReadonly`** | `readonly` | **创建只读状态。** 深度冻结对象，确保状态不可变，用于向子组件传递不可修改的数据，保证组件的纯净性。 |
| **`useMounted`** | `onMounted` | **组件挂载时执行。** 精准替代 `useEffect` 的挂载阶段，语义更清晰。 |
| **`useUnmounted`** | `onUnmounted` | **组件卸载时执行。** 精准替代 `useEffect` 的卸载阶段，语义更清晰。 |
| **`useUpdated`** | `onUpdated` | **组件更新时执行。** 忽略首次挂载，仅在后续组件更新时触发副作用。 |

## 使用范式与优势

### 1\. 细粒度的副作用控制 (`useWatch`)

告别复杂的 `useEffect` 依赖数组，`useWatch` 提供更强大的逻辑分离能力。

* **精准监听：** 仅在特定数据源变化时触发，避免不必要的副作用执行。
* **停止/启动：** 通过返回的 `stop` 函数，随时暂停或恢复监听，这是 `useEffect` 难以直接实现的。

```tsx
// 仅在 userId 变化时执行，忽略 data 变化
const stopWatch = useWatch(
  () => userId, 
  (newId, oldId) => {
    console.log(`User ID 发生变化：${oldId} -> ${newId}`);
    // 异步操作：根据新 ID 获取数据
  }, 
  { immediate: true }
);

// ... 可以在需要时调用 stopWatch()
```

### 2\. 简洁的状态修改 (`useState$`)

`useState$` 结合了 `useState` 和 `useImmer` 的优势，让复杂状态修改像操作普通 JavaScript 对象一样简单。

```tsx
const [user, setUser] = useState$({ 
  name: 'Alice', 
  posts: [{ title: 'Post 1' }] 
});

// 无需手动展开对象 (Spread)，直接在 Draft 上修改
setUser(draft => {
  draft.posts.push({ title: `New Post ${draft.posts.length + 1}` });
  draft.name = 'Bob'; // 多个修改一次完成
});
```

## 局限性说明

我们需客观说明，由于 **React** 与 **Vue** 在底层设计哲学与渲染机制上存在本质差异，尽管本库通过精细化适配尽可能贴近 Vue 3 的体验，但在部分边缘场景下仍可能存在细微的表现差异或局限性。
