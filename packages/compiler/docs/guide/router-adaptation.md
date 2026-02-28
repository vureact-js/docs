# 路由适配

VuReact 对路由组件与部分 API 有转换支持，但接入时仍需要人工完成小改造。

## 必做项

1. 确保项目已安装并配置 `@vureact/router`
2. 对路由入口进行手动校对（Provider、历史模式、路由表）
3. 逐页验证 `RouterLink`、`RouterView` 和守卫行为

## 为什么要手动改

路由是工程级上下文，不是单文件语法替换。编译器只能处理它能静态分析到的部分。

## 继续阅读

- VuReact Router 基础章节：<https://router-vureact.vercel.app/guide/introduction>
- VuReact Router 快速上手：<https://router-vureact.vercel.app/guide/quick-start>
