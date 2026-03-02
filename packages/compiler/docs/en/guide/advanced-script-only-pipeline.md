# Script-Only Pipeline (Non-SFC)

This chapter illustrates the compilation pipeline for `*.ts/*.js` files (non-`.vue`) in VuReact.

## 1. Applicable Scenarios

1. Writing standard Hooks.
2. Retaining partial script utility files during the migration phase.
3. First handling Composition API and dependency analysis, then gradually migrating the template layer.
4. Expecting to uniformly process SFCs and scripts through the same CLI/caching system.

## 2. Input Example (test-script.ts)

❌ Incorrect usage: Using transformable APIs directly anywhere:

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

✅ Correct usage: Using APIs inside top-level functions:

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

## 4. Differences from the SFC Pipeline

1. Script-only files skip the template and style processing phases.
2. Macros (`defineProps/defineEmits/...`) should not be used in regular script files.
3. API adaptation, dependency analysis, code generation, and plugin hooks are still executed.
4. Compilation warnings are likely to be emitted if Hooks are used outside top-level functions.

## 5. Recommendations

1. Only route "genuinely script module" files through this pipeline.
2. Component files should still primarily use SFCs to fully leverage template capabilities.
