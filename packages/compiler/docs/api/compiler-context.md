# 上下文 API

本页介绍编译过程中的上下文管理 API，适用于需要自定义编译流程或深度扩展编译器的场景。

## 概述

编译上下文（Compilation Context）是 Vue 到 React 编译过程中的核心数据容器，它在解析（parse）、转换（transform）、生成（generate）三个阶段之间传递和共享数据。上下文提供了编译所需的所有元数据、状态信息和中间结果。

## 核心接口

### `ICompilationContext`

稳定性：`Low-level`

编译上下文的核心接口，定义了编译过程中所有需要共享的数据结构。

```ts
interface ICompilationContext {
  // 基础信息
  fileId: string; // 文件唯一标识（哈希值）
  source: string; // 源代码内容
  compName: string; // 组件名称
  filename: string; // 文件名（含路径）
  imports: Map<string, ImportItem[]>; // 导入记录
  cssVars: string[]; // CSS 变量列表
  inputType: FileInputType; // 输入文件类型
  propField: string; // 函数组件的 prop 参数名
  route?: boolean; // 是否使用了路由
  preprocessStyles?: boolean; // 是否预处理样式

  // 模板相关数据
  templateData: {
    lang?: string; // 模板语言
    slots: Record<string, SlotNodesContext>; // 插槽信息
    refBindings: RefBindings; // ref 绑定元数据
    reactiveBindings: ReactiveBindinds; // 响应式变量绑定
  };

  // 脚本相关数据
  scriptData: {
    lang: LangType; // 脚本语言（js/ts）
    provide: ProvideData; // provide/inject 数据
    propsTSIface: IPropsContext; // Props 类型接口
    source: string; // 脚本源代码
  };

  // 样式相关数据
  styleData: {
    filePath: string; // 样式文件路径
    moduleName?: string; // 样式模块名称
    scopeId?: string; // 作用域 ID
  };
}
```

### `FileInputType` 枚举

```ts
type FileInputType = 'sfc' | 'script-js' | 'script-ts' | 'style' | 'unknow';
```

## 上下文管理类

### `CompilationContext`

稳定性：`Low-level`

上下文管理类，提供上下文的创建、初始化和清理功能。

```ts
import { CompilationContext, createCompilationCtx } from '@vureact/compiler-core';

// 创建上下文实例
const ctx = createCompilationCtx();

// 初始化上下文
ctx.init({
  inputType: 'sfc',
  filename: 'MyComponent.vue',
  source: vueSourceCode,
  compName: 'MyComponent',
});

// 获取上下文数据
const contextData = ctx.data;

// 清理上下文（重置为初始状态）
ctx.clear();
```

#### 方法

1. `get data(): ICompilationContext` - 获取当前上下文数据
2. `clear(): void` - 清理上下文，重置为初始状态
3. `init(opts: Partial<ICompilationContext>): void` - 初始化上下文
4. `create(): ICompilationContext` - 创建默认上下文（内部使用）

### `CompilationAdapter`

稳定性：`Low-level`

上下文适配器，提供智能的上下文创建和输入类型检测功能。

```ts
import { CompilationAdapter } from '@vureact/compiler-core';

// 自动检测文件类型并创建上下文
const ctx = CompilationAdapter.createContext({
  source: sourceCode,
  filename: '/path/to/Component.vue', // 自动检测为 'sfc' 类型
});

// 手动指定上下文数据
const ctx2 = CompilationAdapter.createContext({
  source: scriptCode,
  filename: '/path/to/utils.ts', // 自动检测为 'script-ts' 类型
  compName: 'myUtility',
  preprocessStyles: false,
});
```

#### 静态方法

1. `createContext(input: CompilationInput): CompilationContext` - 创建编译上下文
2. `detectInputType(filename: string): FileInputType` - 检测输入文件类型

#### `CompilationInput` 接口

```ts
interface CompilationInput extends Partial<ICompilationContext> {
  source: string; // 源代码（必需）
  filename: string; // 文件名（必需）
}
```

## 辅助类型

### `ImportItem`

```ts
type ImportItem = { name: string; onDemand: boolean };
```

### `SlotNodesContext`

```ts
interface SlotNodesContext {
  name: string; // 插槽名称
  isScope: boolean; // 是否为作用域插槽
  props: {
    // 插槽属性
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
  name: string; // Props 接口名称
  hasPropsInJsEnv?: boolean; // 是否在 JS 环境中有 Props
  propsTypes: t.TSType[]; // Props 类型定义
  emitTypes: t.TSType[]; // Emit 类型定义
  slotTypes: t.TSType[]; // Slot 类型定义
}
```

## 使用示例

### 示例 1：手动创建和管理上下文

```ts
import { createCompilationCtx } from '@vureact/compiler-core';
import { parse, transform, generate } from '@vureact/compiler-core';

// 创建上下文
const ctx = createCompilationCtx();

// 初始化上下文
ctx.init({
  inputType: 'sfc',
  filename: 'MyComponent.vue',
  source: vueSourceCode,
  compName: 'MyComponent',
  preprocessStyles: true,
});

// 使用上下文进行编译
const ast = parse(vueSourceCode, ctx.data);
const ir = transform(ast, ctx.data);
const result = generate(ir, ctx.data);

console.log(result.code);

// 清理上下文
ctx.clear();
```

### 示例 2：使用适配器自动创建上下文

```ts
import { CompilationAdapter } from '@vureact/compiler-core';
import { parse, transform, generate } from '@vureact/compiler-core';

// 自动创建上下文（适配器会检测文件类型）
const ctx = CompilationAdapter.createContext({
  source: vueSourceCode,
  filename: 'MyComponent.vue', // 自动检测为 SFC 类型
});

// 编译流程
const ast = parse(vueSourceCode, ctx.data);
const ir = transform(ast, ctx.data);
const result = generate(ir, ctx.data);

console.log(result.fileInfo);
```

### 示例 3：处理脚本文件

```ts
import { CompilationAdapter } from '@vureact/compiler-core';
import { parseOnlyScript, transform, generateOnlyScript } from '@vureact/compiler-core';

// 创建脚本文件上下文
const ctx = CompilationAdapter.createContext({
  source: scriptCode,
  filename: 'utils.ts', // 自动检测为 script-ts 类型
});

// 脚本文件编译流程
const ast = parseOnlyScript(scriptCode, ctx.data);
const ir = transform(ast, ctx.data);
const result = generateOnlyScript(ir, ctx.data);

console.log(result.code);
```

## 注意事项

1. **上下文生命周期**：上下文应在单次编译过程中使用，编译完成后应及时清理
2. **线程安全**：上下文不是线程安全的，不应在并发环境中共享同一上下文实例
3. **数据一致性**：手动修改上下文数据可能影响编译结果，需谨慎操作
4. **性能考虑**：频繁创建和销毁上下文可能影响性能，建议复用上下文实例
5. **错误处理**：上下文不包含错误处理机制，编译错误需通过其他方式处理

## 适用场景

1. **自定义编译流程**：需要绕过标准编译管线，实现特殊编译逻辑
2. **插件开发**：在插件中访问和修改编译上下文数据
3. **工具链集成**：将编译器集成到其他构建工具中
4. **调试和分析**：检查编译过程中的中间状态和数据
5. **性能优化**：针对特定场景优化上下文初始化和清理

## 相关 API

- [流水线 API](./pipeline) - 低层编译流水线接口
- [插件系统 API](./plugin-system) - 插件开发和扩展接口
- [类型与结果](./types) - 编译结果和数据类型定义
