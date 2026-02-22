# Teleport

这是适配 Vue `<Teleport>` 的组件，用于把一段 UI 渲染到当前组件树之外的目标容器中，常用于模态框、通知、浮层等场景。

## 基本使用

通过 `to` 指定目标节点（选择器或元素对象），子内容会被传送到目标位置。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FTeleport%2FBasicTeleport.tsx&initialpath=/components/teleport/basic">
</iframe>

```tsx
const [open, setOpen] = useState(false);

<Teleport to="body">{open ? <Modal onClose={() => setOpen(false)} /> : null}</Teleport>;
```

## 禁用传送

当 `disabled` 为 `true` 时，内容会在原位置渲染，不执行传送。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FTeleport%2FDisabledTeleport.tsx&initialpath=/components/teleport/disabled">
</iframe>

```tsx
<Teleport to="body" disabled={isMobile}>
  <StatusBadge />
</Teleport>
```

## 多个 Teleport 指向同一目标

多个 `<Teleport>` 可以挂到同一个容器，内容会按渲染顺序追加。

<iframe
  title="examples"
  loading="lazy"
  style="width: 100%; height: 500px; background: #ccc; border: none; border-radius: 8px; overflow: hidden;"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  src="https://codesandbox.io/embed/f5rlpk?view=preview&module=%2Fsrc%2Fpages%2Fadapter-components%2FTeleport%2FMultipleTeleport.tsx&initialpath=/components/teleport/multiple">
</iframe>

```tsx
<div id="modals" />

<Teleport to="#modals">
  <div>弹层 A</div>
</Teleport>

<Teleport to="#modals">
  <div>弹层 B</div>
</Teleport>
```

## API

### Props

```ts
interface TeleportProps extends PropsWithChildren {
  /**
   * 目标容器选择器或目标元素。
   */
  to: string | HTMLElement;
  /**
   * true 时禁用传送并原地渲染。
   */
  disabled?: boolean;
  /**
   * true 时延迟到挂载后再执行传送。
   */
  defer?: boolean;
}
```

## 注意事项

- `to` 指向的目标不存在时会回退为原地渲染，并输出错误日志。
- `disabled` 与 `to` 可动态切换，组件会自动重新计算渲染位置。
- `defer` 适用于目标节点晚于当前组件创建的场景。
