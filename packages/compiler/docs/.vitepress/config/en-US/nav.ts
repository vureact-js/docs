import { DefaultTheme } from 'vitepress';

export default [
  {
    text: 'Others',
    items: [
      {
        text: 'Sponsor',
        link: '/en/guide/sponsor',
      },
      {
        text: 'Contact',
        link: '/en/guide/contact',
      },
    ],
  },
  {
    text: 'Issues',
    link: 'https://github.com/vureact-js/core/issues',
  },
  {
    text: 'Playground',
    items: [
      {
        text: 'CRM Admin Dashboard (Standard)',
        link: 'https://codesandbox.io/p/github/vureact-js/example-crm-admin-backend/master',
      },
      {
        text: 'Customer Support Hub (Mixed)',
        link: 'https://codesandbox.io/p/github/vureact-js/example-customer-support-hub/master?import=true',
      },
    ],
  },
  {
    text: 'Guide',
    items: [
      { text: 'Quick Start', link: '/en/guide/quick-start' },
      { text: 'Progressive Migration', link: '/en/guide/progressive-migration' },
      { text: 'Best Practices', link: '/en/guide/best-practices' },
      { text: 'FAQ', link: '/en/guide/faq' },
      { text: 'Router Adaptation Guide', link: '/en/guide/router-adaptation' },
      { text: 'Semantic Compilation Reference', link: '/en/guide/semantic-comparison/overview' },
      { text: 'CLI', link: '/en/guide/cli' },
      { text: 'API', link: '/api/' },
      { text: 'Changelog', link: '/en/guide/changelog' },
    ],
  },
  {
    text: 'Ecosystem',
    items: [
      {
        text: 'Official Libraries',
        items: [
          { text: 'VuReact Runtime 1.x', link: 'https://runtime.vureact.top/en' },
          { text: 'VuReact Router 2.x', link: 'https://router.vureact.top/en' },
        ],
      },
    ],
  },
] as DefaultTheme.Config['nav'];
