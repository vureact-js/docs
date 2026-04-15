# Best Practices

## Recommended Practices

1. Prioritize writing new features in accordance with VuReact conventions
2. Split into small modules for migration first to ensure each change is rollbackable
3. Configure `exclude` to explicitly exclude entry points and unstable directories
4. Use TypeScript + explicit props/emits definitions
5. Fix input code first when encountering warnings, then continue expanding the migration scope
6. Use AI to assist or take over the full compilation workflow, continuously optimizing and fixing potential issues in the React output

## Common Anti-Patterns

- Continuously writing complex runtime "magic" with only Vue thinking
- Calling APIs that will be converted to Hooks outside of the top-level scope
- Treating "compilation warnings" as "ignorable prompts"
- Migrating the entire repository at once without phased acceptance checks

## Outcome-Oriented Suggestions

Treat VuReact as a "compilation platform with boundaries" and a "strict AI collaborator", rather than an "unbounded fallback tool".
