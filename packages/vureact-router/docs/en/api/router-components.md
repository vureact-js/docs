# Router Components

## Signature

```ts
function RouterView(props?: RouterViewProps): ReactNode

type RouterViewProps = {
  customRender?: (component: ReactNode, route: RouteLocation) => ReactNode;
};

function RouterLink(props: RouterLinkProps): ReactNode
```

## Parameters

### RouterView

- `customRender(component, route)`: Customize rendering using guard-processed route info.

### RouterLink (core)

- `to`: `string | RouterOptions`
- `replace?: boolean`
- `activeClassName?` / `exactActiveClassName?`
- `activeClass?` / `exactActiveClass?` (aliases)
- `inActiveClassName?`
- `customRender?` / `custom?`

## Returns

- `RouterView`: rendered node of current matched route.
- `RouterLink`: default `<Link>` output or custom-rendered node.

## Behavior Details

- `RouterView` integrates guard executor internally.
- `RouterLink` computes `isActive/isExactActive` and applies active/inactive classes.
- `customRender` receives `href/isActive/isExactActive/navigate`.

## Error / Failure Semantics

- Using these components outside `RouterProvider` triggers context errors.
- Invalid named targets in `to` throw during resolution.

## Example

```tsx
import { RouterLink, RouterView } from '@vureact/router';

export default function Layout() {
  return (
    <div>
      <RouterLink to="/home" inActiveClassName="link-idle">
        Home
      </RouterLink>

      <RouterLink
        to={{ path: '/profile', query: { tab: 'account' } }}
        customRender={({ navigate, isActive }) => (
          <button onClick={navigate}>Profile ({String(isActive)})</button>
        )}
      />

      <RouterView
        customRender={(component, route) => (
          <section data-route={route.fullPath}>{component}</section>
        )}
      />
    </div>
  );
}
```
