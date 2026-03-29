# RouteRecordRaw

## Signature

```ts
interface RouteRecordRaw extends ExclusiveGuards {
  path?: string;
  name?: string;
  state?: any;
  sensitive?: boolean;
  component?: ReactNode | ComponentLoader;
  children?: RouteRecordRaw[];
  linkActiveClassName?: string;
  linkInActiveClassName?: string;
  linkExactActiveClassName?: string;
  redirect?: RouteLocationRaw | ((to: RouteRecordRaw) => RouteLocationRaw);
  loader?: NonIndexRouteObject['loader'];
  meta?: { [x: string]: any; loadingComponent?: ReactNode };
}
```

## Parameters

- `path`: Route path (supports dynamic segments like `user/:id`).
- `name`: Named route key, must be globally unique.
- `component`: Sync node or async component loader.
- `children`: Nested route records.
- `redirect`: Redirect by string/object/function.
- `beforeEnter`: From `ExclusiveGuards`, supports single guard or guard array.
- `meta`: Arbitrary metadata merged into `useRoute().meta`.

## Returns

`RouteRecordRaw` is a declaration type, not a function return value.

## Behavior Details

- `beforeEnter` does not run when only params/query/hash changes on the same record.
- Async component loaders can use `meta.loadingComponent` as fallback UI.
- Relative child paths are resolved under parent path.

## Error / Failure Semantics

- Duplicate route names throw runtime errors.
- Invalid named redirect targets throw errors.
- Guard return values may abort or redirect navigation.

## Example

```tsx
import type { RouteRecordRaw } from '@vureact/router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    component: <Layout />,
    meta: { layout: 'main' },
    children: [
      { path: '', redirect: '/home' },
      { path: 'home', name: 'home', component: <HomePage /> },
      {
        path: 'user/:id',
        name: 'user',
        component: () => import('./UserPage'),
        meta: { requiresAuth: true, loadingComponent: <div>Loading...</div> },
        beforeEnter: (to, from, next) => {
          if (!isAuthed()) return next('/login');
          next();
        },
      },
    ],
  },
];
```
