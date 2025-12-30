# 编程式导航

除了使用 `<RouterLink>` 创建 a 标签来定义导航链接，我们还可以借助 router 的实例方法，通过编写代码来实现。

## 导航到不同的位置

**你可以通过调用 `useRouter()`来访问路由器。** 该方法的参数可以是一个字符串路径，或者一个描述地址的对象。例如：

```js
const router = useRouter()
// 字符串路径
router.push('/users/eduardo')

// 带有路径的对象
router.push({ path: '/users/eduardo' })

// 命名的路由，并加上参数，让路由建立 url
router.push({ name: 'user', params: { username: 'eduardo' } })

// 带查询参数，结果是 /register?plan=private
router.push({ path: '/register', query: { plan: 'private' } })

// 带 hash，结果是 /about#team
router.push({ path: '/about', hash: '#team' })
```

**注意**：如果提供了 `path`，`params` 会被忽略，上述例子中的 `query` 并不属于这种情况。取而代之的是下面例子的做法，你需要提供路由的 `name` 或手写完整的带有参数的 `path` ：

```js
const username = 'eduardo'
// 我们可以手动建立 url，但我们必须自己处理编码
router.push(`/user/${username}`) // -> /user/eduardo
// 同样
router.push({ path: `/user/${username}` }) // -> /user/eduardo
// 如果可能的话，使用 `name` 和 `params` 从自动 URL 编码中获益
router.push({ name: 'user', params: { username } }) // -> /user/eduardo
// `params` 不能与 `path` 一起使用
router.push({ path: '/user', params: { username } }) // -> /user
```

由于  `<RouterLink>` prop `to` 与 `router.push` 接受的对象种类相同，所以两者的规则完全相同。

`router.push` 和所有其他导航方法`不会返回 Promise`！！

### 如何处理异步导航和数据加载

如果你需要在导航操作之后执行依赖于新页面状态的异步逻辑，你需要将异步逻辑放到新页面或使用专为数据加载设计的工具。

1. 你可以通过 `loader` 函数在**导航发生之前**预加载数据。

- **`loader` 函数**：在路由配置中定义，它会在导航开始时运行。只有当 `loader` 成功返回数据后，路由组件才会被渲染。
- **优点**：这让你的导航操作变成一个**有等待机制**的过程。

```jsx
// 路由配置中
const router = [
  {
    path: "posts/:id",
    // loader 在导航发生前运行，等待数据加载完成
    loader: async ({ params }) => {
      const data = await fetch(`/api/posts/${params.id}`);
      return data;
    },
    component: <PostDetail />,
  },
];
```

2. 在新组件内部管理异步状态

如果你不能使用 loader API，你必须在新组件内部管理加载状态：

```jsx
function NewPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // 异步操作在新组件内部启动
      const response = await fetch('/api/data');
      setData(await response.json());
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // 在此期间页面显示加载状态
  }

  return <div>{/* 使用加载后的数据 */}</div>;
}
```

## 替换当前位置

可以直接在传递给 `router.push` 的 `to` 参数中增加一个属性 `replace: true` ：

```js
router.push({ path: '/home', replace: true })
// 相当于
router.replace({ path: '/home' })
```

## 横跨历史

该方法采用一个整数作为参数，表示在历史堆栈中前进或后退多少步

```js
// 向前移动一条记录，与 router.forward() 相同
router.go(1)

// 返回一条记录，与 router.back() 相同
router.go(-1)

// 前进 3 条记录
router.go(3)

// 如果没有那么多记录，静默失败
router.go(-100)
router.go(100)
```

