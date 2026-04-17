# defineAsyncComponent

这是对 Vue `defineAsyncComponent` 的适配实现，用于在 React 中创建异步加载的组件。

## 说明

异步组件允许你将组件代码分割成独立的包，在需要时才加载。这对于优化大型应用的初始加载时间特别有用。

## 基本使用

### 函数形式

```tsx
const AsyncComponent = defineAsyncComponent(() => import('./MyComponent'));

function App() {
  return <AsyncComponent />;
}
```

### 配置对象形式

```tsx
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./MyComponent'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200,
  timeout: 5000,
});
```

## 配置选项

### loader

- **类型**: `() => Promise<Component | { default: Component }>`
- **必需**: 是
- **说明**: 异步加载组件的函数。可以返回组件本身或包含 `default` 属性的 ES 模块对象。

### loadingComponent

- **类型**: `ComponentType<any>`
- **默认**: `undefined`
- **说明**: 组件加载过程中显示的加载组件。

### errorComponent

- **类型**: `ComponentType<{ error: Error }>`
- **默认**: `undefined`
- **说明**: 加载失败时显示的错误组件。接收 `error` 属性。

### delay

- **类型**: `number`
- **默认**: `200`
- **说明**: 延迟显示加载组件的时间（毫秒）。如果组件在延迟时间内加载完成，则不会显示加载组件。

### timeout

- **类型**: `number`
- **默认**: `undefined`
- **说明**: 加载超时时间（毫秒）。超过指定时间未加载完成将触发错误。

### suspensible

- **类型**: `boolean`
- **默认**: `true`
- **说明**: 是否可挂起。当组件在运行时 Suspense 边界内时，将使用 React Suspense 机制。

### onError

- **类型**: `(error: Error, retry: () => void, fail: () => void, attempts: number) => any`
- **默认**: `undefined`
- **说明**: 错误处理回调函数。可以自定义重试逻辑。

### hydrate

- **类型**: `(...args: any[]) => any`
- **默认**: `undefined`
- **说明**: ⚠️ **当前在 React 运行时中未实现**，开发环境下会显示警告。

## 高级用法

### 自定义错误处理

```tsx
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./MyComponent'),
  onError: (error, retry, fail, attempts) => {
    console.error(`加载失败，已尝试 ${attempts} 次`, error);

    if (attempts < 3) {
      // 重试加载
      retry();
    } else {
      // 放弃加载
      fail();
    }
  },
  errorComponent: ({ error }) => (
    <div>
      <h3>加载失败</h3>
      <p>{error.message}</p>
      <button onClick={() => window.location.reload()}>刷新页面</button>
    </div>
  ),
});
```

### 延迟显示加载状态

```tsx
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./HeavyComponent'),
  loadingComponent: () => <Spinner size="large" />,
  delay: 300, // 300ms 内加载完成则不显示加载状态
});
```

### 超时处理

```tsx
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./SlowComponent'),
  timeout: 10000, // 10秒超时
  errorComponent: ({ error }) => <Alert type="error" message={`加载超时: ${error.message}`} />,
});
```

### 与 Suspense 集成

```tsx
import { Suspense } from '@vureact/runtime-core';

function App() {
  const AsyncComponent = defineAsyncComponent(() => import('./LazyComponent'));

  return (
    <Suspense fallback={<LoadingScreen />}>
      <AsyncComponent />
    </Suspense>
  );
}
```

### 禁用 Suspense

```tsx
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./MyComponent'),
  loadingComponent: LoadingIndicator,
  suspensible: false, // 禁用 Suspense，使用本地加载流程
});
```

## 特性说明

### 请求去重

当多个相同异步组件同时渲染时，加载请求会被去重，避免重复加载。

```tsx
// 只会发起一次加载请求
<>
  <AsyncComponent />
  <AsyncComponent />
  <AsyncComponent />
</>
```

### 组件缓存

已加载的组件会被缓存，组件卸载后重新挂载时不会重新加载。

### 竞态条件处理

当新的加载请求发起时，旧的 pending 请求会被正确处理，避免状态混乱。

### ES 模块支持

自动处理 ES 模块格式（包含 `default` 属性）和普通组件格式。

```tsx
// 两种格式都支持
defineAsyncComponent(() => import('./Component')); // { default: Component }
defineAsyncComponent(() => Promise.resolve(Component)); // Component
```

## 注意事项

1. **hydrate 选项**: 当前在 React 运行时中未实现，开发环境下会显示警告。

2. **Suspense 边界**: 当 `suspensible=true` 且组件在运行时 Suspense 边界内时，会使用 React Suspense 机制。否则使用本地加载/错误流程。

3. **错误边界**: 建议将异步组件包裹在错误边界中，以处理未捕获的加载错误。

4. **TypeScript 支持**: 完整的 TypeScript 类型定义，支持智能提示。

5. **性能优化**: 对于频繁切换的异步组件，考虑使用 `KeepAlive` 组件进行缓存。

## API

```ts
function defineAsyncComponent<T extends ComponentType<any>>(
  source: () => Promise<T | { default: T }>,
): T;

function defineAsyncComponent<T extends ComponentType<any>>(source: {
  loader: () => Promise<T | { default: T }>;
  loadingComponent?: ComponentType<any>;
  errorComponent?: ComponentType<{ error: Error }>;
  delay?: number;
  timeout?: number;
  suspensible?: boolean;
  hydrate?: (...args: any[]) => any;
  onError?: (error: Error, retry: () => void, fail: () => void, attempts: number) => any;
}): T;
```
