# vCls

`vCls` 用于把 Vue 风格的 class 输入（字符串、对象、数组及其嵌套）转换为 React `className` 字符串。

## 说明

React 通常只接收字符串 `className`，而 Vue 的 class 语法支持更多形式。`vCls` 负责在运行时统一归一化。

## 基本使用

```ts
vCls('btn primary');
// "btn primary"

vCls({ active: true, disabled: false });
// "active"

vCls(['btn', { active: true }, ['size-lg']]);
// "btn active size-lg"
```

## 合并第二个输入

可以传第二个参数进行合并（常用于把已有 `className` 与新增 class 合并）：

```ts
vCls('base', { active: true });
// "base active"

vCls('foo bar', 'bar baz');
// "foo bar baz"  // 去重且保持顺序
```

## 对象语法细节

- 对象 value 为 truthy 时保留 key
- value 支持函数，函数返回 truthy 才保留 key
- key 以 `...` 开头时，会递归展开其值

```ts
vCls({
  active: () => true,
  hidden: () => false,
});
// "active"
```

## API

```ts
type ClsInputValue = string | Record<string, any> | ClsInputValue[];

function vCls(value: ClsInputValue, mergeItem?: ClsInputValue): string;
```

## 注意事项

- 会自动规整多余空格。
- 数组中的 `false/null/undefined` 会被忽略。
- 合并时会去重，且保留第一次出现顺序。
