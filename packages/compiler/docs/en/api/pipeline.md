# Pipeline API

This page documents the low-level compilation pipeline interfaces, suitable for scenarios requiring a custom compilation chain.

## `parseSFC(source, ctx, options?)`

Stability: `Low-level`

Parses a Vue SFC (Single-File Component) and returns a `ParseResult` (containing template/script/style).

## `parseOnlyScript(source, ctx, options?)`

Stability: `Low-level`

Parses only non-SFC script inputs (`script-js/script-ts`).

## `parse(source, ctx, options?)`

Stability: `Low-level`

Unified entry: automatically dispatches to the SFC or script parser based on `ctx.inputType`.

## `transform(ast, ctx, options?)`

Stability: `Low-level`

Converts the parsing result into a `ReactIRDescriptor`.

## `generateComponent(ir, ctx, options?)`

Stability: `Low-level`

Used for SFC inputs; generates component-level AST and code.

## `generateOnlyScript(ir, ctx, options?)`

Stability: `Low-level`

Used for script-only inputs; generates only script code.

## `generate(ir, ctx, options?)`

Stability: `Low-level`

Unified entry: automatically dispatches to the corresponding generator based on `ctx.inputType`.

## Minimal Manual Pipeline Example

```ts
import { createCompilationCtx } from '@vureact/compiler-core';
import { parse, transform, generate } from '@vureact/compiler-core';

const ctx = createCompilationCtx();
ctx.init({ inputType: 'sfc', filename: 'Demo.vue', source });

const ast = parse(source, ctx.data);
const ir = transform(ast, ctx.data);
const out = generate(ir, ctx.data);

console.log(out.code);
```

## Notes

1. Low-level APIs require you to manage the context and disk-writing behavior yourself.
2. Unless extending the toolchain, prefer using `VuReact.execute()`.
