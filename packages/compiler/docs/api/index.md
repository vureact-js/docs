# API 总览

本目录面向“直接调用 `@vureact/compiler-core` 编程接口”的开发者。

## 分层

1. 稳定高层 API：`defineConfig`、`VuReact`、CLI 配置对应能力。
2. 进阶 API：`BaseCompiler`、`FileCompiler`、插件分阶段钩子。
3. 低层流水线 API：`parse*`、`transform`、`generate*`。

## 稳定性约定

1. `Stable`：推荐直接使用。
2. `Advanced`：可用，但需要理解编译链路。
3. `Low-level`：适合框架/工具开发者。

## 目录

- [配置 API](./config)
- [编译器 API](./compiler)
- [流水线 API](./pipeline)
- [插件系统 API](./plugin-system)
- [类型与结果](./types)
- [导出清单](./exports)
