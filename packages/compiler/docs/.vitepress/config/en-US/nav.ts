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
      { text: 'Changelog', link: '/en/guide/changelog' },
      { text: 'Specifications & Best Practices', link: '/en/guide/specification' },
      { text: 'Tuts & Practices', link: '/en/guide/basic-tutorial' },
      { text: 'CLI', link: '/guide/cli' },
      { text: 'Router Adaptation', link: '/en/guide/router-adaptation' },
      { text: 'FAQ', link: '/en/guide/faq' },
      { text: 'API', link: '/api/' },
      { text: 'Conversion Guide', link: '/en/guide/conversion-overview' },
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
