# vOn

`vOn` 用于把 Vue 风格事件描述（含修饰符）转换为 React 可绑定的事件处理函数。

## 说明

Vue 模板中的 `click.stop.prevent`、`keydown.enter` 这类语法在 React 中不能直接用。`vOn` 将其运行时转换为标准处理函数。

## 基本使用

```ts
const onClick = vOn('click', handler);

<button onClick={onClick} />
```

如果第三个参数传 `true`，会返回事件对象形式：

```ts
const eventProps = vOn('click', handler, true);
// { onClick: fn }
```

## 修饰符支持

运行时支持以下修饰符：

- 流程修饰符：`stop`、`prevent`、`self`、`once`
- 鼠标按键：`left`、`middle`、`right`
- 键盘按键：`enter`、`esc`、`space`、`tab`、`delete`、`up`、`down`、`left`、`right`
- 捕获：`capture`（体现在事件名转换）

示例：

```ts
vOn('click.stop.prevent', handler);
vOn('click.once', handler);
vOn('keydown.enter', handler);
vOn('click.capture', handler, true); // => { onClickCapture: fn }
```

## 行为顺序

执行时分两步：

1. 先做条件校验（如 `self`、鼠标按键、键盘按键）
2. 校验通过后再执行动作修饰符（`stop`、`prevent`、`once`）并调用原 handler

## API

```ts
function vOn<E = any>(event: string, handler: any): (...args: any[]) => E;

function vOn<E = any>(
  event: string,
  handler: any,
  fullEventObj?: boolean,
): Record<string, (...args: any[]) => E>;
```

## 注意事项

- `handler` 非函数时，会包装成常量返回函数。
- `.once` 状态在每个 `vOn` 调用实例内独立。
- 使用键盘修饰符时，应绑定到对应键盘事件（如 `keydown`/`keyup`）。
