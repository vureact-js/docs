# useState$

`useState$` 对应 Vue 3 中的 `ref` 和 `reactive` API，用于创建响应式状态。

它根据初始值的类型**智能选择** `useState`（处理原始值）或 `useImmer`（处理复杂对象），在 React 中模拟 Vue 的响应式语义，支持通过 Draft 模式进行可变式更新。

## 核心特性

- **智能类型选择**：自动检测初始值类型，原始值（`string`, `number`, `boolean`, `null`, `undefined`）使用 `useState`，对象/数组使用 `useImmer`，无需手动判断。
- **Immer Draft 模式**：对复杂对象返回 `useImmer` 的 `[state, update]` 元组，支持在 `update` 回调中通过 `draft` 直接修改嵌套属性，模拟 Vue 的可变式更新体验。
- **工厂函数支持**：接受函数作为初始值，仅在组件挂载时执行一次，避免每次渲染重复创建复杂初始状态。
- **Shallow 模式**：通过 `shallow: true` 强制使用 `useState`，即使值是对象也视为整体替换，适用于不需要深度可变更新的场景，性能更优。
- **集合类型支持**：启用 Immer 的 `enableMapSet` 插件，原生支持 `Map` 和 `Set` 的 Draft 模式更新。

## 使用方法

### 1. 原始值状态（对应 Vue `ref`）

字符串、数字等基本类型自动使用 `useState`，返回标准元组：

```jsx
import { useState$ } from 'react-vue3-hooks';

const [count, setCount] = useState$(0); // 原始值 → useState
const [name, setName] = useState$('Alice');
const [visible, setVisible] = useState$(false);

// 使用方式与 useState 完全一致
setCount(prev => prev + 1);
setName('Bob');
```

### 2. 复杂对象状态（对应 Vue `reactive`）

对象或数组自动使用 `useImmer`，通过 Draft 可变更新：

```jsx
const [user, updateUser] = useState$({
  name: 'Alice',
  info: { age: 30, city: 'London' }
}); // 复杂对象 → useImmer

// 通过 draft 直接修改嵌套属性（无需手动展开）
updateUser(draft => {
  draft.info.city = 'Paris';        // ✅ 直接赋值
  draft.info.age = 31;              // ✅ 修改深层属性
  draft.tags.push('developer');     // ✅ 数组变异
});

// 注意：直接覆盖整个对象会丢失嵌套响应性
updateUser({ name: 'Bob' }); // ❌ 错误用法，会替换整个 state
```

### 3. 使用工厂函数初始化

当初始状态需要复杂计算时，传入函数避免重复执行：

```jsx
const [state, updateState] = useState$(() => {
  // 仅在挂载时执行一次
  const data = generateComplexInitialData();
  return deepProcess(data);
});
```

### 4. Shallow 模式强制使用 useState

对对象类型也使用 `useState`，整体替换而非 Draft 更新：

```jsx
const [config, setConfig] = useState$(
  { theme: 'light', locale: 'zh-CN' },
  true // shallow: true
);

// 必须整体替换
setConfig({ theme: 'dark', locale: 'zh-CN' }); // ✅ 正确
// config.theme = 'dark'; // ❌ 无效，对象已冻结
```

### 5. 集合类型（Map/Set）

持对 Map/Set 的 Draft 更新：

```jsx
const [userMap, updateMap] = useState$(new Map([['id', 1], ['name', 'Alice']]));

updateMap(draft => {
  draft.set('age', 30); // ✅ 直接操作 Map
  draft.delete('id');   // ✅ 删除键
});

const [tagSet, updateSet] = useState$(new Set(['admin', 'user']));

updateSet(draft => {
  draft.add('moderator'); // ✅ 添加项
  draft.delete('user');   // ✅ 删除项
});
```

## 与 Vue 的差异说明

**核心差异：无响应式代理与 .value 访问**

| 特性 | Vue `ref/reactive` | `useState$` |
|------|-------------------|-------------|
| **实现机制** | **Proxy 响应式代理** | **useState / useImmer** |
| **值访问** | `.value` 访问（ref） | **直接访问**（无 .value） |
| **更新方式** | **可变**（自动转不可变） | **可变**（Immer Draft）或 **不可变**（useState） |
| **嵌套响应性** | **深度响应**（自动追踪） | **Draft 模式**（显式在回调中修改） |
| **性能** | **Proxy 开销** | **Immer 结构共享** |

**关键区别**：

1. **无 `.value`**：Vue 的 `ref` 需要 `.value` 访问，本 Hook 直接返回状态值本身。

2. **更新语法差异**：

   ```typescript
   // Vue (reactive)
   state.info.city = 'Paris' // 直接赋值，自动追踪
   
   // useState$ (useImmer)
   updateUser(draft => {
     draft.info.city = 'Paris' // 必须在 draft 回调中
   })
   ```

3. **无响应式代理**：Vue 的响应式是细粒度的，仅触发实际访问过的组件重新渲染。`useImmer` 的更新会导致整个组件重新渲染（基于 React 的渲染机制）。

4. **原始值与对象的统一**：Vue 的 `ref` 统一处理所有类型，`useState$` 根据类型自动选择底层 Hook，但返回值结构不同（`useState` 返回 `[value, setter]`，`useImmer` 返回 `[value, updater]`）。

## 注意事项

- **类型推断**：返回值类型 `StateHook<S>` 会根据 `S` 是原始值还是对象自动推断。对复杂对象，应使用函数式更新（`update(draft => {...})`），而非直接赋值。
- **Immer 的 Draft 限制**：在 Draft 回调中，对 `draft` 的修改必须是同步的，不能是异步操作。回调结束后，Immer 立即生成不可变的新状态。
- **Shallow 模式的选择**：对不需要深度更新的对象（如整体替换的配置），使用 `shallow: true` 避免不必要的 Immer 开销。若对象包含嵌套结构且需要局部更新，必须使用默认的深层模式。
- **初始状态稳定性**：使用工厂函数 `() => initialState` 可确保初始状态只创建一次。若直接传入对象字面量 `useState$(obj)`，每次渲染都会创建新对象（虽然仅在首次生效），但可能引起 React 严格模式下的双重调用问题。
- **SSR 兼容性**：`useImmer` 在服务端渲染时工作正常，但需确保初始状态在服务端和客户端序列化后一致，避免水合错误。对大型初始对象，建议在客户端懒加载。
- **与 `useState` 的对比**：本 Hook 的价值在于统一原始值和对象的 API，减少心智负担。若明确知道状态是原始值，直接使用 `useState` 性能略优（跳过类型检测）。
