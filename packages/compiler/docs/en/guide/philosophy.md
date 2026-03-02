# Philosophy

VuReact's design adheres to a set of core principles that define its behavioral boundaries and engineering orientation. Understanding these principles will help you use VuReact more effectively and make sound technical decisions in your projects.

## 1. Controllability Over Coverage

**Core Principle**: It is better to explicitly reject unanalyzable code than to generate unmaintainable React output.

### What This Means

- VuReact proactively requires your code to comply with specific conventions
- When encountering code that cannot be statically analyzed, it will issue clear warnings or errors
- Conversion quality takes precedence over conversion coverage

### Why This Design Choice?

React Hook rules mandate that code must meet strict static analysis criteria. If the input code itself is unanalyzable, no conversion tool can stably generate React code that complies with the rules. Rather than producing code that may crash at runtime, it is better to clearly define boundaries at compile time.

## 2. Enabling Modern Cross-Framework Web Development

**Vision**: To make migration between Vue and React no longer a "one-time rewrite", but a plannable and verifiable engineering process.

### Traditional Migration vs. VuReact Approach

| Dimension                  | Traditional Migration Approach                        | VuReact Approach                                             |
| -------------------------- | ----------------------------------------------------- | ------------------------------------------------------------ |
| **Conversion Strategy**    | String-replacement-based scripts                      | Complete compilation pipeline (Parse → Transform → Generate) |
| **Predictability**         | Unpredictable results, reliant on manual verification | Deterministic conversion based on conventions                |
| **Maintainability**        | Generated code is hard to understand and maintain     | Produces code aligned with React best practices              |
| **Incremental Capability** | Usually requires one-time completion                  | Supports modular, phased migration                           |

### Four Pillars of Cross-Framework Flow

1. **Analyzable**: Input code must be amenable to static analysis
2. **Verifiable**: Conversion results can be automatically validated in CI
3. **Reproducible**: The same input always yields the same output
4. **Extensible**: Can start small and gradually expand migration scope

Nowadays, Vue → React migration is not a new concept, but VuReact aims to prove that with clear conventions in place, a stable engineering flow between Vue and React can be established.

## 3. Conventions as Collaborative Interfaces

**Philosophy**: Clear conventions are more valuable than complex runtime fallbacks.

### Role of Conventions

- **Reduce cognitive load**: The team shares a common understanding of "what can/cannot be converted"
- **Improve conversion quality**: Results are more stable and reliable within convention boundaries
- **Simplify troubleshooting**: Issues can be quickly traced to specific convention violations

### Examples of Conventions

- Vue 3 + `<script setup>` syntax
- Reactive APIs must be called at the top level
- Template expressions must be statically analyzable
- Component naming must be explicitly declared

## 4. Incremental Rather Than Big Bang

**Migration Philosophy**: Mitigate migration risks through controlled, small-step iterations.

### Recommended Approach

```mermaid
graph LR
    A[Select Pilot Module] --> B[Fix Compilation Warnings]
    B --> C[Verify Functionality]
    C --> D[Extend to Adjacent Modules]
    D --> E[Establish Team Workflow]
```

### Key Practices

1. **Pilot first, scale later**: Start with a module with clear boundaries
2. **Maintain rollback capability**: Design rollback plans for each migration step
3. **Define acceptance criteria**: Clarify what constitutes "migration completion"
4. **Build a pattern library**: Turn successful cases into team knowledge

## 5. Compiler-Runtime Collaboration

**Architectural Choice**: Rational distribution of complexity between compile time and runtime.

### Compile Time (Compiler)

- Syntax transformation: Vue SFC → React TSX
- Static analysis: Verify code compliance with conventions
- Dependency management: Automatically add runtime dependencies
- Code optimization: Generate code aligned with React best practices

### Runtime

- Semantic adaptation: Provide Vue-style APIs (e.g., `useVRef`, `useComputed`)
- Behavioral fallback: Handle subtle differences between frameworks
- Developer experience: Offer debugging tools and error prompts

### Collaborative Advantages

- **Compile-time correctness**: Avoid runtime errors through static analysis
- **Runtime flexibility**: Deliver Vue development experience within controlled boundaries
- **Engineering through combination**: Neither pure string replacement nor pure runtime interpretation

## What These Principles Mean for You

### If You Are a Technical Decision-Maker

- Evaluate if your project is suitable for VuReact based on these principles
- Develop reasonable migration plans and manage expectations
- Understand the tool's limitations and strengths to make informed technology choices

### If You Are a Developer

- Know why specific conventions must be followed
- Understand the design considerations behind compilation warnings
- Use the tool more efficiently and reduce trial-and-error costs

### If You Are a Team Lead

- Translate these principles into team work norms
- Establish convention-based code review standards
- Plan incremental technology evolution roadmaps

## Next Steps

- Check out [Why VuReact](./why) to learn about specific use cases
- Read [Compilation Conventions](./specification) to master mandatory rules
- Refer to [Best Practices](./best-practices) to establish team workflows
