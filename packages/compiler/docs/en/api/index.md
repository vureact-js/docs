# API Overview

This directory is intended for developers who "directly invoke the programming interfaces of `@vureact/compiler-core`".

## Layering

1. Stable High-level APIs: `defineConfig`, `VuReact`, and capabilities corresponding to CLI configurations.
2. Advanced APIs: `BaseCompiler`, `FileCompiler`, and plugin phased hooks.
3. Low-level Pipeline APIs: `parse*`, `transform`, `generate*`.

## Stability Conventions

1. `Stable`: Recommended for direct use.
2. `Advanced`: Usable, but requires understanding of the compilation chain.
3. `Low-level`: Suitable for framework/tool developers.

## Directory

- [Configuration API](./config)
- [Compiler API](./compiler)
- [Pipeline API](./pipeline)
- [Plugin System API](./plugin-system)
- [Compiler Context API](./compiler-context)
- [Types and Results](./types)
- [Export Manifest](./exports)
