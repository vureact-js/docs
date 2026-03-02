# 流水线 API

本页是低层编译流水线接口，适合需要自定义编译链路的场景。

## `parseSFC(source, ctx, options?)`

稳定性：`Low-level`

解析 Vue SFC，返回 `ParseResult`（template/script/style）。

## `parseOnlyScript(source, ctx, options?)`

稳定性：`Low-level`

仅解析非 SFC 脚本输入（`script-js/script-ts`）。

## `parse(source, ctx, options?)`

稳定性：`Low-level`

统一入口：根据 `ctx.inputType` 自动分派到 SFC 或 script 解析器。

## `transform(ast, ctx, options?)`

稳定性：`Low-level`

把解析结果转换为 `ReactIRDescriptor`。

## `generateComponent(ir, ctx, options?)`

稳定性：`Low-level`

用于 SFC 输入，生成组件级 AST 与代码。

## `generateOnlyScript(ir, ctx, options?)`

稳定性：`Low-level`

用于 script-only 输入，只生成脚本代码。

## `generate(ir, ctx, options?)`

稳定性：`Low-level`

统一入口：根据 `ctx.inputType` 自动分派到对应 generator。

## 最小手工流水线示例

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

## 注意

1. 低层 API 需要你自己管理上下文和落盘行为。
2. 若不是做工具链扩展，优先用 `VuReact.execute()`。
