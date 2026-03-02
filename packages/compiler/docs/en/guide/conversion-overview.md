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

When using `ref` in Vue templates, `.value` is usually not written, but in the generated React code, VuReact will automatically add `.value` for access. This is the default behavior in template expression conversion, used to maintain semantic consistency and ensure the output is runnable.

## Recommended Reading Order

1. [Script Comparison](./conversion-script)
2. [Template Comparison](./conversion-template)
3. [Compilation Conventions](./specification)
