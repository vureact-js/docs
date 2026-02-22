# vKeyless

`vKeyless` 用于把一个“Vue 风格 props 对象”转换为可直接 spread 到 JSX 的 React props。

## 说明

在模板编译或运行时适配中，常见场景是 `v-bind="obj"`。`vKeyless` 负责一次性处理 class/style/event/属性命名差异。

## 基本使用

```tsx
const input = {
  id: 'main',
  class: ['container', { fluid: true }],
  'click.stop': onClick,
  style: 'background-color: #eee; font-size: 14px',
};

const props = vKeyless(input);

<div {...props} />;
```

转换后你会得到 React 可用的 `className`、`onClick`、`style` 等字段。

## 内部处理规则

### 1. class 合并

- `class` 和 `className` 都会进入 `vCls` 合并
- 最终只输出 `className`

### 2. 事件转换

- 事件字段会交给 `vOn(..., true)` 返回标准事件对象并合并
- 既支持 `onClick` 风格，也支持 `click.stop` 风格

### 3. style 转换

- `style` 字段交给 `vStyle` 转为 React style 对象

### 4. 属性命名映射

- `for` -> `htmlFor`
- `class` -> `className`
- `v-html` -> `dangerouslySetInnerHTML`
- `data-*` / `aria-*` 保持原样
- 其他 kebab-case 属性会转为 camelCase

## API

```ts
function vKeyless(obj: Record<string, any>): Record<string, any>;
```

## 注意事项

- `v-html` 仅做 key 映射，不自动包装 `__html` 对象。
- 事件值建议传函数；非函数值会按 `vOn` 规则包装。
- 当一个对象里同时包含 `class` 与 `className` 时，会统一合并到 `className`。
