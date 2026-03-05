# Plugin System API

## Overview

`CompilerOptions.plugins` supports 4 types of extension points:

1. `parser`: Parsing phase.
2. `transformer`: Transformation phase.
3. `codegen`: Code generation phase.
4. Post-compilation plugins: Keys under `plugins` excluding the first three types, executed after compilation is completed.

## Basic Types

```ts
interface PluginRegister<T> {
  [name: string]: (result: T, ctx: ICompilationContext) => void;
}
```

## Configuration Example

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  plugins: {
    parser: {
      collectParseMeta(result, ctx) {
        // ParseResult extension
      },
    },
    transformer: {
      inspectIR(result, ctx) {
        // ReactIRDescriptor extension
      },
    },
    codegen: {
      patchOutput(result, ctx) {
        // GeneratorResult extension
      },
    },
    afterCompile(result, ctx) {
      // Post-processing of CompilationResult
    },
  },
});
```

## Execution Order

1. parser
2. transformer
3. codegen
4. Post-compilation plugins

## Constraints

1. Plugins follow a synchronous execution model.
2. Plugin exceptions are caught and printed, and will not directly interrupt the entire compilation process.
3. Plugins should avoid relying on undocumented internal details and should only depend on public structures as much as possible.
