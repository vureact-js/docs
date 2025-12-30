# 扩展 RouterLink

基于 `react-router-dom` 的 `<Link>` 组件进行了功能扩展。

当需要更灵活地控制链接的渲染，例如，将链接渲染为一个按钮，或者在链接激活时切换到一个非链接元素，可以使用 `customRender` 属性。

```jsx
<RouterLink
  to="/page"
  customRender={({ isActive, navigate }) => (
    <button 
      onClick={navigate} 
      className={isActive ? 'btn-primary' : 'btn-secondary'}>
      Go to Page
    </button>
  )}
/>
```

## Props 

`<RouterLink>` 组件支持所有 `<Link>` 的 props 属性，并扩展了以下自定义属性：

| **Prop 名称**          | **类型**                    | **描述**                                    | 必填项 |
| ---------------------- | --------------------------- | ------------------------------------------- | ------ |
| to             | `String` \| `RouterOptions` | 跳转的路由地址                              | 是     |
| replace              | `Boolean`                   | 使用 `history.replace`进行导航。            | 否     |
| activeClassName      | `String`                    | 链接 **匹配** 当前路由时应用的 CSS 类名     | 否     |
| inActiveClassName    | `String`                    | 链接 **不匹配** 当前路由时应用的 CSS 类名   | 否     |
| exactActiveClassName | `String`                    | 链接 **精确匹配** 当前路由时应用的 CSS 类名 | 否     |
| customRender        | `(args) => ReactNode`       | 自定义渲染组件的内容                        | 否     |

### CustomRenderArgs

| **属性名**      | **类型**     | **描述**                                                     |
| --------------- | ------------ | ------------------------------------------------------------ |
| href          | `String`     | 最终解析出的 **可访问 URL**，包括 `pathname`, `search`, 和 `hash`。 |
| isActive    | `Boolean`    | 链接是否处于 **激活** 状态（非精确匹配）。                   |
| isExactActive | `Boolean`    | 链接是否处于 **精确激活** 状态。                             |
| navigate    | `() => void` | 一个用于执行导航的函数，您可以在任何元素（如 `<button>`) 的点击事件中调用它。 |