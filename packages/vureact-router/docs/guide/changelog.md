# 更新日志

## v1.1.0 - 2026-03-20

### Added

- 路由配置中的 `component` 选项现在支持直接使用 React 组件函数（如 `component: App`）

### Changed

- 重构 `convertRoute` 函数，改进对组件类型的处理逻辑
- 更新 `RouteConfig` 类型定义，`ComponentType` 现在支持 `FunctionComponent` 类型
- 改进 `buildResolvedTo` 函数，增强路径解析的健壮性和空值处理
- 改进代码组织结构，提高可维护性和可读性

### Fixed

- 修复类型导入路径，确保正确的模块依赖关系
- 改进路由匹配逻辑，确保更准确的路由解析
- 修复组件渲染逻辑，正确处理各种组件类型

---
