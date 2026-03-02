# CLI

This chapter covers the VuReact command-line entry, parameters, and actual behaviors.

## Commands

### `build [root]`

One-time compilation without continuous monitoring.

```bash
# By default, uses the `src` directory under the running path of the command line
npx vureact build

# Specify the input path
npx vureact build ./src
```

### `watch [root]`

After the initial full compilation, enters file monitoring and incremental recompilation.

```bash
npx vureact watch
npx vureact watch ./src
```

## Configuration Loading and Priority

The CLI first attempts to load `root/vureact.config.js`, then merges command-line parameters.

Priority:

1. CLI parameters
2. `vureact.config.js`
3. Default values

## Parameters

| Parameter             | Description                                      |
| --------------------- | ------------------------------------------------ |
| `-i, --input <dir>`   | Input directory (relative to `root`)             |
| `-o, --outDir <dir>`  | Output directory name (relative to `workspace`)  |
| `--workspace <dir>`   | Compilation workspace directory (cache + output) |
| `--bootstrapVite`     | Pre-initialize a standard React (Vite) project   |
| `--exclude <pattern>` | Exclude files/directories (glob pattern)         |
| `--no-recursive`      | Disable recursive scanning of subdirectories     |
| `--no-cache`          | Disable caching                                  |
| `--format`            | Enable code formatting                           |
| `--formatter <type>`  | Formatter type: `prettier` / `builtin`           |

## Common Command Templates

### 1) Standard Compilation for New Projects

```bash
npx vureact build -i src --workspace .vureact -o dist --format --formatter prettier
```

### 2) Progressive Migration (Exclude Vue Entry)

```bash
npx vureact build -i src --exclude src/main.ts --workspace .vureact -o dist
```

### 3) Incremental Monitoring for Local Development

```bash
npx vureact watch -i src --exclude src/main.ts
```

## Watch Mode Behavior

1. Executes a full compilation once at startup.
2. Monitors file changes under the `input` directory.
3. `.vue` files trigger SFC compilation; `.js/.ts` files trigger script compilation; other files are copied as resource files.
4. Deleting files/directories will synchronously clean up output artifacts and cache records.

## Key Relationships with Configuration Items

1. `exclude`: It is recommended to explicitly exclude the Vue entry file (e.g., `src/main.ts`).
2. `bootstrapVite`: Available for directory compilation; Vite initialization is automatically skipped for single-file input.
3. `cache`: When enabled, unchanged files are skipped directly, resulting in a noticeable difference in experience in watch mode.

## Common Issues

### 1) The command takes effect, but the output directory is not updated

First confirm:

1. Whether the target file is matched by `exclude`.
2. Whether it was skipped because the cache judged it as "unchanged".
3. Whether `input` points to the expected directory.

### 2) Old artifacts remain after deleting files in watch mode

This is usually due to inconsistent mapping between the deletion path and the cache. Prioritize checking:

1. Whether `root/input/outDir/workspace` are in the same path system.
2. Whether an external script writes back files after compilation.
3. Manually delete old artifacts, or delete the entire output directory.

### 3) `--formatter prettier` does not take effect

`prettier` is an optional peer dependency, and the `prettier` package must be resolvable in the project. It is recommended to install it.

## Next Steps

- See [Configuration API](/api/config)
- See [Plugin System API](/api/plugin-system)
