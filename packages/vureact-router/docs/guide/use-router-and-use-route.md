# useRouter 与 useRoute

## 问题背景

声明式导航解决了大部分链接场景，但在真实业务中仍需要：

- 按条件触发跳转
- 读取当前 params/query/meta
- 在跳转前先解析目标地址

这时使用 `useRouter` 与 `useRoute`。

## 最小可运行示例

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

## 关键 API 解释

- `useRouter()` 返回：`push/replace/go/back/forward/resolve/current`。
- `useRoute()` 返回：`name/path/params/query/hash/meta/state/fullPath/matched/redirectedFrom`。
- `route.meta`
  - 来自匹配链路上所有记录的 `meta` 合并结果（后者可覆盖前者同名字段）。

## 常见坑

- `useRouter().resolve()` 返回结构是 `{ href, path, fullPath, query, hash }`。
- `routerInstance.resolve()`（`createRouter` 返回实例方法）返回 `RouteLocation`，包含 `matched/meta/state` 等更多字段。
- `route.redirectedFrom` 仅在重定向失败类型为 `redirected` 时可用。

## Vue Router 对照

- 组合式 API: <https://router.vuejs.org/zh/guide/advanced/composition-api.html>
- 编程式导航: <https://router.vuejs.org/zh/guide/essentials/navigation.html>
- 路由元信息: <https://router.vuejs.org/zh/guide/advanced/meta.html>

下一步建议阅读：[全局守卫与路由守卫](./global-and-route-guards.md)。
