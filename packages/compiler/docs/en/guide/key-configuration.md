# Key Configuration

This page does not cover the full API. Instead, it focuses on the few configurations that most projects will actually change.

If you want to see the complete list of fields, check out the [Configuration API](/en/api/config). If you just want to get your project set up as quickly as possible, reading this page is enough.

## Start with This

For most Vue 3 + Vite projects, it's recommended to start with this configuration:

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: './src',
  exclude: ['src/main.ts'],
  output: {
    workspace: '.vureact',
    outDir: 'react-app',
    bootstrapVite: true,
  },
});
```

This configuration already covers the most common scenarios:

- Compile only the `src` directory
- Exclude the Vue entry point to avoid conflicts with the existing `createApp(...).mount(...)`
- Output to `.vureact/react-app`
- Automatically prepare a Vite React runtime environment

## The 6 Configurations Worth Caring About Most

### `input`

Specifies the source directory or single file to compile.

```ts
input: './src'
```

It's recommended to use `src` by default and not to expand the scope too broadly at first. During gradual migration, the more stable your input scope is, the lower the debugging effort.

### `exclude`

Specifies files or directories that should not be compiled.

```ts
exclude: ['src/main.ts']
```

This is one of the most important configurations. For gradual migration projects, it's generally recommended to exclude the Vue entry file first.

Common use cases:

- Excluding `src/main.ts`
- Excluding experimental directories
- Excluding files you don't want to migrate yet

### `output.workspace`

Specifies the workspace directory, which will contain both the output and cache files.

```ts
output: {
  workspace: '.vureact',
}
```

Usually, keeping the default is fine. Unless your team has a clear convention for output directories, frequent changes are not recommended.

### `output.outDir`

Specifies the name of the React output directory.

```ts
output: {
  outDir: 'react-app',
}
```

The final output location will typically be:

```txt
.vureact/react-app
```

If you need to integrate the generated project into another workflow, you can adjust this value.

### `output.bootstrapVite`

Whether to automatically prepare a runnable Vite React project.

```ts
output: {
  bootstrapVite: true,
}
```

For most users, it's recommended to keep this as `true`, so you can directly navigate to the output directory and run:

```bash
cd .vureact/react-app
npm install
npm run dev
```

Only set this to `false` if you already have your own React host project, or if you explicitly do not want VuReact to initialize a Vite environment.

`bootstrapVite` can also be written as an object instead of a boolean:

```ts
bootstrapVite: {
  template: 'react-ts',
  vite: '@latest',
  react: '^19.0.0',
}
```

The available options are as follows:

- `template`: Specifies the Vite React template to initialize, can be `react-ts` or `react`
- `vite`: Specifies the Vite version to use during initialization, must include the `@` prefix
- `react`: Specifies the React version to use during initialization

### `router.configFile`

If the project uses Vue Router, you should typically add this:

```ts
router: {
  configFile: 'src/router/index.ts',
}
```

This allows the compiler to identify the router entry point and perform the corresponding route adaptation in the output.

This is suitable for projects that:

- Already use Vue Router
- Have `router-link` and `router-view`
- Use `useRouter`, `useRoute`, navigation guards, etc.

## Three Most Common Configuration Patterns

### 1. Standard Vue Project

Suitable for most first-time integration scenarios.

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: './src',
  exclude: ['src/main.ts'],
  output: {
    workspace: '.vureact',
    outDir: 'react-app',
    bootstrapVite: true,
  },
});
```

### 2. Business Project with Routing

Suitable for backends, admin panels, content sites, and other projects with complete page routing.

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  ...,
  router: {
    configFile: 'src/router/index.ts',
  },
});
```

### 3. Projects That Need Post-Processing

Suitable for scenarios where you want to modify output files, add scripts, or print custom logs after a successful build.

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  ...,
  onSuccess: async () => {
    console.log('build finished');
  },
});
```

## Configurations You Don't Need to Worry About Yet

The following configurations are indeed useful, but most projects can address them later:

- `ignoreAssets`
- `preprocessStyles`
- `packageJson`
- `logging`
- `format`
- `plugins`

The reason is simple: they lean more toward "customization" and "optimization" rather than being prerequisites for getting the project running.

## A Simple Rule of Thumb

If you're unsure about whether to add many configuration items, use this principle:

- First, only configure the items that affect whether the project "can run"
- Add the rest once the project is stable

The truly critical first-round items are usually only these:

1. `input`
2. `exclude`
3. `output.workspace`
4. `output.outDir`
5. `output.bootstrapVite`
6. `router.configFile`

## Related Sections

- [Configuration API](/api/config): View the complete configuration reference
