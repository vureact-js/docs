import { DefaultTheme } from 'vitepress';

export default [
  {
    text: 'Introduction',
    items: [
      { text: 'Getting Started', link: '/en/guide/introduction' },
      { text: 'Philosophy', link: '/en/guide/philosophy' },
      { text: 'Why Choose VuReact', link: '/en/guide/why' },
      { text: 'What is Semantics-Aware', link: '/en/guide/what-is-semantic-aware' },
    ],
  },
  { text: 'Change Log', link: '/en/guide/changelog' },
  {
    text: 'Specifications & Best Practices',
    items: [
      { text: 'Compilation Conventions', link: '/en/guide/specification' },
      { text: 'Best Practices', link: '/en/guide/best-practices' },
    ],
  },
  {
    text: 'Tuts & Practices',
    items: [
      {
        text: 'Basic Tutorials',
        items: [
          { text: 'Counter Component', link: '/en/guide/basic-tutorial' },
          {
            text: 'Template Basic',
            link: '/en/guide/beginner-template-stable',
          },
          {
            text: 'Component Communication',
            link: '/en/guide/beginner-component-communication',
          },
          {
            text: 'Component References',
            link: '/en/guide/beginner-component-references',
          },
          {
            text: 'SFC Advanced Features',
            link: '/en/guide/advanced-context-events-slots',
          },
          { text: 'Styles in Components', link: '/en/guide/advanced-style-pipeline' },
          { text: 'Script Files', link: '/en/guide/advanced-script-only-pipeline' },
          { text: 'Style Files', link: '/en/guide/advanced-style-only-pipeline' },
        ],
      },
      {
        text: 'Project Practice',
        items: [
          {
            text: 'CRM Admin Dashboard',
            link: '/en/guide/crm-admin-backend',
          },
          {
            text: 'Customer Support Hub',
            link: '/en/guide/customer-support-hub',
          },
        ],
      },
      {
        text: 'Mind Control',
        items: [
          { text: 'Introduction', link: '/en/guide/mind-control-readme' },
          {
            text: 'Controlled Mixed Writing',
            link: '/en/guide/mind-control-controlled-mixed',
          },
          {
            text: 'Full Ecosystem Unleashed',
            link: '/en/guide/mind-control-full-ecosystem',
          },
        ],
      },
    ],
  },
  { text: 'ESLint Rule Conflicts', link: '/en/guide/eslint-rule-conflicts' },
  { text: 'Router Adaptation', link: '/en/guide/router-adaptation' },
  { text: 'FAQ', link: '/en/guide/faq' },
  { text: 'CLI', link: '/en/guide/cli' },
  { text: 'Plugin', link: '/en/guide/plugin' },
  {
    text: 'Conversion Guide',
    items: [
      { text: 'Overview', link: '/en/guide/conversion-overview' },
      { text: 'Template Guide', link: '/en/guide/conversion-template' },
      { text: 'Script Guide', link: '/en/guide/conversion-script' },
      { text: 'Style Guide', link: '/en/guide/conversion-style' },
    ],
  },
  {
    text: 'API',
    items: [
      { text: 'Overview', link: '/en/api/' },
      { text: 'Config API', link: '/en/api/config' },
      { text: 'Compiler API', link: '/en/api/compiler' },
      { text: 'Pipeline API', link: '/en/api/pipeline' },
      { text: 'Plugin System API', link: '/en/api/plugin-system' },
      { text: 'Context API', link: '/en/api/compiler-context' },
      { text: 'Types & Results', link: '/en/api/types' },
      { text: 'Exports Manifest', link: '/en/api/exports' },
    ],
  },
  {
    text: 'Others',
    items: [
      { text: 'Sponsor', link: '/en/guide/sponsor' },
      { text: 'Contact', link: '/en/guide/contact' },
    ],
  },
] as DefaultTheme.Config['sidebar'];
