# CLI

本章是 VuReact 命令行入口、参数和实际行为。

## 命令

### `build [root]`

一次性编译，不持续监听。

```bash
# 默认使用命令行的运行路径下，src 目录
npx vureact build

# 指定输入路径
npx vureact build ./src
```

### `watch [root]`

首次全量编译后，进入文件监听并增量重编译。

```bash
npx vureact watch
npx vureact watch ./src
```

## 配置加载与优先级

CLI 会先尝试加载根目录下的 `vureact.config.js` / `vureact.config.ts`，然后合并命令行参数。

优先级：

1. CLI 参数
2. [配置文件](/api/config)
3. 默认值

## 参数

| 参数                 | 说明                           |
| -------------------- | ------------------------------ |
| `-i, --input <dir>`  | 输入目录（相对 `root`）        |
| `-o, --outDir <dir>` | 输出目录名（相对 `workspace`） |
| `--workspace <dir>`  | 编译工作区目录（缓存 + 输出）  |

## watch 模式行为

1. 启动时先执行一次全量编译。
2. 监听 `input` 下文件变更。
3. `.vue` 触发 SFC 编译；`.js/.ts` 触发 script 编译；`.css/.less/.scss/.sass` 出发 style 编译；其余文件按资源文件复制。
4. 删除文件/目录时会同步清理输出产物与缓存记录。
