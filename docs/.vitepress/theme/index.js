import BackToTopButton from '@miletorix/vitepress-back-to-top-button';
import '@miletorix/vitepress-back-to-top-button/style.css';
import DefaultTheme from 'vitepress/theme';
import './iframe-loading.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    BackToTopButton(app);
  }
}