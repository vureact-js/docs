# vStyle

`vStyle` 用于把 Vue 风格的 style 输入转换为 React style 对象。

## 说明

Vue 的 style 支持字符串、对象、数组混用；React 需要对象形式。`vStyle` 负责解析、展开和合并。

## 基本使用

```ts
vStyle({ color: 'red', fontSize: '14px' });
// { color: 'red', fontSize: '14px' }

vStyle('display: block; background-color: blue;');
// { display: 'block', backgroundColor: 'blue' }
```

## 数组与嵌套合并

```ts
vStyle([{ color: 'red' }, 'font-size: 12px', [{ display: 'flex' }]]);
// { color: 'red', fontSize: '12px', display: 'flex' }
```

## 多参数合并

后面的输入会覆盖前面的同名属性：

```ts
vStyle({ color: 'red' }, { color: 'blue' }, 'margin-top: 10px');
// { color: 'blue', marginTop: '10px' }
```

## API

```ts
type VStyleItem = string | Record<string, any> | VStyleItem[] | null | undefined;

function vStyle(target: VStyleItem, ...mergeItems: VStyleItem[]): object;
```

## 注意事项

- 字符串样式会被解析为 camelCase key。
- `null/undefined/false` 会被忽略。
- 同名属性遵循“后者覆盖前者”。
