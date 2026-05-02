# 增量编译

VuReact 的增量编译并不等于 watch 模式。即使你只是反复执行 `build`，只要缓存开启，编译器也会自动跳过未变化的文件。

这也是 VuReact 在渐进迁移场景里保持高效率的关键能力之一。

## 最常见的使用方式

```bash
npx vureact build
```

也可以像普通前端项目一样写进 package.json：

```json
{
  "scripts": {
    "vr:build": "vureact build"
  }
}
```

```bash
npm run vr:build
```

当存在可复用缓存时，你会看到类似输出：

```bash
VUREACT x.x.x

✔ Build completed in 120 ms
↷ Cached: 24 unchanged file(s)

📦 Output: .vureact/react-app
```

这里的 `Cached: 24 unchanged file(s)` 就表示：有 24 个文件被判定为“没有实际变化”，因此直接跳过，没有重新编译。

## 什么叫“增量”

所谓增量编译，本质上是：

- 首次编译时记录文件元数据与缓存信息
- 下一次编译时只处理真正有变化的文件
- 对未变文件直接复用上一次的编译结果

VuReact 会分别处理几类输入：

- `.vue` 单文件组件
- `.js` / `.ts` 等脚本文件
- `.css` / `.less` / `.scss` / `.sass` 等样式文件
- 需要复制的静态资源文件

也就是说，增量能力不只覆盖 Vue 组件，也覆盖脚本、样式和资源同步。

## 命中缓存的判断方式

VuReact 会先比较文件的基础元数据：

- 文件大小
- 修改时间

如果这两项都没有变化，文件会直接跳过。

如果元数据变化了，编译器还会进一步对比内容哈希，避免一些“看起来改过、实际上内容没变”的情况触发无意义重编译。

你可以把它理解为两层判断：

1. 先用元数据做快速筛选
2. 必要时再用内容哈希做精确确认

这让它同时兼顾了速度和准确性。

## 缓存文件放在哪里

默认情况下，缓存会写入工作区目录下：

```txt
.vureact/cache/_metadata.json
```

如果你的配置是：

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  output: {
    workspace: '.vureact',
  },
});
```

那么：

- React 产物通常位于 `.vureact/react-app`
- 编译缓存位于 `.vureact/cache/_metadata.json`

只要这个缓存文件还在，并且源文件没有发生实际变化，下一次 `build` 或 `watch` 启动就能直接复用它。

## 一个典型流程

### 第一次执行

```bash
npx vureact build
```

第一次通常会处理全部输入文件，因为此时还没有可用缓存。

### 修改少量文件后再次执行

例如你只改了：

- `src/App.vue`
- `src/styles/app.scss`

再次运行：

```bash
npx vureact build
```

此时编译器通常只会重新处理这两个文件，其他未变化文件会被计入 `Cached`。

这也是为什么在中大型项目里，多次构建的耗时往往会明显下降。

## 和 watch 模式是什么关系

两者的关系可以这样理解：

- `build`：一次性执行编译，但默认同样支持增量缓存
- `watch`：先执行一次 `build`，再常驻监听文件变化，后续按单文件继续增量处理

换句话说：

- 增量编译是能力
- `watch` 只是使用这套能力的另一种运行方式

如果你想了解持续监听时的行为细节，可以继续阅读[监听模式](/guide/watch-mode)。

## 什么时候收益最明显

增量编译在下面这些场景里收益最明显：

- 项目文件数较多，完整编译成本高
- 你每天只会改动少量页面或组件
- 正在做渐进迁移，需要频繁重复执行构建
- 资源文件较多，不希望每次都重复复制全部资产

## 如何显式控制缓存

默认情况下，`cache` 为 `true`，通常不需要额外配置：

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: 'src',
  cache: true,
});
```

如果你想禁用缓存，也可以显式关闭：

```ts
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  input: 'src',
  cache: false,
});
```

关闭后会有这些影响：

- `build` 不再复用上一次缓存
- `Cached: ...` 统计不会再出现
- 每次变更都会强制重新处理所有文件

通常只建议在以下情况临时关闭：

- 你正在排查缓存相关问题
- 希望对一次特殊构建做完全重算
- 本地工作区缓存被你手动清理后，想显式确认行为

## 删除与重命名会怎样

VuReact 不只会缓存“新增和修改”，也会处理“删除”：

- 当源文件被删除时，对应 React 产物会一起移除
- 相关缓存记录也会被同步清理

因此在渐进迁移过程中，输出目录不会因为历史文件而越来越脏。

重命名文件时，你可以把它理解为：

1. 旧路径被删除
2. 新路径被新增并重新编译

## 性能建议

如果你希望增量编译尽可能稳定、快速，建议注意这几点：

1. 不要频繁手动删除 `.vureact/cache`
2. 尽量把 `input` 收敛到真正需要编译的目录
3. 用 `exclude` 排除 Vue 入口、构建产物和无关目录
4. 在渐进迁移项目中，保持工作区目录稳定，不要反复切换输出位置

## 常见疑问

### 为什么我执行的是 `build`，却看到了 `Cached`

这是正常现象，因为 `build` 本身就支持增量缓存，不需要进入 watch 才能命中。

### 删除 `.vureact` 后会怎样

缓存和输出目录都被清空后，下一次构建会退回一次完整构建，然后重新建立缓存。

### 增量编译会不会漏掉变更

正常情况下不会。VuReact 不只比较文件修改时间和大小，在必要时还会继续比较内容哈希，尽量减少误判。
