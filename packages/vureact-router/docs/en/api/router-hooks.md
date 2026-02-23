# Router Hooks

## Signature

```ts
function useRouter(): Router
function useRoute(): RouteLocation

function useBeforeRouteLeave(fn: ComponentGuard): void
function useBeforeRouteUpdate(fn: ComponentGuard): void
function useBeforeRouteEnter(fn: ComponentGuard): void
```

## Parameters

### useRouter

No parameters. Returns `push/replace/go/back/forward/resolve/current`.

### useRoute

No parameters. Returns route snapshot fields (`path/fullPath/params/query/hash/meta/matched/...`).

### Component guard hooks

- `fn(to, from)`: may return `true/false/string/object/Error/Promise`.

## Returns

- `useRouter`: navigation API object.
- `useRoute`: current route object.
- component guard hooks: no direct return.

## Behavior Details

- `useRouter().resolve()` returns compact `{ href, path, fullPath, query, hash }`.
- `useRoute().meta` is merged from all matched records.
- `useBeforeRouteEnter` is experimental and does not expose Vue instance callback semantics.

## Error / Failure Semantics

- Hooks must run under router context, otherwise they throw.
- Guard return values control abort/redirect behavior.

## Example

```tsx
import {
  useRouter,
  useRoute,
  useBeforeRouteLeave,
  useBeforeRouteUpdate,
  useBeforeRouteEnter,
} from '@vureact/router';

export default function Page() {
  const router = useRouter();
  const route = useRoute();

  useBeforeRouteLeave(() => true);
  useBeforeRouteUpdate((to, from) => {
    console.log(from.fullPath, '->', to.fullPath);
    return true;
  });
  useBeforeRouteEnter(() => true);

  return (
    <div>
      <button onClick={() => router.push('/home')}>Go Home</button>
      <pre>{JSON.stringify(route, null, 2)}</pre>
    </div>
  );
}
```
