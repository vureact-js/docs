# 脚本能力矩阵

## 宏能力

| 宏              | 状态     | 说明                                                   |
| --------------- | -------- | ------------------------------------------------------ |
| `defineProps`   | 支持     | 支持运行时声明与 TS 类型提取                           |
| `defineEmits`   | 支持     | 支持事件签名提取与调用转换                             |
| `defineSlots`   | 支持     | 支持 slot 类型提取                                     |
| `defineExpose`  | 支持     | 支持转为 `useImperativeHandle` + `forwardRef` 包装组件 |
| `defineOptions` | 部分支持 | 主要处理可分析字段（如 `name`）                        |

## API 适配能力（完整列表）

### 响应式状态 API

| Vue API           | 适配目标             | 类别     | 说明                           |
| ----------------- | -------------------- | -------- | ------------------------------ |
| `ref`             | `useVRef`            | 有副作用 | 创建响应式引用                 |
| `reactive`        | `useReactive`        | 有副作用 | 创建响应式对象                 |
| `computed`        | `useComputed`        | 有副作用 | 创建计算属性                   |
| `readonly`        | `useReadonly`        | 有副作用 | 创建只读响应式对象             |
| `shallowRef`      | `useShallowRef`      | 有副作用 | 创建浅层响应式引用             |
| `shallowReactive` | `useShallowReactive` | 有副作用 | 创建浅层响应式对象             |
| `shallowReadonly` | `useShallowReadonly` | 有副作用 | 创建浅层只读响应式对象         |
| `toRef`           | `useToVRef`          | 有副作用 | 将响应式对象的属性转为 ref     |
| `toRefs`          | `useToVRefs`         | 有副作用 | 将响应式对象的所有属性转为 ref |
| `toRaw`           | `useToRaw`           | 有副作用 | 获取响应式对象的原始对象       |
| `isRef`           | `isRef`              | 纯函数   | 检查是否为 ref                 |
| `isProxy`         | `isProxy`            | 纯函数   | 检查是否为 proxy               |
| `isReactive`      | `isReactive`         | 纯函数   | 检查是否为 reactive 对象       |

### 生命周期 API

| Vue API           | 适配目标           | 类别   | 说明                     |
| ----------------- | ------------------ | ------ | ------------------------ |
| `onMounted`       | `useMounted`       | 纯函数 | 组件挂载后执行           |
| `onUnmounted`     | `useUnmounted`     | 纯函数 | 组件卸载后执行           |
| `onBeforeMount`   | `useBeforeMount`   | 纯函数 | 组件挂载前执行           |
| `onBeforeUnmount` | `useBeforeUnMount` | 纯函数 | 组件卸载前执行           |
| `onBeforeUpdate`  | `useBeforeUpdate`  | 纯函数 | 组件更新前执行           |
| `onUpdated`       | `useUpdated`       | 纯函数 | 组件更新后执行           |
| `useActived`      | `useActived`       | 纯函数 | KeepAlive 组件激活时执行 |
| `useDeactivated`  | `useDeactivated`   | 纯函数 | KeepAlive 组件停用时执行 |

### 侦听器 API

| Vue API           | 适配目标             | 类别     | 说明                      |
| ----------------- | -------------------- | -------- | ------------------------- |
| `watch`           | `useWatch`           | 有副作用 | 侦听响应式数据源变化      |
| `watchEffect`     | `useWatchEffect`     | 纯函数   | 自动追踪依赖的侦听器      |
| `watchPostEffect` | `useWatchPostEffect` | 纯函数   | 在 DOM 更新后执行的侦听器 |
| `watchSyncEffect` | `useWatchSyncEffect` | 纯函数   | 同步执行的侦听器          |

### 依赖注入 API

| Vue API   | 适配目标    | 类别       | 说明           |
| --------- | ----------- | ---------- | -------------- |
| `provide` | `Provider`  | 上下文组件 | 提供依赖注入值 |
| `inject`  | `useInject` | 有副作用   | 注入依赖值     |

### 模板引用 API

| Vue API          | 适配目标 | 类别   | 说明                            |
| ---------------- | -------- | ------ | ------------------------------- |
| `useTemplateRef` | `useRef` | 纯函数 | 模板引用（转换为 React useRef） |

### 路由相关 API

| Vue Router 风格 API   | 适配目标               | 类别     | 说明             |
| --------------------- | ---------------------- | -------- | ---------------- |
| `useRoute`            | `useRoute`             | 有副作用 | 访问当前路由信息 |
| `useRouter`           | `useRouter`            | 有副作用 | 访问路由器实例   |
| `useLink`             | `useLink`              | 有副作用 | 自定义路由链接   |
| `onBeforeRouteLeave`  | `useBeforeRouteLeave`  | 纯函数   | 路由离开前守卫   |
| `onBeforeRouteUpdate` | `useBeforeRouteUpdate` | 纯函数   | 路由更新前守卫   |
| `onBeforeRouteEnter`  | `useBeforeRouteEnter`  | 纯函数   | 路由进入前守卫   |
| `createRouter`        | `createRouter`         | 纯函数   | 创建路由器实例   |

### 工具函数 API

| Vue API    | 适配目标   | 类别   | 说明                                                   |
| ---------- | ---------- | ------ | ------------------------------------------------------ |
| `nextTick` | `nextTick` | 纯函数 | 下一次 DOM 更新后执行                                  |
| `dir`      | -          | 纯函数 | 处理部分编译时难以处理的模板指令属性值，如 `v-bind` 等 |

## 关键转换行为

1. `emit('change', payload)` 会转换为 `props.onChange(payload)`
2. 顶层箭头函数如内部拥有可追踪状态的，会自动补充 `useCallback` 与依赖数组
3. `defineAsyncComponent` 会走 `React.lazy` 路径
4. `watchEffect` 系列 API 会自动分析依赖并添加依赖数组参数
5. 生命周期钩子会自动转换为对应的 React Hook 形式

## 强约束（必须）

1. 宏只能在 SFC 顶层定义
2. 将被转为 Hook 的 `use*` API （如 `ref`/`watchEffect` 等）只能在顶层或顶层函数调用
3. `defineAsyncComponent` 仅支持 ESM `import('...')` 形式

## 部分支持与风险

| 场景                   | 状态     | 风险                                |
| ---------------------- | -------- | ----------------------------------- |
| 传统 `script`          | 部分支持 | 可编译但稳定性低于 `<script setup>` |
| 复杂动态表达式         | 部分支持 | 可能告警、移除或降级                |
| 不可分析依赖链         | 部分支持 | 依赖注入可能不符合预期              |
| 不属于编译器处理的代码 | 部分支持 | 未知的 API 等会原样带到 React 中    |

## 推荐实践

- 使用 `<script setup lang="ts">`
- 在评审中强制检查 Hook 顶层规则
- 将编译告警纳入 CI 失败条件
- 对于复杂响应式逻辑，优先使用 `useReactive` 而非多个 `ref`
- 不使用在编译器识别范围之外的其他 Vue API 或相关库，万不得已可以临时写 React 平台的代码
