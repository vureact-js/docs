# Overview

This section demonstrates how Vue code is compiled into React code by VuReact, and outlines the currently supported APIs and syntax.

> The compiled output is a **pure React application**. It does not rely on the Vue runtime, **nor is it a wrapper approach** that embeds a Vue container within React.

## Why “Semantic Comparison”

- Internal implementations may evolve, and file structures or layering can change
- However, the mapping from **input semantics → output semantics** remains more stable
- For developers, what matters most is: _“If I write it this way, what will it become?”_

## How to Read This Section

1. Start with the Vue input snippet
2. Then review the React output snippet (simplified for clarity)
3. Pay attention to the key notes and constraints provided below each example

> Note: Examples reflect typical outputs. The final result is determined by your local compilation output.

## Three Core Principles

1. **Semantic equivalence**: Preserve original behavior as much as possible
2. **Static analyzability first**: Inputs must be statically analyzable
3. **Follow React rules**: Outputs must comply with Hooks and component constraints

## A Common Detail

In Vue templates, APIs like `ref` and `computed` are typically used without `.value`.
However, in the generated React code, VuReact automatically inserts `.value` access.

This is the default behavior during template expression transformation, ensuring semantic consistency and runtime correctness.

## Capability Matrix

This section defines the current capability boundaries to help you evaluate whether your project is suitable for VuReact.

### Evaluation Criteria

- `Supported`: Stable and works in primary use cases
- `Partially Supported`: Works with constraints, fallbacks, or additional adjustments
- `Not Supported`: Cannot guarantee correct transformation at this time

### Module-Level Matrix

| Area                   | Status      | What You Need to Pay Attention To                                                                                |
| ---------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------- |
| SFC Template           | `Supported` | Custom directives are limited; dynamic attribute name expressions may trigger warnings or degrade                |
| SFC Script             | `Supported` | APIs like `ref` / `watch` / lifecycle hooks are converted to React hooks; top‑level rules are strict             |
| SFC Style              | `Supported` | Multiple `<style>` blocks and `cssVars` functionality are limited                                                |
| Standalone Script File | `Supported` | Top‑level rules are the same as SFC script, but `ref` and other APIs are allowed inside top‑level function scope |
| Standalone Style File  | `Supported` | -                                                                                                                |
| Vue Router             | `Supported` | Syntax, APIs, and TS type interfaces are adapted, allowing a smooth transition from Vue Router usage habits      |

### Scenario Compatibility

| Scenario                                                   | Compatibility | Recommendation                                                                     |
| ---------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------- |
| New or existing projects developed by convention           | `High`        | Recommended as the primary approach                                                |
| Incremental migration (by module)                          | `High`        | Start with pilot modules and expand gradually                                      |
| Developing React apps with Vue, no Vue runtime maintenance | `High`        | Directly use Vue syntax to write React components and integrate with its ecosystem |
| One‑time migration of complex legacy projects              | `Low`         | Not recommended as the first choice                                                |
| Not using `<script setup>`                                 | `Low`         | Recommend using modern Vue syntax                                                  |
| Usage with Vue 2                                           | `None`        | Strongly discouraged                                                               |
