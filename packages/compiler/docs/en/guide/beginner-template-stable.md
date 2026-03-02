# Basic Steady-State Template Conversion

## Chapter Objective

Implement the most commonly used template capabilities with a small component and observe a stable "before-and-after compilation comparison".

## 1. Input Example (Vue)

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

## 2. Output Example (React, Simplified)

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

## 3. Key Observations

1. Variables declared with `ref` in the template can be used directly by name; the `.value` suffix is automatically added during the output phase.
2. `v-if/v-else` is converted to conditional expression branches.
3. `v-for` is converted to `map` method.
4. `v-model` is converted to value binding + update callback.
5. The `@click` event is mapped to React's event attribute.

## 4. Applicable Conclusions

This "explicit, analyzable, low-dynamic" template writing style represents the most stable conversion path currently supported by VuReact.

## Next Steps

- See [Steady-State Component Communication Conversion](./beginner-component-communication)
