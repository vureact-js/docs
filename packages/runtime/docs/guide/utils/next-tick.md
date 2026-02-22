# nextTick

这是对 Vue `nextTick` 的适配实现，用于把逻辑延后到当前同步任务之后执行。

## 说明

在状态更新或一段同步逻辑之后，你可能需要在“下一轮”再读取数据或执行副作用。`nextTick` 提供统一 Promise 化入口。

## 基本使用

```ts
await nextTick();
// 到这里时，当前同步逻辑已完成，且 nextTick 队列已执行
```

```ts
const result = await nextTick(() => {
  return 42;
});

// result === 42
```

## this 绑定

`nextTick` 支持保留调用时的 `this`：

```ts
const ctx = { id: 'ctx-1' };

await nextTick.call(ctx, function () {
  console.log(this.id); // ctx-1
});
```

## 调度策略

内部会按能力顺序选择异步调度方式：

1. `Promise.resolve().then(...)`
2. `requestAnimationFrame(...)`
3. `MutationObserver`
4. `setTimeout(..., 0)`

## API

```ts
function nextTick<T, R>(this: T, fn?: (this: T) => R | Promise<R>): Promise<R>;
```

## 注意事项

- 不传回调时，`nextTick()` 依然返回 Promise，可直接 `await`。
- 回调返回值会作为 Promise 的 resolve 值。
- 该方法是调度工具，不保证等待网络请求或动画结束。
