# 组件守卫

## 问题背景

某些导航逻辑必须贴近组件本身，例如：

- 离开编辑页前确认未保存内容
- 同组件参数变化时刷新数据
- 组件进入时触发一次性检查

`@vureact/router` 提供三个组件守卫 Hook：

- `useBeforeRouteLeave`
- `useBeforeRouteUpdate`
- `useBeforeRouteEnter`（实验）

## 最小可运行示例

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
    return window.confirm('内容未保存，确认离开？');
  });

  return (
    <div>
      <button onClick={() => setDirty(true)}>模拟编辑</button>
      <RouterLink to="/user/1">去用户页</RouterLink>
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

## 关键 API 解释

- `useBeforeRouteLeave(fn)`
  - 离开当前组件对应路由前触发。
- `useBeforeRouteUpdate(fn)`
  - 在同一路由记录下地址变化（常见为参数变化）时触发。
- `useBeforeRouteEnter(fn)`
  - 当前实现为实验能力：基于 React Hook 语义，在组件挂载后运行近似行为。

## 常见坑

- `useBeforeRouteEnter` 不具备 Vue Router 中“通过 next 回调拿组件实例”的语义。
- 守卫返回 `false` 会回退到来源路由；返回 `string/object` 会重定向。
- 守卫执行顺序（完整链路）：
  - `beforeRouteLeave` → `beforeEach` → `beforeRouteUpdate` → `beforeEnter` → `beforeRouteEnter(实验)` → `beforeResolve` → `afterEach`

## Vue Router 对照

- 导航守卫: <https://router.vuejs.org/zh/guide/advanced/navigation-guards.html>
- 组合式 API: <https://router.vuejs.org/zh/guide/advanced/composition-api.html>
- 导航守卫: <https://router.vuejs.org/zh/guide/advanced/navigation-guards.html>

下一步建议阅读：[动态路由](./dynamic-routing.md)。
