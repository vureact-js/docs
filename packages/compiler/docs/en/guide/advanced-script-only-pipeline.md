# Script File Processing Pipeline

This chapter demonstrates the compilation path of `*.ts/*.js` (non-`.vue`) files in VuReact.

## 1. Applicable Scenarios

1. Writing standard Hooks.
2. Retaining some script utility files during the migration phase.
3. Processing Composition API and dependency analysis first, then gradually migrating the template layer.
4. Expecting to handle SFC and script uniformly through the same set of CLI/cache system.

## 2. Input Example (test-script.ts)

❌ Incorrect usage: Using APIs to be transformed anywhere directly:

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

✅ Correct usage: Using them within top-level functions:

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

## 3. Output Example (Simplified)

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

## 4. Differences from SFC Pipeline

1. Script-only files do not go through the template and style processing stages.
2. Macros (`defineProps/defineEmits/...`) should not be used in ordinary script files.
3. API adaptation, dependency analysis, code generation and plugin hooks are still executed.
4. Compilation warnings are prone to be emitted if hooks are used outside of top-level functions.

## 5. Recommendations

1. Only route files that are "indeed script modules" through this pipeline.
2. Component files should still be mainly based on SFC to facilitate the full exertion of template capabilities.
