# Teleport

This is a component adapted to Vue `<Teleport>`, used to render a piece of UI into a target container outside the current component tree. It is commonly used in scenarios such as modals, notifications, and floating layers.

## Basic Usage

Specify the target node (selector or element object) via `to`, and the child content will be teleported to the target position.

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

## Disable Teleportation

When `disabled` is `true`, the content will be rendered in its original position without teleportation.

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

## Multiple Teleports Pointing to the Same Target

Multiple `<Teleport>` components can be attached to the same container, and their content will be appended in the order of rendering.

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
  <div>Modal A</div>
</Teleport>

<Teleport to="#modals">
  <div>Modal B</div>
</Teleport>
```

## API

### Props

```ts
interface TeleportProps extends PropsWithChildren {
  /**
   * Target container selector or target element.
   */
  to: string | HTMLElement;
  /**
   * When true, teleportation is disabled and content is rendered in place.
   */
  disabled?: boolean;
  /**
   * When true, teleportation is deferred until after mounting.
   */
  defer?: boolean;
}
```

## Notes

- If the target pointed to by `to` does not exist, it will fall back to in-place rendering and output an error log.
- `disabled` and `to` can be dynamically switched, and the component will automatically recalculate the rendering position.
- `defer` is applicable to scenarios where the target node is created later than the current component.
