<!-- 支付页面 -->
<template>
  <div class="payment-page">
    <div class="container">
      <el-card class="payment-card">
        <template #header>
          <div class="card-header">
            <span>{{ $t('payment.title') }}</span>
          </div>
        </template>

        <div class="payment-info">
          <el-descriptions :column="1" border>
            <el-descriptions-item :label="$t('order.orderNo')">
              {{ orderCode }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('payment.amount')">
              <span class="amount">{{ $t('common.currency') }}{{ amount }}</span>
            </el-descriptions-item>
          </el-descriptions>

          <!-- 支付方式选择 -->
          <div class="payment-methods">
            <h3>{{ $t('payment.method') }}</h3>
            <el-radio-group v-model="selectedMethod">
              <el-radio label="alipay">
                <div class="payment-method-item">
                  <el-icon><Money /></el-icon>
                  <span>{{ $t('payment.alipay') }}</span>
                </div>
              </el-radio>
              <el-radio label="wechat">
                <div class="payment-method-item">
                  <el-icon><ChatDotRound /></el-icon>
                  <span>{{ $t('payment.wechat') }}</span>
                </div>
              </el-radio>
            </el-radio-group>
          </div>

          <!-- 支付按钮 -->
          <div class="payment-action">
            <el-button type="primary" size="large" :loading="paying" @click="handlePayment">
              {{ $t('payment.confirm') }}
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { getOrderDetail, payOrder } from '@/api/order'
import { Money, ChatDotRound } from '@element-plus/icons-vue'
import request from '@/utils/request'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const orderCode = ref(route.query.orderCode || '')
const amount = ref(route.query.amount || '0.00')
const orderId = ref(route.query.orderId || null)
const selectedMethod = ref('alipay')
const paying = ref(false)

// 处理支付
const handlePayment = async () => {
  if (!selectedMethod.value) {
    ElMessage.warning(t('payment.selectMethod'))
    return
  }

  paying.value = true
  try {
    await request({
      url: '/order/pay',
      method: 'post',
      data: { 
        orderCode: orderCode.value,
        orderId: orderId.value 
      }
    })
    
    ElMessage.success(t('payment.success'))
    // 支付成功后跳转到订单详情页
    router.push(`/order/${orderCode.value}`)
  } catch (error) {
    console.error('Payment failed:', error)
    ElMessage.error(t('payment.failed'))
  } finally {
    paying.value = false
  }
}

onMounted(() => {
  if (!route.query.orderCode || !route.query.amount) {
    ElMessage.error(t('message.invalidOrder'))
    router.push('/')
    return
  }
})
</script>

<style lang="scss" scoped>
.payment-page {
  padding: 40px 0;
  min-height: calc(100vh - var(--app-header-height) - var(--app-footer-height));
  background-color: var(--el-bg-color-page);

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .payment-card {
    .card-header {
      font-size: 20px;
      font-weight: bold;
    }

    .payment-info {
      .amount {
        font-size: 24px;
        color: var(--el-color-danger);
        font-weight: bold;
      }
    }

    .payment-methods {
      margin: 30px 0;

      h3 {
        font-size: 16px;
        margin-bottom: 20px;
      }

      .el-radio-group {
        display: flex;
        gap: 20px;
      }

      .payment-method-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border: 1px solid var(--el-border-color);
        border-radius: 4px;

        .el-icon {
          font-size: 24px;
        }
      }
    }

    .payment-action {
      text-align: center;
      margin: 30px 0;

      .el-button {
        width: 200px;
      }
    }
  }
}
</style> 