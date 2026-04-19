# v-if & v-else Semantic Comparison

How do Vue's frequently used `v-if`, `v-else-if`, and `v-else` directives in templates transform into React code after semantic compilation?

## Prerequisites

To avoid redundancy in example code and ensure clear understanding, let's establish two conventions:

1. Vue/React code examples in this document are simplified core logic, omitting full component wrappers and unrelated configurations.
2. Readers are assumed to be familiar with the usage of conditional directives in Vue 3.

## `v-if` → React Ternary Expression

The simplest `v-if` directive, used to show or hide elements based on conditions.

- Vue code:

```vue
<div v-if="cond">Content</div>
```

- VuReact compiled React code:

```jsx
{
  cond ? <div>Content</div> : null;
}
```

As shown in the example: Vue's `v-if` directive is compiled into React's ternary expression. VuReact adopts a **conditional expression compilation strategy**, converting template directives to JSX inline expressions, **fully preserving Vue's conditional rendering semantics**—rendering `<div>` when `cond` is true, and `null` when false (`null` is not rendered to DOM in React).

## `v-if` and `v-else` Combination

Combining `v-if` with `v-else` for either/or conditional rendering.

- Vue code:

```vue
<div v-if="cond">Content</div>
<div v-else>Other content</div>
```

- VuReact compiled React code:

```jsx
{
  cond ? <div>Content</div> : <div>Other content</div>;
}
```

VuReact compiles `v-if`/`v-else` combinations into **complete ternary expressions**, **fully mimicking Vue's conditional branching semantics**—two mutually exclusive branches ensure only one element is rendered at a time. This compilation approach maintains code simplicity and readability while perfectly aligning with React's expression rendering patterns.

## Multi-Condition `v-else-if` Chain

Complex multi-condition judgment chains using `v-if`, `v-else-if`, `v-else` combinations.

- Vue code:

```vue
<div v-if="type === 'A'">Content A</div>
<div v-else-if="type === 'B'">Content B</div>
<div v-else>Other content</div>
```

- VuReact compiled React code:

```jsx
{
  type === 'A' ? (
    <div>Content A</div>
  ) : type === 'B' ? (
    <div>Content B</div>
  ) : (
    <div>Other content</div>
  );
}
```

For multi-condition chains, VuReact adopts a **nested ternary expression compilation strategy**, converting Vue's `v-else-if` chains to nested conditional expressions. This compilation approach **fully preserves Vue's conditional chain semantics**—checking conditions in order, rendering the first satisfied branch while skipping subsequent ones. Although nested ternary expressions may affect readability in complex scenarios, VuReact intelligently handles complex nesting, splitting into separate variables or functions when necessary.

## Complex Business Scenario Conditional Rendering

Complex conditional rendering in real-world business scenarios, including nested conditions, event bindings, interpolation expressions, etc.

- Vue code:

```vue
<div v-if="user.role === 'admin' && (user.permissions.includes('write') || isSuperAdmin)">
  <h1>Admin Control Panel</h1>
  <button @click="deleteAll">Delete All Data</button>
</div>
<div v-else-if="user.role === 'editor' && articles.length > 0 && !isSuspended">
  <h2>Edit Articles (Total {{ articles.length }} articles)</h2>
  <ul>
    <li v-for="article in articles" :key="article.id">{{ article.title }}</li>
  </ul>
</div>
<div v-else-if="user.role === 'viewer' && hasSubscription">
  <h3>Subscriber View</h3>
  <p>Your subscription expires on {{ subscriptionEndDate }}</p>
</div>
<div v-else-if="user.role === 'guest' && showTrial">
  <div class="trial-banner">
    <p>Trial user, {{ trialDays }} days remaining</p>
    <button @click="upgrade">Upgrade Account</button>
  </div>
</div>
<div v-else>
  <div class="error-state">
    <p v-if="isLoading">Loading...</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>
    <p v-else>No access or account status abnormal</p>
    <button @click="retry">Retry ({{ retryCount }}/3)</button>
  </div>
</div>
```

- VuReact compiled React code:

```jsx
{
  user.role === 'admin' && (user.permissions.includes('write') || isSuperAdmin) ? (
    <div>
      <h1>Admin Control Panel</h1>
      <button onClick={deleteAll}>Delete All Data</button>
    </div>
  ) : user.role === 'editor' && articles.length > 0 && !isSuspended ? (
    <div>
      <h2>Edit Articles (Total {articles.length} articles)</h2>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>{article.title}</li>
        ))}
      </ul>
    </div>
  ) : user.role === 'viewer' && hasSubscription ? (
    <div>
      <h3>Subscriber View</h3>
      <p>Your subscription expires on {subscriptionEndDate}</p>
    </div>
  ) : user.role === 'guest' && showTrial ? (
    <div>
      <div className="trial-banner">
        <p>Trial user, {trialDays} days remaining</p>
        <button onClick={upgrade}>Upgrade Account</button>
      </div>
    </div>
  ) : (
    <div>
      <div className="error-state">
        {isLoading ? (
          <p>Loading...</p>
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : (
          <p>No access or account status abnormal</p>
        )}
        <button onClick={retry}>Retry ({retryCount}/3)</button>
      </div>
    </div>
  );
}
```

For complex business scenarios, VuReact demonstrates **complete conditional compilation capability**:

1. **Complex conditional expressions**: Converts Vue's complex conditional logic (`&&`, `||`, function calls, etc.) directly to JSX expressions
2. **Event binding conversion**: `@click` converts to `onClick`, preserving event semantics
3. **Interpolation expressions**: `{{ }}` converts to `{ }`, preserving data binding
4. **Style class name conversion**: `class` converts to `className`, conforming to React standards

VuReact's compilation strategy **fully preserves Vue's conditional rendering semantics** while generating code that adheres to React best practices, improving maintainability.
