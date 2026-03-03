# Introduction

## What is VuReact Runtime

**VuReact Runtime** is a Vue 3 feature adaptation layer designed specifically for React, enabling you to seamlessly use core Vue 3 features in React applications—including built-in components, reactive APIs, and template directive utilities.

### Background

VuReact Runtime was originally developed to address **runtime scenarios that the [VuReact Compiler](https://vureact.top/en) cannot handle**. During the compilation and conversion process from Vue 3 to React, some features cannot be fully processed at compile time and require runtime support. This library is a tailored solution for these scenarios.

Although it is customized for the VuReact Compiler, it is completely independent in design and **can be used standalone** without relying on any compilation tools.

## Core Values

### 1. Optimal Developer Experience

- **Friendly Migration for Vue Developers**: If you are familiar with Vue 3, you can continue using familiar APIs and patterns in React.
- **Enhancement for React Projects**: Introduce excellent Vue 3 features (e.g., component caching, reactive state management) to existing React projects.

### 2. Progressive Adoption

- **Zero Invasiveness**: No need to rewrite existing code; specific features can be imported on demand.
- **Modular Design**: Each feature can be used independently, supporting Tree Shaking.

### 3. Production-Ready

- **Reactive System**: Leverages the mature [Valtio](https://github.com/pmndrs/valtio) as the reactive engine, with React as the rendering layer.
- **Animation Transitions**: Uses [React Transition Group](https://github.com/reactjs/react-transition-group#readme) to provide high-performance transition effects for the `<Transition>` component.
- **Complete Type Support**: 100% written in TypeScript, with full type definitions provided.
- **Test Coverage**: Comprehensive unit tests ensure stability.

## Relationship with VuReact Compiler

```txt
┌─────────────────────────────────────────────┐
│            VuReact Ecosystem                │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────┐  ┌─────────────────┐   │
│  │  Compiler       │  │   Runtime       │   │
│  │                 │  │                 │   │
│  │ • Vue → React   │  │ • Runtime Features │
│  │   Code Conversion│  │ • Reactive System  │
│  │ • Template Compilation │  │ • Vue Component Adaptation │
│  │ • Static Analysis │  │ • Directive Utilities │
│  └─────────────────┘  └───────────────── ┘   │
│                                              │
│  Can be used standalone or in combination    │
└──────────────────────────────────────────────┘
```

### Standalone Usage Scenarios

- You have a pure React project and want to introduce specific Vue 3 features.
- You are migrating from Vue to React and need a transitional compatibility solution.
- You prefer Vue's development mode but your project's tech stack requires React.

### Usage Scenarios with the Compiler

The VuReact Compiler has integrated support for the runtime library—you do not need to manually import or write related code, including dependency collection and other logic.

## Technical Architecture

VuReact Runtime adopts a layered architecture design:

1. **Adapter Layer**
   - `adapter-components`: React implementations of Vue's built-in components
   - `adapter-hooks`: React Hooks wrappers for Vue's reactive APIs
   - `adapter-utils`: JSX utility functions for Vue's template directives

2. **Reactive Engine**
   - High-performance Proxy implementation based on Valtio
   - Complete reactive tracking and dependency collection
   - Supports deep reactivity and shallow reactivity

3. **React Integration Layer**
   - 100% React Hooks API
   - Seamless integration with React lifecycle
   - Support for Concurrent Features

## Getting Started

Whether you:

- Want to add Vue 3 features to an existing React project
- Need a compatibility solution while migrating from Vue to React
- Are simply curious about how to combine the strengths of the two frameworks

VuReact Runtime offers an elegant solution. Next, let's get started with the [Quick Start](./quick-start.md)!
