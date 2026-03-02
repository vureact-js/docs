# Steady-State Transition of Component Communication

## Chapter Objective

Demonstrate the steady-state transition path of `defineProps`, `defineEmits`, default slots, and scoped slots.

## 1. Child Component Input (Vue)

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

## 2. Parent Component Input (Vue)

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

## 3. Output Example (React, Simplified)

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

## 4. Key Observations

1. Automatically generate the component type `IUserCardProps` (derived from macro definitions in this example).
2. `emit('follow')` is mapped to `onFollow?.(...)`.
3. Default slots are mapped to `children`, and non-scoped slots are not converted to `props.children?.()` calls.
4. Scoped slots are mapped to function-type props, with automatic derivation of TS types for corresponding simple values (e.g., `footer` in this example).
5. Both events and data flow maintain a clear unidirectional path of "parent to child, child calls back to parent".

## Next Steps

- See [Context + Events + Slot Link](./advanced-context-events-slots)
