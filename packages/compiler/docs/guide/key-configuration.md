# 关键配置

这一页不展开全部 API，而是只讲大多数项目真正会改的少数几个配置。

如果你想查完整字段，请看 [配置 API](/api/config)。如果你只是想尽快配好项目，先看完这一页就够了。

## 先用这一份

大多数 Vue 3 + Vite 项目，推荐先从这份配置开始：

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: './src',
  exclude: ['src/main.ts'],
  output: {
    workspace: '.vureact',
    outDir: 'react-app',
    bootstrapVite: true,
  },
});
```

这份配置已经覆盖了最常见场景：

- 只编译 `src`
- 排除 Vue 入口，避免和现有 `createApp(...).mount(...)` 冲突
- 输出到 `.vureact/react-app`
- 自动准备 Vite React 运行环境

## 最值得关心的 6 个配置

### `input`

指定要编译的源目录或单文件。

```ts
input: './src'
```

推荐默认用 `src`，先不要把范围放太大。渐进迁移时，输入范围越稳定，排查成本越低。

### `exclude`

指定不参与编译的文件或目录。

```ts
exclude: ['src/main.ts']
```

这是最重要的配置之一。对于渐进迁移项目，通常都建议先排除 Vue 入口文件。

常见用途：

- 排除 `src/main.ts`
- 排除实验目录
- 排除暂时不想迁移的文件

### `output.workspace`

指定工作区目录，里面会同时放产物和缓存。

```ts
output: {
  workspace: '.vureact',
}
```

通常保持默认即可。除非团队对输出目录有明确约定，否则不建议频繁改动。

### `output.outDir`

指定 React 产物目录名。

```ts
output: {
  outDir: 'react-app',
}
```

最终输出位置通常会变成：

```txt
.vureact/react-app
```

如果你想把生成工程接入别的流程，可以再调整这个值。

### `output.bootstrapVite`

是否自动准备一个可运行的 Vite React 工程。

```ts
output: {
  bootstrapVite: true,
}
```

对大多数用户来说，推荐保持 `true`，这样你可以直接进入产物目录执行：

```bash
cd .vureact/react-app
npm install
npm run dev
```

只有在你已经有自己的 React 宿主工程，或者明确不想让 VuReact 初始化 Vite 环境时，才考虑设为 `false`。

`bootstrapVite` 除了写成布尔值，也可以写成对象：

```ts
bootstrapVite: {
  template: 'react-ts',
  vite: '@latest',
  react: '^19.0.0',
}
```

可选项含义如下：

- `template`：指定初始化的 Vite React 模板，可选 `react-ts` 或 `react`
- `vite`：指定初始化时使用的 Vite 版本，写法需要带 `@`
- `react`：指定初始化时使用的 React 版本

### `router.configFile`

如果项目用了 Vue Router，通常应该补上这一项：

```ts
router: {
  configFile: 'src/router/index.ts',
}
```

它的作用是让编译器识别路由入口，并在产物里完成对应的路由适配。

适合这些项目：

- 已经在用 Vue Router
- 有 `router-link`、`router-view`
- 有 `useRouter`、`useRoute`、导航守卫等

## 三种最常见配置写法

### 1. 标准 Vue 项目

适合大多数初次接入场景。

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: './src',
  exclude: ['src/main.ts'],
  output: {
    workspace: '.vureact',
    outDir: 'react-app',
    bootstrapVite: true,
  },
});
```

### 2. 带路由的业务项目

适合后台、管理台、内容站等存在完整页面路由的项目。

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  ...,
  router: {
    configFile: 'src/router/index.ts',
  },
});
```

### 3. 需要编译后做一点补充处理

适合你想在 build 成功后顺手改写产物文件、补充脚本或打印自定义日志的场景。

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  ...,
  onSuccess: async () => {
    console.log('build finished');
  },
});
```

## 不急着配的项

下面这些配置确实有用，但大多数项目可以晚一点再关心：

- `ignoreAssets`
- `preprocessStyles`
- `packageJson`
- `logging`
- `format`
- `plugins`

原因很简单：它们更偏“定制”和“优化”，不是把项目先跑起来的前置条件。

## 一个简单判断

如果你正在纠结配置要不要加很多项，可以用这条原则：

- 先只配会影响“能不能跑起来”的项
- 其他项等项目稳定后再补

通常真正的第一批关键项只有这些：

1. `input`
2. `exclude`
3. `output.workspace`
4. `output.outDir`
5. `output.bootstrapVite`
6. `router.configFile`

## 相关章节

- [配置 API](/api/config)：查看完整配置说明
