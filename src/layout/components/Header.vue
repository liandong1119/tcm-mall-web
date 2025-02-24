<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <router-link to="/" class="logo">
          <img src="@/assets/logo.svg" alt="TCM Mall" class="logo-img">
          <span class="logo-text">{{ $t('common.systemName') }}</span>
        </router-link>

        <!-- 导航菜单 -->
        <nav class="nav-menu">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path"
            :to="item.path"
            class="nav-item"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ $t(item.title) }}</span>
          </router-link>
        </nav>

        <!-- 搜索框 -->
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            :placeholder="$t('common.search')"
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <!-- 用户菜单 -->
        <div class="user-menu">
          <!-- 购物车 -->
          <router-link to="/cart" class="cart-link">
            <el-badge :value="cartStore.totalCount" :hidden="!cartStore.totalCount">
              <el-icon :size="24"><ShoppingCart /></el-icon>
            </el-badge>
          </router-link>

          <!-- 语言切换 -->
          <LanguageSwitch />

          <!-- 用户信息 -->
          <template v-if="userStore.isLoggedIn">
            <el-dropdown>
              <span class="user-info">
                <el-avatar 
                  :size="32"
                  :src="userStore.userInfo.avatar"
                >
                  {{ userStore.userInfo.nickname?.[0] || userStore.userInfo.username?.[0] }}
                </el-avatar>
                <span class="username">
                  {{ userStore.userInfo.nickname || userStore.userInfo.username }}
                </span>
                <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <router-link to="/user/profile" class="dropdown-link">
                      <el-icon><User /></el-icon>
                      {{ $t('user.profile') }}
                    </router-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <router-link to="/user/orders" class="dropdown-link">
                      <el-icon><List /></el-icon>
                      {{ $t('user.orders') }}
                    </router-link>
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">
                    <el-icon><SwitchButton /></el-icon>
                    {{ $t('user.logout') }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <router-link to="/user/login" class="auth-link login-link">
              {{ $t('user.login') }}
            </router-link>
            <router-link to="/user/register" class="auth-link register-link">
              {{ $t('user.register') }}
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { 
  Search, 
  ShoppingCart, 
  ArrowDown,
  User,
  List,
  SwitchButton,
  HomeFilled,
  Grid
} from '@element-plus/icons-vue'
import LanguageSwitch from '@/components/LanguageSwitch.vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()
const searchKeyword = ref('')

const menuItems = [
  { path: '/', title: 'home.title', icon: 'HomeFilled' },
  { path: '/category/all', title: 'category.title', icon: 'Grid' }
]

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchKeyword.value.trim() }
    })
  }
}

const handleLogout = async () => {
  await userStore.logout()
  ElMessage.success('退出成功')
  router.push('/user/login')
}
</script>

<style lang="scss" scoped>
.header {
  height: var(--app-header-height);
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--el-color-primary);
  
  .logo-img {
    height: 40px;
    margin-right: 10px;
    transition: transform var(--app-transition-duration);
    
    &:hover {
      transform: scale(1.1);
    }
  }
  
  .logo-text {
    font-size: 20px;
    font-weight: bold;
    background: linear-gradient(120deg, var(--el-color-primary), var(--el-color-primary-light-3));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.nav-menu {
  display: flex;
  gap: 30px;
  margin: 0 40px;

  .nav-item {
    text-decoration: none;
    color: var(--el-text-color-regular);
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: var(--app-border-radius);
    transition: all var(--app-transition-duration);

    .el-icon {
      font-size: 18px;
    }

    &:hover,
    &.router-link-active {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }
  }
}

.search-box {
  width: 400px;
  margin: 0 20px;

  .search-input {
    :deep(.el-input__wrapper) {
      border-radius: 20px;
      padding-left: 15px;
      
      &.is-focus {
        box-shadow: 0 0 0 1px var(--el-color-primary);
      }
    }
    
    :deep(.el-input__prefix) {
      color: var(--el-text-color-placeholder);
    }
  }
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 20px;

  .cart-link {
    color: var(--el-text-color-regular);
    text-decoration: none;
    transition: all var(--app-transition-duration);

    &:hover {
      color: var(--el-color-primary);
      transform: translateY(-2px);
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    
    .username {
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .auth-link {
    text-decoration: none;
    padding: 8px 16px;
    border-radius: var(--app-border-radius);
    transition: all var(--app-transition-duration);

    &.login-link {
      color: var(--el-color-primary);
      
      &:hover {
        background-color: var(--el-color-primary-light-9);
      }
    }

    &.register-link {
      background-color: var(--el-color-primary);
      color: #fff;
      
      &:hover {
        background-color: var(--el-color-primary-dark-2);
      }
    }
  }
}

.dropdown-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: inherit;
  text-decoration: none;
  
  .el-icon {
    margin-right: 4px;
  }
}
</style> 