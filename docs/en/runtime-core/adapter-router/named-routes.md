# Named Routes

When creating a route, we can choose to give it a `name`:

```jsx
const routes = [
  {
    path: '/user/:username',
    name: 'profile',
    component: <User />
  }
]
```

Then we can use the `name` instead of the `path` to pass the `to` prop to `<RouterLink>`:

```jsx
<RouterLink to={{ name: 'profile', params: { username: 'apple' } }}>
  User profile
</RouterLink>
```

The above example will create a link pointing to `/user/apple`.

Using `name` has many advantages:

- No hard-coded URLs.
- Automatic encoding/decoding of `params`.
- Prevents you from making typos in the URL.

The names of all routes **must be unique**.