# Provider

这是适配 Vue `provide / inject` 语义的组件与 Hook 组合。通过 `<Provider>` 向后代提供值，通过 `useInject` 在任意深层组件中读取。

## 基本使用

上层组件通过 `name` 和 `value` 提供上下文，后代通过同名 key 注入。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FProvider%2FBasicProvider.tsx&initialpath=/components/provider/basic">
</iframe>

```tsx
const [theme, setTheme] = useState('light');

<Provider name="app-theme" value={theme}>
  <DeepChild />
</Provider>;

function DeepChild() {
  const theme = useInject<string>('app-theme');
  return <div>{theme}</div>;
}
```

## 默认值注入

当没有对应 Provider 时，可以传入默认值，避免读取到 `undefined`。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
 src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FProvider%2FBasicProvider.tsx&initialpath=/components/provider/default-inject">
</iframe>

```tsx
const config = useInject('app-config', {
  apiEndpoint: 'https://fallback.api.com',
  retries: 3,
});

<p>API 地址: {config.apiEndpoint}</p>
<p>重试次数: {config.retries}</p>
```

## 工厂函数默认值

当默认值创建成本高时，可以把默认值写成工厂函数，并把第三个参数设为 `true`。工厂结果会按 key 缓存。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
 src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FProvider%2FBasicProvider.tsx&initialpath=/components/provider/factory-inject">
</iframe>

```tsx
const time = useInject('time', () => new Date().toLocaleTimeString(), true);
```

## 使用 Symbol 作为 Key

`name` 支持 `string | number | symbol`，推荐在跨模块场景使用 `Symbol` 避免冲突。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
 src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FProvider%2FBasicProvider.tsx&initialpath=/components/provider/symbol-key">
</iframe>

```tsx
// 假设在父组件模块：

export interface UserState {
  name: string;
  setName: (v: string) => void;
}

// 导出共享的 symbol key
export const UserStateKey = Symbol('UserState');

// 假设在父组件内：
const [name, setName] = useState('React 开发者');

// 将状态和 updater 组合成一个对象传递
const userContextValue = { name, setName };

<Provider name={UserStateKey} value={{ name, setName }}>
  <ProfileEditor />
</Provider>;

// 假设在子组件模块：
// import 进 UserStateKey 和 UserState
function ProfileEditor() {
  // 注入时，类型安全地解构出状态和修改器
  const user = useInject<UserState>(UserStateKey);
  if (!user) return null;
  return (
    <input
      // 注入数据
      value={user.name}
      // 使用 Provider 提供的 setName 方法
      onChange={(e) => user.setName(e.target.value)}
    />
  );
}
```

## API

### Provider Props

```ts
type ContextKey = string | number | symbol;

interface ProviderProps<T, K = ContextKey> extends PropsWithChildren {
  /**
   * 上下文唯一标识。
   */
  name: K;
  /**
   * 提供给后代组件的值。
   */
  value: T;
  children?: ReactNode;
}
```

### useInject Hook

```ts
function useInject<T>(name: ContextKey): T | undefined;

function useInject<T>(name: ContextKey, defaultValue: T, treatDefaultAsFactory?: false): T;

function useInject<T>(name: ContextKey, defaultValue: () => T, treatDefaultAsFactory: true): T;
```

## 注意事项

- 没有 Provider 且未提供默认值时，`useInject` 返回 `undefined`，并输出错误/警告日志。
- 当 Provider 存在时，即使传入了默认值，也优先使用 Provider 的值。
- 工厂默认值只在 `treatDefaultAsFactory === true` 且默认值是函数时生效。
