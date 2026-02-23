# Navigation Failure

## Signature

```ts
type NavigationFailureType = 'aborted' | 'redirected' | 'cancelled' | 'error';

interface NavigationFailure {
  readonly _isNavigationFailure: true;
  type: NavigationFailureType;
  to?: unknown;
  from?: unknown;
  message?: string;
  error?: unknown;
}

function createNavigationFailure(
  type: NavigationFailureType,
  options?: Omit<NavigationFailure, '_isNavigationFailure' | 'type'>,
): NavigationFailure

function isNavigationFailure(value: unknown): value is NavigationFailure
```

## Parameters

- `createNavigationFailure`
  - `type`: failure category
  - `options`: optional `to/from/message/error` fields
- `isNavigationFailure`
  - `value`: unknown input to check

## Returns

- `createNavigationFailure`: normalized failure object
- `isNavigationFailure`: type guard boolean

## Behavior Details

- Guard failures are exposed in `afterEach` as the third argument.
- Typical types:
  - `aborted`: guard returned `false`
  - `redirected`: guard returned string/object
  - `error`: guard threw or returned `Error`

## Error / Failure Semantics

- `isNavigationFailure({})` is `false`.
- Failure objects are diagnostics for navigation outcomes.

## Example

```tsx
import { createRouter, isNavigationFailure } from '@vureact/router';

const router = createRouter({ routes, history: createWebHistory() });

router.afterEach((to, from, failure) => {
  if (!failure) return;

  if (isNavigationFailure(failure)) {
    console.log('failure type:', failure.type);
    console.log('from -> to:', from.fullPath, '->', to.fullPath);
  }
});
```
