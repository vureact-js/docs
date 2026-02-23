# Component Guards

## Background

Some route checks belong to component scope:

- confirm unsaved changes before leaving
- react to param updates on same route record
- run entry logic on component mount

`@vureact/router` provides:

- `useBeforeRouteLeave`
- `useBeforeRouteUpdate`
- `useBeforeRouteEnter` (experimental)

## Minimal Runnable Example

```tsx
import {
  RouterLink,
  useBeforeRouteEnter,
  useBeforeRouteLeave,
  useBeforeRouteUpdate,
  useRoute,
} from '@vureact/router';
import { useState } from 'react';

export function EditForm() {
  const [dirty, setDirty] = useState(false);

  useBeforeRouteLeave(() => {
    if (!dirty) return true;
    return window.confirm('Unsaved changes. Leave this page?');
  });

  return (
    <div>
      <button onClick={() => setDirty(true)}>Make Dirty</button>
      <RouterLink to="/user/1">Go to User</RouterLink>
    </div>
  );
}

export function UserDetail() {
  const route = useRoute();

  useBeforeRouteUpdate((to, from) => {
    console.log('id changed', from.params.id, '->', to.params.id);
    return true;
  });

  useBeforeRouteEnter((to, from) => {
    console.log('enter', from.path, '->', to.path);
    return true;
  });

  return <div>Current User: {String(route.params.id)}</div>;
}
```

## Key APIs

- `useBeforeRouteLeave(fn)`
  - Runs before leaving current component route.
- `useBeforeRouteUpdate(fn)`
  - Runs when location changes on the same route record.
- `useBeforeRouteEnter(fn)`
  - Experimental approximation for enter guard in React hook lifecycle.

## Common Pitfalls

- `useBeforeRouteEnter` does not provide Vue's instance callback semantics.
- Returning `false` aborts and navigates back to source; returning `string/object` redirects.
- Full execution order:
  - `beforeRouteLeave` → `beforeEach` → `beforeRouteUpdate` → `beforeEnter` → `beforeRouteEnter (experimental)` → `beforeResolve` → `afterEach`

## Vue Router Mapping

- In-Component Guards: <https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards>
- Composition API: <https://router.vuejs.org/guide/advanced/composition-api.html>
- Guard Order: <https://router.vuejs.org/guide/advanced/navigation-guards.html>

Next: [Dynamic Routing](./dynamic-routing.md).
