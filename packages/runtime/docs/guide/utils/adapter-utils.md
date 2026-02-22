# AdapterUtils

`adapter-utils` 是 runtime-core 提供的一组模板运行时工具，主要用于把 Vue 风格的 class/style/event/对象展开能力映射到 React JSX。

它有两种使用方式：

- 直接使用独立函数：`vCls`、`vStyle`、`vOn`、`vKeyless`
- 使用统一实例入口：`adapterUtils`（或别名 `dir`）

## 统一入口

`adapter-utils/index.ts` 中定义了 `AdapterUtil` 类，并导出实例：

```ts
class AdapterUtil {
  cls(value, mergeItem?);
  keyless(obj);
  on(event, handler, fullEventObj?);
  style(target, ...mergeItems);
}

export const adapterUtils = new AdapterUtil();
export const dir = adapterUtils;
```

因此可以这样使用：

```tsx
import { adapterUtils, dir } from '@vureact/runtime-core';

const cls = adapterUtils.cls(['btn', { active: isActive }]);
const props = dir.keyless({ class: ['card', { selected: true }], click: onClick });
const onKeyDown = dir.on('keydown.enter.stop', handleEnter);
const style = adapterUtils.style('color: red', { fontSize: '14px' });
```

## 说明

`adapter-utils` 主要解决以下运行时问题：

- 把 Vue 的 class/style 多语法（字符串、对象、数组）统一转换成 React 可消费格式
- 把 Vue 风格事件名与修饰符（如 `.stop`、`.prevent`、`.enter`）转换为 React 事件处理函数
- 把 `v-bind="obj"` 风格对象批量转换为 JSX props（包含 `class`、`style`、事件、属性重命名）
- 提供 `nextTick` 的异步调度能力

## API

```ts
// class
adapterUtils.cls(value: ClsInputValue, mergeItem?: ClsInputValue): string;

// spread props
adapterUtils.keyless(obj: Record<string, any>): Record<string, any>;

// event
adapterUtils.on(event: string, handler: any, fullEventObj?: boolean): any;

// style
adapterUtils.style(target: VStyleItem, ...mergeItems: VStyleItem[]): object;

// alias
const dir = adapterUtils;
```

## 注意事项

- `nextTick` 是独立导出函数，不在 `AdapterUtil` 实例方法中。
- `dir` 只是 `adapterUtils` 的别名，两者能力一致。
- 复杂行为（修饰符优先级、属性映射规则）请分别参考各子文档。
