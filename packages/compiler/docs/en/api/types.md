# Types and Results

## Core Process Types

1. `ParseResult`: Output of the parsing phase.
2. `ReactIRDescriptor`: Output of the transformation phase.
3. `GeneratorResult`: Output of the generation phase.

## Compilation Result Types

1. `CompilationResult`: Unified result union type.
2. `SFCCompilationResult`: SFC (Single-File Component) output (jsx + css information).
3. `ScriptCompilationResult`: Script-only output.
4. `StyleCompilationResult`: Style-only output.

## Compilation Unit Types

1. `CompilationUnit`: Generic unit.
2. `SFCUnit`: SFC unit.
3. `ScriptUnit`: Script unit.
4. `StyleUnit`: Style unit.
5. `AssetUnit`: Asset unit.

## Cache-Related Types

1. `CacheKey`: `SFC | SCRIPT | STYLE | ASSET`.
2. `CacheMeta`, `FileCacheMeta`, `Vue2ReactCacheMeta`.
3. `LoadedCache<T>`: Cache loading structure.
4. `CacheCheckResult`: Cache hit check result.

## Configuration and Plugin Types

1. `CompilerOptions`
2. `PluginRegister<T>`
3. `ParserOptions`
4. `TransformerOptions`
5. `GeneratorOptions`

## Recommendations

1. For business integration, prioritize relying on high-level types (`CompilerOptions`, `CompilationResult`).
2. Use IR/cache fine-grained types only when deep extension is required.
