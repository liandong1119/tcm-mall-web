<template>
  <div class="user-guide">
    <!-- 引导触发按钮，通常在第一次访问时自动触发 -->
    <el-button
      v-if="showGuideButton"
      type="primary"
      class="guide-button"
      @click="startGuide"
    >
      {{ $t('guide.startGuide') }}
    </el-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { driver } from "driver.js"
import 'driver.js/dist/driver.css'

const { t } = useI18n()
const router = useRouter()
const showGuideButton = ref(false)

// 定义引导步骤
const steps = [
  {
    element: '.logo',
    popover: {
      title: t('guide.logo.title'),
      description: t('guide.logo.description'),
      position: 'bottom'
    }
  },
  {
    element: '.search-box',
    popover: {
      title: t('guide.search.title'),
      description: t('guide.search.description'),
      position: 'bottom'
    }
  },
  {
    element: '.category-nav',
    popover: {
      title: t('guide.category.title'),
      description: t('guide.category.description'),
      position: 'right'
    }
  },
  {
    element: '.cart-link',
    popover: {
      title: t('guide.cart.title'),
      description: t('guide.cart.description'),
      position: 'left'
    }
  },
  {
    element: '.user-info',
    popover: {
      title: t('guide.userCenter.title'),
      description: t('guide.userCenter.description') + '\n' + t('guide.userMenu.description'),
      position: 'left'
    }
  },
//   {
//     element: '.service-guarantee',
//     popover: {
//       title: t('guide.service.title'),
//       description: t('guide.service.description'),
//       position: 'top'
//     }
//   }
]

// 创建 driver 实例
const driverObj = driver({
  animate: true,
  opacity: 0.7,
  padding: 10,
  allowClose: true,
  overlayClickNext: true,
  doneBtnText: t('guide.done'),
  closeBtnText: t('guide.close'),
  nextBtnText: t('guide.next'),
  prevBtnText: t('guide.prev'),
  steps,
  onReset: () => {
    // 引导结束或关闭时的回调
    localStorage.setItem('userGuideShown', 'true')
  }
})

// 开始引导
const startGuide = () => {
  driverObj.drive()
}

onMounted(() => {
  // 检查是否是第一次访问
  const hasShownGuide = localStorage.getItem('userGuideShown')
  if (!hasShownGuide) {
    showGuideButton.value = false
    // 自动开始引导
    startGuide()
  }
})

defineExpose({
  startGuide
})
</script>

<style lang="scss" scoped>
.user-guide {
  .guide-button {
    position: fixed;
    right: 20px;
    bottom: 100px;
    z-index: 1000;
  }
}

:deep(.driver-popover) {
  min-width: 280px;
  
  .driver-popover-title {
    font-size: 16px;
    color: var(--el-color-primary);
    margin-bottom: 8px;
  }
  
  .driver-popover-description {
    font-size: 14px;
    color: var(--el-text-color-regular);
    line-height: 1.5;
  }

  .driver-popover-footer {
    margin-top: 12px;
    
    button {
      font-size: 14px;
      padding: 6px 12px;
      border-radius: 4px;
      
      &.driver-next-btn {
        background-color: var(--el-color-primary);
        color: white;
      }
    }
  }
}
</style> 