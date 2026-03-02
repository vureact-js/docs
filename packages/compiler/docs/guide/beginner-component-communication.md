# 组件通信稳态转换

本章目标：展示 `defineProps`、`defineEmits`、默认插槽、作用域插槽的稳态转换路径。

## 1. 子组件输入（Vue）

```vue
<template>
  <article class="card">
    <h3>{{ props.name }}</h3>
    <p>Age: {{ props.age }}</p>

    <button @click="follow">Follow</button>

    <slot>
      <small>default from child</small>
    </slot>

    <slot name="footer" :name="props.name" :count="followCount">
      <small>{{ props.name }} followed {{ followCount }} times</small>
    </slot>
  </article>
</template>

<script setup lang="ts">
// @vr-name: UserCard
import { ref } from 'vue';

const props = defineProps<{ name: string; age: number }>();

const emit = defineEmits<{
  (e: 'follow', payload: { name: string; count: number }): void;
}>();

const followCount = ref(0);

const follow = () => {
  followCount.value += 1;
  emit('follow', { name: props.name, count: followCount.value });
};
</script>
```

## 2. 父组件输入（Vue）

```vue
<template>
  <UserCard :name="user.name" :age="user.age" @follow="onFollow">
    <template #default>
      <small>default from parent</small>
    </template>

    <template #footer="{ name, count }">
      <small>{{ name }} has {{ count }} follows</small>
    </template>
  </UserCard>
</template>
```

## 3. 输出示例（React，简化）

```tsx
interface IUserCardProps {
  name: string;
  age: number;
  onFollow?: (payload: { name: string; count: number }) => void;
  children?: ReactNode;
  footer?: (props: { name: any; count: number }) => React.ReactNode;
}

const UserCard = memo((props: IUserCardProps) => {
  const followCount = useVRef(0);

  const follow = useCallback(() => {
    followCount.value += 1;
    props.onFollow?.({ name: props.name, count: followCount.value });
  }, [props.name, props.onFollow, followCount.value]);

  return (
    <article className="card">
      <h3>{props.name}</h3>
      <p>Age: {props.age}</p>
      <button onClick={follow}>Follow</button>
      {props.children ?? <small>default from child</small>}
      {props.footer?.({ name: props.name, count: followCount.value })}
    </article>
  );
});
```

## 4. 重点观察

1. 自动生成组件类型 `IUserCardProps`（根据本例`宏定义`推导）。
2. `emit('follow')` 映射为 `onFollow?.(...)`。
3. 默认插槽映射为 `children`，且非作用域插槽没有变为 `props.children?.()` 调用。
4. 作用域插槽映射为函数型 props，并自动推导对应简单值 TS 类型（本例 `footer`）。
5. 事件和数据流都保持“父传子、子回调父”的清晰单向路径。

## 下一步

- 查看 [上下文 + 事件 + 插槽链路](./advanced-context-events-slots)
