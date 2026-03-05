# 编译器 API

## `VuReact`

稳定性：`Stable`

`VuReact` 继承自 `FileCompiler`，是推荐的编程入口。

```ts
import { VuReact } from '@vureact/compiler-core';

const compiler = new VuReact({
  input: 'src',
  exclude: ['src/main.ts'],
});

await compiler.execute();
```

### 常用方法

1. `execute()`：执行完整编译流程。
2. `processSFC(filePath)`：单文件 SFC 增量编译。
3. `processScript(filePath)`：单文件 script 增量编译。
4. `processStyle(filePath)`：单文件 style 增量编译。
5. `processAsset(filePath)`：资源文件增量处理。
6. `removeOutputPath(targetPath, cacheKey)`：删除输出与缓存映射。
7. `processFile(key, filePath)`：通用文件处理方法，根据 CacheKey 类型自动选择处理逻辑。
8. `getSkippedCount()`：获取跳过的文件数量（增量编译中未变更的文件）。
9. `resetSkippedCount()`：重置跳过的文件数量计数器。

## `BaseCompiler`

稳定性：`Advanced`

面向"单次编译调用"场景。

```ts
import { BaseCompiler } from '@vureact/compiler-core';

const base = new BaseCompiler({ input: 'src' });
const result = base.compile(sourceCode, '/abs/path/Comp.vue');
```

### 属性

- `version`：编译器版本号，从 package.json 自动读取。

### 方法

- `compile(source: string, filename: string): CompilationResult`：编译 Vue 源代码为 React 代码。
  - `source`：Vue 源代码字符串
  - `filename`：源文件名，用于生成文件ID和输出路径

## `FileCompiler`

稳定性：`Advanced`

`VuReact` 的父类，提供批处理、缓存、管线、落盘能力。一般直接用 `VuReact` 即可。

### 构造函数

```ts
constructor(options: CompilerOptions = {})
```

### 主要特性

1. **增量编译**：基于文件哈希、大小和修改时间进行变更检测
2. **智能缓存**：维护编译缓存，支持清理过期文件
3. **资源处理**：自动识别并拷贝非编译文件
4. **错误隔离**：单个文件编译失败不影响其他文件处理
5. **并发处理**：支持 Promise.all 并发处理多个文件
6. **路由感知**：自动检测并注入 Vue Router 到 React Router 的转换依赖

## `Helper`

稳定性：`Advanced`

提供路径、缓存、格式化等通用工具能力。主要用于二次封装，不建议业务侧直接耦合内部行为。
