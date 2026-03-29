# RouterLink

## Background

Navigation links usually require:

- Declarative navigation
- query/hash/state support
- active state styling
- custom rendered targets (buttons/cards)

`RouterLink` handles all of these with Vue Router-style naming.

## Minimal Runnable Example

```tsx
import { RouterLink } from '@vureact/router';

export default function Nav() {
  return (
    <div>
      <RouterLink to="/home">String to</RouterLink>

      <RouterLink
        to={{ path: '/search', query: { q: 'book' }, hash: 'result' }}
        activeClassName="is-active"
        exactActiveClassName="is-exact-active"
      >
        Object to (path + query + hash)
      </RouterLink>

      <RouterLink to={{ name: 'user', params: { id: '7' } }}>Named target</RouterLink>

      <RouterLink
        to={{ path: '/profile', query: { tab: 'setting' } }}
        customRender={({ href, isActive, navigate }) => (
          <button onClick={navigate} data-href={href}>
            customRender / active={String(isActive)}
          </button>
        )}
      />
    </div>
  );
}
```

## Key APIs

- `to`
  - Accepts `RouteLocationRaw`.
- `activeClassName` / `exactActiveClassName`
  - Per-link active class override (`activeClass` and `exactActiveClass` are aliases).
- `inActiveClassName`
  - Class applied when link is inactive.
- `customRender` / `custom`
  - Render callback with `href/isActive/isExactActive/navigate`.

## Common Pitfalls

- In `customRender`, you must wire `navigate` manually.
- If `to` object has `path` and `params`, `params` is ignored.
- Global active class defaults come from `createRouter` runtime config.

## Vue Router Mapping

- Active Links: <https://router.vuejs.org/guide/essentials/active-links.html>
- Programmatic Navigation: <https://router.vuejs.org/guide/essentials/navigation.html>
- Passing Props to Route Components: <https://router.vuejs.org/guide/essentials/passing-props.html>

Next: [useRouter and useRoute](./use-router-and-use-route.md).
