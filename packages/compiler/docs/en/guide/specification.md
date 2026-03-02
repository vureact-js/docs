# Compilation Conventions

This page contains mandatory specifications. Non-compliance may result in compilation outputs that violate React Hook rules.

## A. File and Entry Conventions

1. It is recommended to include only controllable directories in `input`.
2. It is strongly recommended to add Vue entry files (e.g., `src/main.ts`) to `exclude`.
3. Validate with small directories first, then expand the scope.

## B. Script Conventions

1. Prioritize the use of `<script setup>`.
2. `defineProps/defineEmits/defineSlots/defineOptions` are only allowed to be used at the top level.
3. `use*` calls that will be converted to React Hooks must be placed at the top level; calling them inside conditions, loops, or nested functions is prohibited.

## C. Template Conventions

1. Only use supported directives; unknown directives will trigger warnings.
2. `v-else` / `v-else-if` must immediately follow the previous conditional branch.
3. Child nodes of `Transition` need to meet constraints (single node or derivable conditional branches).

## D. Style Conventions

1. Only the first `style` block is supported; multiple `style` blocks will trigger warnings.
2. `scoped` and `module` are supported but must be used in accordance with specifications.
3. Avoid relying on complex global style side effects.

## E. Routing Conventions

1. Minor manual adaptation is required when using routing.
2. See [Router Adaptation](./router-adaptation).

## F. Experimental Version Notice

The current version is intended for controllable projects and does not guarantee one-time, non-intrusive migration of complex legacy projects.
