# CLI 与配置

## CLI 命令

```bash
vureact build [root]
vureact watch [root]
```

## 常用参数

- `-i, --input <dir>`：输入目录
- `-o, --outDir <dir>`：输出目录名
- `--workspace <dir>`：工作区目录（缓存与产物根）
- `--bootstrapVite`：自动初始化 Vite React 环境
- `--exclude <pattern>`：排除规则
- `--no-recursive`：关闭递归扫描
- `--format`：启用格式化
- `--formatter <type>`：`prettier` 或 `builtin`

## 推荐配置模板

```js
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: 'src',
  exclude: ['src/main.ts'],
  output: {
    workspace: '.vureact',
    outDir: 'dist',
    bootstrapVite: true,
    ignoreAssets: ['vureact.config.js'],
  },
  format: {
    enabled: false, // 推荐只在 build 时启用，在 watch 模式下不用，减少编译耗时
    formatter: 'prettier',
  },
});
```

请注意，CLI 参数会覆盖 `vureact.config.js` 的同名配置。

## 编译器配置

### 签名

```ts
interface CompilerOptions {
  root?: string;
  input?: string;
  cache?: boolean;
  watch?: boolean;
  exclude?: string[];
  recursive?: boolean;
  generate?: GeneratorOptions;

  onSuccess?: () => Promise<void | undefined>;
  onChange?: (event: 'add' | 'change', unit: SFCUnit | ScriptUnit) => Promise<void | undefined>;

  output?: {
    workspace?: string;
    outDir?: string;
    ignoreAssets?: string[];
    bootstrapVite?: boolean | { template: 'react-ts' | 'react' };
  };

  plugins?: PluginRegister<CompilationResult> & {
    parser?: PluginRegister<ParseResult>;
    transformer?: PluginRegister<ReactIRDescriptor>;
    codegen?: PluginRegister<GeneratorResult>;
  };

  format?: {
    enabled?: boolean;
    formatter?: 'prettier' | 'builtin';
    prettierOptions?: PrettierOptions;
  };

  logging?: {
    enabled?: boolean;
    warnings?: boolean;
    info?: boolean;
    errors?: boolean;
  };
}
```
