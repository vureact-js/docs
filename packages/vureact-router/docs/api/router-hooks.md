# 路由 Hooks

## 签名

```ts
function useRouter(): Router
function useRoute(): RouteLocation

function useBeforeRouteLeave(fn: ComponentGuard): void
function useBeforeRouteUpdate(fn: ComponentGuard): void
function useBeforeRouteEnter(fn: ComponentGuard): void
```

## 参数

### useRouter

无参数。返回对象：`push/replace/go/back/forward/resolve/current`。

### useRoute

无参数。返回当前路由信息：`path/fullPath/params/query/hash/meta/matched/...`。

### 组件守卫 Hook

- `fn(to, from)`：可返回 `true/false/string/object/Error/Promise`。

## 返回值

- `useRouter`: 路由操作对象。
- `useRoute`: 路由快照对象。
- 组件守卫 Hook: 无返回值（通过内部注册守卫生效）。

## 行为细节

- `useRouter().resolve()` 返回轻量对象 `{ href, path, fullPath, query, hash }`。
- `useRoute().meta` 为 matched 记录合并结果。
- `useBeforeRouteEnter` 为实验能力，不提供 Vue Router 的实例回调语义。

## 错误/失败语义

- Hook 必须在路由上下文中调用，否则会抛错。
- 守卫返回 `false` 导致中断，返回 `string/object` 导致重定向。

## 示例

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
