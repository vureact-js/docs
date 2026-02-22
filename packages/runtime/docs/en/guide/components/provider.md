# Provider

This is a combination of components and Hooks adapted to Vue's `provide / inject` semantics. Provide values to descendant components via `<Provider>`, and read them in any deep-level component via `useInject`.

## Basic Usage

Parent components provide context through `name` and `value`, and descendants inject values using the same key.

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

## Inject with Default Value

When there is no corresponding Provider, you can pass a default value to avoid reading `undefined`.

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

<p>API Endpoint: {config.apiEndpoint}</p>
<p>Retry Count: {config.retries}</p>
```

## Factory Function for Default Value

When the cost of creating a default value is high, you can write the default value as a factory function and set the third parameter to `true`. The factory result will be cached by key.

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

## Using Symbol as Key

`name` supports `string | number | symbol`. It is recommended to use `Symbol` in cross-module scenarios to avoid conflicts.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
 src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FProvider%2FBasicProvider.tsx&initialpath=/components/provider/symbol-key">
</iframe>

```tsx
// Assume in the parent component module:

export interface UserState {
  name: string;
  setName: (v: string) => void;
}

// Export the shared symbol key
export const UserStateKey = Symbol('UserState');

// Assume inside the parent component:
const [name, setName] = useState('React Developer');

// Combine state and updater into an object for passing
const userContextValue = { name, setName };

<Provider name={UserStateKey} value={{ name, setName }}>
  <ProfileEditor />
</Provider>;

// Assume in the child component module:
// Import UserStateKey and UserState
function ProfileEditor() {
  // Destructure state and modifier in a type-safe way when injecting
  const user = useInject<UserState>(UserStateKey);
  if (!user) return null;
  return (
    <input
      // Inject data
      value={user.name}
      // Use the setName method provided by the Provider
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
   * Unique identifier for the context.
   */
  name: K;
  /**
   * Value provided to descendant components.
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

## Notes

- When there is no Provider and no default value is provided, `useInject` returns `undefined` and outputs an error/warning log.
- When a Provider exists, its value is used first even if a default value is passed in.
- The factory default value only takes effect when `treatDefaultAsFactory === true` and the default value is a function.
