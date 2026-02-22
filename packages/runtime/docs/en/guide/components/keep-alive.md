# KeepAlive

This is a component adapted to Vue's `<KeepAlive>`, with consistent semantics, functionality, and usage. It is used to cache removed component instances when dynamically switching components to avoid state loss.

## Basic Usage

By default, a component will be unmounted and lose its internal state after being replaced. When wrapped with `<KeepAlive>`, the component will be cached when switched out and restore its previous state when switched back.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FKeepAlive%2FBasicKeepAlive.tsx&initialpath=/components/keep-alive/basic">
</iframe>

Core usage example:

```tsx
const [view, setView] = useState('A');

<KeepAlive>
  {/* It is recommended to provide a stable key for better cache hit */}
  <Component is={Counter} key={view} name={view} />
</KeepAlive>;
```

Please note:

> In a React environment, to allow `<KeepAlive>` to accurately identify and switch cached instances, be sure to provide a stable `key` or derivable component name for the child component.

## Inclusion and Exclusion

By default, `<KeepAlive>` caches all cacheable components inside it. You can precisely control the cache scope through `include` and `exclude`.

```tsx
{
  /* Comma-separated string */
}
<KeepAlive include="A,B">
  <Counter key={view} />
</KeepAlive>;

{
  /* Regular expression */
}
<KeepAlive include={/A|B/}>
  <Counter key={view} />
</KeepAlive>;

{
  /* Array */
}
<KeepAlive include={['A', /^User-/]}>
  <Counter key={view} />
</KeepAlive>;
```

Matching will attempt both the component name and cache key.

## Maximum Number of Cached Instances

The maximum number of cached instances can be limited via `max`. When the upper limit is exceeded, the least recently accessed instance will be evicted following the LRU (Least Recently Used) strategy.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FKeepAlive%2FMaxCacheKeepAlive.tsx&initialpath=/components/keep-alive/lifecycle">
</iframe>

```tsx
<KeepAlive max={2}>
  <CacheItem key={activeId} id={activeId} />
</KeepAlive>
```

## Lifecycle of Cached Instances

Components cached by `<KeepAlive>` are not unmounted but enter a deactivated state; they enter an activated state when displayed again. You can listen to these states via `useActived` and `useDeactivated`.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FKeepAlive%2FLifecycleKeepAlive.tsx&initialpath=/components/keep-alive/max-cache">
</iframe>

```tsx
function Child() {
  useActived(() => {
    console.log('activated');
  });

  useDeactivated(() => {
    console.log('deactivated');
  });

  return <div>Cached Content</div>;
}

<KeepAlive>
  <Child key="child" />
</KeepAlive>;
```

## API

### Props

```ts
interface KeepAliveProps extends PropsWithChildren {
  /**
   * Specify matching rules for components allowed to be cached.
   */
  include?: MatchPattern;
  /**
   * Specify matching rules for components prohibited from being cached.
   */
  exclude?: MatchPattern;
  /**
   * Maximum number of cached instances.
   */
  max?: number | string;
}

type MatchPattern = string | RegExp | (string | RegExp)[];
```

### Hooks

| Name             | Description                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| `useActived`     | Called when the component enters the activated state (first activation and recovery from cache) |
| `useDeactivated` | Called when the component enters the deactivated state (switched out of cache or unmounted)     |

## Notes

- `<KeepAlive>` only allows one direct child node; multiple child nodes will trigger an error log.
- The child node should be a component element; passing plain text or other types will not be cached.
- When the child node lacks a stable `key/name`, it will degrade to non-cached rendering and output a warning.
