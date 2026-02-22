# KeepAlive

这是适配 Vue `<KeepAlive>` 的组件，其语义、功能和使用方式保持一致。它用于在动态切换组件时缓存被移除的组件实例，避免状态丢失。

## 基本使用

默认情况下，组件在被替换后会卸载并丢失内部状态。使用 `<KeepAlive>` 包裹后，组件切出时会进入缓存，切回时恢复之前状态。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FKeepAlive%2FBasicKeepAlive.tsx&initialpath=/components/keep-alive/basic">
</iframe>

核心用法示例：

```tsx
const [view, setView] = useState('A');

<KeepAlive>
  {/* 推荐提供稳定 key，便于缓存命中 */}
  <Component is={Counter} key={view} name={view} />
</KeepAlive>;
```

请注意：

> 在 React 环境中，为了让 `<KeepAlive>` 准确识别并切换缓存实例，请务必为子组件提供稳定的 `key` 或可推导的组件名。

## 包含与排除

默认情况下，`<KeepAlive>` 会缓存内部所有可缓存组件。你可以通过 `include` 与 `exclude` 精确控制缓存范围。

```tsx
{
  /* 逗号分隔字符串 */
}
<KeepAlive include="A,B">
  <Counter key={view} />
</KeepAlive>;

{
  /* 正则 */
}
<KeepAlive include={/A|B/}>
  <Counter key={view} />
</KeepAlive>;

{
  /* 数组 */
}
<KeepAlive include={['A', /^User-/]}>
  <Counter key={view} />
</KeepAlive>;
```

匹配时会同时尝试组件名与缓存 key。

## 最大缓存实例数

通过 `max` 可以限制最大缓存数量。超过上限时会按 LRU 策略淘汰最久未访问的实例。

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

## 缓存实例的生命周期

组件被 `<KeepAlive>` 缓存时不会卸载，而是进入停用态；重新显示时进入激活态。可以通过 `useActived` 与 `useDeactivated` 监听。

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
   * 指定允许被缓存的组件匹配规则。
   */
  include?: MatchPattern;
  /**
   * 指定禁止被缓存的组件匹配规则。
   */
  exclude?: MatchPattern;
  /**
   * 最大缓存实例数。
   */
  max?: number | string;
}

type MatchPattern = string | RegExp | (string | RegExp)[];
```

### Hooks

| 名称             | 描述                                         |
| ---------------- | -------------------------------------------- |
| `useActived`     | 组件进入激活态时调用（首次激活与从缓存恢复） |
| `useDeactivated` | 组件进入停用态时调用（切出缓存或卸载）       |

## 注意事项

- `<KeepAlive>` 仅允许一个直接子节点，多子节点会触发错误日志。
- 子节点应为组件元素；传入普通文本等类型不会进行缓存。
- 当子节点缺少稳定 `key/name` 时，会降级为非缓存渲染并输出警告。
