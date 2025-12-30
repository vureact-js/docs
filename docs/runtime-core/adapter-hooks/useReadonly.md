# useReadonly

`useReadonly` 对应 Vue 3 中的 `readonly()` API，用于创建不可变的响应式数据。

它通过**深度冻结**（deep freeze）对象实现不可变性，而非 Vue 的响应式代理机制。任何对返回对象的修改操作将在严格模式下抛出错误，或在非严格模式下静默失败。

## 核心特性

- **深度冻结**：使用 `klona` 深度克隆 + `freeze-mutate` 递归冻结，确保对象所有嵌套层级均不可修改。这是对 Vue `readonly()` 的**运行时层面模拟**，而非编译时或代理层保护。
- **工厂函数支持**：接受对象或工厂函数作为初始状态，工厂函数在首次渲染时执行一次，避免每次渲染重复创建对象。
- **浅层冻结模式**：通过 `shallow: true` 参数仅冻结对象第一层，深层属性仍可修改，性能优于全量深度冻结。
- **与 Vue 的本质差异**：Vue 的 `readonly()` 返回**响应式代理对象**，可与其他响应式 API 联动；而本 Hook 返回**纯冻结对象**，不具备响应式能力，仅提供运行时不可变保证。
- **缓存优化**：使用 `useMemo` 缓存冻结结果，确保在依赖不变时返回同一引用，避免不必要的组件重渲染。

## 使用方法

### 1. 保护配置对象

创建不可变的全局配置，防止运行时意外修改：

```jsx
import { useReadonly } from 'react-vue3-hooks';

const config = useReadonly({
  apiBase: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
});

// 修改将抛出错误（严格模式）
// config.timeout = 10000; // ❌ TypeError: Cannot assign to read only property
```

### 2. 使用工厂函数初始化

当初始状态需要复杂计算时，使用工厂函数避免重复计算：

```jsx
const initialData = useReadonly(() => {
  // 仅在组件挂载时执行一次，后续渲染复用冻结结果
  const data = generateComplexInitialData();
  return deepProcess(data);
});

// initialData 全程不可变
```

### 3. 浅层冻结优化

对大型对象只冻结顶层，提升性能且允许内部属性可变：

```jsx
const largeObject = useReadonly(
  {
    id: 1,
    data: { nested: { value: 100 } }, // nested 属性仍可修改
  },
  true // 开启浅层冻结
);

// 仅顶层不可修改
// largeObject.id = 2; // ❌ 错误

// 深层可修改（需自行保证不可变性）
largeObject.data.nested.value = 200; // ✅ 允许
```

### 4. 配合 Context 提供不可变数据

在 Context Provider 中提供全局不可变状态：

```jsx
function ConfigProvider({ children }) {
  const config = useReadonly({
    theme: 'light',
    locale: 'zh-CN',
  });

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
}
```

## 与 Vue 的差异说明

**核心差异：冻结 vs 代理**

| 特性 | Vue `readonly()` | `useReadonly` |
|------|-----------------|-------------|
| **实现机制** | **Proxy 代理**（响应式追踪） | **Object.freeze()**（运行时冻结） |
| **响应式能力** | ✅ **保留**（可触发渲染） | ❌ **完全丢失**（纯静态数据） |
| **嵌套保护** | **递归代理**（深层自动保护） | **深度克隆 + 冻结**（内存开销） |
| **修改行为** | 开发环境警告 + 严格模式错误 | **静默失败**（非严格）或 **TypeError**（严格） |
| **使用场景** | 创建只读响应式数据 | 创建不可变的静态配置 |

**关键限制**：

1. **非响应式**：返回对象是**完全静态**的，修改不会触发组件重渲染。若需要响应式的只读数据，应使用 `useState$` 配合 `readonly()` 选项，而非本 Hook。

2. **内存开销**：深度克隆会创建对象的完整深拷贝，对大型对象可能产生显著的内存占用和性能损耗。每次 `initialState` 引用变化时都会重新克隆 + 冻结。

3. **运行时保护**：Vue 的 `readonly()` 可在开发环境提供友好的警告和追踪；本 Hook 仅依赖 JavaScript 引擎的原生冻结行为，在严格模式下抛出 TypeError，非严格模式静默失败。

## 注意事项

- **避免频繁重建**：确保 `initialState` 或工厂函数引用稳定。若每次渲染传入新对象，将导致重复深度克隆，严重影响性能。建议将初始状态提取到组件外部或使用 `useMemo` 缓存。
- **浅层冻结权衡**：`shallow: true` 可提升性能，但仅冻结顶层属性，深层对象仍可修改。需自行确保深层不可变性，否则将破坏"只读"语义。
- **与 `useMemo` 的关系**：本 Hook 内部已使用 `useMemo`，无需额外包裹。依赖数组 `[initialState, shallow]` 确保仅在输入变化时重新冻结。
- **非严格模式风险**：在禁用严格模式的代码中，对冻结对象的修改将静默失败，可能导致难以调试的逻辑错误。建议在 TypeScript 中配合 `Readonly<T>` 类型使用，获得编译时保护。
- **SSR 安全性**：冻结操作在服务端和客户端均能正常执行，但需确保 `initialState` 在服务端和客户端保持一致，避免水合时因引用不同导致重复冻结。
- **替代方案**：若仅需防止误修改而不需要深度克隆（如已知对象已是不可变结构），直接使用 `Object.freeze()` 或 `as const` 断言可能更高效。
