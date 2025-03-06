<template>
  <div class="order-detail">
    <div class="container">
      <el-card class="order-info" v-loading="loading">
        <template #header>
          <div class="card-header">
            <h3>{{ $t('order.detail') }}</h3>
            <el-tag :type="getOrderStatusType(orderInfo.status)">
              {{ $t(`order.statuses.${orderInfo.status}`) }}
            </el-tag>
          </div>
        </template>

        <!-- 订单基本信息 -->
        <el-descriptions :column="2" border>
          <el-descriptions-item :label="$t('order.orderNo')">
            {{ orderInfo.orderNo }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('order.createTime')">
            {{ orderInfo.createTime }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('order.payTime')" v-if="orderInfo.payTime">
            {{ orderInfo.payTime }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('order.shipTime')" v-if="orderInfo.shipTime">
            {{ orderInfo.shipTime }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 收货地址信息 -->
        <div class="section-title">{{ $t('order.shipping') }}</div>
        <el-descriptions :column="1" border>
          <el-descriptions-item :label="$t('order.recipient')">
            {{ orderInfo.address?.name }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('order.phone')">
            {{ orderInfo.address?.phone }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('order.address')">
            {{ orderInfo.address?.address }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 商品列表 -->
        <div class="section-title">{{ $t('order.items') }}</div>
        <div class="order-items">
          <div v-for="item in orderInfo.items" :key="item.id" class="order-item">
            <div class="item-info">
              <el-image :src="item.image" class="item-image" fit="cover">
                <template #error>
                  <div class="image-placeholder">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              <div class="item-details">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-price">
                  <span class="price">¥{{ item.price.toFixed(2) }}</span>
                  <span class="quantity">x {{ item.quantity }}</span>
                </div>
              </div>
            </div>
            <!-- 评价按钮 -->
            <div class="item-actions" v-if="orderInfo.status === 'completed'">
              <el-button 
                v-if="!item.hasReviewed"
                type="primary" 
                size="small" 
                @click="handleReview(item)"
              >
                {{ $t('review.writeReview') }}
              </el-button>
              <el-tag v-else type="info" size="small">{{ $t('review.reviewed') }}</el-tag>
            </div>
          </div>
        </div>

        <!-- 订单金额信息 -->
        <div class="order-amount">
          <div class="amount-item">
            <span>{{ $t('order.subtotal') }}:</span>
            <span>¥{{ orderInfo.subtotal?.toFixed(2) }}</span>
          </div>
          <div class="amount-item">
            <span>{{ $t('order.shipping') }}:</span>
            <span>¥{{ orderInfo.shippingFee?.toFixed(2) }}</span>
          </div>
          <div class="amount-item total">
            <span>{{ $t('order.total') }}:</span>
            <span class="total-price">¥{{ orderInfo.total?.toFixed(2) }}</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 评价对话框 -->
    <el-dialog
      v-model="reviewDialogVisible"
      :title="$t('review.writeReview')"
      width="500px"
    >
      <el-form
        ref="reviewFormRef"
        :model="reviewForm"
        :rules="reviewRules"
        label-position="top"
      >
        <el-form-item :label="$t('review.rating')" prop="rating">
          <el-rate
            v-model="reviewForm.rating"
            :texts="ratingTexts"
            show-text
          />
        </el-form-item>
        <el-form-item :label="$t('review.content')" prop="content">
          <el-input
            v-model="reviewForm.content"
            type="textarea"
            :rows="4"
            :placeholder="$t('review.reviewPlaceholder')"
          />
        </el-form-item>
        <el-form-item :label="$t('review.uploadPhotos')">
          <el-upload
            action="/api/upload"
            list-type="picture-card"
            :limit="5"
            :on-success="handleUploadSuccess"
            :on-remove="handleUploadRemove"
            :auto-upload="false"
            :http-request="handleUpload"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reviewDialogVisible = false">
            {{ $t('common.cancel') }}
          </el-button>
          <el-button type="primary" @click="submitReview" :loading="submitting">
            {{ $t('common.submit') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Plus, Picture } from '@element-plus/icons-vue'
import { getOrderDetail, submitOrderReview, uploadReviewImage } from '@/api/order'

const route = useRoute()
const { t } = useI18n()

// 订单数据
const orderInfo = ref({})
const loading = ref(false)

// 评价相关
const reviewDialogVisible = ref(false)
const reviewFormRef = ref(null)
const currentReviewItem = ref(null)
const submitting = ref(false)

const reviewForm = ref({
  rating: 5,
  content: '',
  images: []
})

const reviewRules = {
  rating: [
    { required: true, message: t('validate.ratingRequired'), trigger: 'change' }
  ],
  content: [
    { required: true, message: t('validate.reviewContentRequired'), trigger: 'blur' },
    { min: 5, max: 500, message: t('validate.reviewContentLength'), trigger: 'blur' }
  ]
}

const ratingTexts = [
  t('review.rating.terrible'),
  t('review.rating.bad'),
  t('review.rating.normal'),
  t('review.rating.good'),
  t('review.rating.excellent')
]

// 获取订单状态样式
const getOrderStatusType = (status) => {
  const types = {
    pending: 'warning',
    paid: 'primary',
    shipped: 'success',
    completed: 'info',
    cancelled: 'danger'
  }
  return types[status] || 'info'
}

// 获取订单详情
const fetchOrderDetail = async () => {
  loading.value = true
  try {
    const data = await getOrderDetail(route.params.id)
    orderInfo.value = data
  } catch (error) {
    console.error('Failed to fetch order detail:', error)
    ElMessage.error(t('message.fetchFailed'))
  } finally {
    loading.value = false
  }
}

// 处理评价
const handleReview = (item) => {
  currentReviewItem.value = item
  reviewForm.value = {
    rating: 5,
    content: '',
    images: []
  }
  reviewDialogVisible.value = true
}

// 处理图片上传
const handleUpload = async ({ file }) => {
  try {
    const { url } = await uploadReviewImage(file)
    reviewForm.value.images.push(url)
    return { url }
  } catch (error) {
    ElMessage.error(t('message.uploadFailed'))
    return false
  }
}

const handleUploadSuccess = (response) => {
  if (response.url) {
    reviewForm.value.images.push(response.url)
  }
}

const handleUploadRemove = (file) => {
  const index = reviewForm.value.images.indexOf(file.url)
  if (index > -1) {
    reviewForm.value.images.splice(index, 1)
  }
}

// 提交评价
const submitReview = async () => {
  if (!reviewFormRef.value) return

  await reviewFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        await submitOrderReview({
          orderId: orderInfo.value.id,
          itemId: currentReviewItem.value.id,
          ...reviewForm.value
        })
        ElMessage.success(t('message.reviewSuccess'))
        reviewDialogVisible.value = false
        // 刷新订单详情
        fetchOrderDetail()
      } catch (error) {
        console.error('Submit review failed:', error)
        ElMessage.error(t('message.reviewFailed'))
      } finally {
        submitting.value = false
      }
    }
  })
}

onMounted(() => {
  fetchOrderDetail()
})
</script>

<style lang="scss" scoped>
.order-detail {
  padding: 20px 0;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 18px;
    }
  }

  .section-title {
    font-size: 16px;
    font-weight: bold;
    margin: 20px 0 12px;
    color: var(--el-text-color-primary);
  }

  .order-items {
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 4px;

    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid var(--el-border-color-lighter);

      &:last-child {
        border-bottom: none;
      }

      .item-info {
        display: flex;
        align-items: center;
        flex: 1;

        .item-image {
          width: 80px;
          height: 80px;
          border-radius: 4px;
          margin-right: 12px;
        }

        .image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--el-fill-color-lighter);
          color: var(--el-text-color-secondary);
          font-size: 24px;
        }

        .item-details {
          flex: 1;

          .item-name {
            font-size: 14px;
            color: var(--el-text-color-primary);
            margin-bottom: 8px;
          }

          .item-price {
            color: var(--el-text-color-regular);

            .price {
              color: var(--el-color-danger);
              margin-right: 8px;
            }
          }
        }
      }

      .item-actions {
        margin-left: 16px;
      }
    }
  }

  .order-amount {
    margin-top: 20px;
    padding: 16px;
    background-color: var(--el-fill-color-lighter);
    border-radius: 4px;

    .amount-item {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      span {
        &:first-child {
          margin-right: 16px;
          color: var(--el-text-color-regular);
        }
      }

      &.total {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid var(--el-border-color-lighter);

        .total-price {
          font-size: 18px;
          color: var(--el-color-danger);
          font-weight: bold;
        }
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style> 