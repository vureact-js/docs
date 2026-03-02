# Why Choose VuReact

## Overview

VuReact is a compilation tool for migrating from Vue 3 to React, adopting an engineering approach entirely different from traditional migration tools. If you are considering migrating a Vue project to React, or wish to retain Vue's development experience within the React ecosystem, VuReact offers a controllable and predictable solution.

## Pain Points of Traditional Migration

Before exploring VuReact's advantages, let's examine the challenges of traditional migration methods:

### 1. Limitations of String Replacement

```javascript
// Traditional tools might convert like this
// Vue
const count = ref(0);
// → Naively replaced with
const count = useState(0); // This is usually incorrect
```

### 2. Semantic Loss Issues

- Fundamental differences between Vue's reactivity system and React's Hook rules
- Simple replacement fails to handle complex reactive dependencies
- Template conversion easily breaks the original data flow

### 3. Lack of Engineering Support

- Manual handling of project structure, dependencies, and build configurations required after migration
- No continuous integration or automated validation capabilities
- Difficulty in progressive migration

### 4. Maintainability Challenges

- Generated code is hard to understand and maintain
- Lack of type safety and static analysis
- Debugging difficulties and hard-to-locate issues

## VuReact's Solutions

### 1. Complete Compilation Pipeline

VuReact is not a simple string replacement tool but a full-fledged compiler:

```txt
Vue SFC → Parsing → Transformation → Code Generation → React TSX
     ↓        ↓        ↓           ↓
  Syntax Analysis  Semantic Analysis  Hook Compliance  Engineering-Grade Output
```

### 2. Convention-Based Transformation

Unlike traditional tools, VuReact requires code to adhere to specific conventions:

```vue
<!-- Convertible code -->
<script setup>
// Reactive APIs must be at the top level
const count = ref(0);
const doubled = computed(() => count.value * 2);

// Clear function definitions
const increment = () => {
  count.value++;
};
</script>
```

### 3. Engineering Migration Support

| Capability                | Traditional Tools                       | VuReact                                |
| ------------------------- | --------------------------------------- | -------------------------------------- |
| **Progressive Migration** | ❌ Usually requires one-time completion | ✅ Supports module-by-module migration |
| **Rollback Capability**   | ❌ Difficult to roll back               | ✅ Rollback possible at every step     |
| **CI/CD Integration**     | ❌ Manual verification                  | ✅ Automated validation                |
| **Type Safety**           | ❌ Typically loses type information     | ✅ Maintains TypeScript support        |

## Core Technical Advantages

### 1. Static Analysis Assurance

VuReact performs rigorous static analysis during compilation to ensure generated React code complies with Hook rules:

```typescript
// Input: Vue code
const user = ref({ name: 'Alice' });
const userName = computed(() => user.value.name);

// Output: React code compliant with Hook rules
const user = useVRef({ name: 'Alice' });
const userName = useComputed(() => user.value.name);
```

### 2. Semantic-Preserving Transformation

Instead of simple syntax replacement, VuReact performs semantic-preserving transformation:

- `ref()` → `useVRef()` (preserves reactive semantics)
- `computed()` → `useComputed()` (preserves computed property semantics)
- `watch()` → `useWatch()` (preserves watcher semantics)
- Template directives → corresponding React patterns

### 3. Complete Engineering Output

VuReact generates a fully functional React project:

```txt
.vureact/dist/
├── src/                    # Transformed source code
│   ├── components/        # React components
│   ├── utils/            # Utility functions
│   └── types/            # Type definitions
├── package.json          # Dependency management
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Build configuration
```

## Applicable Scenarios

### ✅ Recommended Use Cases for VuReact

1. **Adopting React Ecosystem for New Projects**
   - Team has Vue development experience
   - Wish to retain Vue's development experience
   - Need progressive learning of React

2. **Controllable Progressive Migration**
   - Large projects requiring phased migration
   - Need to maintain normal operation of existing business
   - Require clear migration progress and acceptance criteria

3. **Tech Stack Unification**
   - Company aims to unify tech stack to React
   - Possesses substantial Vue code and development experience
   - Requires a smooth transition period

4. **Cross-Team Collaboration**
   - Vue and React teams need to collaborate
   - Expect mutually understandable and maintainable code
   - Require unified development specifications

5. **Hybrid Development**
   - Open to unconventional approaches, experimenting with writing React code in Vue

### ❌ Not Recommended Use Cases for VuReact

1. **Pursuing One-Click Full Migration**
   - Expect complete automation without any code adjustments
   - Unwilling to accept any conventions or constraints

2. **Complex Legacy Projects**
   - Code contains numerous hard-to-static-analyze tricks
   - Heavily dependent on Vue-specific runtime features
   - No plan for refactoring and code consolidation

3. **Misgivings About Compilation Tools**
   - Unwilling to introduce additional build steps
   - Have extremely high requirements for generated code quality
   - Need full control over every line of output code

## Practical Benefits

### For Development Teams

- **Reduced Learning Curve**: Vue developers can smoothly transition to React
- **Improved Migration Efficiency**: Automates repetitive conversion tasks
- **Guaranteed Code Quality**: Generated code adheres to React best practices
- **Simplified Collaboration**: Unified code standards and development workflows

### For Technical Decision-Makers

- **Controllable Risk**: Can start small and scale gradually
- **Clear ROI**: Quantifiable migration progress and outcomes
- **Technical Debt Management**: Systematic handling of technical debt from framework migration
- **Team Capability Building**: Fosters full-stack capabilities during migration

### For the Project Itself

- **Maintainability**: Generated code is clear, readable, and maintainable
- **Stability**: Rigorous static analysis prevents runtime errors
- **Continuous Evolution**: Modern React features remain available post-migration
- **Recruitment Flexibility**: Expands talent pool while leveraging existing team expertise

## Start Evaluation

If you're unsure whether VuReact suits your project, evaluate it through the following steps:

1. **Technical Feasibility Assessment**

   ```bash
   # Select a small module for pilot testing
   npx vureact build --input src/components/Button
   ```

2. **Team Acceptance Assessment**
   - Is the team willing to adopt new development conventions?
   - Is there time and resources for code adjustments?
   - Is the compilation tool's working principle understood?

3. **Project Compatibility Assessment**
   - Does the project code comply with Vue 3 + `<script setup>` specifications?
   - Does it contain complex code that cannot be statically analyzed?
   - Is the migration timeline sufficient?

## Next Steps

If the evaluation is positive, we recommend proceeding as follows:

1. **Read Documentation**: Learn details about [compilation conventions](./specification)
2. **Conduct Pilot**: Test with a well-bounded module
3. **Establish Processes**: Incorporate conventions into code review and CI workflows
4. **Gradually Expand**: Develop a complete migration plan based on pilot results

## Comparison with Other Solutions

| Solution                        | Advantages                                                                                         | Disadvantages                                     | Suitable Scenarios                                      |
| ------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------- |
| **Manual Rewrite**              | Full control over code quality                                                                     | High cost, long cycle                             | Small projects or core modules                          |
| **Traditional Migration Tools** | Fast, broad coverage                                                                               | Poor code quality, hard to maintain               | One-time migration with no concern for code quality     |
| **VuReact**                     | Engineering-grade, controllable, high quality; AI can be leveraged for subsequent code refactoring | Requires adherence to conventions, learning curve | Projects needing balance of quality, cost, and timeline |

## Frequently Asked Questions

### Q: How is the performance of code generated by VuReact?

A: Code generated by VuReact is optimized and performs on par with handwritten React code. The runtime adaptation layer is carefully designed with minimal performance overhead.

### Q: How to maintain the project after migration?

A: Post-migration, the project can be maintained like a regular React project. If rollback or modifications are needed, you can directly edit the generated React code. Additionally, with AI for secondary development, the clear and rigorous code output enables both AI and developers to quickly understand and modify the code.

### Q: Does it support all Vue 3 features?

A: The current experimental version supports core features of Vue 3 + `<script setup>`. For detailed support, refer to the [Capability Matrix](./capabilities-overview).

### Q: How to continue business development during migration?

A: We recommend adopting a branching strategy: perform conversion on a migration branch, continue business development on the main branch, and synchronize regularly.

---

**Need more help?** Check out the [FAQ](./faq), join community discussions, or submit an [issue](https://github.com/vureact-js/core/issues) on GitHub.
