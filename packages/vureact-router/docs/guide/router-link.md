# RouterLink

## 问题背景

在导航场景中，你通常会同时遇到：

- 声明式跳转（链接）
- query/hash/state 传参
- 激活态样式
- 自定义渲染节点（按钮、卡片等）

`RouterLink` 提供了这些能力，并兼容 Vue Router 风格的属性命名。

## 最小可运行示例

```tsx
import { RouterLink } from '@vureact/router';

export default function Nav() {
  return (
    <div>
      <RouterLink to="/home">字符串 to</RouterLink>

      <RouterLink
        to={{ path: '/search', query: { q: 'book' }, hash: 'result' }}
        activeClassName="is-active"
        exactActiveClassName="is-exact-active"
      >
        对象 to（path + query + hash）
      </RouterLink>

      <RouterLink to={{ name: 'user', params: { id: '7' } }}>命名路由</RouterLink>

      <RouterLink
        to={{ path: '/profile', query: { tab: 'setting' } }}
        customRender={({ href, isActive, navigate }) => (
          <button onClick={navigate} data-href={href}>
            customRender / active={String(isActive)}
          </button>
        )}
      />
    </div>
  );
}
```

## 关键 API 解释

- `to`
  - `string` 或 `RouterOptions` 对象。
- `activeClassName` / `exactActiveClassName`
  - 局部覆盖激活态 class，也支持别名 `activeClass`/`exactActiveClass`。
- `inActiveClassName`
  - 非激活态 class。
- `customRender` / `custom`
  - 自定义渲染函数，参数包含 `href/isActive/isExactActive/navigate`。

## 常见坑

- 使用 `customRender` 时需要手动绑定 `navigate` 才会跳转。
- `to` 为对象且同时提供 `path + params` 时，`params` 会被忽略。
- 全局默认 active class 来自 `createRouter({ linkActiveClass, linkExactActiveClass })`。

## Vue Router 对照

- 匹配当前路由的链接: <https://router.vuejs.org/zh/guide/essentials/active-links.html>
- 编程式导航: <https://router.vuejs.org/zh/guide/essentials/navigation.html>
- 将 props 传递给路由组件: <https://router.vuejs.org/zh/guide/essentials/passing-props.html>

下一步建议阅读：[useRouter 与 useRoute](./use-router-and-use-route.md)。
