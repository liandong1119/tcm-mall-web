<!-- 主布局组件 -->
<template>
  <div class="app-container">
    <Header />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<style lang="scss" scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.main-content {
  flex: 1;
  padding: 20px 0;
  min-height: calc(100vh - var(--app-header-height) - var(--app-footer-height));
  
  // 添加渐变背景
  background: linear-gradient(
    135deg,
    rgba(43, 153, 57, 0.05) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
  
  // 添加网格背景
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--app-transition-duration) ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 