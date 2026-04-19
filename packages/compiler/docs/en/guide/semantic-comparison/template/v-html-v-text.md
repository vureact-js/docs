# v-html & v-text Semantic Comparison

How do Vue's frequently used `v-html` and `v-text` directives in templates transform into React code after semantic compilation?

## Prerequisites

To avoid redundancy in example code and ensure clear understanding, let's establish two conventions:

1. Vue/React code examples in this document are simplified core logic, omitting full component wrappers and unrelated configurations.
2. Readers are assumed to be familiar with the usage of v-html and v-text directives in Vue 3.

## `v-html` → React `dangerouslySetInnerHTML`

`v-html` is Vue's directive for dynamically rendering HTML strings as DOM elements, replacing all content within the element and parsing HTML tags.

- Vue code:

```vue
<div v-html="htmlContent"></div>
```

- VuReact compiled React code:

```jsx
<div dangerouslySetInnerHTML={{ __html: htmlContent }} />
```

As shown in the example: Vue's `v-html` directive is compiled into React's `dangerouslySetInnerHTML` property. VuReact adopts an **HTML injection compilation strategy**, converting template directives to React's special properties, **fully preserving Vue's HTML rendering semantics**—parsing the `htmlContent` string as HTML and inserting it into the DOM.

Key characteristics of this compilation approach:

1. **Semantic consistency**: Fully mimics Vue `v-html` behavior, directly rendering HTML strings
2. **Security warning**: React's `dangerouslySetInnerHTML` property name itself warns developers about XSS attack risks
3. **Content replacement**: Like Vue, replaces all existing content within the element

## `v-text` → React `JSX Interpolation Expression`

`v-text` is Vue's directive for setting plain text content within elements, replacing all content within the element but not parsing HTML tags.

- Vue code:

```vue
<p v-text="message"></p>
```

- VuReact compiled React code:

```jsx
<p>{message}</p>
```

As shown in the example: Vue's `v-text` directive is compiled into React's JSX interpolation expression. VuReact adopts a **text interpolation compilation strategy**, converting template directives to JSX curly brace expressions, **fully preserving Vue's text rendering semantics**—inserting `message` as plain text content into the element.

Key characteristics of this compilation approach:

1. **Semantic consistency**: Fully mimics Vue `v-text` behavior, rendering plain text content
2. **Automatic escaping**: React's JSX interpolation automatically escapes HTML special characters, preventing XSS attacks
3. **Content replacement**: Like Vue, replaces all existing content within the element

VuReact's compilation strategy ensures smooth migration from Vue to React, eliminating the need for developers to manually rewrite content rendering logic. The compiled code maintains both Vue's semantics and React's security best practices.
