import { DefaultTheme } from 'vitepress';

export default [
  {
    text: 'Introduction',
    items: [
      { text: 'Getting Started', link: '/en/guide/introduction' },
      { text: 'Philosophy', link: '/en/guide/philosophy' },
      { text: 'Why VuReact', link: '/en/guide/why' },
      { text: 'Semantic Compilation', link: '/en/guide/what-is-semantic-aware' },
    ],
  },
  { text: 'Changelog', link: '/en/guide/changelog' },
  {
    text: 'Guidelines',
    items: [
      { text: 'Compilation Conventions', link: '/en/guide/specification' },
      { text: 'Best Practices', link: '/en/guide/best-practices' },
    ],
  },
  {
    text: 'Guides',
    items: [
      {
        text: 'Basic Tutorials',
        items: [
          { text: 'Counter Component', link: '/en/guide/basic-tutorial' },
          { text: 'Template Basics', link: '/en/guide/beginner-template-stable' },
          { text: 'Component Communication', link: '/en/guide/beginner-component-communication' },
          { text: 'Component References', link: '/en/guide/beginner-component-references' },
          { text: 'Advanced SFC Features', link: '/en/guide/advanced-context-events-slots' },
          { text: 'Component Styling', link: '/en/guide/advanced-style-pipeline' },
          { text: 'Script File Processing', link: '/en/guide/advanced-script-only-pipeline' },
          { text: 'Style File Processing', link: '/en/guide/advanced-style-only-pipeline' },
        ],
      },
      {
        text: 'Real-World Projects',
        items: [
          { text: 'CRM Admin Dashboard (Standard)', link: '/en/guide/crm-admin-backend' },
          {
            text: 'Customer Support Hub (Mixed Mode)',
            link: '/en/guide/customer-support-hub',
          },
        ],
      },
      {
        text: 'Mind Control',
        items: [
          { text: 'Overview', link: '/en/guide/mind-control-readme' },
          { text: 'Controlled Mixed Mode', link: '/en/guide/mind-control-controlled-mixed' },
          { text: 'Full Ecosystem Mode', link: '/en/guide/mind-control-full-ecosystem' },
        ],
      },
    ],
  },
  { text: 'ESLint Rule Conflicts', link: '/en/guide/eslint-rule-conflicts' },
  { text: 'Router Adaptation Guide', link: '/en/guide/router-adaptation' },
  { text: 'FAQ', link: '/en/guide/faq' },
  { text: 'CLI', link: '/en/guide/cli' },
  { text: 'Plugin System', link: '/en/guide/plugin' },
  {
    text: 'API',
    items: [
      { text: 'Overview', link: '/en/api/' },
      { text: 'Configuration API', link: '/en/api/config' },
      { text: 'Compiler API', link: '/en/api/compiler' },
      { text: 'Pipeline API', link: '/en/api/pipeline' },
      { text: 'Plugin System API', link: '/en/api/plugin-system' },
      { text: 'Context API', link: '/en/api/compiler-context' },
      { text: 'Types & Results', link: '/en/api/types' },
      { text: 'Exports', link: '/en/api/exports' },
    ],
  },
  {
    text: 'Semantic Comparison',
    items: [
      { text: 'Overview', link: '/en/guide/semantic-comparison/overview' },
      {
        text: 'Script',
        items: [
          { text: 'ref', link: '/en/guide/semantic-comparison/script/ref' },
          { text: 'reactive', link: '/en/guide/semantic-comparison/script/reactive' },
          { text: 'computed', link: '/en/guide/semantic-comparison/script/computed' },
          { text: 'readonly', link: '/en/guide/semantic-comparison/script/readonly' },
          { text: 'toRef(s)', link: '/en/guide/semantic-comparison/script/toRef(s)' },
          { text: 'watch', link: '/en/guide/semantic-comparison/script/watch' },
          { text: 'watchEffect', link: '/en/guide/semantic-comparison/script/watchEffect' },
          { text: 'Lifecycle', link: '/en/guide/semantic-comparison/script/lifecycle' },
          { text: 'defineProps', link: '/en/guide/semantic-comparison/script/define-props' },
          { text: 'defineEmits', link: '/en/guide/semantic-comparison/script/define-emits' },
          { text: 'defineOptions', link: '/en/guide/semantic-comparison/script/define-options' },
          { text: 'defineSlots', link: '/en/guide/semantic-comparison/script/define-slots' },
          { text: 'defineExpose', link: '/en/guide/semantic-comparison/script/define-expose' },
          {
            text: 'defineAsyncComponent',
            link: '/en/guide/semantic-comparison/script/define-async-comp',
          },
          { text: 'provide & inject', link: '/en/guide/semantic-comparison/script/provide-inject' },
          { text: 'useAttrs', link: '/en/guide/semantic-comparison/script/use-attrs' },
          { text: 'useTemplateRef', link: '/en/guide/semantic-comparison/script/use-template-ref' },
          { text: 'Constants & Variables', link: '/en/guide/semantic-comparison/script/const-var' },
          { text: 'Arrow Functions', link: '/en/guide/semantic-comparison/script/arrow-function' },
          {
            text: 'Automatic Dependency Tracking',
            link: '/en/guide/semantic-comparison/script/auto-deps',
          },
          {
            text: 'Type Declarations',
            link: '/en/guide/semantic-comparison/script/type-declaration',
          },
          { text: 'Script setup', link: '/en/guide/semantic-comparison/script/script-setup' },
          { text: 'Vue Router', link: '/en/guide/semantic-comparison/script/vue-router' },
        ],
      },
      {
        text: 'Template',
        items: [
          { text: 'v-bind', link: '/en/guide/semantic-comparison/template/v-bind' },
          { text: 'v-for', link: '/en/guide/semantic-comparison/template/v-for' },
          { text: 'v-html & v-text', link: '/en/guide/semantic-comparison/template/v-html-v-text' },
          { text: 'v-if & v-else', link: '/en/guide/semantic-comparison/template/v-if-v-else' },
          { text: 'v-memo & v-once', link: '/en/guide/semantic-comparison/template/v-memo-v-once' },
          { text: 'v-model', link: '/en/guide/semantic-comparison/template/v-model' },
          { text: 'v-on', link: '/en/guide/semantic-comparison/template/v-on' },
          { text: 'v-show', link: '/en/guide/semantic-comparison/template/v-show' },
          { text: 'v-slot', link: '/en/guide/semantic-comparison/template/v-slot' },
          { text: 'KeepAlive', link: '/en/guide/semantic-comparison/template/keep-alive' },
          { text: 'Suspense', link: '/en/guide/semantic-comparison/template/suspense' },
          { text: 'Teleport', link: '/en/guide/semantic-comparison/template/teleport' },
          {
            text: 'TransitionGroup',
            link: '/en/guide/semantic-comparison/template/transition-group',
          },
          { text: 'Transition', link: '/en/guide/semantic-comparison/template/transition' },
          { text: 'Dynamic Component', link: '/en/guide/semantic-comparison/template/is' },
          { text: 'slot', link: '/en/guide/semantic-comparison/template/slot' },
        ],
      },
      { text: 'Style', link: '/en/guide/semantic-comparison/style/' },
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
