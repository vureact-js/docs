# 监听模式

监听模式适合本地开发阶段使用：会先执行一次构建，然后常驻监听文件变化，把 Vue 侧的改动持续同步到 React 产物目录。

如果你还没有完成基础安装与配置，建议先阅读[快速开始](/guide/quick-start)。

## 基本用法

```bash
npx vureact watch
```

也可以像普通前端项目一样写进 `package.json`：

```json
{
  "scripts": {
    "vr:watch": "vureact watch"
  }
}
```

```bash
npm run vr:watch
```

## 启动后会发生什么

`watch` 不是“只监听不编译”，而是会按下面的顺序工作：

1. 先执行一次 `build` 流程，生成最新 React 产物。
2. 复用缓存，跳过没有变化的文件。
3. 进入常驻监听状态，等待后续文件变更。

典型输出大致如下：

```bash
# 示例
10:53:49 [hrm] Watching for file changes...
```

这意味着：

- 首次启动并不一定是“纯全量”编译，如果缓存仍然可复用，会直接走[增量](/guide/incremental-compilation)。
- 监听启动前，React 产物目录已经被准备好，可以直接配合 `npm run dev` 使用。

## 监听范围

监听器只会关注 `input` 对应的目录或文件。

例如下面这份配置：

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: './src',
});
```

那么 watch 阶段实时监听的就是 `src` 目录。

这点很重要：

- `src` 下的 Vue、脚本、样式、资源变更会被立即处理。
- 根目录下但不在 `input` 里的文件，例如根目录下的 `public/`，不会被实时监听。
- 这类目录中的资源仍然会在启动时的那次 `build` 中被扫描和复制，但后续修改通常需要重新执行一次 `npx vureact build` 或调整你的目录组织方式。

## 改动后会触发什么

在监听状态下，保存文件会触发对应的增量处理。

### Vue / Script / Style 文件

`input` 下的 `.vue`、`.js`、`.ts`、`.less`、`.scss`、`.sass` 文件发生变化后，会重新生成对应产物。

```bash
# 示例
10:56:51 [vureact] Compiled src/App.vue (20 ms)
10:57:52 [vureact] Compiled src/components/Card.vue (24 ms)
10:58:53 [vureact] Compiled src/app.scss (32 ms)
10:59:54 [vureact] Compiled src/router/index.ts (12 ms)
```

这里的特点是“单文件增量”：

- 改哪个文件，就只处理哪个文件。
- 不会因为你修改了一个组件，就把整个项目重新编译一遍。

### 资源文件

对于不走编译流程的静态资源，watch 会同步复制到输出目录。

```bash
# 示例
11:01:56 [vureact] Copied Asset src/images/avatar.svg
11:02:17 [vureact] Copied Asset src/mock/banner.json
```

常见场景包括：

- 图片资源
- 字体文件
- JSON 数据文件
- 其他需要原样复制到产物目录的文件

## 删除文件时的行为

删除文件或目录时，watch 会**同步清理对应产物和缓存记录**，而不是把旧文件残留在输出目录里。

```bash
11:03:40 [vureact] Removed src/images/avatar.svg
11:04:22 [vureact] Removed src/components/Card.vue
```

这对渐进迁移尤其重要，因为输出目录会始终尽量和源目录保持一致。

## 推荐工作流

本地开发时，通常会开两个终端：

1. 在 Vue 源项目根目录运行 `npx vureact watch`
2. 在输出目录运行 React 开发服务器

```bash
cd .vureact/react-app
npm install
npm run dev
```

这样你的工作流会变成：

1. 在 `src/` 编写 Vue 代码
2. VuReact 实时生成对应 React 产物
3. Vite React 开发服务器自动热更新页面

## 可选：在变更后执行自定义逻辑

如果你希望在 watch 成功处理某个编译文件后，再执行通知、日志、额外同步等操作，可以使用 `onChange`：

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: './src',
  onChange: async (event, unit) => {
    console.log(`[${event}] ${unit.file}`);
  },
});
```

适合用于：

- 打印自定义日志
- 联动外部脚本
- 接入团队内部开发工具

## 什么时候优先用 watch

推荐使用 `watch` 的场景：

- 正在本地开发，需要持续看到 React 侧结果
- 正在做渐进迁移，希望边改边验证
- 希望把“编译”和“运行 React 应用”拆成两个长期进程

更适合只用 `build` 的场景：

- CI / 发布流程
- 一次性生成产物
- 不需要常驻监听

## 常见排查

### 改了文件但没有同步

优先检查下面几项：

1. 当前修改的文件是否位于 `input` 目录内。
2. 该文件是否被 `exclude` 排除了。
3. `vr:watch` 进程是否仍在运行。
4. 你观察的是否是 `.vureact/react-app` 里的最新产物。

### 为什么 watch 启动也会显示 `Cached`

因为 watch 启动前会先执行一次 build，而 build 默认启用缓存。所以如果上次编译结果仍可复用，就会看到：

```bash
# 示例
↷ Cached: 24 unchanged file(s)
```

这属于正常现象，说明启动更快了，而不是漏编译。
