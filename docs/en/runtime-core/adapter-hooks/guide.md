# React Vue3 Hooks

## Introduction

A carefully crafted **Vue 3 lifecycle and Hook API adaptation toolkit** specifically for the **React ecosystem**.

Our core goal is to **maximally and highly replicate the core functionalities and usage paradigms of Vue Composition API** within React's functional component environment, providing a **Hook-level** solution for cross-framework design, team knowledge migration, and component refactoring.

With this toolkit, you can:

* **Seamlessly migrate mental models**: Easily bring Vue's intuitive reactive thinking and lifecycle management into React projects.
* **Unify development experience**: Provide consistent logic organization and side-effect management specifications for teams maintaining both Vue and React technology stacks.
* **Simplify logic refactoring**: Gain more powerful and focused control than pure `useEffect` and others in scenarios with complex component logic that require fine-grained control over side effects.

## Core Features

The Hooks provided by this library are committed to matching the corresponding Vue 3 APIs in terms of functionality and semantics.

| Hook Name | Corresponding Vue 3 API | Core Function |
| :--- | :--- | :--- |
| **`useWatch`** | `watch` | **Data monitoring and side effects.** Precisely control the side effects executed when dependencies change, supporting `immediate`, `deep` deep monitoring, and returning a `stop` function to stop. |
| **`useWatchEffect`** | `watchEffect` | **Automatic dependency tracking.** Automatically track reactive dependencies used in the callback function and re-execute when dependencies change. |
| **`useState$`** | `ref` or `reactive` | **Enhanced reactive state.** Intelligently distinguish between simple values (`useState`) and complex objects (`useImmer`, supporting draft modification), providing Vue-style convenient state management. |
| **`useReadonly`** | `readonly` | **Create read-only state.** Deeply freeze objects to ensure state immutability, used to pass unmodifiable data to child components and ensure component purity. |
| **`useMounted`** | `onMounted` | **Execute when the component is mounted.** Precisely replace the mounting phase of `useEffect` with clearer semantics. |
| **`useUnmounted`** | `onUnmounted` | **Execute when the component is unmounted.** Precisely replace the unmounting phase of `useEffect` with clearer semantics. |
| **`useUpdated`** | `onUpdated` | **Execute when the component is updated.** Ignore the first mount and only trigger side effects during subsequent component updates. |

## Usage Paradigms and Advantages

### 1. Fine-grained side-effect control (`useWatch`)

Say goodbye to complex `useEffect` dependency arrays. `useWatch` provides more powerful logic separation capabilities.

* **Precise monitoring**: Trigger only when specific data sources change, avoiding unnecessary execution of side effects.
* **Stop/start**: Use the returned `stop` function to pause or resume monitoring at any time, which is difficult to achieve directly with `useEffect`.

```tsx
// Execute only when userId changes, ignoring data changes
const stopWatch = useWatch(
  () => userId, 
  (newId, oldId) => {
    console.log(`User ID changed: ${oldId} -> ${newId}`);
    // Asynchronous operation: fetch data based on the new ID
  }, 
  { immediate: true }
);

// ... You can call stopWatch() when needed
```

### 2. Concise state modification (`useState$`)

`useState$` combines the advantages of `useState` and `useImmer`, making complex state modification as simple as operating ordinary JavaScript objects.

```tsx
const [user, setUser] = useState$({ 
  name: 'Alice', 
  posts: [{ title: 'Post 1' }] 
});

// No need to manually spread objects; modify directly on the Draft
setUser(draft => {
  draft.posts.push({ title: `New Post ${draft.posts.length + 1}` });
  draft.name = 'Bob'; // Multiple modifications completed at once
});
```

## Limitation Notes

It should be objectively stated that due to the inherent differences in underlying design philosophies and rendering mechanisms between **React** and **Vue**, although this library tries to be as close as possible to the Vue 3 experience through refined adaptation, there may still be slight behavioral differences or limitations in some edge cases.