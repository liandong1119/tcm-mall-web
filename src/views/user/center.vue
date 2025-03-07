<template>
  <div class="user-center">
    <div class="container">
      <el-row :gutter="20">
        <!-- 左侧导航 -->
        <el-col :span="6">
          <el-card class="menu-card">
            <template #header>
              <div class="user-info">
                <el-avatar :size="64" :src="userStore.userInfo.avatar" />
                <h3>{{ userStore.userInfo.nickname || userStore.userInfo.username }}</h3>
              </div>
            </template>
            <el-menu
              :default-active="activeMenu"
              class="menu"
              @select="handleSelect"
            >
              <el-menu-item index="/user/profile">
                <el-icon><User /></el-icon>
                <span>{{ $t('user.profile') }}</span>
              </el-menu-item>
              <el-menu-item index="/user/orders">
                <el-icon><List /></el-icon>
                <span>{{ $t('user.orders') }}</span>
              </el-menu-item>
              <el-menu-item index="/user/refunds">
                <el-icon><RefreshRight /></el-icon>
                <span>{{ $t('user.refunds') }}</span>
              </el-menu-item>
              <el-menu-item index="/user/favorites">
                <el-icon><Star /></el-icon>
                <span>{{ $t('user.favorites') }}</span>
              </el-menu-item>
            </el-menu>
          </el-card>
        </el-col>
        
        <!-- 右侧内容 -->
        <el-col :span="18">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { User, List, Star, RefreshRight } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)

const handleSelect = (path) => {
  if (path.startsWith('/')) {
    router.push(path).catch(err => {
      if (err.name !== 'NavigationDuplicated') {
        console.error('Navigation error:', err)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.user-center {
  padding: 20px 0;
  min-height: calc(100vh - var(--app-header-height) - var(--app-footer-height));
  background-color: var(--el-bg-color-page);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.menu-card {
  .user-info {
    text-align: center;
    padding: 10px 0;
    
    h3 {
      margin: 10px 0 0;
      font-size: 16px;
      color: var(--el-text-color-primary);
    }
  }
  
  .menu {
    border-right: none;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 