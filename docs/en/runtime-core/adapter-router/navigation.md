# Programmatic Navigation

In addition to using `<RouterLink>` to create `<a>` tags for navigation links, we can also use the router's instance methods to achieve navigation through code.

## Navigating to Different Locations

**You can access the router by calling `useRouter()`.** This method can take a string path or an object describing the address. For example:

```js
const router = useRouter()
// String path
router.push('/users/eduardo')

// Object with path
router.push({ path: '/users/eduardo' })

// Named route with parameters, allowing the router to build the URL
router.push({ name: 'user', params: { username: 'eduardo' } })

// With query parameters, resulting in /register?plan=private
router.push({ path: '/register', query: { plan: 'private' } })

// With hash, resulting in /about#team
router.push({ path: '/about', hash: '#team' })
```

**Note**: If `path` is provided, `params` will be ignored, which is not the case for `query` in the above example. Instead, as shown in the following example, you need to provide the route's `name` or manually write the complete `path` with parameters:

```js
const username = 'eduardo'
// We can build the URL manually, but we have to handle encoding ourselves
router.push(`/user/${username}`) // -> /user/eduardo
// Similarly
router.push({ path: `/user/${username}` }) // -> /user/eduardo
// When possible, use `name` and `params` to benefit from automatic URL encoding
router.push({ name: 'user', params: { username } }) // -> /user/eduardo
// `params` cannot be used with `path`
router.push({ path: '/user', params: { username } }) // -> /user
```

Since the `<RouterLink>` prop `to` accepts the same type of object as `router.push`, the rules for both are exactly the same.

`router.push` and all other navigation methods **do not return a Promise**!!

### How to Handle Asynchronous Navigation and Data Loading

If you need to execute asynchronous logic that depends on the new page's state after a navigation operation, you need to place the asynchronous logic in the new page or use tools designed for data loading.

1. You can preload data **before navigation occurs** through a `loader` function.

- **`loader` function**: Defined in the route configuration, it runs when navigation starts. The route component will only be rendered after the `loader` successfully returns data.
- **Advantage**: This makes your navigation operation a **waitable** process.

```jsx
// In route configuration
const router = [
  {
    path: "posts/:id",
    // The loader runs before navigation and waits for data loading to complete
    loader: async ({ params }) => {
      const data = await fetch(`/api/posts/${params.id}`);
      return data;
    },
    component: <PostDetail />,
  },
];
```

2. Managing asynchronous state within the new component

If you can't use the loader API, you have to manage the loading state inside the new component:

```jsx
function NewPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Asynchronous operation starts inside the new component
      const response = await fetch('/api/data');
      setData(await response.json());
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // The page shows a loading state during this period
  }

  return <div>{/* Use the loaded data */}</div>;
}
```

## Replacing the Current Location

You can directly add a `replace: true` property to the `to` parameter passed to `router.push`:

```js
router.push({ path: '/home', replace: true })
// Equivalent to
router.replace({ path: '/home' })
```

## Traversing History

This method takes an integer as a parameter, indicating how many steps to move forward or backward in the history stack.

```js
// Move forward one record, same as router.forward()
router.go(1)

// Move back one record, same as router.back()
router.go(-1)

// Move forward 3 records
router.go(3)

// Silently fail if there aren't that many records
router.go(-100)
router.go(100)
```
