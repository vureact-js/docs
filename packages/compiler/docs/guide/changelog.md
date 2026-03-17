# 更新日志

## v1.3.0 - 2026-03-17

### Added

- 新增 CLI 更新检查功能，启动时自动检查新版本
- 新增路由配置说明文档，使用路由时自动生成配置指南
- 新增对 `update-notifier` 依赖的支持

### Fixed

- 修复 `v-for` 循环中 ref 变量访问，自动添加 `.value` 后缀
- 修复事件调用转换，统一改为可选调用（`onClick?.()`）
- 修复依赖分析中的可选链保护，避免 ref.value 访问导致的运行时错误
- 修复缓存管理，避免存储样式源码，减少缓存体积
- 修复 CLI 构建配置，确保正确的 shebang 注入

### Changed

- 优化示例项目结构，移除旧的示例项目
- 更新 README 文档，改进项目描述和徽章布局
- 更新 FAQ 文档，补充常见问题解答
- 优化编译管线执行流程，改进错误处理和进度显示

---

## v1.2.1 - 2026-03-15

### Fixed

- 修复 `provide` 转换逻辑，改进 Provider 组件的属性处理
- 修复事件调用转换，统一将事件调用变为可选的（`onClick?.()`）
- 修复 `v-model` 转换中的事件名生成逻辑
- 修复模板中 `template` 和 `slot` 出口节点不应注入 `scopeId` 的问题
- 修复插槽作用域参数类型定义，支持包含连字符等非法标识符的字段
- 修复 `ReactNode` 等类型导入，确保正确添加 `type` 修饰符
- 修复 Vue Router 历史模式 API 的适配映射
- 修复 `emit` 事件名格式化，支持 `update:xxx` -> `onUpdateXxx` 转换
- 修复 `provide` 处理顺序，确保在重命名之前收集并移除原始调用
- 修复样式作用域属性注入逻辑，避免在特定节点上错误注入

---

## v1.2.0 - 2026-03-06

### Added

- 新增对 `defineExpose` 宏 API 的转换处理
- 新增使用 `defineExpose` 的场景下，通过 `React.forwardRef` 包装组件
- 优化 API 适配处理
- 优化对组件 ref 的处理

---

## v1.1.1 - 2026-03-05

### 修复

- 修复当样式预处理启用时，样式文件里导入的 `.less`/`.scss` 文件后缀没有替换成 `.css`

## v1.1.0 - 2026-03-05

### 新增功能

- 新增单独对 style 文件的编译处理，如 `.less` 和 `.sass` 等
- 支持对文件内 import 的样式文件，如 `.scss` 等替换成 `.css`

### 修复

- 修复未对项目根目录的 `yarn-lock` 文件进行排除

## v1.0.4 - 2026-03-05

### 修复

- 修复当是默认插槽且没有参数，或者是非作用域插槽（没有参数），则使用 ReactNode 类型
- 修复当 ignoreAssets 选项没有配置时，预设的排除列表没有生效

## v1.0.3 - 2026-03-04

### 修复

- 修复只有当 Vue 组件有 props 时，编译后的 TSX 组件才返回组件函数参数
- 修复 Vue 模板编译到 JSX 时，文本中的特殊字符没有被正确处理

## v1.0.2 - 2026-03-04

### 修复

- 修复 VUE_PACKAGES 常量配置，添加 `@vureact/compiler-core` 到排除列表，避免将其带到 React 项目中

## v1.0.1 - 2026-03-04

### 新增

- chore: bump version to 1.0.1

### 修复

- 修复生产环境CLI入口文件引用错误

## v1.0.0 - 2026-03-03

### 🚩 里程碑版本：VuReact 1.0.0 —— “心灵控制”

> "There is only one true mind." — Yuri

这是 VuReact 的第一个先行版本，代号"心灵控制"。此版本标志着 Vue 到 React 编译从概念验证走向工程实践的重要里程碑。

### ✨ 核心突破

#### 🧠 心灵控制架构

- **双心智模型支持**：开发者可以在 Vue 与 React 两种编程范式间自如切换
- **语义分区能力**：编译器能清晰识别并处理不同心智模型的代码区域
- **可控混写模式**：支持在同一项目中混合使用 Vue 和 React 语义

#### ⚡ 智能编译引擎

- **完整的编译流水线**：实现解析 → 转换 → 生成的完整编译架构
- **深度语法转换**：Vue 3 Composition API 到 React Hooks 的智能映射
- **模板指令转换**：Vue 模板语法到 JSX 的精确转换

### 🚀 新增特性

#### 编译能力

- ✅ **Vue SFC 完整支持**：支持 `<template>`、`<script setup>`、`<style>` 三部分编译
- ✅ **TypeScript 无缝迁移**：完整保留类型定义，自动生成 React 组件类型
- ✅ **零运行时样式**：编译时处理 scoped/module 样式，生成静态 CSS
- ✅ **响应式系统适配**：`ref`、`computed`、`watch` 等 API 的 React 适配

#### 工程化支持

- ✅ **CLI 工具链**：提供 `build` 和 `watch` 双模式编译
- ✅ **增量编译**：基于文件哈希的智能缓存机制
- ✅ **Vite 集成**：自动初始化标准 React 项目结构
- ✅ **混合开发**：支持 Vue 和 React 组件在同一项目中并存

#### 模板转换

- ✅ **基础指令**：`v-bind`、`v-on`、`v-if`、`v-for`、`v-show`
- ✅ **条件渲染**：`v-if`/`v-else-if`/`v-else` 链式转换
- ✅ **列表渲染**：`v-for` 到 JSX `map` 的智能转换
- ✅ **事件处理**：`@click` 等事件到 React 事件系统的适配

#### 脚本转换

- ✅ **组合式 API**：`ref`、`computed`、`watch`、生命周期函数
- ✅ **组件定义**：`defineProps`、`defineEmits`、`defineExpose`
- ✅ **响应式工具**：`toRef`、`toRefs`、`unref` 等工具函数
- ✅ **依赖注入**：`provide`、`inject` 的 React Context 适配

### 🛠️ 技术架构

#### 核心模块

- **解析层**：基于 `@vue/compiler-sfc` 的 Vue SFC 解析
- **转换层**：自定义 AST 转换器，生成 React 中间表示
- **生成层**：基于 Babel 的代码生成，支持 TypeScript
- **样式处理**：PostCSS 管道，支持 Less/Sass 预处理器

#### 运行时适配

- **响应式运行时**：`@vureact/runtime-core` 提供 Vue 风格 API
- **路由适配**：`@vureact/router` 支持 Vue Router 到 React Router 转换
- **内置组件**：`Transition`、`KeepAlive` 等组件的 React 实现

### 📋 编译约定（首次正式定义）

为确保转换质量，1.0.0 版本明确了以下编译约定：

#### 文件与入口

- 建议只把可控目录纳入 `input`
- 强烈建议把 Vue 入口文件加入 `exclude`
- 先在小目录验证，再扩大范围

#### Script 约定

- 优先使用 `<script setup>` 语法
- 宏函数必须位于顶层
- Hook 调用必须遵守 React 规则

#### Template 约定

- 仅使用已支持指令
- 条件分支必须正确嵌套
- 避免复杂动态表达式

#### Style 约定

- 仅支持首个 `style` 块
- `scoped` 与 `module` 按规范使用
- 避免全局样式副作用

### 🎯 适用场景

#### ✅ 推荐使用

- **新项目开发**：直接按照 VuReact 约定编写 Vue 风格组件
- **渐进式迁移**：支持按目录、模块逐步迁移
- **混合开发**：允许 Vue 和 React 组件在项目中并存
- **技术栈探索**：验证 Vue 到 React 编译的技术可行性

#### ⚠️ 注意事项

- **实验性工具**：当前版本优先服务于可控工程场景
- **约定驱动**：需要严格遵守编译约定
- **现代语法**：专注于 Vue 3 Composition API

### 🔧 技术栈

- **编译引擎**：基于 Babel 和 Vue 官方编译器的混合架构
- **样式处理**：PostCSS + 自定义 Scoped CSS 处理器
- **构建工具**：Tsup 构建，支持 ESM 和 CJS
- **开发体验**：TypeScript 4.9+，ESLint，Prettier

### 🤝 生态系统

- **[运行时核心](https://runtime.vureact.top)**：提供 React 版的 Vue 核心 API
- **[路由适配](https://router.vureact.top)**：Vue Router → React Router 转换
- **[完整文档](https://vureact.top/)**：详细的使用指南和 API 文档

### 🚨 已知限制

#### 当前版本限制

- 仅支持 Vue 3 Composition API，不兼容 Options API
- 样式仅处理首个 `<style>` 块
- 复杂动态模板表达式可能降级处理
- 自定义指令支持有限
- 宏 API 支持有限
- 暂不支持处理 Vue 入口文件和路由配置文件

#### 未来规划

- 更多 Vue API 的转换/适配
- 状态管理库的转换支持
- UI 组件库的兼容层
- 性能优化和编译速度提升

### 🙏 致谢

感谢所有参与早期测试和反馈的开发者，你们的宝贵意见帮助 VuReact 不断完善。

特别感谢：

- Vue.js 和 React 社区提供的优秀生态
- 所有开源依赖库的维护者
- 早期采用者的信任和支持

### 🔮 展望未来

1.0.0 "心灵控制"版本是 VuReact 旅程的起点。未来我们将继续探索：

- **更深的转换能力**：支持更多 Vue 特性和复杂场景
- **更好的开发体验**：改进错误提示和调试工具
- **更广的生态集成**：与更多工具和框架集成
- **更强的性能优化**：提升编译速度和运行时性能
