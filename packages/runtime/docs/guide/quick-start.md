# 快速上手

## 安装

### 使用 npm

```bash
npm install @vureact/runtime-core
```

### 使用 pnpm

```bash
pnpm add @vureact/runtime-core
```

### 使用 yarn

```bash
yarn add @vureact/runtime-core
```

## 环境要求

- **React**: >= 18.2.0

## 第一个示例：计数器应用

让我们通过一个简单的计数器应用来快速了解 **VuReact Runtime** 的基本用法：

```tsx
import { useCallback } from 'react';
import { useVRef, useWatch, KeepAlive } from '@vureact/runtime-core';

function Counter() {
  // 1. 创建响应式引用（类似 Vue 的 ref）
  const count = useVRef(0);

  // 2. 监听 count 的变化（类似 Vue 的 watch）
  useWatch(count, (newValue, oldValue) => {
    console.log(`计数器从 ${oldValue} 变为 ${newValue}`);
  });

  const increment = useCallback(() => {
    count.value++; // 直接修改 .value 属性
  ), [count.value]};

  return (
    <div>
      <p>当前计数: {count.value}</p>
      <button onClick={increment}>增加</button>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>我的第一个 VuReact 应用</h1>
      {/* 3. 使用 KeepAlive 缓存组件 */}
      <KeepAlive include={['counter']}>
        <Counter />
      </KeepAlive>
    </div>
  );
}

export default App;
```

## 核心概念快速了解

### 1. 响应式状态管理

VuReact Runtime 提供了多种响应式状态管理方式：

```tsx
import { useCallback } from 'react';
import { useVRef, useReactive, useComputed } from '@vureact/runtime-core';

function UserProfile() {
  // 方式一：useVRef（适合单个值）
  const username = useVRef('张三');

  // 方式二：useReactive（适合对象）
  const user = useReactive({
    name: '李四',
    age: 25,
    address: {
      city: '北京',
      street: '长安街',
    },
  });

  // 方式三：useComputed（计算属性）
  const userInfo = useComputed(() => {
    return `${user.name}，${user.age}岁，来自${user.address.city}`;
  });

  const updateUser = useCallback(() => {
    username.value = '王五'; // 修改 useVRef
    user.age = 26; // 直接修改 useReactive 的属性
    user.address.city = '上海'; // 深度修改也会触发更新
  }, [username.value, user.age, user.address.city]);

  return (
    <div>
      <p>用户名: {username.value}</p>
      <p>用户信息: {userInfo.value}</p>
      <button onClick={updateUser}>更新用户</button>
    </div>
  );
}
```

### 2. Vue 内置组件

在 React 中使用 Vue 3 的核心组件：

```tsx
import { useState } from 'react';
import { Transition, Teleport } from '@vureact/runtime-core';

function ModalExample() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>
        显示模态框
      </button>

      {/* 使用 Transition 添加动画 */}
      <Transition name="fade">
        {showModal && (
          {/* 使用 Teleport 将内容渲染到 body */}
          <Teleport to="body">
            <div className="modal">
              <h2>这是一个模态框</h2>
              <p>使用 Teleport 渲染到 body</p>
              <button onClick={() => setShowModal(false)}>
                关闭
              </button>
            </div>
          </Teleport>
        )}
      </Transition>
    </div>
  );
}
```

对应的 CSS 样式：

```css
.fade-enter-from,
.fade-leave-to {
  opacity: 0; /* 初始过渡外观 */
}

.fade-enter-active {
  opacity: 1; /* 激活时的过渡外观 */
  transition: opacity 0.5s ease;
}

.fade-leave-active {
  opacity: 0; /* 离开时的过渡外观 */
  transition: opacity 0.5s ease;
}
```

### 3. 模板指令工具

使用 Vue 风格的模板指令工具简化 JSX：

```tsx
import { useState } from 'react';
import { vCls, vStyle, vOn } from '@vureact/runtime-core';

function StyledButton() {
  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <button
      // 动态 class（类似 Vue 的 :class）
      className={vCls({
        btn: true,
        'btn-active': isActive,
        'btn-disabled': count >= 5,
      })}
      // 动态 style（类似 Vue 的 :style）
      style={vStyle({
        backgroundColor: isActive ? '#007bff' : '#6c757d',
        transform: `scale(${1 + count * 0.1})`,
      })}
      // 事件绑定（类似 Vue 的 @click.stop）
      onClick={vOn('click.stop', () => {
        setCount(count + 1);
        setIsActive(!isActive);
      })}
      // 右键菜单事件（阻止默认行为）
      onContextMenu={vOn('contextmenu.right.prevent', (e) => {
        console.log('右键菜单被阻止');
      })}
    >
      点击次数: {count}
    </button>
  );
}
```

**vOn 的正确用法说明：**

1. **基本语法**：`vOn('事件名.修饰符', 处理函数)`
2. **返回函数**：vOn 返回一个可以直接绑定到 React 事件属性上的函数
3. **修饰符支持**：
   - `stop`：阻止事件冒泡
   - `prevent`：阻止默认行为
   - `self`：只在事件目标自身触发
   - `once`：只触发一次
   - `left`/`middle`/`right`：鼠标按键
   - `enter`/`esc`/`space` 等：键盘按键

**示例对比：**

```html
// Vue 模板语法
<button @click.stop="handleClick">点击</button>

// React + VuReact Runtime
<button onClick={vOn('click.stop', handleClick)}>点击</button>
```

## 按需导入

VuReact Runtime 支持按需导入，减少打包体积：

```tsx
// 方式一：按模块导入
import { KeepAlive } from '@vureact/runtime-core/adapter-components';
import { useVRef } from '@vureact/runtime-core/adapter-hooks';
import { vCls } from '@vureact/runtime-core/adapter-utils';

// 方式二：从主入口导入（推荐）
import { KeepAlive, useVRef, vCls } from '@vureact/runtime-core';
```

## 下一步

现在您已经了解了 VuReact Runtime 的基本用法，接下来可以：

1. **深入学习组件**：查看 [组件文档](./components/keep-alive) 了解 KeepAlive、Transition 等组件的详细用法
2. **掌握响应式系统**：查看 [Hooks 文档](./hooks/reactive) 学习 useReactive、useComputed、useWatch 等高级用法
3. **使用工具函数**：查看 [工具函数文档](./utils/v-cls) 了解 vCls、vStyle、vOn 等模板指令工具
4. **查看完整示例**：访问 [CodeSandBox](https://codesandbox.io/p/sandbox/examples-f5rlpk) 查看更多实际项目示例（codesanbox 内的预览，需在地址栏手动输入对应示例页面的路由地址进行访问）

## 常见问题

### Q: 需要 Vue 的知识吗？

**A**: 不需要。虽然 API 设计基于 Vue 3，但所有功能都可以通过 React 的方式使用。熟悉 Vue ，上手起来会让您无缝衔接，但不是必须的。

### Q: 能和现有的 React 状态管理库一起使用吗？

**A**: 可以。VuReact Runtime 的响应式系统是独立的，可以和 Redux、Zustand、MobX 等状态管理库共存。

### Q: 性能如何？

**A**: 基于 [Valtio](https://github.com/pmndrs/valtio) 的高性能 Proxy 实现，响应式追踪非常高效。基于 [React Transition Group](https://github.com/reactjs/react-transition-group#readme) 为 `<Transition>` 组件提供高性能过渡效果的支持。组件缓存（KeepAlive）和按需导入也能帮助优化性能。

### Q: 支持服务端渲染（SSR）吗？

**A**: 支持。所有 API 都兼容服务端渲染环境。

---

**提示**：如果在使用过程中遇到问题，请查看 [GitHub Issues](https://github.com/vureact-js/core/issues) 或提交新的问题。
