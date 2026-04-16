import { DefaultTheme } from 'vitepress';

export default [
  {
    text: '介绍',
    items: [
      { text: '开始', link: '/guide/introduction' },
      { text: '理念', link: '/guide/philosophy' },
      { text: '为什么选 VuReact', link: '/guide/why' },
      { text: '什么是语义编译', link: '/guide/what-is-semantic-aware' },
    ],
  },
  { text: '更新日志', link: '/guide/changelog' },
  {
    text: '规范与最佳实践',
    items: [
      { text: '编译约定', link: '/guide/specification' },
      { text: '最佳实践', link: '/guide/best-practices' },
    ],
  },
  {
    text: '入门与实战',
    items: [
      {
        text: '基础教程',
        items: [
          { text: '计数器组件', link: '/guide/basic-tutorial' },
          { text: '模板基础', link: '/guide/beginner-template-stable' },
          { text: '组件通信', link: '/guide/beginner-component-communication' },
          { text: '组件引用', link: '/guide/beginner-component-references' },
          { text: 'SFC高级特性', link: '/guide/advanced-context-events-slots' },
          { text: '组件内样式', link: '/guide/advanced-style-pipeline' },
          { text: '脚本文件处理', link: '/guide/advanced-script-only-pipeline' },
          { text: '样式文件处理', link: '/guide/advanced-style-only-pipeline' },
        ],
      },
      {
        text: '项目实战',
        items: [
          { text: '客户关系管理后台（标准）', link: '/guide/crm-admin-backend' },
          {
            text: '客户支持协同后台（混写）',
            link: '/guide/customer-support-hub',
          },
        ],
      },
      {
        text: '心灵控制',
        items: [
          { text: '说明', link: '/guide/mind-control-readme' },
          { text: '可控混写', link: '/guide/mind-control-controlled-mixed' },
          { text: '全生态释放', link: '/guide/mind-control-full-ecosystem' },
        ],
      },
    ],
  },
  { text: 'ESLint 规则冲突', link: '/guide/eslint-rule-conflicts' },
  { text: '路由适配指南', link: '/guide/router-adaptation' },
  { text: '常见问题', link: '/guide/faq' },
  { text: 'CLI', link: '/guide/cli' },
  { text: '插件系统', link: '/guide/plugin' },
  {
    text: 'API',
    items: [
      { text: '总览', link: '/api/' },
      { text: '配置 API', link: '/api/config' },
      { text: '编译器 API', link: '/api/compiler' },
      { text: '流水线 API', link: '/api/pipeline' },
      { text: '插件系统 API', link: '/api/plugin-system' },
      { text: '上下文 API', link: '/api/compiler-context' },
      { text: '类型与结果', link: '/api/types' },
      { text: '导出清单', link: '/api/exports' },
    ],
  },
  {
    text: '语义编译对照',
    items: [
      { text: '总览', link: '/guide/conversion/overview' },
      {
        text: 'Script',
        items: [
          { text: 'ref', link: '/guide/conversion/script/ref' },
          { text: 'reactive', link: '/guide/conversion/script/reactive' },
          { text: 'computed', link: '/guide/conversion/script/computed' },
          { text: 'readonly', link: '/guide/conversion/script/readonly' },
          { text: 'toRef(s)', link: '/guide/conversion/script/toRef(s)' },
          { text: 'toRaw', link: '/guide/conversion/script/toRaw' },
          { text: 'watch', link: '/guide/conversion/script/watch' },
          { text: 'watchEffect', link: '/guide/conversion/script/watchEffect' },
          { text: '生命周期', link: '/guide/conversion/script/lifecycle' },
          { text: 'defineProps', link: '/guide/conversion/script/define-props' },
          { text: 'defineEmits', link: '/guide/conversion/script/define-emits' },
          { text: 'defineOptions', link: '/guide/conversion/script/define-options' },
          { text: 'defineSlots', link: '/guide/conversion/script/define-slots' },
          { text: 'defineExpose', link: '/guide/conversion/script/define-expose' },
          {
            text: 'defineAsyncComponent',
            link: '/guide/conversion/script/define-async-comp',
          },
          { text: 'useAttrs', link: '/guide/conversion/script/use-attrs' },
          { text: 'useTemplateRef', link: '/guide/conversion/script/use-template-ref' },
          { text: '箭头函数', link: '/guide/conversion/script/arrow-function' },
          { text: '常量与变量', link: '/guide/conversion/script/const-var' },
          { text: '类型声明', link: '/guide/conversion/script/type-declaration' },
          { text: '自动依赖收集', link: '/guide/conversion/script/auto-deps' },
          { text: 'script setup', link: '/guide/conversion/script/script-setup' },
          { text: 'Vue 路由', link: '/guide/conversion/script/vue-router' },
        ],
      },
      { text: 'Template', link: '/guide/conversion-template' },
      { text: 'Style', link: '/guide/conversion-style' },
    ],
  },
  {
    text: '其他',
    items: [
      { text: '赞助', link: '/guide/sponsor' },
      { text: '联系方式', link: '/guide/contact' },
    ],
  },
] as DefaultTheme.Config['sidebar'];
