# 客户支持协同后台（混合开发）

这是一个贴近真实业务场景的多渠道客服协同后台的迁移实战教程，旨在让你从一个 **Vue + React 混合开发**项目出发，完整经历一次 VuReact 在复杂后台场景下的混写与转换能力迁移闭环。

在这个案例里，你会看到：

- 如何克隆并启动示例仓库
- 如何阅读项目目录，快速找到迁移关键文件
- 如何通过 `build` 和 `watch` 观察编译产物
- 如何启动 React 产物并完成业务验收

重点使用的混合技术栈：

- Vue 3
- Vue Router 4
- Ant Design 6（React）
- Zustand（React）

如果你想先在线体验，可以访问以下链接：

- 仓库：<https://github.com/vureact-js/example-customer-support-hub>
- 在线演示：<https://codesandbox.io/p/github/vureact-js/example-customer-support-hub/master?import=true>
- 在线预览：<https://skx7pn-5173.csb.app/>

## 先看目录

开始之前，先对项目结构建立一个整体印象。这个示例的源代码结构大致如下：

```text
customer-support-hub/
├─ package.json
├─ vureact.config.ts
├─ vite.config.ts
├─ index.html
└─ src/
   ├─ main.ts
   ├─ App.vue
   ├─ styles/
   │  └─ app.scss
   ├─ data/
   │  ├─ mock.ts
   │  └─ mock-api.ts
   ├─ store/
   │  └─ useAppStore.ts
   ├─ components/
   │  ├─ ConversationPanel.vue
   │  ├─ TicketFilterBar.vue
   │  ├─ TicketTimeline.vue
   │  └─ ...
   ├─ pages/
   │  ├─ Dashboard.vue
   │  ├─ TicketsList.vue
   │  ├─ TicketDetail.vue
   │  ├─ Customers.vue
   │  ├─ Agents.vue
   │  ├─ ConversationCenter.vue
   │  ├─ KnowledgeBase.vue
   │  ├─ SlaBoard.vue
   │  ├─ Settings.vue
   │  └─ auth/Login.vue
   └─ router/
      ├─ index.ts
      └─ routes.ts
```

这个结构的重点有三个：

- `src/main.ts` 是 Vue 源仓入口，编译后会生成对应的 React 入口
- `src/router/index.ts` 是路由适配的关键位置
- `src/store/useAppStore.ts` 负责跨页面状态，是验收业务链路时最值得关注的文件之一

## Step 1：克隆仓库与安装依赖

先把仓库拉到本地并安装依赖：

```bash
git clone https://github.com/vureact-js/example-customer-support-hub.git
cd customer-support-hub
npm install
```

安装完成后，请先确认 `package.json` 中存在以下脚本：

```json
{
  "scripts": {
    "vr:watch": "vureact watch",
    "vr:build": "vureact build"
  }
}
```

### 关键点

- 这个示例是“先维护 Vue 源码，再观察 React 产物”的模式
- 迁移的起点不是改产物，而是先让编译闭环跑通
- 如果安装阶段就失败，优先检查 Node.js、npm 和网络环境

### 通过标准

- `npm install` 无阻塞性错误
- 根目录可以识别 `vureact.config.ts`
- 你能继续执行 `npm run vr:build`

## Step 2：先跑通编译闭环

先执行一次完整编译：

```bash
npm run vr:build
```

如果你希望在修改源文件时持续看到产物更新，再开启监听模式：

```bash
npm run vr:watch
```

### 你会看到什么

- 控制台输出编译统计信息
- 项目根目录下生成 `.vureact/react-app`
- 生成的 React 产物会保持与 Vue 源结构相近的目录组织

### 关键点

- 这一步的目标不是“看见页面”，而是先确认编译器可以稳定产出 React 工程
- 如果产物目录没有生成，优先检查 `vureact.config.ts` 是否存在
- 这个示例会通过配置在编译成功后补齐必要的产物处理逻辑，因此产物入口和样式导入要以最终生成结果为准

### 失败时检查

- 如果 `build` 失败，先看源码是否存在语法问题
- 如果产物目录缺失，确认命令是在项目根目录执行的
- 如果 `watch` 不同步，确认监听进程仍在运行

### 通过标准

- `.vureact/react-app` 成功生成
- 你可以在重复执行 `npm run vr:build` 时稳定得到产物

## Step 3：理解关键文件

这一步不是为了逐个读完所有代码，而是为了知道“迁移时应该盯哪些文件”。

### 1. 路由入口

`src/router/index.ts` 是最优先要看的文件，因为它决定了应用如何从 Vue 路由进入 React 产物：

```ts
router: {
  configFile: 'src/router/index.ts',
}
```

### 2. 状态入口

`src/store/useAppStore.ts` 负责会话、筛选条件和活动流等跨页面状态。只要状态变化链路通了，页面联动通常也就通了。

### 3. 页面入口

`src/pages/` 下的页面决定了你最终验收的业务面：

- `Dashboard.vue`
- `TicketsList.vue`
- `TicketDetail.vue`
- `Customers.vue`
- `Agents.vue`
- `KnowledgeBase.vue`
- `SlaBoard.vue`
- `Settings.vue`
- `auth/Login.vue`

### 关键点

- 先看路由，再看状态，最后看页面
- 迁移教程最容易卡住的地方，通常不是单个组件，而是页面与状态的联动
- 如果你能说清楚“哪个页面读哪个状态、哪个动作会改哪个状态”，后面的验收就会轻松很多

## Step 4：启动 React 产物

进入生成的 React 工程并启动开发服务器：

```bash
cd .vureact/react-app
npm install
npm run dev
```

### 你会看到什么

- Vite dev server 正常启动
- 浏览器先进入登录页
- 登录后可以进入客服协同主界面
- 修改 Vue 源文件后，React 产物可以持续同步

### 关键点

- 这一步验证的是“产物能不能独立运行”
- 对混写项目来说，Vue 源码和 React 产物是两条同时存在、但职责不同的链路
- 你应当把 React 产物当成编译结果来验证，而不是把它当成主源码去直接维护

### 通过标准

- `npm run dev` 可成功启动
- 页面可以从登录流进入业务主界面
- 修改源文件后，产物页面能够同步更新

## Step 5：完成业务验收

当页面启动后，按下面的链路验收即可：

### 你应该能完成的事情

- 从登录页进入系统
- 打开 Dashboard、Tickets、Customers、KnowledgeBase、SlaBoard、Settings 等页面
- 在工单列表里进行筛选、切换、查看详情
- 在客户页查看风险信息，并观察状态联动
- 在 SLA 看板中观察风险状态变化
- 在知识库中进行内容浏览和检索

### 你应该重点观察什么

- `session` 是否能驱动登录与路由守卫
- `ticketFilters` 是否能驱动列表刷新
- `activities` 是否会随着工单动作新增记录
- `slaConfig` 变化后，SLA 看板是否同步更新

### 失败时检查

- 登录后仍回到登录页，优先检查路由守卫和会话状态
- 列表筛选不生效，优先检查筛选状态是否正确写入 store
- 活动流不更新，优先检查动作是否调用了对应的 mock-api

### 通过标准

- 登录、路由、筛选、详情、SLA、知识库等核心链路都能跑通
- 你可以明确说出每个页面依赖的状态和动作
- 你已经完成一次从 Vue 源码到 React 产物的完整闭环验证

## 小结

这个示例的核心不是“看图认识项目”，而是“顺着目录和步骤完成一次真实迁移闭环”。

如果你按上面的顺序完成了克隆、安装、编译、启动和验收，那么你已经建立起了 VuReact 的最小工作流：先让编译成立，再让产物运行，最后用业务链路验证迁移结果。

## 附录：排错索引

- 路由报错：[路由适配指南](/guide/router-adaptation)
- 编译告警处理建议：看 [编译约定](/guide/specification)
- 问题反馈：
  - [Compiler Issues](https://github.com/vureact-js/core/issues)
  - [Router Issues](https://github.com/vureact-js/vureact-router/issues)
