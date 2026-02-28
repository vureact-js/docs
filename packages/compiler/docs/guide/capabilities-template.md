# 模板能力矩阵

## 指令支持矩阵

| 指令                | 状态     | 典型转换行为                                 | 主要限制                        |
| ------------------- | -------- | -------------------------------------------- | ------------------------------- |
| `v-if` / ...        | 支持     | 生成条件表达式/分支节点                      | `v-else(-if)` 必须紧邻有效分支  |
| `v-for`             | 支持     | 生成 `map` 或 `Object.entries(...).map(...)` | 源表达式需可分析                |
| `v-on` / `@`        | 支持     | 映射到 React 事件属性                        | -                               |
| `v-model`           | 支持     | 生成值绑定 + React 事件                      | 不同元素/组件语义需校验         |
| `v-show`            | 支持     | 生成 style 显隐表达式                        | 与原 style 合并时需关注覆盖顺序 |
| `v-html`            | 支持     | 转为 `dangerouslySetInnerHTML`               | 需自行保证内容安全              |
| `v-text`            | 支持     | 转为文本节点输出                             | -                               |
| `v-slot` / `#`      | 部分支持 | 生成 `children` 或回调 slot                  | 动态 slot key/prop 可能降级     |
| `v-memo` / `v-once` | 支持     | 生成 `useMemo` 路径                          | -                               |
| `is` / `:is`        | 支持     | 动态组件走 `Component` 适配                  | 动态值需可分析                  |
| `pre`               | 不支持   | -                                            | 无法从解析器得到该节点          |

## 组件支持矩阵

| 类型                        | 状态 | 备注                                |
| --------------------------- | ---- | ----------------------------------- |
| `Transition`                | 支持 | 子节点结构有规则校验                |
| `TransitionGroup`           | 支持 | 需配合 key 使用，但编译器会自动注入 |
| `KeepAlive`                 | 支持 | 依赖 runtime 适配                   |
| `Teleport`                  | 支持 | 依赖 runtime 适配                   |
| `Suspense`                  | 支持 | 依赖 runtime 适配                   |
| `Component`                 | 支持 | 动态组件，依赖 runtime 适配         |
| `RouterLink` / `RouterView` | 支持 | 与路由工程接入共同生效              |

## 告警与降级清单

1. 未知指令：会告警
2. 出现不可分析的 Vue `$xxx` 运行时变量：会报错
3. 动态键与动态 slot 场景：可能降级为保守输出
4. `Transition` 结构不符合预期：会告警或报错

## 推荐写法 vs 高风险写法

推荐：

```vue
<button @click="increment">+1</button>
<div v-if="visible">A</div>
<div v-else>B</div>
```

高风险：

```vue
<div v-else>orphan else</div>
<slot :[dynamicKey]="value"></slot>
```

## 实操建议

- 优先显式、可读、可分析的模板表达式
- 把所有模板告警当成发布前阻塞项
- 路由相关模板问题联动查看 [路由适配](./router-adaptation)
