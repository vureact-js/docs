# Script Capability Matrix

## Macro Capabilities

| Macro           | Status              | Description                                             |
| --------------- | ------------------- | ------------------------------------------------------- |
| `defineProps`   | Supported           | Supports runtime declaration and TS type extraction     |
| `defineEmits`   | Supported           | Supports event signature extraction and call conversion |
| `defineSlots`   | Supported           | Supports slot type extraction                           |
| `defineOptions` | Partially Supported | Mainly processes analyzable fields (e.g., `name`)       |

## API Adaptation Capabilities (Complete List)

### Reactive State API

| Vue API           | Adaptation Target    | Category      | Description                                          |
| ----------------- | -------------------- | ------------- | ---------------------------------------------------- |
| `ref`             | `useVRef`            | Side Effect   | Creates a reactive reference                         |
| `reactive`        | `useReactive`        | Side Effect   | Creates a reactive object                            |
| `computed`        | `useComputed`        | Side Effect   | Creates a computed property                          |
| `readonly`        | `useReadonly`        | Side Effect   | Creates a readonly reactive object                   |
| `shallowRef`      | `useShallowRef`      | Side Effect   | Creates a shallow reactive reference                 |
| `shallowReactive` | `useShallowReactive` | Side Effect   | Creates a shallow reactive object                    |
| `shallowReadonly` | `useShallowReadonly` | Side Effect   | Creates a shallow readonly reactive object           |
| `toRef`           | `useToVRef`          | Side Effect   | Converts a reactive object's property to a ref       |
| `toRefs`          | `useToVRefs`         | Side Effect   | Converts all properties of a reactive object to refs |
| `toRaw`           | `useToRaw`           | Side Effect   | Gets the raw object of a reactive object             |
| `isRef`           | `isRef`              | Pure Function | Checks if a value is a ref                           |
| `isProxy`         | `isProxy`            | Pure Function | Checks if a value is a proxy                         |
| `isReactive`      | `isReactive`         | Pure Function | Checks if a value is a reactive object               |

### Lifecycle API

| Vue API           | Adaptation Target  | Category      | Description                                      |
| ----------------- | ------------------ | ------------- | ------------------------------------------------ |
| `onMounted`       | `useMounted`       | Pure Function | Executed after component mounting                |
| `onUnmounted`     | `useUnmounted`     | Pure Function | Executed after component unmounting              |
| `onBeforeMount`   | `useBeforeMount`   | Pure Function | Executed before component mounting               |
| `onBeforeUnmount` | `useBeforeUnMount` | Pure Function | Executed before component unmounting             |
| `onBeforeUpdate`  | `useBeforeUpdate`  | Pure Function | Executed before component update                 |
| `onUpdated`       | `useUpdated`       | Pure Function | Executed after component update                  |
| `useActived`      | `useActived`       | Pure Function | Executed when KeepAlive component is activated   |
| `useDeactivated`  | `useDeactivated`   | Pure Function | Executed when KeepAlive component is deactivated |

### Watcher API

| Vue API           | Adaptation Target    | Category      | Description                                  |
| ----------------- | -------------------- | ------------- | -------------------------------------------- |
| `watch`           | `useWatch`           | Side Effect   | Watches for changes in reactive data sources |
| `watchEffect`     | `useWatchEffect`     | Pure Function | Auto-tracking reactive watcher               |
| `watchPostEffect` | `useWatchPostEffect` | Pure Function | Watcher executed after DOM update            |
| `watchSyncEffect` | `useWatchSyncEffect` | Pure Function | Synchronously executed watcher               |

### Dependency Injection API

| Vue API   | Adaptation Target | Category          | Description                              |
| --------- | ----------------- | ----------------- | ---------------------------------------- |
| `provide` | `Provider`        | Context Component | Provides values for dependency injection |
| `inject`  | `useInject`       | Side Effect       | Injects values from dependency injection |

### Template Ref API

| Vue API          | Adaptation Target | Category      | Description                              |
| ---------------- | ----------------- | ------------- | ---------------------------------------- |
| `useTemplateRef` | `useRef`          | Pure Function | Template ref (converted to React useRef) |

### Injected Attribute API

| Vue API    | Target       | Type         | Description                                                  |
| ---------- | ------------ | ------------ | ------------------------------------------------------------ |
| `useAttrs` | Compile-time | Pure JS code | Pass-through attributes (converted to React props reference) |

### Routing-related API

| Vue Router-style API  | Adaptation Target      | Category      | Description                           |
| --------------------- | ---------------------- | ------------- | ------------------------------------- |
| `useRoute`            | `useRoute`             | Side Effect   | Accesses current route information    |
| `useRouter`           | `useRouter`            | Side Effect   | Accesses router instance              |
| `useLink`             | `useLink`              | Side Effect   | Custom routing link                   |
| `onBeforeRouteLeave`  | `useBeforeRouteLeave`  | Pure Function | Route guard before leaving the route  |
| `onBeforeRouteUpdate` | `useBeforeRouteUpdate` | Pure Function | Route guard before updating the route |
| `onBeforeRouteEnter`  | `useBeforeRouteEnter`  | Pure Function | Route guard before entering the route |
| `createRouter`        | `createRouter`         | Pure Function | Creates router instance               |

### Utility Function API

| Vue API    | Adaptation Target | Category      | Description                              |
| ---------- | ----------------- | ------------- | ---------------------------------------- |
| `nextTick` | `nextTick`        | Pure Function | Executed after the next DOM update cycle |

## Key Conversion Behaviors

1. `emit('change', payload)` will be converted to `props.onChange(payload)`
2. Top-level arrow functions with trackable internal state will automatically have `useCallback` and dependency arrays added
3. `defineAsyncComponent` will use the `React.lazy` path
4. The `watchEffect` series of APIs will automatically analyze dependencies and add dependency array parameters
5. Lifecycle hooks will be automatically converted to corresponding React Hook forms

## Hard Constraints (Mandatory)

1. Macros can only be defined at the top level of SFCs
2. `use*` APIs converted to Hooks (e.g., `ref`/`watchEffect`, etc.) can only be called at the top level or in top-level functions
3. `defineAsyncComponent` only supports ESM `import('...')` syntax

## Partial Support and Risks

| Scenario                           | Status              | Risk                                                    |
| ---------------------------------- | ------------------- | ------------------------------------------------------- |
| Traditional `script`               | Partially Supported | Compilable but less stable than `<script setup>`        |
| Complex dynamic expressions        | Partially Supported | May trigger warnings, removal, or degradation           |
| Unanalyzable dependency chains     | Partially Supported | Dependency injection may not behave as expected         |
| Code not processed by the compiler | Partially Supported | Unknown APIs, etc., will be carried over to React as-is |

## Recommended Practices

- Use `<script setup lang="ts">`
- Enforce checks for Hook top-level rules in code reviews
- Include compilation warnings as CI failure conditions
- For complex reactive logic, prioritize `useReactive` over multiple `ref`s
- Avoid using other Vue APIs or related libraries outside the compiler's recognition scope; if absolutely necessary, temporarily write React platform code
