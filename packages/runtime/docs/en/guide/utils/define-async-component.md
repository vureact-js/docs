# defineAsyncComponent

This is an adaptation implementation of Vue's `defineAsyncComponent`, used to create asynchronously loaded components in React.

## Description

Async components allow you to split component code into independent bundles and load them only when needed. This is particularly useful for optimizing the initial loading time of large applications.

## Basic Usage

### Function Form

```tsx
const AsyncComponent = defineAsyncComponent(() => import('./MyComponent'));

function App() {
  return <AsyncComponent />;
}
```

### Configuration Object Form

```tsx
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./MyComponent'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200,
  timeout: 5000,
});
```

## Configuration Options

### loader

- **Type**: `() => Promise<Component | { default: Component }>`
- **Required**: Yes
- **Description**: Function to asynchronously load the component. Can return the component itself or an ES module object containing the `default` property.

### loadingComponent

- **Type**: `ComponentType<any>`
- **Default**: `undefined`
- **Description**: Loading component displayed during component loading.

### errorComponent

- **Type**: `ComponentType<{ error: Error }>`
- **Default**: `undefined`
- **Description**: Error component displayed when loading fails. Receives the `error` property.

### delay

- **Type**: `number`
- **Default**: `200`
- **Description**: Delay time in milliseconds before showing the loading component. If the component loads within the delay time, the loading component will not be displayed.

### timeout

- **Type**: `number`
- **Default**: `undefined`
- **Description**: Loading timeout in milliseconds. If loading is not completed within the specified time, an error will be triggered.

### suspensible

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether it can be suspended. When the component is within a runtime Suspense boundary, the React Suspense mechanism will be used.

### onError

- **Type**: `(error: Error, retry: () => void, fail: () => void, attempts: number) => any`
- **Default**: `undefined`
- **Description**: Error handling callback function. Can customize retry logic.

### hydrate

- **Type**: `(...args: any[]) => any`
- **Default**: `undefined`
- **Description**: ⚠️ **Currently not implemented in React runtime**, a warning will be displayed in development environment.

## Advanced Usage

### Custom Error Handling

```tsx
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./MyComponent'),
  onError: (error, retry, fail, attempts) => {
    console.error(`Loading failed, attempted ${attempts} times`, error);

    if (attempts < 3) {
      // Retry loading
      retry();
    } else {
      // Abandon loading
      fail();
    }
  },
  errorComponent: ({ error }) => (
    <div>
      <h3>Loading Failed</h3>
      <p>{error.message}</p>
      <button onClick={() => window.location.reload()}>Refresh Page</button>
    </div>
  ),
});
```

### Delayed Loading State Display

```tsx
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./HeavyComponent'),
  loadingComponent: () => <Spinner size="large" />,
  delay: 300, // If loading completes within 300ms, loading state will not be displayed
});
```

### Timeout Handling

```tsx
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./SlowComponent'),
  timeout: 10000, // 10-second timeout
  errorComponent: ({ error }) => (
    <Alert type="error" message={`Loading timeout: ${error.message}`} />
  ),
});
```

### Integration with Suspense

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

### Disabling Suspense

```tsx
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./MyComponent'),
  loadingComponent: LoadingIndicator,
  suspensible: false, // Disable Suspense, use local loading flow
});
```

## Feature Description

### Request Deduplication

When multiple identical async components are rendered simultaneously, loading requests are deduplicated to avoid repeated loading.

```tsx
// Only one loading request will be initiated
<>
  <AsyncComponent />
  <AsyncComponent />
  <AsyncComponent />
</>
```

### Component Caching

Loaded components are cached, and components will not reload when unmounted and remounted.

### Race Condition Handling

When new loading requests are initiated, old pending requests are properly handled to avoid state confusion.

### ES Module Support

Automatically handles ES module format (containing `default` property) and regular component format.

```tsx
// Both formats are supported
defineAsyncComponent(() => import('./Component')); // { default: Component }
defineAsyncComponent(() => Promise.resolve(Component)); // Component
```

## Notes

1. **hydrate**: Currently not implemented in React runtime, a warning will be displayed in development environment.

2. **Suspense Boundary**: When `suspensible=true` and the component is within a runtime Suspense boundary, the React Suspense mechanism will be used. Otherwise, local loading/error flow is used.

3. **Error Boundary**: It is recommended to wrap async components in error boundaries to handle uncaught loading errors.

4. **TypeScript Support**: Complete TypeScript type definitions with intelligent hints.

5. **Performance Optimization**: For frequently switched async components, consider using `KeepAlive` component for caching.

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
