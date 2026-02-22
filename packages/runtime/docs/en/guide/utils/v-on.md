# vOn

`vOn` is used to convert Vue-style event descriptions (including modifiers) into event handler functions that can be bound in React.

## Description

Syntax such as `click.stop.prevent`, `keydown.enter` in Vue templates cannot be used directly in React. `vOn` converts them into standard handler functions at runtime.

## Basic Usage

```ts
const onClick = vOn('click', handler);

<button onClick={onClick} />
```

If `true` is passed as the third parameter, an event object form will be returned:

```ts
const eventProps = vOn('click', handler, true);
// { onClick: fn }
```

## Modifier Support

The following modifiers are supported at runtime:

- Flow modifiers: `stop`, `prevent`, `self`, `once`
- Mouse buttons: `left`, `middle`, `right`
- Keyboard keys: `enter`, `esc`, `space`, `tab`, `delete`, `up`, `down`, `left`, `right`
- Capture: `capture` (reflected in event name conversion)

Examples:

```ts
vOn('click.stop.prevent', handler);
vOn('click.once', handler);
vOn('keydown.enter', handler);
vOn('click.capture', handler, true); // => { onClickCapture: fn }
```

## Execution Order

Execution is divided into two steps:

1. First perform condition checks (e.g., `self`, mouse buttons, keyboard keys)
2. After the check passes, execute action modifiers (`stop`, `prevent`, `once`) and call the original handler

## API

```ts
function vOn<E = any>(event: string, handler: any): (...args: any[]) => E;

function vOn<E = any>(
  event: string,
  handler: any,
  fullEventObj?: boolean,
): Record<string, (...args: any[]) => E>;
```

## Notes

- When `handler` is not a function, it will be wrapped into a constant return function.
- The `.once` state is independent within each `vOn` call instance.
- When using keyboard modifiers, bind to the corresponding keyboard events (e.g., `keydown`/`keyup`).
