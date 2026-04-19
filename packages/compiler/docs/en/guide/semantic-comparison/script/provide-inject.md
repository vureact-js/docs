# provide & inject Semantic Comparison

How do Vue's `provide` and `inject` APIs transform into React code after VuReact compilation?

## Prerequisites

To avoid redundancy in example code and ensure clear understanding, let's establish two conventions:

1. Vue/React code examples in this document are simplified core logic, omitting full component wrappers and unrelated configurations.
2. Readers are assumed to be familiar with the usage of provide and inject in Vue 3.

## `provide`/`inject` → React `Provider`/`useInject`

`provide` and `inject` are Vue APIs for cross-level component communication, allowing ancestor components to provide data to descendant components regardless of the component hierarchy depth.

- Vue code:

```vue
<!-- Ancestor component -->
<script setup>
import { provide } from 'vue';

const theme = 'dark';
provide('theme', theme);
</script>

<!-- Descendant component -->
<script setup>
import { inject } from 'vue';

const theme = inject('theme');
</script>
```

- VuReact compiled React code:

```tsx
// Ancestor component
import { Provider } from '@vureact/runtime-core';

const theme = 'dark';

<Provider name="theme" value={theme}>
  {/* Child component tree */}
</Provider>;

// Descendant component
import { useInject } from '@vureact/runtime-core';

function ChildComponent() {
  const theme = useInject('theme');
  return <div>Theme: {theme}</div>;
}
```

As shown in the example: Vue's `provide` and `inject` APIs are compiled into the [Provider](https://runtime.vureact.top/en/guide/components/provider.html) **component** and `useInject` **Hook** provided by VuReact Runtime, which can be understood as "Vue provide/inject in React style."

Key characteristics of this compilation approach:

1. **Semantic consistency**: Fully mimics Vue provide/inject behavior for cross-level data passing
2. **Component-based providing**: Data is provided through the `<Provider>` component
3. **Hook-based injection**: Data is retrieved via the `useInject` Hook
4. **Type safety**: Supports TypeScript type inference

## Default Value Injection → React `useInject` Default Value Parameter

When no corresponding Provider exists, default values can be used to avoid getting `undefined`.

- Vue code:

```vue
<script setup>
import { inject } from 'vue';

const config = inject('app-config', {
  apiEndpoint: 'https://fallback.api.com',
  retries: 3,
});
</script>
```

- VuReact compiled React code:

```tsx
const config = useInject('app-config', {
  apiEndpoint: 'https://fallback.api.com',
  retries: 3,
});
```

**Default value rules**:

1. **Priority**: When a Provider exists, the Provider's value takes precedence
2. **Fallback mechanism**: Uses default value when no Provider exists
3. **Type safety**: Default value type must be compatible with injection type
4. **Error prevention**: Avoids runtime errors due to missing Providers

## Factory Function Default Value → React `useInject` Factory Function Parameter

For default values with high creation costs, factory functions can be used, and the factory result can be cached.

- Vue code:

```vue
<script setup>
import { inject } from 'vue';

const timestamp = inject('current-time', () => new Date().toISOString(), true);
</script>
```

- VuReact compiled React code:

```tsx
const timestamp = useInject('current-time', () => new Date().toISOString(), true);
```

**Factory function features**:

1. **Lazy creation**: Creates default value only when needed
2. **Result caching**: Enabled via the third parameter `true`
3. **Performance optimization**: Avoids unnecessary repeated creation
4. **On-demand computation**: Computes default value only when no Provider exists

## `Symbol` Keys → React `Provider`/`useInject` Symbol Support

To avoid key name conflicts, using Symbols as provide/inject keys is recommended.

- Vue code:

```vue
<!-- Define Symbol -->
<script setup>
import { provide, inject } from 'vue';

const ThemeKey = Symbol('theme');

// Provide
provide(ThemeKey, 'dark');

// Inject
const theme = inject(ThemeKey);
</script>
```

- VuReact compiled React code:

```tsx
// Define Symbol
const ThemeKey = Symbol('theme');

// Provide
<Provider name={ThemeKey} value="dark">
  {/* Child component tree */}
</Provider>;

// Inject
const theme = useInject(ThemeKey);
```

**Symbol advantages**:

1. **Uniqueness**: Each Symbol is unique, avoiding key name conflicts
2. **Module safety**: Suitable for cross-module dependency injection
3. **Type safety**: Provides better type checking with TypeScript
4. **Encapsulation**: Hides implementation details for better encapsulation

## Reactive Data Injection → React `Provider` Reactive Values

Vue's provide/inject natively supports reactive data, which VuReact also handles correctly.

- Vue code:

```vue
<script setup>
const count = ref(0);
provide('count', count);
</script>
```

- VuReact compiled React code:

```tsx
import { useVRef, Provider } from '@vureact/runtime-core';

const count = useVRef(0);

<Provider name="count" value={count}>
  {/* Child component tree */}
</Provider>;
```

**Reactive handling**:

1. **Data wrapping**: Wraps reactive data as injectable values
2. **State synchronization**: Ensures injected data remains reactive
3. **Update propagation**: Automatically notifies all injecting components when data changes
4. **Performance optimization**: Intelligently manages dependencies and updates

## Summary

VuReact's provide/inject compilation strategy demonstrates **complete dependency injection transformation capability**:

1. **API transformation**: Converts Vue's `provide()` function calls into `<Provider>` components
2. **Hook adaptation**: Converts Vue's `inject()` function calls into `useInject` Hooks
3. **Key name support**: Supports various key name types including strings, numbers, and Symbols
4. **Default value handling**: Fully supports default values and factory function defaults

Core features:

1. **Cross-level passing**: Enables data passing from ancestor to descendant components
2. **Type safety**: Supports TypeScript type inference and checking
3. **Default value support**: Provides flexible default value mechanisms
4. **Reactive integration**: Seamlessly integrates with VuReact's reactive system

Comparison with React Context:

| Feature               | Vue provide/inject         | React Context                          | VuReact Provider/useInject          |
| --------------------- | -------------------------- | -------------------------------------- | ----------------------------------- |
| **Syntax**            | Function calls             | Context.Provider + useContext          | Provider component + useInject Hook |
| **Keys**              | Strings/Symbols            | Context objects                        | Strings/Numbers/Symbols             |
| **Default values**    | Supported                  | Not supported (must be set in Context) | Supported                           |
| **Factory functions** | Supported                  | Not supported                          | Supported                           |
| **Type safety**       | Manual annotation required | Manual annotation required             | Automatic type inference            |

VuReact's compilation strategy ensures smooth migration from Vue to React, eliminating the need for developers to manually rewrite cross-level communication logic. The compiled code maintains both Vue's dependency injection semantics and flexibility while adhering to React's Hook design patterns, preserving complete cross-component communication capabilities in migrated applications.
