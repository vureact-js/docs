# createRouter

## Signature

```ts
function createRouter(options: CreateRouterOptions): RouterInstance
```

## Parameters

```ts
interface CreateRouterOptions {
  routes: RouteConfig[];
  history?: RouterMode;
  initialEntries?: string[];
  initialIndex?: number;
  linkActiveClass?: string;
  linkExactActiveClass?: string;
  parseQuery?: (search: string) => Record<string, any>;
  stringifyQuery?: (query: Record<string, any>) => string;
}

type RouterMode = 'hash' | 'history' | 'memoryHistory';
```

- `routes`: Route configuration array.
- `history`: History mode, defaults to `createWebHashHistory()`.
- `initialEntries` / `initialIndex`: Effective in memory mode.
- `linkActiveClass` / `linkExactActiveClass`: Global RouterLink active class defaults.
- `parseQuery` / `stringifyQuery`: Custom query parser/stringifier.

## Returns

Returns a `RouterInstance` containing:

- `router` (underlying DataRouter)
- `RouterProvider`
- global guard registration methods
- dynamic routing and resolve APIs

See: [RouterInstance](./router-instance.md).

## Behavior Details

- `RouteConfig.component` supports sync `ReactNode` and async loader `() => import(...)`.
- Runtime config for active class and query parsing is registered during creation.
- Internal route containers are initialized for `resolve` / `hasRoute` / matching metadata.

## Error / Failure Semantics

- Duplicate route names and missing parent route targets throw `Error`.
- Guard failures are not thrown from `createRouter`; they appear in `afterEach(..., failure)`.

## Example

```tsx
import {
  createRouter,
  createWebHashHistory,
  RouterView,
  type RouteConfig,
} from '@vureact/router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: <RouterView />,
    children: [
      { path: 'home', name: 'home', component: <div>Home</div> },
      { path: 'about', name: 'about', component: <div>About</div> },
    ],
  },
];

export const router = createRouter({
  routes,
  history: createWebHashHistory(),
  linkActiveClass: 'is-active',
  linkExactActiveClass: 'is-exact-active',
});
```
