---
layout: home

title: 适用于 React 18+、风格类似 Vue Router 4.x 的路由库，提供熟悉的路由组织方式与守卫能力。

hero:
  name: 'VuReact Router'
  tagline: '基于 React Router DOM 7.9+ 封装，面向 TypeScript 与渐进迁移/适配场景'
  actions:
    - theme: brand
      text: 阅读教程 →
      link: /guide/introduction
    - theme: alt
      text: 查看 API
      link: /api/create-router

features:
  - icon: 🧭
    title: Vue Router 风格 API
    details: createRouter、RouterLink、RouterView、useRouter、useRoute 等接口与 Vue Router 思路一致。

  - icon: 🛡️
    title: 完整守卫体系
    details: 支持 beforeEach、beforeResolve、afterEach、beforeEnter 以及组件级守卫，覆盖常见导航控制场景。

  - icon: 🧩
    title: 动态路由与元信息
    details: 支持 addRoute/hasRoute/resolve、嵌套路由、meta 合并，便于实现权限、菜单和运行时扩展。

  - icon: ⚙️
    title: TypeScript First
    details: RouteRecordRaw、Router、RouteLocation 等核心类型完整可推导，适合中大型工程。

  - icon: 🔁
    title: 多历史模式
    details: 内置 createWebHashHistory、createWebHistory、createMemoryHistory，适配浏览器与测试环境。

  - icon: 🚀
    title: 面向迁移与新项目
    details: 既适合从 Vue Router 迁移到 React，也适合在 React 项目中统一路由治理模型。
---
