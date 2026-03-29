# Router Hooks

## Signature

```ts
function useRouter(): Router
function useRoute(): RouteLocation
function useLink(options: UseLinkOptions): UseLinkReturn

function useBeforeRouteLeave(fn: ComponentGuard): void
function useBeforeRouteUpdate(fn: ComponentGuard): void
function useBeforeRouteEnter(fn: ComponentGuard): void
```

## Parameters

### useRouter

No parameters. Returns `push/replace/go/back/forward/resolve/current`.

### useRoute

No parameters. Returns route snapshot fields (`path/fullPath/params/query/hash/meta/matched/...`).

### useLink

Parameters:

- `options.to`: `RouteLocationRaw`
- `options.replace?`: `boolean`

Returns:

- `route`: resolved target location (`href/path/fullPath/query/hash`)
- `href`: link string ready for UI rendering
- `isActive`: prefix-active state
- `isExactActive`: exact-active state
- `navigate`: imperative navigation callback

### Component guard hooks

- `fn(to, from)`: may return `true/false/string/object/Error/Promise`.

## Returns

- `useRouter`: navigation API object.
- `useRoute`: current route object.
- `useLink`: link-resolution and navigation object.
- component guard hooks: no direct return.

## Behavior Details

- `useRouter().resolve()` returns compact `{ href, path, fullPath, query, hash }`.
- `useLink().route` follows the same location shape and is useful for custom link components.
- `useRoute().meta` is merged from all matched records.
- `useBeforeRouteEnter` is experimental and does not expose Vue instance callback semantics.

## Error / Failure Semantics

- Hooks must run under router context, otherwise they throw.
- Guard return values control abort/redirect behavior.

## Example

```tsx
import {
  useLink,
  useRouter,
  useRoute,
  useBeforeRouteLeave,
  useBeforeRouteUpdate,
  useBeforeRouteEnter,
} from '@vureact/router';

export default function Page() {
  const link = useLink({
    to: { name: 'home', query: { from: 'hooks' }, hash: 'top' },
  });

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
      <a
        href={link.href}
        onClick={(e) => {
          e.preventDefault();
          link.navigate();
        }}
      >
        Custom Link (active={String(link.isActive)})
      </a>
      <button onClick={() => router.push('/home')}>Go Home</button>
      <pre>{JSON.stringify(route, null, 2)}</pre>
    </div>
  );
}
```
