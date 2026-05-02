# 配置 API

## `defineConfig`

稳定性：`Stable`

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig(options: CompilerOptions);
```

`defineConfig(options)` 本质上返回原对象，用于类型提示与配置约定统一。

## `CompilerOptions`

```ts
interface CompilerOptions {
  /**
   * 手动指定根目录。
   * @default process.cwd()
   */
  root?: string;

  /**
   * 源文件或目录的路径。
   * - 若为文件，则编译该单个文件。
   * - 若为目录，则递归编译该目录下所有 .vue 文件。
   *
   * @default 'src/'
   */
  input?: string;

  /**
   * 是否启用构建缓存并复用上次缓存结果
   * @default true
   */
  cache?: boolean;

  output?: {
    /**
     * 输出文件对应位置的根目录名称。
     * @default '.vureact'
     */
    workspace?: string;

    /**
     * 输出目录名称，相对于 `output.workspace`
     * @default 'react-app'
     */
    outDir?: string;

    /**
     * 是否在编译前自动调用 Vite 初始化标准的
     * React 项目环境。
     * @default true
     */
    bootstrapVite?:
      | boolean
      | {
          /**
           * 指定 React 模板类型。
           * @default 'react-ts'
           */
          template?: 'react-ts' | 'react';

          /**
           * 指定初始安装的 Vite 版本，必须以 '@' 开头。
           * @default '@latest'
           */
          vite?: string;

          /**
           * 指定初始安装的 React 版本。
           * @default 'latest'
           */
          react?: string;
        };

    /**
     * 指定无需复制的资源文件。
     * 可以是文件名或路径，支持模糊匹配。
     * @default
     * [
     *  'package.json',
     *  'package-lock.json',
     *  'pnpm-lock.yaml',
     *  'index.html',
     *  'tsconfig.',
     *  'vite.config.',
     *  'eslint.config.',
     *  'readme.',
     *  'vue.',
     *  'vureact.config.js',
     * ]
     */
    ignoreAssets?: string[];

    /**
     * 自定义产物文件 package.json。
     * 该函数会接收默认的 package.json 产物对象，
     * 并需要返回修改后的版本。
     *
     * 注：该配置项仅在 `bootstrapVite` 启用时生效。
     */
    packageJson: (data: Record<string, any>) => Record<string, any>;
  };

  /**
   * 排除的文件/目录匹配模式（支持 glob 语法）。
   * @default
   * [
   *  'node_modules/**',
   *  'dist/**',
   *  'build/**',
   *  '.git/**',
   *  '.vureact/**'
   * ]
   */
  exclude?: string[];

  /**
   * 是否递归搜索子目录。
   * @default true
   */
  recursive?: boolean;

  /**
   * 透传给 babel-generator 的配置项。
   */
  generate?: GeneratorOptions;

  /**
   * 实时监听文件变化并自动重新编译。
   * @default false
   */
  watch?: boolean;

  /**
   * 是否将 Less/Sass 样式语言处理为 CSS
   * @default true
   */
  preprocessStyles?: boolean;

  /**
   * 指定 Vue Router 配置文件的路径。
   * 用于在 React 的 main.tsx 或 main.jsx 中注入 Router Provider。
   */
  router?: {
    /**
     * Vue Router 配置文件的路径。
     * 该文件必须有默认导出 createRouter 的 API。
     */
    configFile: string;

    /**
     * 自动更新 React 应用入口文件以使用 Router Provider。
     * 注意：仅当 `output.bootstrapVite` 启用时才会进行注入。
     * @default true
     */
    autoUpdateEntry?: boolean;
  };

  /**
   * 可用于添加插件，并分别自定义
   * 解析/转换/代码生成/编译完成阶段的输出结果。
   */
  plugins?: PluginRegister<CompilationResult> & {
    /**
     * 注册解析器插件
     */
    parser?: PluginRegister<ParseResult>;

    /**
     * 注册转换器插件
     */
    transformer?: PluginRegister<ReactIRDescriptor>;

    /**
     * 注册代码生成插件
     */
    codegen?: PluginRegister<GeneratorResult>;
  };

  format?: {
    /**
     * 是否启用代码格式化
     * @default false
     */
    enabled?: boolean;

    /**
     * 指定格式化工具
     * @default 'prettier'
     */
    formatter?: 'prettier' | 'builtin';

    /**
     * 配置 Prettier 的格式化选项，
     * 仅在 formatter 设置为 'prettier' 时生效。
     */
    prettierOptions?: PrettierOptions;
  };

  /**
   * 日志控制选项
   */
  logging?: {
    /**
     * 是否启用日志输出（注：CLI 重要日志仍会输出）
     * @default true
     */
    enabled?: boolean;

    /** 是否输出警告信息。 */
    warnings?: boolean;

    /** 是否输出提示信息。 */
    info?: boolean;

    /** 是否输出错误信息。 */
    errors?: boolean;
  };

  /**
   * 在 build 模式下，全量编译成功后执行。
   */
  onSuccess?: () => Promise<void | undefined>;

  /**
   * 在 watch 模式下，增量编译成功后执行。
   */
  onChange?: (event: 'add' | 'change', unit: CompilationUnit) => Promise<void | undefined>;
}
```

## 详细配置说明

### `plugins` 选项

插件注册接口定义：

```ts
interface PluginRegister<T> {
  [name: string]: (result: T, ctx: ICompilationContext) => void;
}
```

## 编译结果类型

### `CompilationResult` 类型

编译结果类型，可以是以下三种之一：

- `SFCCompilationResult` - SFC 文件编译结果
- `ScriptCompilationResult` - 脚本文件编译结果
- `StyleCompilationResult` - 样式文件编译结果

### `SFCCompilationResult` 类型

```ts
interface SFCCompilationResult extends BaseCompilationResult {
  fileInfo: {
    jsx: {
      file: string;
      lang: string;
    };
    css: {
      file?: string;
      hash?: string;
      code?: string;
    };
  };
}
```

### `ScriptCompilationResult` 类型

```ts
interface ScriptCompilationResult extends BaseCompilationResult {
  fileInfo: {
    script: {
      file: string;
      lang: string;
    };
  };
}
```

### `StyleCompilationResult` 类型

```ts
interface StyleCompilationResult extends Omit<
  BaseCompilationResult,
  'hasRoute' | keyof GeneratorResult
> {
  code: string;
  fileInfo: {
    style: {
      file: string;
      lang: string;
    };
  };
}
```

## 编译单元类型

### `CompilationUnit` 类型

编译单元类型，可以是以下三种之一：

- `SFCUnit` - SFC 编译单元
- `ScriptUnit` - 脚本编译单元
- `StyleUnit` - 样式编译单元

### `SFCUnit` 类型

```ts
interface SFCUnit extends BaseUnit {
  type: CacheKey.SFC;
  output?: {
    jsx: OutputItem;
    css: Partial<OutputItem>;
  };
}
```

### `ScriptUnit` 类型

```ts
interface ScriptUnit extends BaseUnit {
  type: CacheKey.SCRIPT;
  output?: {
    script: OutputItem;
  };
}
```

### `StyleUnit` 类型

```ts
interface StyleUnit extends Omit<BaseUnit, 'hasRoute'> {
  type: CacheKey.STYLE;
  output?: {
    style: OutputItem;
  };
}
```

## 缓存相关

### `CacheKey` 枚举

缓存键枚举：

```ts
enum CacheKey {
  SFC = 'sfc', // SFC 文件
  SCRIPT = 'script', // 脚本文件
  STYLE = 'style', // 样式文件
  ASSET = 'copied', // 复制的资产文件
}
```

### `CacheList` 结构

缓存列表结构：

```ts
interface CacheList {
  [CacheKey.SFC]: Vue2ReactCacheMeta[];
  [CacheKey.SCRIPT]: FileCacheMeta[];
  [CacheKey.STYLE]: FileCacheMeta[];
  [CacheKey.ASSET]: FileCacheMeta[];
}
```

## 推荐最小配置

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: 'src',
  exclude: ['src/main.ts'],
  output: {
    workspace: '.vureact',
    outDir: 'react-app',
    bootstrapVite: true,
  },
  cache: true,
});
```

## 注意

1. 渐进迁移场景强烈建议排除 Vue 入口文件。
2. `bootstrapVite` 在单文件编译场景会被自动跳过。
3. `plugins` 中未归类键会在编译末阶段执行。
