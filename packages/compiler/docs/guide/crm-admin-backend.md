# 客户关系管理后台

这是一篇可跟练的迁移实战教程，目标是让你从一个典型的**纯 Vue 3 + Vue Router** 后台项目出发，完整完成一次 VuReact 迁移闭环。

在这个案例里，你会看到：

- 如何克隆并安装示例仓库
- 如何通过目录树找到迁移关键文件
- 如何执行编译并观察 React 产物
- 如何启动产物并完成业务验收

如果你想先在线体验，可以访问以下链接：

- 仓库：<https://github.com/vureact-js/example-crm-admin-backend>
- 在线演示：<https://codesandbox.io/p/github/vureact-js/example-crm-admin-backend/master>
- 在线预览：<https://r862dm-5173.csb.app>

## 先看目录

先对这个后台项目的结构建立一个整体认识。源代码目录大致如下：

```text
crm-admin-backend/
├─ package.json
├─ vureact.config.ts
├─ vite.config.ts
├─ index.html
├─ public/
│  ├─ config.js
│  ├─ logo.png
│  └─ File
├─ git-shells/
│  ├─ git-sync-hub.sh
│  └─ git-sync-hub.en.sh
└─ src/
   ├─ main.ts
   ├─ App.vue
   ├─ styles/
   │  └─ app.scss
   ├─ data/
   │  ├─ mock.ts
   │  └─ mock-api.ts
   ├─ components/
   │  ├─ CustomerTable.vue
   │  ├─ ThemeCard.vue
   │  ├─ FilterBar.vue
   │  └─ ...
   ├─ pages/
   │  ├─ Dashboard.vue
   │  ├─ Customers.vue
   │  ├─ LeadsPipeline.vue
   │  ├─ TasksBoard.vue
   │  ├─ NotificationsCenter.vue
   │  ├─ ApprovalsCenter.vue
   │  ├─ Settings.vue
   │  └─ auth/
   │     ├─ Login.vue
   │     └─ Register.vue
   └─ router/
      ├─ index.ts
      └─ routes.ts
```

这个结构里，最值得优先关注的是：

- `src/main.ts`，它决定源仓入口如何被编译成 React 入口
- `src/router/index.ts`，它决定路由如何接入 VuReact 的适配层
- `src/data/mock-api.ts`，它负责演示后台业务动作的状态变化
- `src/pages/`，它决定最终验收能覆盖哪些业务链路

## Step 1：克隆仓库与安装依赖

先把仓库拉到本地并安装依赖：

```bash
git clone https://github.com/vureact-js/example-crm-admin-backend.git
cd crm-admin-backend
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

- 这个案例是标准后台项目，适合先跑通“源仓 -> 产物 -> 启动 -> 验收”的完整流程
- 和混写项目不同，这里更适合观察路由、页面和状态联动是如何在 React 产物里成立的
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
- 生成的 React 产物会保留与 Vue 源结构一致的组织方式

### 关键点

- 这一步的目标不是先看页面，而是先确认编译器可以稳定生成工程产物
- 如果产物目录没有生成，优先检查 `vureact.config.ts`
- 这个项目包含后台常见的路由、表单、列表和看板结构，编译通过之后，后续验证会更清晰

### 失败时检查

- 如果 `build` 失败，先看源码是否存在语法问题
- 如果产物目录缺失，确认命令是在项目根目录执行的
- 如果 `watch` 不同步，确认监听进程仍在运行

### 通过标准

- `.vureact/react-app` 成功生成
- 你可以在重复执行 `npm run vr:build` 时稳定得到产物

## Step 3：理解关键文件

这一步的目标是让你知道迁移时应该盯住哪些入口。

### 1. 路由入口

`src/router/index.ts` 是最重要的文件之一。它负责路由守卫、页面切换和入口接入，也是教程里最常见的验收检查点。

如果项目启用了路由适配，通常会在配置里显式指向它：

```ts
router: {
  configFile: 'src/router/index.ts',
}
```

### 2. 业务状态入口

`src/data/mock-api.ts` 和 `src/data/mock.ts` 提供后台演示所需的状态与动作。只要你能看懂它们，就能更容易理解页面如何联动。

### 3. 页面入口

`src/pages/` 下是本案例的业务验收面：

- `Dashboard.vue`
- `Customers.vue`
- `LeadsPipeline.vue`
- `TasksBoard.vue`
- `NotificationsCenter.vue`
- `ApprovalsCenter.vue`
- `Settings.vue`
- `auth/Login.vue`
- `auth/Register.vue`

### 关键点

- 先看路由，再看状态，再看页面
- 后台类教程最容易卡住的地方，往往不是某个组件本身，而是页面跳转、守卫和状态更新链路
- 如果你能把“哪个页面读哪个状态、哪个动作会改哪个状态”说明白，验收就会非常直接

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
- 登录后可以进入 CRM 主界面
- 修改 Vue 源文件后，React 产物可以持续同步

### 关键点

- 这一步验证的是“产物能不能独立运行”
- 对标准后台项目来说，路由入口和页面联动通常是最先要确认的内容
- 你应当把 React 产物当成编译结果来验证，而不是把它当成主源码去直接维护

### 通过标准

- `npm run dev` 可成功启动
- 页面可以从登录流进入业务主界面
- 修改源文件后，产物页面能够同步更新

## Step 5：完成业务验收

当页面启动后，按下面的链路验收即可：

### 你应该能完成的事情

- 从登录页进入系统
- 打开 Dashboard、Customers、LeadsPipeline、TasksBoard、NotificationsCenter、ApprovalsCenter、Settings 等页面
- 在通知中心完成筛选、关键词检索和单条处理
- 在审批中心完成发起、通过、驳回和历史查看
- 在线索管道中观察审批联动
- 在任务看板中观察阻塞与协同通知
- 在仪表盘中观察摘要信息联动更新

### 你应该重点观察什么

- 路由守卫是否能正确放行登录页、拦截业务页
- `mock-api` 的动作是否能驱动页面数据变化
- 列表、看板和摘要是否能随着状态变化同步更新

### 失败时检查

- 登录后仍回到登录页，优先检查路由守卫和会话状态
- 数据不刷新，优先检查页面是否调用了对应的 mock-api
- 某个看板不联动，优先检查状态是否正确写入并被页面订阅

### 通过标准

- 登录、路由、通知、审批、线索、任务、仪表盘等核心链路都能跑通
- 你可以明确说出每个页面依赖的状态和动作
- 你已经完成一次从 Vue 源码到 React 产物的完整闭环验证

## 小结

这个案例的重点不是“看图认路”，而是“按步骤把一个后台项目从源码跑到验收”。

如果你按上面的顺序完成了克隆、安装、编译、启动和验收，那么你已经走完了 VuReact 的标准迁移工作流：先让编译成立，再让产物运行，最后用业务闭环验证迁移结果。

## 附录：排错索引

- 路由报错：[路由适配指南](/guide/router-adaptation)
- 编译告警处理建议：看 [编译约定](/guide/specification)
- 问题反馈：
  - [Compiler Issues](https://github.com/vureact-js/core/issues)
  - [Router Issues](https://github.com/vureact-js/vureact-router/issues)
