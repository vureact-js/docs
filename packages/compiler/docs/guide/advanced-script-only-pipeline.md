# 脚本文件处理链路

本章展示 `*.ts/*.js`（非 `.vue`）在 VuReact 中的编译路径。

## 1. 适用场景

1. 写标准 Hooks。
2. 迁移阶段保留一部分脚本工具文件。
3. 先处理组合式 API 与依赖分析，再逐步迁移模板层。
4. 希望统一通过同一套 CLI/缓存体系处理 SFC 与 script。

## 2. 输入示例（test-script.ts）

❌错误用法，直接在任意地方使用将被转换的 API：

```ts
import { computed, reactive, ref, watchEffect } from 'vue';

const count = ref(0);
const state = reactive({ step: 2 });
const double = computed(() => count.value * 2);

const inc = () => {
  count.value += state.step;
};

watchEffect(() => {
  console.log(double.value);
});

export { count, double, inc, state };
```

✅正确用法，在顶层函数内使用：

```ts
function useMyHook() {
  const count = ref(0);
  const state = reactive({ step: 2 });
  const double = computed(() => count.value * 2);

  const inc = () => {
    count.value += state.step;
  };

  watchEffect(() => {
    console.log(double.value);
  });

  return { count, double, inc, state };
}
```

## 3. 输出示例（简化）

```ts
import { useComputed, useReactive, useVRef, useWatchEffect } from '@vureact/runtime-core';

function useMyHook() {
  const count = useVRef(0);
  const state = useReactive({ step: 2 });
  const double = useComputed(() => count.value * 2);

  const inc = useCallback(() => {
    count.value += state.step;
  }, [count.value, state.step]);

  useWatchEffect(() => {
    console.log(double.value);
  }, [double.value]);

  return { count, double, inc, state };
}
```

## 4. 和 SFC 链路的区别

1. script-only 不经过模板和样式处理阶段。
2. 宏（`defineProps/defineEmits/...`）不应在普通脚本文件使用。
3. 仍会执行 API 适配、依赖分析、代码生成和插件钩子。
4. 容易发出编译警告，不在顶层函数内使用 hook。

## 5. 建议

1. 只把“确实是脚本模块”的文件走该链路。
2. 组件文件仍以 SFC 为主，便于模板能力完整发挥。
