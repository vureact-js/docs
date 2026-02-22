# nextTick

This is an adapted implementation of Vue's `nextTick`, designed to defer logic execution until after the completion of the current synchronous tasks.

## Description

After a state update or a block of synchronous logic, you may need to read data or execute side effects in the "next tick". `nextTick` provides a unified Promise-based entry point for this purpose.

## Basic Usage

```ts
await nextTick();
// At this point, the current synchronous logic has completed and the nextTick queue has been executed
```

```ts
const result = await nextTick(() => {
  return 42;
});

// result === 42
```

## `this` Binding

`nextTick` supports preserving the `this` context of the call site:

```ts
const ctx = { id: 'ctx-1' };

await nextTick.call(ctx, function () {
  console.log(this.id); // ctx-1
});
```

## Scheduling Strategy

Internally, it selects the asynchronous scheduling method in the following order of priority:

1. `Promise.resolve().then(...)`
2. `requestAnimationFrame(...)`
3. `MutationObserver`
4. `setTimeout(..., 0)`

## API

```ts
function nextTick<T, R>(this: T, fn?: (this: T) => R | Promise<R>): Promise<R>;
```

## Notes

- When no callback is passed, `nextTick()` still returns a Promise and can be directly `await`ed.
- The return value of the callback will be used as the resolved value of the Promise.
- This method is a scheduling utility and does **not** guarantee waiting for network requests or animations to finish.
