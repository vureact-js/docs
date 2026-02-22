# Dynamic Components

这是适配 Vue `<component :is="...">` 的组件，在 React 中通过 `<Component is={...} />` 实现动态渲染。它支持按条件切换组件类型、原生标签和已创建的 React 元素。

## 基本使用

通过 `is` 指定当前要渲染的组件类型，可以很方便地实现 tab、视图切换等场景。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FComponent%2FBasicDynamic.tsx&initialpath=/components/dynamic-component/basic">
</iframe>

核心用法示例：

```tsx
const [currentTab, setCurrentTab] = useState('Post');

const tabs = {
  Post: PostView,
  Archive: ArchiveView,
};

<Component is={tabs[currentTab]} />;
```

请注意：

> 示例中切换 DOM 时，产生的过渡效果不是 `<Component>` 组件自带的。

## 渲染原生标签

`is` 也可以是字符串标签名，传入的 props 会透传到最终渲染的原生节点。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FComponent%2FNativeTagDynamic.tsx&initialpath=/components/dynamic-component/native-tag">
</iframe>

```tsx
const [tag, setTag] = useState('button');

<Component
  is={tag}
  className="custom-element"
  title="透传标题"
  href={tag === 'a' ? '#' : undefined}
>
  动态标签内容
</Component>;
```

## 与 KeepAlive 配合

动态组件与 `<KeepAlive>` 搭配时，建议为子节点提供稳定 `key`，用于正确缓存与切换。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FComponent%2FKeepAliveDynamic.tsx&initialpath=/components/dynamic-component/keep-alive">
</iframe>

```tsx
const [tab, setTab] = useState('Input');

const components = {
  Input: InputView,
  Counter: CounterView,
};

<KeepAlive>
  <Component is={components[tab]} key={tab} />
</KeepAlive>;
```

## API

### Props

```ts
interface ComponentProps extends Record<string, any> {
  /**
   * 动态渲染目标。
   * 支持原生标签名、组件类型、ReactElement。
   */
  is: string | ComponentType<any> | ReactElement;
}
```

## 注意事项

- `is` 为无效值时，组件会返回 `null` 并输出错误日志。
- 当 `is` 为 `ReactElement` 时，会在克隆时合并新 props，并优先使用外层传入的 `children`。
- 与缓存组件联用时，优先使用稳定 `key`，避免切换状态错乱。
