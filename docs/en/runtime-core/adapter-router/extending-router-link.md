# Extending RouterLink

Functionality has been extended based on the `<Link>` component from `react-router-dom`.

When you need more flexible control over the rendering of links, such as rendering a link as a button or switching to a non-link element when the link is active, you can use the `customRender` property.

```jsx
<RouterLink
  to="/page"
  customRender={({ isActive, navigate }) => (
    <button 
      onClick={navigate} 
      className={isActive ? 'btn-primary' : 'btn-secondary'}>
      Go to Page
    </button>
  )}
/>
```

## Props

The `<RouterLink>` component supports all props of the `<Link>` component and extends the following custom properties:

| **Prop Name**          | **Type**                    | **Description**                                      | Required |
| ---------------------- | --------------------------- | ---------------------------------------------------- | -------- |
| to             | `String` \| `RouterOptions` | The routing address to jump to                        | Yes      |
| replace              | `Boolean`                   | Use `history.replace` for navigation.                | No       |
| activeClassName      | `String`                    | CSS class name applied when the link **matches** the current route | No       |
| inActiveClassName    | `String`                    | CSS class name applied when the link **does not match** the current route | No       |
| exactActiveClassName | `String`                    | CSS class name applied when the link **exactly matches** the current route | No       |
| customRender        | `(args) => ReactNode`       | Content for custom rendering of the component         | No       |

### CustomRenderArgs

| **Property Name** | **Type**     | **Description**                                                     |
| ----------------- | ------------ | ------------------------------------------------------------------- |
| href          | `String`     | The finally parsed **accessible URL**, including `pathname`, `search`, and `hash`. |
| isActive    | `Boolean`    | Whether the link is in the **active** state (non-exact match).      |
| isExactActive | `Boolean`    | Whether the link is in the **exact active** state.                  |
| navigate    | `() => void` | A function for performing navigation, which you can call in the click event of any element (such as `<button>`). |