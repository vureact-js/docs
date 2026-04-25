import { DefaultTheme } from 'vitepress';

export default [
  {
    text: '其他',
    items: [
      {
        text: '赞助',
        link: '/guide/sponsor',
      },
      {
        text: '联系方式',
        link: '/guide/contact',
      },
    ],
  },
  {
    text: '反馈问题',
    link: 'https://github.com/vureact-js/core/issues',
  },
  {
    text: '在线案例',
    items: [
      {
        text: '客户关系管理后台（标准）',
        link: 'https://codesandbox.io/p/github/vureact-js/example-crm-admin-backend/master',
      },
      {
        text: '客户支持协同后台（混写）',
        link: 'https://codesandbox.io/p/github/vureact-js/example-customer-support-hub/master?import=true',
      },
    ],
  },
  {
    text: '指南',
    items: [
      { text: '更新日志', link: '/guide/changelog' },
      { text: '规范与最佳实践', link: '/guide/specification' },
      { text: '快速开始', link: '/guide/quick-start' },
      { text: '路由适配指南', link: '/guide/router-adaptation' },
      { text: '常见问题', link: '/guide/faq' },
      { text: 'CLI', link: '/guide/cli' },
      { text: 'API', link: '/api/' },
      { text: '语义编译对照', link: '/guide/semantic-comparison/overview' },
    ],
  },
  {
    text: '生态系统',
    items: [
      {
        text: '官方库',
        items: [
          { text: 'VuReact Runtime 1.x', link: 'https://runtime.vureact.top' },
          { text: 'VuReact Router 2.x', link: 'https://router.vureact.top' },
        ],
      },
    ],
  },
] as DefaultTheme.Config['nav'];
