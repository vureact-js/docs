# 更新日志

`vureact` 遵循 [语义化版本 2.0.0](http://semver.org/) 规范。

---

- 最新版本展示在顶部
- 历史版本按时间倒序排列
- 如需查看更完整的发布详情，请参考代码仓库中的 `packages/router/CHANGELOG.md` 文件

---

## v2.0.0 - 2026-03-29

### ✨ 新增/变更

- 移除了 `@vureact/router/type-compat` 子路径导出。所有 Vue Router 风格的类型现在均从 `@vureact/router` 导出。
- 类型重命名：`CreateRouterOptions` -> `RouterOptions`、`RouterInstance` -> `Router`、`RouteConfig` -> `RouteRecordRaw`。
- `useRouter()` 现在返回主类型 `Router`，与 `createRouter()` 的返回值在语义上保持一致。
- 新增 `RouteLocationOptions` 类型，并标准化 `RouteLocationRaw = string | RouteLocationOptions`。

### 迁移指南

从 v1.x 升级至 v2.0.0：

1. 将所有 `import type { ... } from '@vureact/router/type-compat'` 改为从 `@vureact/router` 导入。
2. 更新类型名称：`RouterInstance` -> `Router`、`CreateRouterOptions` -> `RouterOptions`、`RouteConfig` -> `RouteRecordRaw`。
3. 检查 `useRouter()` 的使用场景，确保不依赖旧的返回类型名称。

## v1.1.1 - 2026-03-20

### 🐞 问题修复

- 修复了路由配置中的 `component` 选项无法正确识别 React 高阶组件（如 `memo`、`forwardRef`、`lazy`）的问题。

## v1.1.0 - 2026-03-20

### ✨ 新增功能

- 路由配置中的 `component` 选项现在支持直接使用 React 组件函数（例如：`component: App`）。

### 🚀 优化改进

- 重构 `convertRoute` 函数，优化组件类型的处理逻辑。
- 更新 `RouteRecordRaw` 类型定义；`ComponentType` 现在支持 `FunctionComponent` 类型。
- 优化 `buildResolvedTo` 函数，提升路径解析的健壮性和空值处理能力。
- 优化代码组织结构，提升可维护性和可读性。

### 🐞 问题修复

- 修正类型导入路径，确保模块依赖关系正确。
- 优化路由匹配逻辑，确保路由解析更精准。
- 修复组件渲染逻辑，正确处理各类组件类型。
