# Playground

This example is a standard `vue-ts` style project, used to verify the closed-loop conversion of a regular Vite Vue3 project.

## CodeSandbox Online Example

The window size is limited, so it is recommended to access and edit via the [Playground] option in the navigation bar.

<div style="width: 100%; height: 80vh">
<iframe src="https://codesandbox.io/p/devbox/compiler-examples-n8yg68?embed=1&file=%2Fsrc%2Fcomponents%2FCounterPanel.vue"
     style="width:100%; height: 100%; border:0; border-radius: 4px; overflow:hidden;"
     title="compiler-examples"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</div>

## Important Notes Before Use

Run in the root directory (unless the online example runs the command automatically):

```bash
# vureact build
npm run vr:build

# vureact watch
npm run vr:watch
```

## Coverage Capabilities

- `ref/computed` and basic events
- Component `props` + slots
- `css/less/sass` style processing
- Vue entry exclusion strategy (`src/main.ts`)

## Run the React App

### Step 1

```bash
# Enter the workspace directory
cd .vureact/react-app/

# Install dependencies
npm install
```

### Step 2

```bash
# Run the react app
npm run dev
```

If `src/App.vue` is excluded, manually import any components from the `components` directory in `App.tsx` that you want to display.

### Step 3

If necessary, modify Vue or other files and observe changes in the terminal, compiled products, or preview page.
