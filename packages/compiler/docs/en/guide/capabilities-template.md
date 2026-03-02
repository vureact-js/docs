# Template Capability Matrix

## Directive Support Matrix

| Directive           | Status              | Typical Conversion Behavior                       | Key Limitations                                                   |
| ------------------- | ------------------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| `v-if` / ...        | Supported           | Generates conditional expressions/branch nodes    | `v-else(-if)` must be adjacent to valid branches                  |
| `v-for`             | Supported           | Generates `map` or `Object.entries(...).map(...)` | Source expressions must be analyzable                             |
| `v-on` / `@`        | Supported           | Maps to React event props                         | -                                                                 |
| `v-model`           | Supported           | Generates value binding + React events            | Semantics need validation for different elements/components       |
| `v-show`            | Supported           | Generates style show/hide expressions             | Pay attention to override order when merging with original styles |
| `v-html`            | Supported           | Converts to `dangerouslySetInnerHTML`             | Content security must be guaranteed by the user                   |
| `v-text`            | Supported           | Converts to text node output                      | -                                                                 |
| `v-slot` / `#`      | Partially Supported | Generates `children` or callback slots            | Dynamic slot keys/props may be downgraded                         |
| `v-memo` / `v-once` | Supported           | Generates `useMemo` paths                         | -                                                                 |
| `is` / `:is`        | Supported           | Dynamic components use `Component` adaptation     | Dynamic values must be analyzable                                 |
| `pre`               | Not Supported       | -                                                 | Cannot retrieve this node from the parser                         |

## Component Support Matrix

| Type                        | Status    | Remarks                                                     |
| --------------------------- | --------- | ----------------------------------------------------------- |
| `Transition`                | Supported | Child node structure is validated against rules             |
| `TransitionGroup`           | Supported | Requires key usage (automatically injected by the compiler) |
| `KeepAlive`                 | Supported | Depends on runtime adaptation                               |
| `Teleport`                  | Supported | Depends on runtime adaptation                               |
| `Suspense`                  | Supported | Depends on runtime adaptation                               |
| `Component`                 | Supported | Dynamic component, depends on runtime adaptation            |
| `RouterLink` / `RouterView` | Supported | Takes effect with routing project integration               |

## Alert and Degradation List

1. Unknown directives: Will trigger alerts
2. Unanalyzable Vue `$xxx` runtime variables: Will throw errors
3. Dynamic key and dynamic slot scenarios: May be downgraded to conservative output
4. `Transition` structure not as expected: Will trigger alerts or errors

## Recommended vs High-Risk Syntax

Recommended:

```vue
<button @click="increment">+1</button>
<div v-if="visible">A</div>
<div v-else>B</div>
```

High-Risk:

```vue
<div v-else>orphan else</div>
<slot :[dynamicKey]="value"></slot>
```

## Practical Recommendations

- Prioritize explicit, readable, and analyzable template expressions
- Treat all template alerts as blocking items before release
- For routing-related template issues, check [Routing Adaptation](./router-adaptation) in conjunction
