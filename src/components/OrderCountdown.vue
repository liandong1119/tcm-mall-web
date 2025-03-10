<template>
  <div class="order-countdown" v-if="showCountdown">
    <el-icon><Timer /></el-icon>
    <span class="countdown-text">
      {{ $t('order.paymentTimeout') }}:
      <span class="time" :class="{ 'warning': isWarning }">
        {{ formatTime(remainingTime) }}
      </span>
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Timer } from '@element-plus/icons-vue'
import { getOrderPaymentCountdown } from '@/api/order'

const props = defineProps({
  orderCode: {
    type: String,
    required: true
  },
  // 是否自动开始倒计时
  autoStart: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['timeout', 'update:remainingTime'])

const { t } = useI18n()
const remainingTime = ref(0)
const timer = ref(null)
const showCountdown = ref(false)

// 当剩余时间小于5分钟时显示警告样式
const isWarning = computed(() => remainingTime.value <= 300)

// 格式化时间
const formatTime = (seconds) => {
  if (seconds <= 0) return '00:00:00'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 开始倒计时
const startCountdown = () => {
  if (timer.value) return
  
  timer.value = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
      emit('update:remainingTime', remainingTime.value)
    } else {
      stopCountdown()
      emit('timeout')
    }
  }, 1000)
}

// 停止倒计时
const stopCountdown = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

// 初始化倒计时数据
const initCountdown = async () => {
  try {
    const data = await getOrderPaymentCountdown(props.orderCode)
    if (data.status === 'pending' && data.remainingTime > 0) {
      remainingTime.value = data.remainingTime
      showCountdown.value = true
      if (props.autoStart) {
        startCountdown()
      }
    } else {
      showCountdown.value = false
    }
  } catch (error) {
    console.error('Failed to get countdown:', error)
    showCountdown.value = false
  }
}

// 组件挂载时初始化
onMounted(() => {
  initCountdown()
})

// 组件卸载时清理定时器
onUnmounted(() => {
  stopCountdown()
})

// 暴露方法给父组件
defineExpose({
  startCountdown,
  stopCountdown,
  initCountdown
})
</script>

<style lang="scss" scoped>
.order-countdown {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--el-text-color-regular);
  
  .el-icon {
    font-size: 16px;
  }
  
  .countdown-text {
    font-size: 14px;
    
    .time {
      font-weight: bold;
      color: var(--el-color-primary);
      
      &.warning {
        color: var(--el-color-danger);
      }
    }
  }
}
</style> 