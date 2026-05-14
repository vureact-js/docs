# Show HN: VuReact – An AST compiler to convert Vue 3 SFC to pure React (TS supported)

## text

我一直在思考如何用 Vue 3 写 React？如何把 Vue SFC 或整个 Vue 工程都转成纯净的 React？而不是使用臃肿的双框架运行时桥接方案。
为此我写了 VuReact，一个纯粹的 Vue 转 React 编译工具链 + 轻量 Runtime 适配方案（纯 React），既满足迁移需求也能继续用 Vue 语法编写 React。

VuReact 覆盖了 Vue 3 script setup 全特性，对 SFC、Script、Style 三个维度进行深度静态分析，完整编译为纯 React 18+ 组件与代码，无额外运行时框架损耗。
它还处理了大量复杂的模板指令、Props、插槽、Composition API、scoped 样式以及 TS 类型定义等等，同时内置工程化的 CLI，支持 watch 模式和增量编译。

VuReact 的核心编译流为：Vue Compiler （解析 Vue 组件）→ 中间层 AST（分析/优化/重构） → Babel（构建 Jsx/Tsx AST） → React 组件。

目前是 1.8 版本，我已分别在一个纯 Vue 和混合 Vue + React 编写的后台项目中使用 VuReact，总体核心功能稳定，绝大多数复杂的边界情况能够处理。虽然市面上有一些转换工具，但我致力于让生成的代码 “像人类手写的”，而不是代码残缺/幻觉乱写，方便后续长期维护。

欢迎大家尝试或查看转换前后的代码对比，我很想听听你们的反馈。

Repo: <https://github.com/vureact-js/core>
Documentation: <https://vureact.top/en>
Playground: <https://codesandbox.io/p/github/vureact-js/example-customer-support-hub/master?import=true>
Install: npm i @vureact/compiler-core
