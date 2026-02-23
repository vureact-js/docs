# useRouter and useRoute

## Background

Declarative links cover many scenarios, but applications still need:

- conditional navigation
- current params/query/meta inspection
- pre-navigation target resolution

Use `useRouter` and `useRoute` for this.

## Minimal Runnable Example

```tsx
import { useMemo } from 'react';
import { useRouter, useRoute } from '@vureact/router';

export default function ProfileActions() {
  const router = useRouter();
  const route = useRoute();

  const preview = useMemo(
    () =>
      router.resolve({
        name: 'user',
        params: { id: '99' },
        query: { tab: 'security' },
        hash: 'top',
      }),
    [router],
  );

  return (
    <div>
      <button onClick={() => router.push('/home')}>push</button>
      <button onClick={() => router.replace('/home?from=replace')}>replace</button>
      <button onClick={() => router.back()}>back</button>
      <button onClick={() => router.forward()}>forward</button>
      <button onClick={() => router.go(-1)}>go(-1)</button>

      <pre>{JSON.stringify(route, null, 2)}</pre>
      <p>preview: {preview.fullPath}</p>
      <p>current: {router.current}</p>
    </div>
  );
}
```

## Key APIs

- `useRouter()` returns `push/replace/go/back/forward/resolve/current`.
- `useRoute()` returns `name/path/params/query/hash/meta/state/fullPath/matched/redirectedFrom`.
- `route.meta` is merged from all matched route records.

## Common Pitfalls

- `useRouter().resolve()` returns a compact shape: `{ href, path, fullPath, query, hash }`.
- `routerInstance.resolve()` from `createRouter` returns full `RouteLocation` with `matched/meta/state`.
- `route.redirectedFrom` is only set when latest transition is a redirected failure.

## Vue Router Mapping

- Composition API: <https://router.vuejs.org/guide/advanced/composition-api.html>
- Programmatic Navigation: <https://router.vuejs.org/guide/essentials/navigation.html>
- Route Meta Fields: <https://router.vuejs.org/guide/advanced/meta.html>

Next: [Global and Route Guards](./global-and-route-guards.md).
