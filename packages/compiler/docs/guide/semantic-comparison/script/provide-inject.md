# provide / inject 语义对照

解析 Vue 中的 `provide` 和 `inject` API 经过 VuReact 编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中 provide 和 inject 的用法。

## `provide`/`inject` → React `Provider`/`useInject`

`provide` 和 `inject` 是 Vue 中用于实现跨层级组件通信的 API，允许祖先组件向后代组件提供数据，无论组件层次有多深。

- Vue 代码：

```vue
<!-- 祖先组件 -->
<script setup>
import { provide } from 'vue';

const theme = 'dark';
provide('theme', theme);
</script>

<!-- 后代组件 -->
<script setup>
import { inject } from 'vue';

const theme = inject('theme');
</script>
```

- VuReact 编译后 React 代码：

```tsx
// 祖先组件
import { Provider } from '@vureact/runtime-core';

const theme = 'dark';

<Provider name="theme" value={theme}>
  {/* 子组件树 */}
</Provider>;

// 后代组件
import { useInject } from '@vureact/runtime-core';

function ChildComponent() {
  const theme = useInject('theme');
  return <div>主题: {theme}</div>;
}
```

从示例可以看到：Vue 的 `provide` 和 `inject` API 被编译为 VuReact Runtime 提供的 [Provider](https://runtime.vureact.top/guide/components/provider.html) **组件**和 `useInject` **Hook**，可理解为「React 版的 Vue provide/inject」。

这种编译方式的关键特点在于：

1. **语义一致性**：完全模拟 Vue provide/inject 的行为，实现跨层级数据传递
2. **组件化提供**：通过 `<Provider>` 组件提供数据
3. **Hook 式注入**：通过 `useInject` Hook 获取数据
4. **类型安全**：支持 TypeScript 类型推断

## 默认值注入 → React `useInject` 默认值参数

当没有对应的 Provider 时，可以通过默认值避免获取到 `undefined`。

- Vue 代码：

```vue
<script setup>
import { inject } from 'vue';

const config = inject('app-config', {
  apiEndpoint: 'https://fallback.api.com',
  retries: 3,
});
</script>
```

- VuReact 编译后 React 代码：

```tsx
const config = useInject('app-config', {
  apiEndpoint: 'https://fallback.api.com',
  retries: 3,
});
```

**默认值规则**：

1. **优先级**：当 Provider 存在时，优先使用 Provider 的值
2. **回退机制**：没有 Provider 时使用默认值
3. **类型安全**：默认值类型必须与注入类型兼容
4. **错误避免**：避免因缺少 Provider 导致的运行时错误

## 工厂函数默认值 → React `useInject` 工厂函数参数

对于创建成本较高的默认值，可以使用工厂函数，并且可以缓存工厂结果。

- Vue 代码：

```vue
<script setup>
import { inject } from 'vue';

const timestamp = inject('current-time', () => new Date().toISOString(), true);
</script>
```

- VuReact 编译后 React 代码：

```tsx
const timestamp = useInject('current-time', () => new Date().toISOString(), true);
```

**工厂函数特性**：

1. **延迟创建**：只在需要时创建默认值
2. **结果缓存**：通过第三个参数 `true` 启用结果缓存
3. **性能优化**：避免不必要的重复创建
4. **按需计算**：只在没有 Provider 时计算默认值

## `Symbol` 键名 → React `Provider`/`useInject` Symbol 支持

为了避免键名冲突，推荐使用 Symbol 作为 provide/inject 的键名。

- Vue 代码：

```vue
<!-- 定义 Symbol -->
<script setup>
import { provide, inject } from 'vue';

const ThemeKey = Symbol('theme');

// 提供
provide(ThemeKey, 'dark');

// 注入
const theme = inject(ThemeKey);
</script>
```

- VuReact 编译后 React 代码：

```tsx
// 定义 Symbol
const ThemeKey = Symbol('theme');

// 提供
<Provider name={ThemeKey} value="dark">
  {/* 子组件树 */}
</Provider>;

// 注入
const theme = useInject(ThemeKey);
```

**Symbol 的优势**：

1. **唯一性**：每个 Symbol 都是唯一的，避免键名冲突
2. **模块安全**：适合跨模块的依赖注入
3. **类型安全**：配合 TypeScript 提供更好的类型检查
4. **封装性**：隐藏实现细节，提供更好的封装

## 响应式数据注入 → React `Provider` 响应式值

Vue 的 provide/inject 天然支持响应式数据，VuReact 也能正确处理。

- Vue 代码：

```vue
<script setup>
const count = ref(0);
provide('count', count);
</script>
```

- VuReact 编译后 React 代码：

```tsx
import { useVRef, Provider } from '@vureact/runtime-core';

const count = useVRef(0);

<Provider name="count" value={count}>
  {/* 子组件树 */}
</Provider>;
```

**响应式处理**：

1. **数据包装**：将响应式数据包装为可注入的值
2. **状态同步**：确保注入的数据保持响应性
3. **更新传播**：数据变化时自动通知所有注入组件
4. **性能优化**：智能管理依赖和更新

## 总结

VuReact 的 provide/inject 编译策略展示了**完整的依赖注入转换能力**：

1. **API 转换**：将 Vue 的 `provide()` 函数调用转换为 `<Provider>` 组件
2. **Hook 适配**：将 Vue 的 `inject()` 函数调用转换为 `useInject` Hook
3. **键名支持**：支持字符串、数字、Symbol 等多种键名类型
4. **默认值处理**：完整支持默认值和工厂函数默认值

核心功能：

1. **跨层级传递**：实现祖先组件向后代组件的数据传递
2. **类型安全**：支持 TypeScript 类型推断和检查
3. **默认值支持**：提供灵活的默认值机制
4. **响应式集成**：与 VuReact 的响应式系统无缝集成

与 React Context 的区别：

| 特性         | Vue provide/inject | React Context                 | VuReact Provider/useInject    |
| ------------ | ------------------ | ----------------------------- | ----------------------------- |
| **语法**     | 函数调用           | Context.Provider + useContext | Provider组件 + useInject Hook |
| **键名**     | 字符串/Symbol      | Context对象                   | 字符串/数字/Symbol            |
| **默认值**   | 支持               | 不支持（需在Context中设置）   | 支持                          |
| **工厂函数** | 支持               | 不支持                        | 支持                          |
| **类型安全** | 需要手动标注       | 需要手动标注                  | 自动类型推断                  |

VuReact 的编译策略确保了从 Vue 到 React 的平滑迁移，开发者无需手动重写跨层级通信逻辑。编译后的代码既保持了 Vue 的依赖注入语义和灵活性，又符合 React 的 Hook 设计模式，让迁移后的应用保持完整的跨组件通信能力。
