# Capabilities Matrix Overview

This page outlines the current capability boundaries of the experimental version, intended to assess whether a project is compatible with VuReact.

## Evaluation Criteria

- `Supported`: The main path is stable and usable
- `Partially Supported`: Usable, but with constraints, degradation, or requiring additional modifications
- `Not Supported`: Correct conversion cannot be guaranteed currently

## Module-Level Matrix

| Domain         | Status              | Key Considerations                                                                                              |
| -------------- | ------------------- | --------------------------------------------------------------------------------------------------------------- |
| Template       | Supported           | Custom directives are restricted; complex dynamic expressions may trigger alerts or degradation                 |
| Script         | Supported           | Macro/API adaptation is available, but Hook top-level rules are extremely strict                                |
| Style          | Supported           | Single style + scoped/module is usable; multiple style/cssVars are restricted                                   |
| Router-related | Partially Supported | Syntax and APIs are adapted, but project entry and partial route organization still require manual modification |

## Scenario Adaptation Matrix

| Scenario                                      | Adaptability | Recommendation                        |
| --------------------------------------------- | ------------ | ------------------------------------- |
| New project developed per conventions         | High         | Recommended as the preferred approach |
| Progressive migration (module by module)      | Medium       | Pilot first, then scale up            |
| One-time migration of complex legacy projects | Low          | Not recommended as the first choice   |
| Not using `<script setup>`                    | Low          | Recommended to use modern Vue syntax  |
| Vue 2 usage                                   | None         | Not recommended at all                |

## Decision Recommendations

1. First run through the minimal workflow with the [Basic Tutorial](./basic-tutorial)
2. Then review details by module:
   - [Template Capabilities](./capabilities-template)
   - [Script Capabilities](./capabilities-script)
   - [Style Capabilities](./capabilities-style)
3. Be sure to align with the [Compilation Conventions](./specification) before project integration
