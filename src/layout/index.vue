<!-- 主布局组件 -->
<template>
  <div class="app-layout">
    <el-container>
      <el-header height="auto" class="app-header">
        <Header />
      </el-header>
      
      <el-main>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>

      <el-footer height="auto">
        <Footer />
      </el-footer>
    </el-container>

    <!-- 用户引导组件 -->
    <UserGuide />
  </div>
</template>

<script setup>
import Header from '@/layout/components/Header.vue'
import Footer from '@/layout/components/Footer.vue'
import UserGuide from '@/components/UserGuide.vue'
</script>

<style lang="scss" scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .el-container {
    flex: 1;
  }

  .app-header {
    padding: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .el-main {
    padding: 20px;
    background-color: var(--el-bg-color-page);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
</style> 