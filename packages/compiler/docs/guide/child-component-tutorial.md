# 子组件通信与插槽

本教程用一个最小例子展示 4 件事：

1. `defineProps` 接收父组件数据
2. `defineEmits` 回传子组件事件
3. 默认插槽（`default slot`）内容投影
4. 作用域插槽（`scoped slot`）数据回传

## Step 0：目录结构（示意）

```txt
my-app/
├─ src/
│  ├─ components/
│  │  ├─ UserCard.vue
│  │  └─ ParentDemo.vue
│  ├─ main.ts
│  └─ index.css
└─ vureact.config.js
```

## Step 1：子组件输入（UserCard.vue）

```vue
<template>
  <article class="user-card">
    <h3>{{ myProps.name }}</h3>
    <p>Age: {{ myProps.age }}</p>

    <!-- 点击按钮，通知父组件 -->
    <button @click="notifyFollow">Follow</button>

    <footer>
      <!-- 默认插槽 -->
      <slot></slot>

      <!-- 作用域插槽：把 name/count 回传给父组件 -->
      <slot name="footer" :name="myProps.name" :count="followCount">
        <small>{{ myProps.name }} followed {{ followCount }} times</small>
      </slot>
    </footer>
  </article>
</template>

<script setup lang="ts">
// @vr-name: UserCard
import { ref } from 'vue';

const myProps = defineProps<{
  name: string;
  age: number;
}>();

const emit = defineEmits<{
  (e: 'follow', payload: { name: string; count: number }): void;
}>();

const followCount = ref(0);

const notifyFollow = () => {
  followCount.value += 1;
  // 重点：emit 会映射为 onFollow 回调调用
  emit('follow', { name: myProps.name, count: followCount.value });
};
</script>

<style scoped>
.user-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  display: grid;
  gap: 8px;
}
</style>
```

## Step 2：父组件输入（ParentDemo.vue）

```vue
<template>
  <UserCard :name="user.name" :age="user.age" @follow="onFollow">
    <!-- 默认插槽 -->
    <template #default>
      <small>From parent default slot</small>
    </template>

    <!-- 作用域插槽：直接解构子组件回传字段 -->
    <template #footer="{ name, count }">
      <small>Scoped slot -> {{ name }} has {{ count }} follows</small>
    </template>
  </UserCard>
</template>

<script setup lang="ts">
// @vr-name: ParentDemo
import { reactive } from 'vue';
import UserCard from './UserCard.vue';

const user = reactive({
  name: 'Alice',
  age: 20,
});

const onFollow = (payload: { name: string; count: number }) => {
  console.log('follow:', payload.name, payload.count);
};
</script>
```

## Step 3：编译后对照（简化示意）

### `UserCard.tsx`

```tsx
import { memo, useCallback, type ReactNode } from 'react';
import { useVRef } from '@vureact/runtime-core';

type IUserCardProps = {
  name: string;
  age: number;
  // emit('follow', ...) -> onFollow?.(...)
  onFollow?: (payload: { name: string; count: number }) => void;
  // 默认插槽 -> children
  children?: ReactNode;
  // 作用域插槽 -> 函数型 props
  footer?: (slotProps: { name: any; count: any }) => ReactNode;
};

const UserCard = memo((myProps: IUserCardProps) => {
  const followCount = useVRef(0);

  const notifyFollow = useCallback(() => {
    followCount.value += 1;
    myProps.onFollow?.({ name: myProps.name, count: followCount.value });
  }, [myProps.name, myProps.onFollow, followCount.value]);

  return (
    <article className="user-card">
      <h3>{myProps.name}</h3>
      <p>Age: {myProps.age}</p>
      <button onClick={notifyFollow}>Follow</button>
      <footer>
        {myProps?.children}
        {myProps?.footer({ name: myProps.name, count: followCount.value })}
      </footer>
    </article>
  );
});

export default UserCard;
```

### `ParentDemo.tsx`

```tsx
<UserCard
  name={user.name}
  age={user.age}
  onFollow={onFollow}
  footer={({ name, count }) => <small>Scoped slot -> {name} has {count} follows</small>}
>
  <small>From parent default slot</small>
</UserCard>
```

## Step 4：重点观察

1. `defineProps` 影响组件参数类型与属性访问路径
2. `defineEmits` 的事件名会映射到 `onXxx` 回调
3. 默认插槽映射为 `children`
4. 作用域插槽映射为“函数型 slot props”

## 常见问题

- 作用域插槽参数建议直接解构：`#footer="{ name, count }"`
- 不要写过度动态的 slot 参数结构，保持可分析
- `defineProps / defineEmits` 必须在顶层调用

## 下一步

- 查看 [计数器 + 子组件通信](./counter-child-tutorial)
- 查看 [Template 能力](./capabilities-template)
