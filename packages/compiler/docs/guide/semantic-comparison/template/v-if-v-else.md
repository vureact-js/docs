# v-if 与 v-else 语义对照

解析 Vue 模板中高频使用的 `if`、`v-else-if` 和 `v-else` 指令，经过语义编译后会变成什么样的 React 代码？

## 前置约定

为避免示例代码冗余导致理解偏差，先明确两个小约定：

1. 文中 Vue / React 代码均为核心逻辑简写，省略完整组件包裹、无关配置等内容；
2. 默认读者已熟悉 Vue 3 中的条件指令用法。

## `v-if` → React 三元表达式

最简单的 `v-if` 指令，用于根据条件显示或隐藏元素。

- Vue 代码：

```vue
<div v-if="cond">内容</div>
```

- VuReact 编译后 React 代码：

```jsx
{
  cond ? <div>内容</div> : null;
}
```

从示例可以看到：Vue 的 `v-if` 指令被编译为 React 的三元表达式。VuReact 采用 **条件表达式编译策略**，将模板指令转换为 JSX 内联表达式，**完全保持 Vue 的条件渲染语义**——当 `cond` 为真时渲染 `<div>`，为假时渲染 `null`（React 中 `null` 不会被渲染到 DOM）。

## `v-if` 与 `v-else` 组合

`v-if` 与 `v-else` 组合使用，实现二选一的条件渲染。

- Vue 代码：

```vue
<div v-if="cond">内容</div>
<div v-else>其他内容</div>
```

- VuReact 编译后 React 代码：

```jsx
{
  cond ? <div>内容</div> : <div>其他内容</div>;
}
```

VuReact 将 `v-if`/`v-else` 组合编译为**完整的三元表达式**，**完全模拟 Vue 的条件分支语义**——两个分支互斥，确保同一时间只有一个元素被渲染。这种编译方式保持了代码的简洁性和可读性，同时与 React 的表达式渲染模式完美契合。

## 多条件 `v-else-if` 链

复杂的多条件判断链，使用 `v-if`、`v-else-if`、`v-else` 组合。

- Vue 代码：

```vue
<div v-if="type === 'A'">内容A</div>
<div v-else-if="type === 'B'">内容B</div>
<div v-else>其他内容</div>
```

- VuReact 编译后 React 代码：

```jsx
{
  type === 'A' ? <div>内容A</div> : type === 'B' ? <div>内容B</div> : <div>其他内容</div>;
}
```

对于多条件链，VuReact 采用**嵌套三元表达式编译策略**，将 Vue 的 `v-else-if` 链转换为嵌套的条件表达式。这种编译方式**完全保持 Vue 的条件链语义**——按顺序检查条件，第一个满足条件的分支被渲染，后续分支被跳过。虽然嵌套三元表达式在复杂场景下可能影响可读性，但 VuReact 会智能处理复杂嵌套，必要时拆分为独立的变量或函数。

## 复杂业务场景条件渲染

实际业务中的复杂条件渲染，包含嵌套条件、事件绑定、插值表达式等。

- Vue 代码：

```vue
<div v-if="user.role === 'admin' && (user.permissions.includes('write') || isSuperAdmin)">
  <h1>管理员控制面板</h1>
  <button @click="deleteAll">删除所有数据</button>
</div>
<div v-else-if="user.role === 'editor' && articles.length > 0 && !isSuspended">
  <h2>编辑文章 (共{{ articles.length }}篇)</h2>
  <ul>
    <li v-for="article in articles" :key="article.id">{{ article.title }}</li>
  </ul>
</div>
<div v-else-if="user.role === 'viewer' && hasSubscription">
  <h3>订阅用户视图</h3>
  <p>您的订阅将于{{ subscriptionEndDate }}到期</p>
</div>
<div v-else-if="user.role === 'guest' && showTrial">
  <div class="trial-banner">
    <p>试用用户，剩余{{ trialDays }}天</p>
    <button @click="upgrade">升级账户</button>
  </div>
</div>
<div v-else>
  <div class="error-state">
    <p v-if="isLoading">加载中...</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>
    <p v-else>无访问权限或账户状态异常</p>
    <button @click="retry">重试 ({{ retryCount }}/3)</button>
  </div>
</div>
```

- VuReact 编译后 React 代码：

```jsx
{
  user.role === 'admin' && (user.permissions.includes('write') || isSuperAdmin) ? (
    <div>
      <h1>管理员控制面板</h1>
      <button onClick={deleteAll}>删除所有数据</button>
    </div>
  ) : user.role === 'editor' && articles.length > 0 && !isSuspended ? (
    <div>
      <h2>编辑文章 (共{articles.length}篇)</h2>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>{article.title}</li>
        ))}
      </ul>
    </div>
  ) : user.role === 'viewer' && hasSubscription ? (
    <div>
      <h3>订阅用户视图</h3>
      <p>您的订阅将于{subscriptionEndDate}到期</p>
    </div>
  ) : user.role === 'guest' && showTrial ? (
    <div>
      <div className="trial-banner">
        <p>试用用户，剩余{trialDays}天</p>
        <button onClick={upgrade}>升级账户</button>
      </div>
    </div>
  ) : (
    <div>
      <div className="error-state">
        {isLoading ? (
          <p>加载中...</p>
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : (
          <p>无访问权限或账户状态异常</p>
        )}
        <button onClick={retry}>重试 ({retryCount}/3)</button>
      </div>
    </div>
  );
}
```

对于复杂的业务场景，VuReact 展示了**完整的条件编译能力**：

1. **复杂条件表达式**：将 Vue 的复杂条件逻辑（`&&`、`||`、函数调用等）原样转换为 JSX 表达式
2. **事件绑定转换**：`@click` 转换为 `onClick`，保持事件语义
3. **插值表达式**：`{{ }}` 转换为 `{ }`，保持数据绑定
4. **样式类名转换**：`class` 转换为 `className`，符合 React 规范

VuReact 的编译策略**完全保持 Vue 的条件渲染语义**，同时生成符合 React 最佳实践的代码，提高可维护性。
