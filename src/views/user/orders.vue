<template>
  <div class="orders">
    <div class="container">
      <el-card class="orders-card">
        <template #header>
          <div class="card-header">
            <span>{{ $t('user.orders') }}</span>
          </div>
        </template>

        <!-- 订单状态标签 -->
        <div class="status-tabs">
          <el-tabs v-model="activeStatus" @tab-click="handleStatusChange">
            <el-tab-pane
              v-for="status in orderStatuses"
              :key="status.value"
              :label="status.label"
              :name="status.value"
            />
          </el-tabs>
        </div>

        <!-- 订单列表 -->
        <div v-loading="loading" class="order-list">
          <el-empty
            v-if="!orders.length"
            :description="$t('order.noOrders')"
          />

          <div v-else class="order-items">
            <el-card v-for="order in orders" :key="order.id" class="order-item">
              <div class="order-header">
                <div class="order-info">
                  <span class="order-no">{{ $t('order.number') }}: {{ order.orderCode }}</span>
                  <span class="order-time">{{ $t('order.createTime') }}: {{ order.createTime }}</span>
                </div>
                <el-tag :type="getStatusType(order.status)">
                  {{ $t(`order.statuses`) }}{{order.status}}
                </el-tag>
              </div>

              <div class="order-products">
                <div
                  v-for="product in order.orderProductVoList"
                  :key="product.id"
                  class="product-item"
                >
                  <img :src="product.img" :alt="product.name">
                  <div class="product-info">
                    <router-link :to="`/product/${product.id}`" class="product-name">
                      {{ product.name }}
                    </router-link>
                    <div class="product-meta">
                      <span class="price">{{ $t('common.currency') }}{{ (product.price || 0).toFixed(2) }}</span>
                      <span class="quantity">x{{ product.num }}{{ product.unit || $t('product.detail.unit') }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="order-footer">
                <div class="order-amount">
                  {{ $t('order.total') }}: 
                  <span class="amount">{{ $t('common.currency') }}{{ (order.totalAmount || 0).toFixed(2) }}</span>
                </div>
                <div class="order-operations">
                  <el-button
                    v-if="order.status === 'pending'"
                    type="primary"
                    @click="handlePayOrder(order)"
                  >
                    {{ $t('order.pay') }}
                  </el-button>
                  <el-button
                    v-if="order.status === 'pending'"
                    type="danger"
                    @click="handleCancelOrder(order)"
                  >
                    {{ $t('order.cancel') }}
                  </el-button>
                  <el-button
                    v-if="order.status === 'shipped'"
                    type="success"
                    @click="handleConfirmReceive(order)"
                  >
                    {{ $t('order.confirmReceive') }}
                  </el-button>
                  <el-button
                    v-if="['paid', 'shipped', 'completed'].includes(order.status)"
                    @click="handleViewShipping(order)"
                  >
                    {{ $t('order.viewShipping') }}
                  </el-button>
                  <el-button
                    v-if="order.status === 'completed'"
                    type="warning"
                    @click="handleApplyRefund(order)"
                  >
                    {{ $t('order.applyRefund') }}
                  </el-button>
                  <el-button
                    type="info"
                    link
                    @click="$router.push(`/order/${order.orderCode}`)"
                  >
                    {{ $t('order.detail') }}
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>

          <!-- 分页 -->
          <div class="pagination">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :total="total"
              :page-sizes="[10, 20, 30, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </el-card>
    </div>

    <!-- 退款申请对话框 -->
    <el-dialog
      v-model="refundDialogVisible"
      :title="$t('order.applyRefund')"
      width="500px"
    >
      <el-form
        ref="refundFormRef"
        :model="refundForm"
        :rules="refundRules"
        label-width="100px"
      >
        <el-form-item :label="$t('order.refundReason')" prop="reason">
          <el-input
            v-model="refundForm.reason"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="refundDialogVisible = false">
            {{ $t('common.cancel') }}
          </el-button>
          <el-button type="primary" @click="submitRefund" :loading="submitting">
            {{ $t('common.submit') }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 物流信息对话框 -->
    <el-dialog
      v-model="shippingDialogVisible"
      :title="$t('order.shippingInfo')"
      width="500px"
    >
      <div v-loading="loadingShipping" class="shipping-info">
        <div v-if="shippingInfo" class="shipping-content">
          <div class="shipping-header">
            <div class="carrier">
              {{ $t('order.carrier') }}: {{ shippingInfo.carrier }}
            </div>
            <div class="tracking-no">
              {{ $t('order.trackingNo') }}: {{ shippingInfo.trackingNo }}
            </div>
          </div>
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in shippingInfo.traces"
              :key="index"
              :timestamp="item.time"
            >
              {{ item.content }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getOrderList,
  cancelOrder,
  confirmReceive,
  applyRefund,
  getShippingInfo,
  payOrder
} from '@/api/order'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

// 数据
const loading = ref(false)
const submitting = ref(false)
const loadingShipping = ref(false)
const orders = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const activeStatus = ref('all')

// 对话框
const refundDialogVisible = ref(false)
const shippingDialogVisible = ref(false)
const currentOrder = ref(null)
const shippingInfo = ref(null)

// 退款表单
const refundFormRef = ref(null)
const refundForm = ref({
  reason: ''
})

const refundRules = {
  reason: [
    { required: true, message: t('validate.refundReasonRequired'), trigger: 'blur' },
    { min: 10, max: 200, message: t('validate.refundReasonLength'), trigger: 'blur' }
  ]
}

// 订单状态
const orderStatuses = [
  { value: 'all', label: t('common.all') },
  { value: 'pending', label: t('order.statuses.pending') },
  { value: 'paid', label: t('order.statuses.paid') },
  { value: 'shipped', label: t('order.statuses.shipped') },
  { value: 'completed', label: t('order.statuses.completed') },
  { value: 'cancelled', label: t('order.statuses.cancelled') }
]

// 获取订单列表
const fetchOrders = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      status: activeStatus.value === 'all' ? undefined : activeStatus.value
    }
    const { list, total: totalCount } = await getOrderList(params)
    orders.value = list
    total.value = totalCount
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    ElMessage.error(t('message.fetchFailed'))
  } finally {
    loading.value = false
  }
}

// 获取状态样式
const getStatusType = (status) => {
  const types = {
    pending: 'warning',
    paid: 'info',
    shipped: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return types[status] || 'info'
}

// 处理状态切换
const handleStatusChange = () => {
  currentPage.value = 1
  fetchOrders()
}

// 处理分页
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchOrders()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchOrders()
}

// 取消订单
const handleCancelOrder = async (order) => {
  try {
    await ElMessageBox.confirm(
      t('message.confirmCancel'),
      t('common.tips'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )
    
    await cancelOrder(order.id)
    ElMessage.success(t('message.cancelSuccess'))
    fetchOrders()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to cancel order:', error)
      ElMessage.error(t('message.cancelFailed'))
    }
  }
}

// 确认收货
const handleConfirmReceive = async (order) => {
  try {
    await ElMessageBox.confirm(
      t('message.confirmReceive'),
      t('common.tips'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )
    
    await confirmReceive(order.id)
    ElMessage.success(t('message.operateSuccess'))
    fetchOrders()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to confirm receive:', error)
      ElMessage.error(t('message.operateFailed'))
    }
  }
}

// 申请退款
const handleApplyRefund = (order) => {
  currentOrder.value = order
  refundForm.value.reason = ''
  refundDialogVisible.value = true
}

const submitRefund = async () => {
  if (!refundFormRef.value) return

  await refundFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        await applyRefund(currentOrder.value.id, refundForm.value)
        ElMessage.success(t('message.operateSuccess'))
        refundDialogVisible.value = false
        fetchOrders()
      } catch (error) {
        console.error('Failed to apply refund:', error)
        ElMessage.error(t('message.operateFailed'))
      } finally {
        submitting.value = false
      }
    }
  })
}

// 查看物流
const handleViewShipping = async (order) => {
  shippingDialogVisible.value = true
  loadingShipping.value = true
  try {
    const data = await getShippingInfo(order.id)
    shippingInfo.value = data
  } catch (error) {
    console.error('Failed to get shipping info:', error)
    ElMessage.error(t('message.fetchFailed'))
  } finally {
    loadingShipping.value = false
  }
}

// 支付订单
const handlePayOrder = async (order) => {
  try {
    const data = await payOrder(order.id)
    // TODO: 处理支付结果，可能需要跳转到支付页面或其他操作
    ElMessage.success(t('message.paySuccess'))
    fetchOrders()
  } catch (error) {
    console.error('Failed to pay order:', error)
    ElMessage.error(t('message.payFailed'))
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style lang="scss" scoped>
.orders {
  padding: 20px 0;
  min-height: calc(100vh - 200px);
  background-color: #f5f7fa;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .orders-card {
    .card-header {
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }

    .status-tabs {
      margin-bottom: 20px;
      border-bottom: 1px solid #ebeef5;
    }

    .order-list {
      .order-items {
        .order-item {
          margin-bottom: 20px;
          transition: all 0.3s ease;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .order-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 15px;
            border-bottom: 1px solid #ebeef5;

            .order-info {
              .order-no {
                font-size: 14px;
                color: #666;
                margin-right: 20px;
              }

              .order-time {
                font-size: 14px;
                color: #999;
              }
            }
          }

          .order-products {
            padding: 15px 0;

            .product-item {
              display: flex;
              align-items: center;
              padding: 10px 0;

              img {
                width: 80px;
                height: 80px;
                object-fit: cover;
                border-radius: 4px;
                margin-right: 15px;
              }

              .product-info {
                flex: 1;

                .product-name {
                  font-size: 16px;
                  color: #333;
                  text-decoration: none;
                  margin-bottom: 8px;
                  display: block;

                  &:hover {
                    color: #409eff;
                  }
                }

                .product-meta {
                  display: flex;
                  align-items: center;
                  gap: 15px;

                  .price {
                    color: #f56c6c;
                    font-size: 15px;
                    font-weight: 500;
                  }

                  .quantity {
                    color: #666;
                  }
                }
              }
            }
          }

          .order-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 15px;
            border-top: 1px solid #ebeef5;

            .order-amount {
              font-size: 15px;
              color: #666;

              .amount {
                color: #f56c6c;
                font-size: 18px;
                font-weight: 600;
                margin-left: 5px;
              }
            }

            .order-operations {
              display: flex;
              gap: 10px;
              
              .el-button {
                padding: 8px 15px;
              }
            }
          }
        }
      }

      .pagination {
        margin-top: 30px;
        text-align: right;
      }
    }
  }

  .shipping-info {
    min-height: 200px;

    .shipping-header {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #ebeef5;

      .carrier, .tracking-no {
        font-size: 14px;
        color: #666;
        margin-bottom: 8px;
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style> 