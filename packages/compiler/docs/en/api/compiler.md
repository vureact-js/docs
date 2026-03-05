# Compiler API

## `VuReact`

Stability: `Stable`

`VuReact` inherits from `FileCompiler` and is the recommended programming entry point.

```ts
import { VuReact } from '@vureact/compiler-core';

const compiler = new VuReact({
  input: 'src',
  exclude: ['src/main.ts'],
});

await compiler.execute();
```

### Common Methods

1. `execute()`: Execute the complete compilation process.
2. `processSFC(filePath)`: Incremental compilation for single-file SFC (Single-File Component).
3. `processScript(filePath)`: Incremental compilation for single-file script.
4. `processStyle(filePath)`: Incremental compilation for single-file style.
5. `processAsset(filePath)`: Incremental processing for asset files.
6. `removeOutputPath(targetPath, cacheKey)`: Remove the mapping between output and cache.
7. `processFile(key, filePath)`: Generic file processing method that automatically selects processing logic based on the CacheKey type.
8. `getSkippedCount()`: Get the number of skipped files (unchanged files in incremental compilation).
9. `resetSkippedCount()`: Reset the counter for the number of skipped files.

## `BaseCompiler`

Stability: `Advanced`

Designed for "one-time compilation call" scenarios.

```ts
import { BaseCompiler } from '@vureact/compiler-core';

const base = new BaseCompiler({ input: 'src' });
const result = base.compile(sourceCode, '/abs/path/Comp.vue');
```

### Properties

- `version`: Compiler version number, automatically read from package.json.

### Methods

- `compile(source: string, filename: string): CompilationResult`: Compile Vue source code into React code.
  - `source`: Vue source code string.
  - `filename`: Source file name, used to generate file ID and output path.

## `FileCompiler`

Stability: `Advanced`

Parent class of `VuReact`, providing batch processing, caching, pipeline, and disk-writing capabilities. It is generally recommended to use `VuReact` directly.

### Constructor

```ts
constructor(options: CompilerOptions = {})
```

### Key Features

1. **Incremental Compilation**: Change detection based on file hash, size, and modification time.
2. **Intelligent Caching**: Maintains compilation cache and supports cleaning up expired files.
3. **Asset Handling**: Automatically identifies and copies non-compiled files.
4. **Error Isolation**: Failure of single-file compilation does not affect processing of other files.
5. **Concurrent Processing**: Supports concurrent processing of multiple files via Promise.all.
6. **Router Awareness**: Automatically detects and injects conversion dependencies from Vue Router to React Router.

## `Helper`

Stability: `Advanced`

Provides general utility capabilities such as path handling, caching, and formatting. Mainly used for secondary encapsulation; direct coupling with internal behaviors in business code is not recommended.
