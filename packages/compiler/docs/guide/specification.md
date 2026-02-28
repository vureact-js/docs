# 编译约定

本页是必读规范。若不遵守，编译结果可能不符合 React Hook 规则。

## A. 文件与入口约定

1. 建议只把可控目录纳入 `input`
2. 强烈建议把 Vue 入口（如 `src/main.ts`）加入 `exclude`
3. 先在小目录验证，再扩大范围

## B. Script 约定

1. 优先使用 `<script setup>`
2. `defineProps/defineEmits/defineSlots/defineOptions` 仅允许顶层使用
3. 将被转换为 React Hook 的 `use*` 调用必须位于顶层，禁止在条件、循环、嵌套函数内调用

## C. Template 约定

1. 仅使用已支持指令，未知指令会告警
2. `v-else` / `v-else-if` 必须紧邻前一个条件分支
3. `Transition` 子节点需要满足约束（单节点或可推导条件分支）

## D. Style 约定

1. 仅支持首个 `style` 块，多 `style` 会告警
2. `scoped` 与 `module` 支持，但需按规范使用
3. 避免依赖复杂全局样式副作用

## E. 路由约定

1. 使用路由时需做小幅手动接入改造
2. 参见 [路由适配](./router-adaptation)

## F. 实验版声明

当前版本目标是可控工程，不承诺复杂旧项目一次性无改动迁移。
