# Navigation Failure

## 签名

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

## 参数

- `createNavigationFailure`
  - `type`: 失败类型。
  - `options`: 额外信息（`to/from/message/error`）。
- `isNavigationFailure`
  - `value`: 任意未知值。

## 返回值

- `createNavigationFailure`: 标准化失败对象。
- `isNavigationFailure`: 类型守卫布尔值。

## 行为细节

- 导航守卫失败会在 `afterEach` 第三个参数给出 `NavigationFailure`。
- 常见类型：
  - `aborted`: 守卫返回 `false`
  - `redirected`: 守卫返回字符串或对象
  - `error`: 守卫抛错或返回 `Error`

## 错误/失败语义

- `isNavigationFailure({}) === false`。
- 失败对象用于诊断导航，不表示应用崩溃。

## 示例

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
