# 路由适配指南

路由适配使用了 `@vureact/router` 适配包提供的完整解决方案。

## 概述

编译器提供完整的 Vue Router 到 React Router 自动适配功能。**当检测到项目中的 SFC 或脚本文件使用了路由相关功能时**，将自动执行以下转换：

### 自动转换的部分

- `<router-link>` → `<RouterLink>`
- `<router-view>` → `<RouterView>`
- 路由API调用：`createRouter`, `useRouter()`, `useBeforeRouteUpdate()`等
- 路由全局守卫：`router.beforeEach()` 等导航守卫保持相同的行为
- 路由元字段：`to.meta` 等元数据访问保持不变
- 嵌套路由：完整的嵌套路由支持
- 自动注入`@vureact/router`依赖

更多支持的适配内容请参考 [VuReact Router 官方文档](https://router.vureact.top)。

### 依赖自动注入

编译器会自动检测并注入必要的依赖，如：

```javascript
// 编译前（Vue 项目）
import { useRouter, createRouter, createWebHistory } from 'vue-router';

// 编译后（React 项目）
import { useRouter, createRouter, createWebHistory } from '@vureact/router';
```

## 编译器自动注入

要实现 Vue Router 的自动适配，需按照以下步骤完成配置，核心是让编译器识别并处理路由配置文件，从而自动完成依赖替换、入口文件调整等适配工作：

### 一、配置编译器路由参数（vureact.config.js）

在项目根目录的 `vureact.config.js`（或.ts）文件中，指定 Vue Router 配置文件的路径，这是编译器实现自动注入的关键：

示例：

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  // ...其他配置
  router: {
    /**
     * 必填：替换为你的 Vue Router 配置文件实际路径
     * 要求该文件必须通过 export default 导出 createRouter 的调用结果
     */
    configFile: 'src/router/index.ts',
  },
});
```

> ⚠ 若 `output.bootstrapVite` 选项设置为 `false`，自动注入功能将不生效，请参考下方的[手动适配方案](#手动适配方案)。

### 二、调整 Vue Router 配置文件的导出方式

确保你的 Vue Router 配置文件（如 `src/router/index.ts`）通过 `export default` 导出 `createRouter` 的调用结果，而非仅导出路由实例：

示例：

```tsx
// 原 Vue Router 配置示例（调整前）
import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    // 其他路由规则...
  ],
});

// 调整后：必须用 export default 导出 createRouter 调用结果
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    // 其他路由规则...
  ],
});
export default router;
```

### 三、验证编译器自动注入结果

配置完成后执行编译，编译器会自动完成以下操作，无需手动修改：

- 自动依赖替换：
  - 产物的路由配置文件中的 `import ... from 'vue-router'` 会被自动替换为 `import ... from '@vureact/router'`；
- 自动入口文件调整：
  - 产物的入口文件（如 `main.tsx`）会自动导入路由实例，并将原 `<App />` 替换为 `<RouterInstance.RouterProvider />`；

示例如下：

```tsx
// 编译后自动生成的 React 入口文件（main.tsx）
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import RouterInstance from './router/index'; // 自动导入路由配置

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterInstance.RouterProvider /> {/* 自动替换 App 组件 */}
  </StrictMode>,
);
```

- 在对应的路由配置文件产物中，你将看到以下内容：

```ts
import { createRouter } from '@vureact/router';
export default createRouter({ ... });
```

> 🏄🏻‍♂️ 除了 `vue-router` 被替换为 `@vureact/router` 外，其余 API 与行为均保持不变，这正是路由适配包的核心优势。

### 关键注意事项

1. 若 `output.bootstrapVite` 设为 `false`，自动注入功能失效，需切换为[「手动适配方案」](#手动适配方案)；
2. 路由配置文件必须是标准的 `Vue Router` 格式，且仅通过 `createRouter` 定义路由规则；
3. 自动适配仅替换路由相关 API 和组件（如 `<router-link>→<RouterLink>`、`useRouter` 等），其余业务逻辑无需修改。

### 验证自动适配是否生效

参考章节内的 [验证与测试](#验证与测试)。

## 手动适配方案

当编译器的自动注入功能无法使用（如 `output.bootstrapVite: false`）时，需通过手动调整完成 Vue Router 到 React Router（VuReact Router）的适配。核心思路是：保留 Vue Router 配置逻辑，替换依赖为 `@vureact/router`，并调整 React 入口文件的渲染方式。

### 一、适配前提

1. 已完成 Vue 项目到 React 项目的编译（执行 `npx vureact build`）；
2. 编译后的 React 项目中已安装 `@vureact/router` 依赖；
3. 你的 Vue Router 配置文件是标准格式（基于 `createRouter` 定义）。

### 二、核心步骤

#### 步骤 1：调整 Vue Router 配置文件的导出逻辑

找到你的 Vue Router 配置文件（如 `src/router/index.ts`），确保导出 `createRouter` 创建的路由实例（支持任意导出方式，无需严格 `export default`）：

```ts
// 编译前的 Vue Router 配置文件（src/router/index.ts）
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Dashboard from '../views/Dashboard.vue';

// 1. 定义路由规则（保留原有逻辑，无需修改）
const routes = [
  {
    path: '/',
    component: Home,
    children: [
      { path: 'dashboard', component: Dashboard }, // 嵌套路由也保留
    ],
  },
];

// 2. 创建路由实例
const router = createRouter({
  history: createWebHistory(), // 保留 history 模式配置
  routes,
});

// 3. 导出路由实例（任意导出方式均可）
export { router };
// 或 export default router;
```

#### 步骤 2：修改 React 入口文件的渲染方式

找到编译后的 React 入口文件（如 `src/main.tsx`），移除原 `<App />` 渲染，改为渲染 VuReact Router 的 `RouterProvider`：

```tsx
// 编译后的 React 入口文件（src/main.tsx）
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// 导入手动导出的路由实例
import { router } from './router/index';

// 渲染 RouterProvider 替代原 App 组件
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 核心修改：使用 RouterProvider 渲染路由 */}
    <router.RouterProvider />
    {/* 注意：若 App 组件包含 <RouterView />，需将 App 挂载到路由配置的根路由，而非直接渲染 */}
    {/* <App />  // 注释或删除原 App 渲染 */}
  </StrictMode>,
);
```

**关键说明**：

- 示例仅供参考，请根据实际的路由结构、React 入口文件及 `<App />` 组件的具体实现进行调整。
- 若你的 `<App />` 组件包含路由出口组件，需将 `<App />` 作为根路由的 `component` 配置在路由规则中，而非直接渲染；
- `<RouterProvider />` 是 `@vureact/router` 提供的路由上下文组件，替代 React Router 原生的 `RouterProvider`，完全兼容 Vue Router 逻辑。

### 总结

手动适配 Vue Router 到 React Router 的核心要点：

1. 确保路由配置文件导出有效的路由实例；
2. 调整 React 入口文件，使用 `RouterProvider` 替代原 `<App />` 渲染；
3. 验证路由组件中的 API 调用和 `<RouterView />`/`<RouterLink>` 组件是否正常。

手动适配完全保留 Vue Router 的使用习惯（如路由守卫、meta 字段、嵌套路由），仅需调整依赖和渲染方式，无需重构路由逻辑。

## 验证与测试

编译完成后，请进入产物目录（例如 `.vureact/react-app`），并按以下步骤进行验证：

1. **安装依赖**：执行 `npm install` 命令。
2. **启动项目**：执行 `npm run dev` 命令。
3. **测试路由跳转**：在浏览器中访问应用，测试页面间的路由跳转功能是否正常。
4. **验证嵌套路由**：检查嵌套路由的视图渲染和层级关系是否正确。

## 下一步

- [VuReact Router 官方文档](https://router.vureact.top)
- [CRM 后台迁移实战](./crm-admin-backend/index)
- [编译问题反馈](https://github.com/vureact-js/core/issues)
- [路由问题反馈](https://github.com/vureact-js/vureact-router/issues)
