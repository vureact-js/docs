# Instructions

> ☣️ This chapter contains advanced content. Please complete the beginner and intermediate chapters before proceeding.

## What is "Mind Control"

It aims to enable developers to switch freely between the mental models of Vue and React. VuReact acts as the **Mind Control Tower**, providing the ability to master both Vue and React programming paradigms simultaneously:

1. When writing Vue semantics, follow Vue's data flow and compilation conventions.
2. When writing React semantics, strictly adhere to React Hook rules and component specifications.
3. When mixing code in the same file, clearly identify which mental model each segment of code belongs to.

## Why the Warning First

If you are "controlled" by a single mental model for a long time, mixing code can easily get out of control:

1. Writing unanalyzable expressions in Vue areas makes stable conversion by the compiler difficult.
2. Violating Hook top-level rules in React areas leads to direct runtime errors.
3. Chaotic boundaries between events and states result in a sharp rise in subsequent maintenance costs.

## Prerequisites

1. Proficiency in Vue 3 (`script setup`, reactivity, slots, component communication).
2. Proficiency in React (Hooks, dependency arrays, controlled components, ecosystem integration).
3. Ability to proactively perform "semantic partitioning" and avoid merging the two sets of rules into one.

## The Most Important Rule

Mixing code does not mean "writing code randomly".

The prerequisite for mixing code is: you can switch at any time and keep both sets of specifications correct.

## Reading Order for This Section

1. [Controlled Mixing](./mind-control-controlled-mixed)
2. [Full Ecosystem Unleashed](./mind-control-full-ecosystem)
