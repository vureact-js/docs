# 演练场

本示例是标准 `vue-ts` 风格工程，用于验证常规 Vite Vue3 项目的闭环转换。

## CodeSanbox 在线示例

窗口大小有限，建议通过导航栏的【在线演示】选项访问并编辑

<div style="width: 100%; height: 80vh">
<iframe src="https://codesandbox.io/p/devbox/compiler-examples-n8yg68?embed=1&file=%2Fsrc%2Fcomponents%2FCounterPanel.vue"
     style="width:100%; height: 100%; border:0; border-radius: 4px; overflow:hidden;"
     title="compiler-examples"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</div>

## 使用前必读

根目录运行（除非在线示例没有自动运行命令）：

```bash
# vureact 构建
npm run vr:build

# vureact 监听
npm run vr:watch
```

## 覆盖能力

- `ref/computed` 与基础事件
- 组件 `props` + 插槽
- `css/less/sass` 样式处理
- Vue 入口排除策略（`src/main.ts`）

## 运行 React App

### Step 1

```bash
# 进入工作区目录
cd .vureact/react-app/

# 安装依赖
npm install
```

### Step 2

```bash
# 运行 react 应用
npm run dev
```

如果排除了 `src/App.vue` ，则在 `App.tsx` 里手动导入 `components` 目录下任何你想展示的组件即可

### Step 3

如果有需要，修改 Vue 或其他文件，观察终端与编译产物或预览页面的变动
