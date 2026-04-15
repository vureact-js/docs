# 模板基础稳态转换

本章目标：用一个小组件把最常用的模板能力跑通，并看到稳定的“编译前后对照”。

## 1. 输入示例（Vue）

```vue
<template>
  <section>
    <h2>{{ title }}</h2>

    <p v-if="items.length === 0">No data</p>
    <ul v-else>
      <li v-for="item in items" :key="item.id">{{ item.name }}</li>
    </ul>

    <input v-model="keyword" placeholder="keyword" />
    <button @click="count++">count: {{ count }}</button>
  </section>
</template>

<script setup lang="ts">
// @vr-name: TemplateStableDemo
import { ref } from 'vue';

const title = ref('Template Stable Demo');
const count = ref(0);
const keyword = ref('');
const items = ref([
  { id: 1, name: 'A' },
  { id: 2, name: 'B' },
]);

const onInput = () => {
  console.log(keyword.value);
};
</script>
```

## 2. 输出示例（React，简化）

```tsx
const TemplateStableDemo = memo(() => {
  const title = useVRef('Template Stable Demo');
  const count = useVRef(0);
  const keyword = useVRef('');
  const items = useVRef([
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
  ]);

  const onInput = useCallback(() => {
    console.log(keyword.value);
  }, [keyword.value]);

  return (
    <section>
      <h2>{title.value}</h2>

      {items.value.length === 0 ? (
        <p>No data</p>
      ) : (
        <ul>
          {items.value.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}

      <input
        value={keyword.value}
        onInput={(e) => {
          keyword.value = e.target.value;
        }}
        placeholder="keyword"
      />

      <button onClick={() => count.value++}>count: {count.value}</button>
    </section>
  );
});
```

## 3. 重点观察

1. 模板中 `ref` 可直接使用变量名，输出阶段会自动补 `.value`。
2. `v-if/v-else` 转为条件表达式分支。
3. `v-for` 转为 `map`。
4. `v-model` 转为值绑定 + 更新回调。
5. 事件 `@click` 映射到 React 事件属性。

## 4. 适用结论

这类“显式、可分析、低动态”的模板写法，属于 VuReact 当前最稳定的转换路径。
