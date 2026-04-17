# TS Type Declaration Static Hoisting

What do `top-level TS type declarations` in Vue become after being hoisted by VuReact into React code?

## Prerequisites

To avoid misunderstandings caused by redundant example code, let's first clarify two conventions:

1. The Vue/React code in this document is simplified core logic, omitting complete component wrappers, irrelevant configurations, etc.;
2. It is assumed that readers are already familiar with TypeScript.

## Top-level TS Type Declarations → Static Hoisting Outside React Component

In Vue, top-level type declarations (such as `interface`, `type`, `enum`, etc.) in `<script setup>` are pure TypeScript constructs that do not generate any runtime code. During compilation, VuReact performs static analysis: these top-level type declarations are completely hoisted outside the generated React component, maintaining their module-level type scope, ensuring consistency of the type system, while avoiding any impact on component runtime logic.

- Vue code:

```vue
<script setup lang="ts">
export interface ExampleInterface { ... }

enum ExampleEnum { ... }

function func() {
  type ExampleType = { ... };
}
</script>
```

- React code after VuReact compilation:

```tsx
export interface ExampleInterface { ... }

enum ExampleEnum { ... }

const Example = memo(() => {
  function func() {
    type ExampleType = { ... };
  }

  return <></>;
});
```

From the example, we can see: top-level **type declarations** are hoisted and preserved outside the component, continuing to serve as module-level type declarations for React; while **types** declared inside functions remain within the function scope and are not incorrectly hoisted (this applies to any non-top-level declarations).

This approach allows VuReact to preserve TS type semantics while avoiding unnecessary changes to the runtime structure.
