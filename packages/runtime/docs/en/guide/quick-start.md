# Quick Start

## Installation

### NPM

```bash
npm install @vureact/runtime-core
```

### PNPM

```bash
pnpm add @vureact/runtime-core
```

### YARN

```bash
yarn add @vureact/runtime-core
```

## Environment Requirements

- **React**: >= 18.2.0

## First Example: Counter Application

Let's quickly understand the basic usage of **VuReact Runtime** through a simple counter application:

```tsx
import { useCallback } from 'react';
import { useVRef, useWatch, KeepAlive } from '@vureact/runtime-core';

function Counter() {
  // 1. Create reactive reference (similar to Vue's ref)
  const count = useVRef(0);

  // 2. Watch count changes (similar to Vue's watch)
  useWatch(count, (newValue, oldValue) => {
    console.log(`Counter changed from ${oldValue} to ${newValue}`);
  });

  const increment = useCallback(() => {
    count.value++; // Directly modify .value property
  }, [count.value]);

  return (
    <div>
      <p>Current count: {count.value}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>My First VuReact Application</h1>
      {/* 3. Use KeepAlive to cache components */}
      <KeepAlive include={['counter']}>
        <Counter />
      </KeepAlive>
    </div>
  );
}

export default App;
```

## Quick Overview of Core Concepts

### 1. Reactive State Management

VuReact Runtime provides multiple ways of reactive state management:

```tsx
import { useCallback } from 'react';
import { useVRef, useReactive, useComputed } from '@vureact/runtime-core';

function UserProfile() {
  // Method 1: useVRef (suitable for single values)
  const username = useVRef('Zhang San');

  // Method 2: useReactive (suitable for objects)
  const user = useReactive({
    name: 'Li Si',
    age: 25,
    address: {
      city: 'Beijing',
      street: 'Chang'an Avenue',
    },
  });

  // Method 3: useComputed (computed properties)
  const userInfo = useComputed(() => {
    return `${user.name}, ${user.age} years old, from ${user.address.city}`;
  });

  const updateUser = useCallback(() => {
    username.value = 'Wang Wu'; // Modify useVRef
    user.age = 26; // Directly modify properties of useReactive
    user.address.city = 'Shanghai'; // Deep modification also triggers updates
  }, [username.value, user.age, user.address.city]);

  return (
    <div>
      <p>Username: {username.value}</p>
      <p>User Info: {userInfo.value}</p>
      <button onClick={updateUser}>Update User</button>
    </div>
  );
}
```

### 2. Vue Built-in Components

Use Vue 3 core components in React:

```tsx
import { useState } from 'react';
import { Transition, Teleport } from '@vureact/runtime-core';

function ModalExample() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>
        Show Modal
      </button>

      {/* Use Transition to add animation */}
      <Transition name="fade">
        {showModal && (
          {/* Use Teleport to render content to body */}
          <Teleport to="body">
            <div className="modal">
              <h2>This is a Modal</h2>
              <p>Rendered to body using Teleport</p>
              <button onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </Teleport>
        )}
      </Transition>
    </div>
  );
}
```

Corresponding CSS styles:

```css
.fade-enter-from,
.fade-leave-to {
  opacity: 0; /* Initial transition appearance */
}

.fade-enter-active {
  opacity: 1; /* Transition appearance when active */
  transition: opacity 0.5s ease;
}

.fade-leave-active {
  opacity: 0; /* Transition appearance when leaving */
  transition: opacity 0.5s ease;
}
```

### 3. Template Directive Tools

Simplify JSX with Vue-style template directive tools:

```tsx
import { useState } from 'react';
import { vCls, vStyle, vOn } from '@vureact/runtime-core';

function StyledButton() {
  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <button
      // Dynamic class (similar to Vue's :class)
      className={vCls({
        btn: true,
        'btn-active': isActive,
        'btn-disabled': count >= 5,
      })}
      // Dynamic style (similar to Vue's :style)
      style={vStyle({
        backgroundColor: isActive ? '#007bff' : '#6c757d',
        transform: `scale(${1 + count * 0.1})`,
      })}
      // Event binding (similar to Vue's @click.stop)
      onClick={vOn('click.stop', () => {
        setCount(count + 1);
        setIsActive(!isActive);
      })}
      // Context menu event (prevent default behavior)
      onContextMenu={vOn('contextmenu.right.prevent', (e) => {
        console.log('Right-click menu is prevented');
      })}
    >
      Click Count: {count}
    </button>
  );
}
```

**Explanation of correct vOn usage:**

1. **Basic syntax**: `vOn('eventName.modifiers', handlerFunction)`
2. **Return value**: vOn returns a function that can be directly bound to React event properties
3. **Supported modifiers**:
   - `stop`: Prevent event bubbling
   - `prevent`: Prevent default behavior
   - `self`: Trigger only when the event target is the element itself
   - `once`: Trigger only once
   - `left`/`middle`/`right`: Mouse buttons
   - `enter`/`esc`/`space`, etc.: Keyboard keys

**Example comparison:**

```html
// Vue template syntax
<button @click.stop="handleClick">Click</button>

// React + VuReact Runtime
<button onClick={vOn('click.stop', handleClick)}>Click</button>
```

## On-Demand Import

VuReact Runtime supports on-demand import to reduce bundle size:

```tsx
// Method 1: Import by module
import { KeepAlive } from '@vureact/runtime-core/adapter-components';
import { useVRef } from '@vureact/runtime-core/adapter-hooks';
import { vCls } from '@vureact/runtime-core/adapter-utils';

// Method 2: Import from main entry (recommended)
import { KeepAlive, useVRef, vCls } from '@vureact/runtime-core';
```

## Next Steps

Now that you have learned the basic usage of VuReact Runtime, you can:

1. **Learn components in depth**: Check the [Component Documentation](./components/keep-alive) to learn the detailed usage of components like KeepAlive and Transition
2. **Master the reactive system**: Check the [Hooks Documentation](./hooks/reactive) to learn advanced usage of useReactive, useComputed, useWatch, etc.
3. **Use utility functions**: Check the [Utility Functions Documentation](./utils/v-cls) to learn about template directive tools like vCls, vStyle, vOn
4. **View complete examples**: Visit [CodeSandBox](https://codesandbox.io/p/sandbox/examples-f5rlpk) to view more practical project examples (For preview in CodeSandbox, you need to manually enter the route address of the corresponding example page in the address bar to access it)

## Frequently Asked Questions

### Q: Do I need Vue knowledge?

**A**: No. Although the API design is based on Vue 3, all features can be used in a React way. Familiarity with Vue will allow you to get started seamlessly, but it is not required.

### Q: Can it be used with existing React state management libraries?

**A**: Yes. The reactive system of VuReact Runtime is independent and can coexist with state management libraries such as Redux, Zustand, MobX, etc.

### Q: How about performance?

**A**: Based on the high-performance Proxy implementation of [Valtio](https://github.com/pmndrs/valtio), reactive tracking is very efficient. The `<Transition>` component is supported with high-performance transition effects based on [React Transition Group](https://github.com/reactjs/react-transition-group#readme). Component caching (KeepAlive) and on-demand import also help optimize performance.

### Q: Does it support Server-Side Rendering (SSR)?

**A**: Yes. All APIs are compatible with server-side rendering environments.
