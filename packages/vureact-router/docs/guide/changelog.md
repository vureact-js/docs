# 更新日志

`vureact` 遵循 [Semantic Versioning 2.0.0](http://semver.org/lang/zh-CN/) 语义化版本规范。

---

- 最新版本在最上方
- 历史版本按时间倒序
- 更完整的发布细节可参考仓库中的 `packages/router/CHANGELOG.md`

---

## v1.2.0 - 2026-03-29

### ✨ 新增功能

- 新增 `@vureact/router/type-compat` 子路径导出，提供与 Vue Router 4.x 兼容的类型别名
- 新增 `RouteRecordRaw`、`Router`、`RouterOptions` 等 Vue Router 兼容类型别名

## v1.1.1 - 2026-03-20

### 🐞 修复问题

- 修复路由配置中的 `component` 选项无法正确识别 `memo`、`forwardRef`、`lazy` 等 React 高阶组件的问题

## v1.1.0 - 2026-03-20

### ✨ 新增功能

- 路由配置中的 `component` 选项现在支持直接使用 React 组件函数（如 `component: App`）

### 🚀 优化改进

- 重构 `convertRoute` 函数，改进对组件类型的处理逻辑
- 更新 `RouteConfig` 类型定义，`ComponentType` 现在支持 `FunctionComponent` 类型
- 改进 `buildResolvedTo` 函数，增强路径解析的健壮性和空值处理
- 改进代码组织结构，提高可维护性和可读性

### 🐞 修复问题

- 修复类型导入路径，确保正确的模块依赖关系
- 改进路由匹配逻辑，确保更准确的路由解析
- 修复组件渲染逻辑，正确处理各种组件类型
