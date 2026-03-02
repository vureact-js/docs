# 插件系统 API

## 总览

`CompilerOptions.plugins` 支持 4 类扩展点：

1. `parser`：解析阶段。
2. `transformer`：转换阶段。
3. `codegen`：代码生成阶段。
4. 末阶段插件：`plugins` 下除前三类外的键，编译完成后执行。

## 基础类型

```ts
interface PluginRegister<T> {
  [name: string]: (result: T, ctx: ICompilationContext) => void;
}
```

## 配置示例

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  plugins: {
    parser: {
      collectParseMeta(result, ctx) {
        // ParseResult 扩展
      },
    },
    transformer: {
      inspectIR(result, ctx) {
        // ReactIRDescriptor 扩展
      },
    },
    codegen: {
      patchOutput(result, ctx) {
        // GeneratorResult 扩展
      },
    },
    afterCompile(result, ctx) {
      // CompilationResult 末阶段处理
    },
  },
});
```

## 执行顺序

1. parser
2. transformer
3. codegen
4. 末阶段插件

## 约束

1. 插件是同步执行模型。
2. 插件异常会被捕获并打印，不会直接中断整个编译进程。
3. 插件应避免依赖内部未文档化细节，尽量只依赖公开结构。
