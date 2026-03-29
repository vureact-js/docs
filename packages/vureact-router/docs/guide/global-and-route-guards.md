# 全局守卫与路由守卫

## 问题背景

当路由成为权限、审计、埋点入口时，需要在导航生命周期中插入统一逻辑：

- 登录校验与重定向
- 页面进入前的数据门禁
- 导航成功/失败日志

`@vureact/router` 通过 `Router` 提供全局守卫，通过 `RouteRecordRaw.beforeEnter` 提供路由级守卫。

## 最小可运行示例

```tsx
import { createRouter, createWebHistory, RouterView, isNavigationFailure } from '@vureact/router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: <RouterView />,
      children: [
        { path: 'public', component: <div>Public</div> },
        {
          path: 'protected',
          component: <div>Protected</div>,
          meta: { requiresAuth: true },
          beforeEnter: (to, from, next) => {
            if (to.query.block === '1') {
              next(false);
              return;
            }
            next();
          },
        },
        { path: 'login', name: 'login', component: <div>Login</div> },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    next('/login');
    return;
  }
  next();
});

router.beforeResolve((to, from, next) => {
  console.log('beforeResolve', to.fullPath);
  next();
});

router.afterEach((to, from, failure) => {
  if (failure && isNavigationFailure(failure)) {
    console.log('navigation failure', failure.type);
  }
});

router.onError((error) => {
  console.error('[router error]', error);
});
```

## 关键 API 解释

- `beforeEach` / `beforeResolve`
  - 支持 `next` 回调，返回 `false/string/object/Error` 也可中断或重定向。
- `afterEach`
  - 第三个参数是可选 `failure`，可以用 `isNavigationFailure` 判断。
- `beforeEnter`
  - 支持单函数或函数数组，作用于具体路由记录。

## 常见坑

- 同一路由记录内仅 `params/query/hash` 变化时，`beforeEnter` 不会触发。
- 多级嵌套下，父级 `beforeEnter` 不会在同父路由子节点横跳时重复触发。
- 取消守卫注册要调用返回的卸载函数，避免组件重复挂载造成重复执行。

## Vue Router 对照

- 导航守卫: <https://router.vuejs.org/zh/guide/advanced/navigation-guards.html>
- 路由元信息: <https://router.vuejs.org/zh/guide/advanced/meta.html>
- 等待导航结果: <https://router.vuejs.org/zh/guide/advanced/navigation-failures.html>

下一步建议阅读：[组件守卫](./component-guards.md)。
