# Introduction

This library is a lightweight and high-performance component library developed based on **React**, aiming to **accurately simulate Vue 3 built-in components** (such as `KeepAlive`, `Suspense`, `Transition`, etc.) and common functions and usage styles of **Vue Router**.

Through careful design and implementation, this library is committed to enabling developers familiar with the Vue framework to **seamlessly transition**, significantly reducing the learning cost of cross-framework development. It innovatively provides component-level adaptation solutions for **cross-framework development scenarios**, helping developers achieve efficient development and maintenance in multi-framework projects. All content and examples in the documentation are almost consistent with the **Vue official documentation**, except for a few differences.

## Core Features and Technology Stack

This library is semantically consistent with Vue for easy上手, and at the same time integrates well-validated excellent open-source libraries from the React community to ensure the efficiency and stability of function implementation:

- **Animation Transitions:** Draws on and integrates **[react-transition-group](https://github.com/reactjs/react-transition-group)** (^4.4.5)
- **Routing Management:** Draws on and integrates **[react-router-dom](https://www.google.com/search?q=https://reactrouter.com/en/main/start/overview)** (^7.9.5)

## Limitations Note

It should be objectively stated that due to the essential differences in underlying design philosophy and rendering mechanisms between **React** and **Vue**, although this library tries to be as close as possible to the Vue 3 experience through refined adaptation, there may still be slight behavioral differences or limitations in some edge cases.
