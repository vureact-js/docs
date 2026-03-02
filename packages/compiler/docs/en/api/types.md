# 类型与结果

## 核心过程类型

1. `ParseResult`：解析阶段输出。
2. `ReactIRDescriptor`：转换阶段输出。
3. `GeneratorResult`：生成阶段输出。

## 编译结果类型

1. `CompilationResult`：统一结果联合类型。
2. `SFCCompilationResult`：SFC 产物（jsx + css 信息）。
3. `ScriptCompilationResult`：script-only 产物。

## 编译单元类型

1. `CompilationUnit`：通用单元。
2. `SFCUnit`：SFC 单元。
3. `ScriptUnit`：脚本单元。
4. `AssetUnit`：资源单元。

## 缓存相关类型

1. `CacheKey`：`SFC | SCRIPT | ASSET`。
2. `CacheMeta`、`FileCacheMeta`、`Vue2ReactCacheMeta`。
3. `LoadedCache<T>`：缓存加载结构。
4. `CacheCheckResult`：缓存命中检查结果。

## 配置与插件类型

1. `CompilerOptions`
2. `PluginRegister<T>`
3. `ParserOptions`
4. `TransformerOptions`
5. `GeneratorOptions`

## 建议

1. 业务接入优先依赖高层类型（`CompilerOptions`、`CompilationResult`）。
2. 仅在需要深度扩展时使用 IR/缓存细粒度类型。
