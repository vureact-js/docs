# CLI

本章 VuReact 命令行入口、参数和实际行为。

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

CLI 会先尝试加载 `root/vureact.config.js`，然后合并命令行参数。

优先级：

1. CLI 参数
2. `vureact.config.js`
3. 默认值

## 参数

| 参数                  | 说明                             |
| --------------------- | -------------------------------- |
| `-i, --input <dir>`   | 输入目录（相对 `root`）          |
| `-o, --outDir <dir>`  | 输出目录名（相对 `workspace`）   |
| `--workspace <dir>`   | 编译工作区目录（缓存 + 输出）    |
| `--bootstrapVite`     | 预先初始化标准 React(Vite) 工程  |
| `--exclude <pattern>` | 排除文件/目录（glob）            |
| `--no-recursive`      | 关闭递归扫描子目录               |
| `--no-cache`          | 关闭缓存                         |
| `--format`            | 启用格式化                       |
| `--formatter <type>`  | 格式化器：`prettier` / `builtin` |

## 常用命令模板

### 1) 新项目标准编译

```bash
npx vureact build -i src --workspace .vureact -o dist --format --formatter prettier
```

### 2) 渐进迁移（排除 Vue 入口）

```bash
npx vureact build -i src --exclude src/main.ts --workspace .vureact -o dist
```

### 3) 本地开发增量监听

```bash
npx vureact watch -i src --exclude src/main.ts
```

## watch 模式行为

1. 启动时先执行一次全量编译。
2. 监听 `input` 下文件变更。
3. `.vue` 触发 SFC 编译；`.js/.ts` 触发 script 编译；其余文件按资源文件复制。
4. 删除文件/目录时会同步清理输出产物与缓存记录。

## 与配置项的关键关系

1. `exclude`：建议显式排除 Vue 入口（如 `src/main.ts`）。
2. `bootstrapVite`：目录编译可用；单文件输入会自动跳过 Vite 初始化。
3. `cache`：开启时对未变化文件直接跳过，watch 下体感差异明显。

## 常见问题

### 1) 命令生效了，但输出目录没有更新

先确认：

1. 目标文件是否被 `exclude` 命中。
2. 是否因为缓存判断为“未变化”被跳过。
3. `input` 是否指向了预期目录。

### 2) watch 模式下删文件后还有旧产物

通常是删除路径与缓存映射不一致，优先检查：

1. `root/input/outDir/workspace` 是否在同一套路径体系。
2. 是否有外部脚本在编译后又写回了文件。
3. 手动删除旧产物，或删除整个 output 目录

### 3) `--formatter prettier` 未生效

`prettier` 是可选 peer 依赖，需要项目里可解析到 `prettier` 包，建议安装它。

## 下一步

- 查看 [配置 API](/api/config)
- 查看 [插件系统 API](/api/plugin-system)
