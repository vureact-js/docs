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

The CLI first attempts to load `vureact.config.js` / `vureact.config.ts` from the root directory, then merges in command-line parameters.
Priority:

1. CLI parameters
2. [Configuration File](/api/config)
3. Default values

## Parameters

| Parameter            | Description                                      |
| -------------------- | ------------------------------------------------ |
| `-i, --input <dir>`  | Input directory (relative to `root`)             |
| `-o, --outDir <dir>` | Output directory name (relative to `workspace`)  |
| `--workspace <dir>`  | Compilation workspace directory (cache + output) |

## Watch Mode Behavior

1. Executes a full compilation once at startup.
2. Monitors file changes under the `input` directory.
3. `.vue` files trigger SFC compilation; `.js/.ts` files trigger script compilation; other files are copied as resource files.
4. Deleting files/directories will synchronously clean up output artifacts and cache records.
