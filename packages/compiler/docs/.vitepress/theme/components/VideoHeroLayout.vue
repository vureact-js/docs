<template>
  <DefaultThemeLayout>
    <!-- 该 slot 位置介于 hero 和 features 区域之间 -->
    <template #home-hero-after>
      <div class="hero-video-wrapper">
        <video
          autoplay
          loop
          muted
          playsinline
          preload="metadata"
          class="hero-video"
          poster="/images/hero_demo_poster.jpg"
        >
          <source src="/static/hero_demo_3MB.mp4" type="video/mp4" />
          您的浏览器不支持视频播放。
        </video>
      </div>
    </template>
  </DefaultThemeLayout>
</template>

<script setup>
import DefaultTheme from 'vitepress/theme';
const { Layout: DefaultThemeLayout } = DefaultTheme;
</script>

<style scoped>
.hero-video-wrapper {
  margin: 2rem auto 3rem;
  width: 100%;
  max-width: 1152px;
  padding: 0 24px;
}

.hero-video {
  width: 100%;
  border-radius: 12px;
  transition: box-shadow 0.3s ease;
}

/* 深色模式适配 */
.dark .hero-video {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 响应式断点 - 与 VitePress 默认主题保持一致 */
@media (min-width: 640px) {
  .hero-video-wrapper {
    padding: 0 48px;
  }
}

@media (min-width: 960px) {
  .hero-video-wrapper {
    max-width: 1152px;
    padding: 0 64px;
  }
}

@media (min-width: 1440px) {
  .hero-video-wrapper {
    max-width: 1280px;
  }
}

/* 移动端优化 */
@media (max-width: 640px) {
  .hero-video-wrapper {
    margin: 1rem auto 2rem;
  }
}
</style>
