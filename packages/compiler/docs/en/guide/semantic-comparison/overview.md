# Overview

This section demonstrates how Vue code is compiled into React code by VuReact, and outlines the currently supported APIs and syntax.

## Why “Semantic Mapping”

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

| Area                      | Status      | What You Should Pay Attention To                                                           |
| ------------------------- | ----------- | ------------------------------------------------------------------------------------------ |
| Templates                 | `Supported` | Custom directives are limited; dynamic prop names may warn or degrade                      |
| Script / Standalone Files | `Supported` | APIs like `ref`, `watch`, lifecycle, etc. map to React Hooks; strict top-level rules apply |
| Style / Standalone Files  | `Supported` | Single `<style>` with scoped/module works; multiple styles/cssVars are limited             |
| Vue Router                | `Supported` | Syntax and APIs are adapted                                                                |

### Scenario Compatibility

| Scenario                                      | Compatibility | Recommendation                           |
| --------------------------------------------- | ------------- | ---------------------------------------- |
| Convention-driven new or modern projects      | `High`        | Recommended as a primary approach        |
| Incremental migration (module-by-module)      | `High`        | Start with a pilot, then scale gradually |
| One-shot migration of complex legacy projects | `Low`         | Not recommended as the first option      |
| Not using `<script setup>`                    | `Low`         | Use modern Vue syntax                    |
| Vue 2 usage                                   | `None`        | Strongly not recommended                 |
