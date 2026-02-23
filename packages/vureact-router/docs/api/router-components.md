# 路由组件

## 签名

```ts
function RouterView(props?: RouterViewProps): ReactNode

type RouterViewProps = {
  customRender?: (component: ReactNode, route: RouteLocation) => ReactNode;
};

function RouterLink(props: RouterLinkProps): ReactNode
```

## 参数

### RouterView

- `customRender(component, route)`：自定义渲染已匹配组件，可拿到守卫处理后的 `route`。

### RouterLink（核心）

- `to`: `string | RouterOptions`
- `replace?: boolean`
- `activeClassName?` / `exactActiveClassName?`
- `activeClass?` / `exactActiveClass?`（别名）
- `inActiveClassName?`
- `customRender?` / `custom?`

## 返回值

- `RouterView`：当前匹配路由的渲染结果。
- `RouterLink`：默认输出 `<Link>`，或输出 `customRender` 返回节点。

## 行为细节

- `RouterView` 内部集成守卫执行器；`customRender` 拿到的是最终 route。
- `RouterLink` 自动计算 `isActive/isExactActive` 并拼接 class。
- `RouterLink` 的 `customRender` 参数包含 `href/isActive/isExactActive/navigate`。

## 错误/失败语义

- 在 `RouterProvider` 外使用会触发上下文错误。
- `to` 命名路由无效时会在解析阶段抛错。

## 示例

```tsx
import { RouterLink, RouterView } from '@vureact/router';

export default function Layout() {
  return (
    <div>
      <RouterLink to="/home" inActiveClassName="link-idle">
        Home
      </RouterLink>

      <RouterLink
        to={{ path: '/profile', query: { tab: 'account' } }}
        customRender={({ navigate, isActive }) => (
          <button onClick={navigate}>Profile ({String(isActive)})</button>
        )}
      />

      <RouterView
        customRender={(component, route) => (
          <section data-route={route.fullPath}>{component}</section>
        )}
      />
    </div>
  );
}
```
