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
4. `processAsset(filePath)`：资源文件增量处理。
5. `removeOutputPath(targetPath, cacheKey)`：删除输出与缓存映射。

## `BaseCompiler`

稳定性：`Advanced`

面向“单次编译调用”场景。

```ts
import { BaseCompiler } from '@vureact/compiler-core';

const base = new BaseCompiler({ input: 'src' });
const result = base.compile(sourceCode, '/abs/path/Comp.vue');
```

## `FileCompiler`

稳定性：`Advanced`

`VuReact` 的父类，提供批处理、缓存、管线、落盘能力。一般直接用 `VuReact` 即可。

## `Helper`

稳定性：`Advanced`

提供路径、缓存、格式化等通用工具能力。主要用于二次封装，不建议业务侧直接耦合内部行为。
