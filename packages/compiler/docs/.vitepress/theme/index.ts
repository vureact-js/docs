import BackToTopButton from '@miletorix/vitepress-back-to-top-button';
import '@miletorix/vitepress-back-to-top-button/style.css';
import DefaultTheme from 'vitepress/theme';
import VideoHeroLayout from './components/VideoHeroLayout.vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  Layout: VideoHeroLayout,
  enhanceApp({ app }: any) {
    BackToTopButton(app);
  },
};
