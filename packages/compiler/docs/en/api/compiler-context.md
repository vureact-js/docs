# Context API

This page describes the context management API during the compilation process, applicable to scenarios requiring custom compilation flows or deep extension of the compiler.

## Overview

Compilation Context is the core data container in the Vue to React compilation process, which passes and shares data among the three stages of parsing, transformation, and generation. The context provides all metadata, state information, and intermediate results required for compilation.

## Core Interfaces

### `ICompilationContext`

Stability: `Low-level`

The core interface of the compilation context, defining all data structures that need to be shared during the compilation process.

```ts
interface ICompilationContext {
  // Basic information
  fileId: string; // Unique file identifier (hash value)
  source: string; // Source code content
  compName: string; // Component name
  filename: string; // File name (including path)
  imports: Map<string, ImportItem[]>; // Import records
  cssVars: string[]; // CSS variable list
  inputType: FileInputType; // Input file type
  propField: string; // Prop parameter name of functional component
  route?: boolean; // Whether routing is used
  preprocessStyles?: boolean; // Whether to preprocess styles

  // Template-related data
  templateData: {
    lang?: string; // Template language
    slots: Record<string, SlotNodesContext>; // Slot information
    refBindings: RefBindings; // Ref binding metadata
    reactiveBindings: ReactiveBindinds; // Reactive variable bindings
  };

  // Script-related data
  scriptData: {
    lang: LangType; // Script language (js/ts)
    provide: ProvideData; // provide/inject data
    propsTSIface: IPropsContext; // Props type interface
    source: string; // Script source code
  };

  // Style-related data
  styleData: {
    filePath: string; // Style file path
    moduleName?: string; // Style module name
    scopeId?: string; // Scope ID
  };
}
```

### `FileInputType` Enum

```ts
type FileInputType = 'sfc' | 'script-js' | 'script-ts' | 'style' | 'unknown';
```

## Context Management Classes

### `CompilationContext`

Stability: `Low-level`

Context management class that provides functions for context creation, initialization, and cleanup.

```ts
import { CompilationContext, createCompilationCtx } from '@vureact/compiler-core';

// Create context instance
const ctx = createCompilationCtx();

// Initialize context
ctx.init({
  inputType: 'sfc',
  filename: 'MyComponent.vue',
  source: vueSourceCode,
  compName: 'MyComponent',
});

// Get context data
const contextData = ctx.data;

// Clean up context (reset to initial state)
ctx.clear();
```

#### Methods

1. `get data(): ICompilationContext` - Get current context data
2. `clear(): void` - Clean up context and reset to initial state
3. `init(opts: Partial<ICompilationContext>): void` - Initialize context
4. `create(): ICompilationContext` - Create default context (internal use)

### `CompilationAdapter`

Stability: `Low-level`

Context adapter that provides intelligent context creation and input type detection capabilities.

```ts
import { CompilationAdapter } from '@vureact/compiler-core';

// Automatically detect file type and create context
const ctx = CompilationAdapter.createContext({
  source: sourceCode,
  filename: '/path/to/Component.vue', // Automatically detected as 'sfc' type
});

// Manually specify context data
const ctx2 = CompilationAdapter.createContext({
  source: scriptCode,
  filename: '/path/to/utils.ts', // Automatically detected as 'script-ts' type
  compName: 'myUtility',
  preprocessStyles: false,
});
```

#### Static Methods

1. `createContext(input: CompilationInput): CompilationContext` - Create compilation context
2. `detectInputType(filename: string): FileInputType` - Detect input file type

#### `CompilationInput` Interface

```ts
interface CompilationInput extends Partial<ICompilationContext> {
  source: string; // Source code (required)
  filename: string; // File name (required)
}
```

## Auxiliary Types

### `ImportItem`

```ts
type ImportItem = { name: string; onDemand: boolean };
```

### `SlotNodesContext`

```ts
interface SlotNodesContext {
  name: string; // Slot name
  isScope: boolean; // Whether it is a scoped slot
  props: {
    // Slot properties
    prop: string;
    value: string;
    tsType: t.TSTypeAnnotation;
  }[];
}
```

### `ReactiveBindinds`

```ts
interface ReactiveBindinds {
  [name: string]: {
    name: string;
    value: t.Expression;
    source: string;
    reactiveType: ReactiveTypes;
  };
}
```

### `RefBindings`

```ts
interface RefBindings {
  [name: string]: { tag: string; name: string; htmlType: string };
}
```

### `ProvideData`

```ts
interface ProvideData {
  name: string;
  value: string;
  isOccupied: boolean;
  provide: ProvideData | Record<string, any>;
}
```

### `IPropsContext`

```ts
interface IPropsContext {
  name: string; // Props interface name
  hasPropsInJsEnv?: boolean; // Whether Props exist in JS environment
  propsTypes: t.TSType[]; // Props type definitions
  emitTypes: t.TSType[]; // Emit type definitions
  slotTypes: t.TSType[]; // Slot type definitions
}
```

## Usage Examples

### Example 1: Manually create and manage context

```ts
import { createCompilationCtx } from '@vureact/compiler-core';
import { parse, transform, generate } from '@vureact/compiler-core';

// Create context
const ctx = createCompilationCtx();

// Initialize context
ctx.init({
  inputType: 'sfc',
  filename: 'MyComponent.vue',
  source: vueSourceCode,
  compName: 'MyComponent',
  preprocessStyles: true,
});

// Use context for compilation
const ast = parse(vueSourceCode, ctx.data);
const ir = transform(ast, ctx.data);
const result = generate(ir, ctx.data);

console.log(result.code);

// Clean up context
ctx.clear();
```

### Example 2: Use adapter to automatically create context

```ts
import { CompilationAdapter } from '@vureact/compiler-core';
import { parse, transform, generate } from '@vureact/compiler-core';

// Automatically create context (adapter detects file type)
const ctx = CompilationAdapter.createContext({
  source: vueSourceCode,
  filename: 'MyComponent.vue', // Automatically detected as SFC type
});

// Compilation process
const ast = parse(vueSourceCode, ctx.data);
const ir = transform(ast, ctx.data);
const result = generate(ir, ctx.data);

console.log(result.fileInfo);
```

### Example 3: Process script files

```ts
import { CompilationAdapter } from '@vureact/compiler-core';
import { parseOnlyScript, transform, generateOnlyScript } from '@vureact/compiler-core';

// Create context for script file
const ctx = CompilationAdapter.createContext({
  source: scriptCode,
  filename: 'utils.ts', // Automatically detected as script-ts type
});

// Script file compilation process
const ast = parseOnlyScript(scriptCode, ctx.data);
const ir = transform(ast, ctx.data);
const result = generateOnlyScript(ir, ctx.data);

console.log(result.code);
```

## Notes

1. **Context Lifecycle**: The context should be used in a single compilation process and cleaned up promptly after compilation is completed.
2. **Thread Safety**: The context is not thread-safe and the same context instance should not be shared in a concurrent environment.
3. **Data Consistency**: Manually modifying context data may affect compilation results and should be done with caution.
4. **Performance Considerations**: Frequent creation and destruction of contexts may impact performance; it is recommended to reuse context instances.
5. **Error Handling**: The context does not include error handling mechanisms; compilation errors need to be handled through other means.

## Applicable Scenarios

1. **Custom Compilation Flows**: Need to bypass the standard compilation pipeline to implement special compilation logic.
2. **Plugin Development**: Access and modify compilation context data in plugins.
3. **Toolchain Integration**: Integrate the compiler into other build tools.
4. **Debugging and Analysis**: Inspect intermediate states and data during compilation.
5. **Performance Optimization**: Optimize context initialization and cleanup for specific scenarios.

## Related APIs

- [Pipeline API](./pipeline) - Low-level compilation pipeline interface
- [Plugin System API](./plugin-system) - Plugin development and extension interface
- [Types and Results](./types) - Compilation result and data type definitions
