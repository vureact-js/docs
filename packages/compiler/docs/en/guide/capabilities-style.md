# Style Capability Matrix

## Support Scope Matrix

| Capability                            | Status    | Output Behavior                                                    |
| ------------------------------------- | --------- | ------------------------------------------------------------------ |
| Extraction of the first `style` block | Supported | Generates an independent CSS file and injects the import statement |
| `scoped`                              | Supported | Generates a scoped identifier and injects it as a node attribute   |
| `module`                              | Supported | Generates `.module.css`-style artifacts and maps module names      |
| `less` language                       | Supported | Pre-converts to CSS before normal processing                       |
| `sass` language                       | Supported | Pre-converts to CSS before normal processing                       |

## Constraints and Limitations

| Scenario                | Status              | Description                                              |
| ----------------------- | ------------------- | -------------------------------------------------------- |
| Multiple `style` blocks | Incomplete support  | Only the first one takes effect, others trigger warnings |
| `cssVars`               | Not supported       | Throws an "unsupported" error during parsing             |
| `scoped` + `@import`    | Partially supported | Imported content may retain global impact                |

## Output File Naming Rules

Typical output structure (illustrative):

```txt
.vureact/dist/src/components/
├─ Counter.tsx
├─ counter-<hash>.css
└─ counter-<hash>.module.css
```

Notes:

1. Regular scoped styles are suffixed with a hash value
2. Module styles generate filenames with the `.module.css` suffix
3. Component artifacts automatically include imports for corresponding styles
4. If preprocessing for less/sass is disabled, corresponding style files (e.g., `.less`) are generated, and scoped processing is ignored

## Recommended Practices

- Maintain a single `style` block per SFC (Single-File Component)
- Prioritize scoped/module styles to reduce global coupling
- Conduct regression testing for `@import` scenarios before deployment

## Relationship to Migration Strategy

Styling is a high-risk aspect of migration. It is recommended to first establish a baseline for style constraints, then expand the scope of module migration.
