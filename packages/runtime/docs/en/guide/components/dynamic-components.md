# Dynamic Components

This is a component adapted to Vue's `<component :is="...">`, implemented in React via `<Component is={...} />` for dynamic rendering. It supports conditional switching of component types, native tags, and created React elements.

## Basic Usage

Specify the component type to be rendered dynamically via the `is` prop, which can be easily used in scenarios such as tabs and view switching.

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FComponent%2FBasicDynamic.tsx&initialpath=/components/dynamic-component/basic">
</iframe>

Core usage example:

```tsx
const [currentTab, setCurrentTab] = useState('Post');

const tabs = {
  Post: PostView,
  Archive: ArchiveView,
};

<Component is={tabs[currentTab]} />;
```

Please note:

> The transition effect when switching DOM in the example is not built into the `<Component>` component.

## Render Native Tags

`is` can also be a string tag name, and the passed props will be forwarded to the final rendered native node.

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
  title="Forwarded Title"
  href={tag === 'a' ? '#' : undefined}
>
  Dynamic Tag Content
</Component>;
```

## Usage with KeepAlive

When using dynamic components with `<KeepAlive>`, it is recommended to provide a stable `key` for child nodes to ensure correct caching and switching.

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
   * Target for dynamic rendering.
   * Supports native tag names, component types, and ReactElement.
   */
  is: string | ComponentType<any> | ReactElement;
}
```

## Notes

- When `is` is an invalid value, the component returns `null` and outputs an error log.
- When `is` is a `ReactElement`, new props will be merged during cloning, and the externally passed `children` will be used first.
- When used with cached components, prioritize using a stable `key` to avoid state confusion during switching.
