# Configuration API

## `defineConfig`

Stability: `Stable`

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig(options: CompilerOptions);
```

`defineConfig(options)` essentially returns the original object, used for type hinting and unifying configuration conventions.

## `CompilerOptions`

```ts
interface CompilerOptions {
  /**
   * Manually specify the root directory.
   * @default process.cwd()
   */
  root?: string;

  /**
   * Path to the source file or directory.
   * - If it is a file, compile this single file.
   * - If it is a directory, recursively compile all .vue files under this directory.
   *
   * @default
   * 'src/' // src directory under the root directory
   */
  input?: string;

  /**
   * Whether to enable build cache and reuse the last cached result
   * @default true
   */
  cache?: boolean;

  output?: {
    /**
     * Name of the root directory corresponding to the output file location.
     * @default '.vureact'
     */
    workspace?: string;

    /**
     * Output directory name, relative to `output.workspace`
     * @default 'dist'
     */
    outDir?: string;

    /**
     * Whether to automatically call Vite to initialize a standard
     * React project environment before compilation.
     * @default true
     */
    bootstrapVite?:
      | boolean
      | {
          /**
           * Specify the React template type.
           * @default 'react-ts'
           */
          template?: 'react-ts' | 'react';

          /**
           * Specify the Vite version for initial installation, which must start with '@'.
           * @default '@latest'
           */
          vite?: string;

          /**
           * Specify the React version for initial installation.
           * @default 'latest'
           */
          react?: string;
        };

    /**
     * Specify resource files that do not need to be copied.
     * Can be file names or paths, supporting fuzzy matching.
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
     * Customize the generated package.json file.
     * This function receives the default package.json object
     * and should return the modified version.
     *
     * Note: This option only takes effect when `bootstrapVite` is enabled.
     */
    packageJson: (data: Record<string, any>) => Record<string, any>;
  };

  /**
   * Excluded file/directory matching patterns (supports glob syntax).
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
   * Whether to recursively search subdirectories.
   * @default true
   */
  recursive?: boolean;

  /**
   * Configuration items passed through to babel-generator.
   */
  generate?: GeneratorOptions;

  /**
   * Real-time monitoring of file changes and automatic recompilation.
   * @default false
   */
  watch?: boolean;

  /**
   * Whether to process Less/Sass style languages into CSS
   * @default true
   */
  preprocessStyles?: boolean;

  /**
   * Used to inject Router Provider in React's main.tsx or main.jsx
   */
  router?: {
    /**
     * Path to the Vue Router config file.
     * Must be the location where `createRouter` is **exported as default**.
     */
    configFile: string;

    /**
     * Automatically update the react app entry file to use the VuReact Router Provider.
     *
     * Note: Injection only occurs when `output.bootstrapVite` is enabled.
     *
     * @default true
     */
    autoUpdateEntry?: boolean;
  };

  /**
   * Can be used to add plugins and customize the output results of
   * parsing/transforming/code generation/compilation completion stages respectively.
   */
  plugins?: PluginRegister<CompilationResult> & {
    /**
     * Register parser plugins
     */
    parser?: PluginRegister<ParseResult>;

    /**
     * Register transformer plugins
     */
    transformer?: PluginRegister<ReactIRDescriptor>;

    /**
     * Register code generation plugins
     */
    codegen?: PluginRegister<GeneratorResult>;
  };

  format?: {
    /**
     * Whether to enable code formatting
     * @default false
     */
    enabled?: boolean;

    /**
     * Specify the formatting tool
     * @default 'prettier'
     */
    formatter?: 'prettier' | 'builtin';

    /**
     * Configure Prettier's formatting options,
     * only takes effect when formatter is set to 'prettier'.
     */
    prettierOptions?: PrettierOptions;
  };

  /**
   * Log control options
   */
  logging?: {
    /**
     * Whether to enable log output
     * (Note: CLI important logs will still be output)
     * @default true
     */
    enabled?: boolean;

    /** Whether to output warning messages. */
    warnings?: boolean;

    /** Whether to output info messages. */
    info?: boolean;

    /** Whether to output error messages. */
    errors?: boolean;
  };

  /**
   * Executed after successful compilation in build mode.
   */
  onSuccess?: () => Promise<void | undefined>;

  /**
   * Executed post successful incremental compilation in watch mode.
   */
  onChange?: (event: 'add' | 'change', unit: CompilationUnit) => Promise<void | undefined>;
}
```

## Detailed Configuration Explanation

### `plugins` Option

Plugin registration interface definition:

```ts
interface PluginRegister<T> {
  [name: string]: (result: T, ctx: ICompilationContext) => void;
}
```

## Compilation Result Types

### `CompilationResult` Type

The compilation result type can be one of the following three:

- `SFCCompilationResult` - SFC file compilation result
- `ScriptCompilationResult` - Script file compilation result
- `StyleCompilationResult` - Style file compilation result

### `SFCCompilationResult` Type

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

### `ScriptCompilationResult` Type

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

### `StyleCompilationResult` Type

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

## Compilation Unit Types

### `CompilationUnit` Type

The compilation unit type can be one of the following three:

- `SFCUnit` - SFC compilation unit
- `ScriptUnit` - Script compilation unit
- `StyleUnit` - Style compilation unit

### `SFCUnit` Type

```ts
interface SFCUnit extends BaseUnit {
  type: CacheKey.SFC;
  output?: {
    jsx: OutputItem;
    css: Partial<OutputItem>;
  };
}
```

### `ScriptUnit` Type

```ts
interface ScriptUnit extends BaseUnit {
  type: CacheKey.SCRIPT;
  output?: {
    script: OutputItem;
  };
}
```

### `StyleUnit` Type

```ts
interface StyleUnit extends Omit<BaseUnit, 'hasRoute'> {
  type: CacheKey.STYLE;
  output?: {
    style: OutputItem;
  };
}
```

## Cache Related

### `CacheKey` Enum

Cache key enumeration:

```ts
enum CacheKey {
  SFC = 'sfc', // SFC files
  SCRIPT = 'script', // Script files
  STYLE = 'style', // Style files
  ASSET = 'copied', // Copied asset files
}
```

### `CacheList` Structure

Cache list structure:

```ts
interface CacheList {
  [CacheKey.SFC]: Vue2ReactCacheMeta[];
  [CacheKey.SCRIPT]: FileCacheMeta[];
  [CacheKey.STYLE]: FileCacheMeta[];
  [CacheKey.ASSET]: FileCacheMeta[];
}
```

## Recommended Minimal Configuration

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

## Notes

1. It is strongly recommended to exclude the Vue entry file in progressive migration scenarios.
2. `bootstrapVite` will be automatically skipped in single-file compilation scenarios.
3. Unclassified keys in `plugins` will be executed at the end of compilation.
