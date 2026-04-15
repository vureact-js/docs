# Conversion Overview

This chapter mainly explains:

**What React syntax the Vue syntax will be compiled into under VuReact.**

## Why "Semantic Comparison"

- The internal implementation will evolve, and file paths and layering may change
- However, the rules of "input semantics -> output semantics" are more stable
- For business developers, the most important thing is "what I write will eventually become what"

## How to Read This Chapter

1. First, look at the Vue input snippet
2. Then, look at the React output snippet (simplified illustration)
3. Pay attention to the key explanations and constraints below each group

> Note: The examples are typical outputs, and the final code is subject to the local compiled product.

## Three Core Evaluation Criteria

1. Semantic equivalence as much as possible: Maintain the original business behavior as much as possible
2. Analyzability first: Inputs must be statically analyzable
3. Adherence to React rules: Outputs must comply with Hook and component constraints

## A Frequently Noticed Detail

When using `ref` / `computed` in Vue templates, `.value` is usually not written, but in the generated React code, VuReact will automatically add `.value` for access. This is the default behavior in template expression conversion, used to maintain semantic consistency and ensure the output is runnable.

## Capability Matrix

This chapter also provides the current capability boundaries of VuReact to help you evaluate whether your project is a good fit.

### Evaluation Criteria

- `Supported`: Stable on the main path
- `Partially Supported`: Usable, but with constraints, degradation, or extra adaptation
- `Not Supported`: Currently cannot guarantee correct conversion

### Module-Level Matrix

| Area       | Status      | What to Watch                                                                                     |
| ---------- | ----------- | ------------------------------------------------------------------------------------------------- |
| Template   | `Supported` | Custom directives are limited; dynamic attribute name expressions may warn or degrade             |
| Script     | `Supported` | APIs such as `ref` / `watch` / lifecycle are converted to React hooks; top-level rules are strict |
| Style      | `Supported` | Single style block + scoped/module are supported; multi-style and cssVars are limited             |
| Vue Router | `Supported` | Syntax and API adaptation are supported                                                           |

### Scenario Adaptation Matrix

| Scenario                           | Fit    | Recommendation                                  |
| ---------------------------------- | ------ | ----------------------------------------------- |
| New projects written by convention | `High` | Recommended as first choice                     |
| Progressive migration by module    | `High` | Start with a pilot and expand along conventions |
| Complex legacy one-time migration  | `Low`  | Not recommended as the first option             |
| Non-`<script setup>` code          | `Low`  | Prefer modern Vue syntax                        |
| Vue 2 projects                     | `None` | Strongly not recommended                        |

### Decision Suggestions

1. Start with [the basic tutorial](./basic-tutorial) to verify the smallest working path.
2. Then review details by area:
   - [Script comparison](./conversion-script)
   - [Template comparison](./conversion-template)
   - [Style comparison](./conversion-style)
3. Before adoption, be sure to read [Compilation Conventions](./specification).
