<template>
  <div class="order-detail">
    <div class="container">
      <el-card class="detail-card">
        <template #header>
          <div class="card-header">
            <h3>{{ $t('order.detail') }}</h3>
            <el-tag :type="orderStatusType">{{ orderStatusText }}</el-tag>
          </div>
        </template>

        <!-- 订单信息 -->
        <div class="section">
          <h4>{{ $t('order.info') }}</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item :label="$t('order.number')">
              {{ order.orderNo }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('order.createTime')">
              {{ order.createTime }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('order.payTime')" v-if="order.payTime">
              {{ order.payTime }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('order.shipTime')" v-if="order.shipTime">
              {{ order.shipTime }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 收货信息 -->
        <div class="section">
          <h4>{{ $t('order.shipping') }}</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item :label="$t('order.recipient')">
              {{ order.address.name }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('order.phone')">
              {{ order.address.phone }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('order.address')">
              {{ order.address.address }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('order.tracking')" v-if="order.trackingNo">
              {{ order.trackingNo }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 商品信息 -->
        <div class="section">
          <h4>{{ $t('order.items') }}</h4>
          <el-table :data="order.items" border>
            <el-table-column prop="image" :label="$t('product.image')" width="100">
              <template #default="{ row }">
                <img :src="row.image" :alt="row.name" class="product-image">
              </template>
            </el-table-column>
            <el-table-column prop="name" :label="$t('product.name')" />
            <el-table-column prop="price" :label="$t('product.price')" width="120">
              <template #default="{ row }">
                ¥{{ row.price }}
              </template>
            </el-table-column>
            <el-table-column prop="quantity" :label="$t('product.quantity')" width="120" />
            <el-table-column :label="$t('product.subtotal')" width="120">
              <template #default="{ row }">
                ¥{{ row.price * row.quantity }}
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 订单金额 -->
        <div class="section amount-section">
          <el-descriptions :column="1" border>
            <el-descriptions-item :label="$t('order.subtotal')">
              ¥{{ order.subtotal }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('order.shipping')" v-if="order.shippingFee">
              ¥{{ order.shippingFee }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('order.discount')" v-if="order.discount">
              -¥{{ order.discount }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('order.total')">
              <span class="total-amount">¥{{ order.total }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 操作按钮 -->
        <div class="section operations">
          <el-button v-if="canPay" type="primary" @click="handlePay">
            {{ $t('order.pay') }}
          </el-button>
          <el-button v-if="canCancel" @click="handleCancel">
            {{ $t('order.cancel') }}
          </el-button>
          <el-button v-if="canConfirm" type="success" @click="handleConfirm">
            {{ $t('order.confirm') }}
          </el-button>
          <el-button v-if="canRefund" type="warning" @click="handleRefund">
            {{ $t('order.refund') }}
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { getOrderDetail, cancelOrder, confirmReceive, applyRefund } from '@/api/order'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const order = ref({})
const loading = ref(false)

// 订单状态类型
const orderStatusType = computed(() => {
  const statusMap = {
    pending: 'warning',
    paid: 'info',
    shipped: 'primary',
    completed: 'success',
    cancelled: 'danger',
    refunding: 'warning',
    refunded: 'info'
  }
  return statusMap[order.value.status] || 'info'
})

// 订单状态文本
const orderStatusText = computed(() => {
  return order.value.status ? t(`order.status.${order.value.status}`) : ''
})

// 操作按钮显示逻辑
const canPay = computed(() => order.value.status === 'pending')
const canCancel = computed(() => ['pending', 'paid'].includes(order.value.status))
const canConfirm = computed(() => order.value.status === 'shipped')
const canRefund = computed(() => ['paid', 'shipped'].includes(order.value.status))

// 获取订单详情
const fetchOrderDetail = async () => {
  loading.value = true
  try {
    const data = await getOrderDetail(route.params.id)
    order.value = data
  } catch (error) {
    console.error('Failed to fetch order detail:', error)
    ElMessage.error(error.message || 'Failed to fetch order detail')
  } finally {
    loading.value = false
  }
}

// 支付订单
const handlePay = () => {
  router.push(`/payment/${order.value.id}`)
}

// 取消订单
const handleCancel = async () => {
  try {
    await ElMessageBox.confirm(
      t('order.confirmCancel'),
      t('common.warning'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )
    await cancelOrder(order.value.id)
    ElMessage.success(t('order.cancelSuccess'))
    fetchOrderDetail()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to cancel order:', error)
      ElMessage.error(error.message || t('order.cancelFailed'))
    }
  }
}

// 确认收货
const handleConfirm = async () => {
  try {
    await ElMessageBox.confirm(
      t('order.confirmReceipt'),
      t('common.warning'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )
    await confirmReceive(order.value.id)
    ElMessage.success(t('order.confirmSuccess'))
    fetchOrderDetail()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to confirm order:', error)
      ElMessage.error(error.message || t('order.confirmFailed'))
    }
  }
}

// 申请退款
const handleRefund = async () => {
  try {
    const { value } = await ElMessageBox.prompt(
      t('order.enterRefundReason'),
      t('order.refundApplication'),
      {
        confirmButtonText: t('common.submit'),
        cancelButtonText: t('common.cancel'),
        inputPlaceholder: t('order.refundReasonPlaceholder')
      }
    )
    await applyRefund(order.value.id, { reason: value })
    ElMessage.success(t('order.refundSuccess'))
    fetchOrderDetail()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to apply refund:', error)
      ElMessage.error(error.message || t('order.refundFailed'))
    }
  }
}

onMounted(() => {
  fetchOrderDetail()
})
</script>

<style lang="scss" scoped>
.order-detail {
  padding: 20px 0;
  background-color: var(--el-bg-color-page);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.detail-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 18px;
      color: var(--el-text-color-primary);
    }
  }
}

.section {
  margin-bottom: 24px;

  h4 {
    margin: 0 0 16px;
    font-size: 16px;
    color: var(--el-text-color-primary);
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.amount-section {
  max-width: 400px;
  margin-left: auto;

  .total-amount {
    color: var(--el-color-danger);
    font-size: 20px;
    font-weight: bold;
  }
}

.operations {
  text-align: right;
  border-top: 1px solid var(--el-border-color-light);
  padding-top: 24px;
  margin-top: 24px;
}
</style> 