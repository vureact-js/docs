# 配置 API

## `defineConfig`

稳定性：`Stable`

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: 'src',
  exclude: ['src/main.ts'],
});
```

`defineConfig(options)` 本质上返回原对象，用于类型提示与配置约定统一。

## `CompilerOptions`

核心字段：

1. `root?: string` 项目根目录。
2. `input?: string` 输入文件或目录。
3. `exclude?: string[]` 排除规则（glob）。
4. `cache?: boolean` 是否启用缓存。
5. `recursive?: boolean` 是否递归扫描。
6. `watch?: boolean` 是否 watch（CLI `watch` 命令会设置为 `true`）。
7. `preprocessStyles?: boolean` 是否预处理 less/sass。
8. `output?: { workspace, outDir, bootstrapVite, ignoreAssets }` 输出行为。
9. `format?: { enabled, formatter, prettierOptions }` 产物格式化。
10. `plugins?: { parser, transformer, codegen, ...final }` 分阶段插件。
11. `logging?: { enabled, warnings, info, errors }` 日志控制。
12. `onSuccess?: () => Promise<void>` 首次全量编译成功后执行。
13. `onChange?: (event, unit) => Promise<void>` watch 模式增量回调。

## 推荐最小配置

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: 'src',
  exclude: ['src/main.ts'],
  output: {
    workspace: '.vureact',
    outDir: 'dist',
    bootstrapVite: true,
  },
  cache: true,
});
```

## 注意

1. 渐进迁移场景强烈建议排除 Vue 入口文件。
2. `bootstrapVite` 在单文件编译场景会被自动跳过。
3. `plugins` 中未归类键会在编译末阶段执行。
