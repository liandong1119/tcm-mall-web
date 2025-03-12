<template>
    <div class="order-detail">
        <div class="container">
            <el-card class="order-info" v-loading="loading">
                <template #header>
                    <div class="card-header">
                        <div class="header-left">
                            <h3>{{ $t('order.detail') }}</h3>
                            <el-tag :type="getOrderStatusType(orderInfo.status)" class="status-tag">
                                {{ $t(`order.statusText.${orderInfo.status}`) }}
                            </el-tag>
                            <!-- 待支付状态显示倒计时 -->
                            <OrderCountdown
                                v-if="orderInfo.status === 'pending'"
                                :order-code="orderInfo.orderCode"
                                @timeout="handleTimeout"
                                class="countdown-wrapper"
                            />
                        </div>
                        <div class="header-right">
                            <el-button @click="goBack">{{ $t('common.back') }}</el-button>
                        </div>
                    </div>
                </template>

                <!-- 订单基本信息 -->
                <el-descriptions :column="2" border>
                    <el-descriptions-item :label="$t('order.orderNo')">
                        {{ orderInfo.orderCode }}
                    </el-descriptions-item>
                    <el-descriptions-item :label="$t('order.createTime')">
                        {{ orderInfo.createTime }}
                    </el-descriptions-item>
                    <el-descriptions-item :label="$t('order.payTime')" v-if="orderInfo.payTime">
                        {{ orderInfo.payTime }}
                    </el-descriptions-item>
                    <el-descriptions-item :label="$t('order.shipTime')" v-if="orderInfo.shippingTime">
                        {{ orderInfo.shippingTime }}
                    </el-descriptions-item>
                </el-descriptions>

                <!-- 收货地址信息 -->
                <div class="section-title">{{ $t('order.shipping') }}</div>
                <el-descriptions :column="1" border>
                    <el-descriptions-item :label="$t('order.recipient')">
                        {{ orderInfo.addr }}
                    </el-descriptions-item>
                    <el-descriptions-item :label="$t('order.phone')">
                        {{ orderInfo.contactDetailInfo }}
                    </el-descriptions-item>
                    <el-descriptions-item :label="$t('order.address')">
                        {{ orderInfo.receipt }}
                    </el-descriptions-item>
                </el-descriptions>

                <!-- 商品列表 -->
                <div class="section-title">{{ $t('order.items') }}</div>
                <div class="order-items">
                    <div v-for="item in orderInfo.orderProductVoList" :key="item.id" class="order-item">
                        <div class="item-info">
                            <el-image :src="item.img" class="item-image" fit="cover">
                                <template #error>
                                    <div class="image-placeholder">
                                        <el-icon>
                                            <Picture/>
                                        </el-icon>
                                    </div>
                                </template>
                            </el-image>
                            <div class="item-details">
                                <div class="item-name">{{ item.name }}</div>
                                <div class="item-price">
                                    <span class="price">¥{{ item.price.toFixed(2) }}</span>
                                    <span class="quantity">x {{ item.num }}</span>
                                </div>
                                <!-- 显示商品状态 -->
                                <div class="item-status">
                                    <el-tag size="small" :type="getOrderStatusType(item.status)">
                                        {{ $t(`order.statuses.${item.status}`) }}
                                    </el-tag>
                                </div>
                            </div>
                        </div>
                        <!-- 评价按钮 - 根据商品状态显示 -->
                        <div class="item-actions" v-if="item.status === 'completed'">
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
                        <!-- 退款按钮 - 根据商品状态显示 -->
                        <div class="item-actions" v-if="item.status === 'paid' || item.status === 'shipped'">
                            <el-button
                                    v-if="!item.refundStatus"
                                    type="danger"
                                    size="small"
                                    @click="handleRefund(item)"
                            >
                                {{ $t('order.refund') }}
                            </el-button>
                            <el-tag
                                    v-else
                                    :type="getRefundStatusType(item.refundStatus)"
                                    size="small"
                            >
                                {{ $t(`order.refundStatus.${item.refundStatus}`) }}
                            </el-tag>
                        </div>
                    </div>
                </div>

                <!-- 订单金额信息 -->
                <div class="order-amount">
                    <div class="amount-item">
                        <span>{{ $t('order.subtotal') }}:</span>
                        <span>¥{{ orderInfo.totalAmount?.toFixed(2) }}</span>
                    </div>
                    <div class="amount-item">
                        <span>{{ $t('order.shipping') }}:</span>
                        <span>¥{{ orderInfo.shippingFee?.toFixed(2) }}</span>
                    </div>
                    <div class="amount-item total">
                        <span>{{ $t('order.total') }}:</span>
                        <span class="total-price">¥{{ orderInfo.totalAmount?.toFixed(2) }}</span>
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
                        limit="5"
                        :action="uploadUrl"
                        :on-remove="handleRemove"
                        :headers="uploadHeaders"
                        list-type="picture-card"
                        :on-success="handleUploadSuccess"
                        :on-error="handleUploadError"
                        :before-upload="beforeUpload"
                    >
                        <el-icon>
                            <Plus/>
                        </el-icon>
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

        <!-- 退款对话框 -->
        <el-dialog
                v-model="refundDialogVisible"
                :title="$t('order.refundApplication')"
                width="500px"
        >
            <el-form
                    ref="refundFormRef"
                    :model="refundForm"
                    :rules="refundRules"
                    label-position="top"
            >
                <el-form-item :label="$t('order.refundAmount')" prop="amount">
                    <el-input-number
                            v-model="refundForm.amount"
                            :min="0"
                            :max="currentRefundItem?.price"
                            :precision="2"
                            :step="0.01"
                            style="width: 100%"
                    />
                </el-form-item>
                <el-form-item :label="$t('order.refundReason')" prop="reason">
                    <el-select v-model="refundForm.reason" style="width: 100%">
                        <el-option
                                v-for="(reason, index) in refundReasons"
                                :key="index"
                                :label="$t(`order.refundReasons.${reason}`)"
                                :value="reason"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('order.refundDescription')" prop="description">
                    <el-input
                            v-model="refundForm.description"
                            type="textarea"
                            :rows="4"
                            :placeholder="$t('order.refundDescriptionPlaceholder')"
                    />
                </el-form-item>
                <el-form-item :label="$t('order.refundImages')">
                    <el-upload
                        :action="uploadUrl"
                        :on-remove="handleRemove"
                        :headers="uploadHeaders"
                        list-type="picture-card"
                        :on-success="handleUploadSuccess"
                        :on-error="handleUploadError"
                        :before-upload="beforeUpload"
                    >
                        <el-icon>
                            <Plus/>
                        </el-icon>
                    </el-upload>
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
    </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {ElMessage} from 'element-plus'
import {Plus, Picture} from '@element-plus/icons-vue'
import {getOrderDetail, submitOrderReview, uploadReviewImage, applyRefund} from '@/api/order'
import {deletePhoto} from "@/api/photos";
import OrderCountdown from '@/components/OrderCountdown.vue'

const route = useRoute()
const router = useRouter()
const {t} = useI18n()

/**
 * 页面挂载执行的方法
 */
onMounted(() => {
    fetchOrderDetail()
})

///// 图片上传相关的配置和方法定义

/**
 * 上传图片的请求头的配置
 * @type {{token: string}}
 */
const uploadHeaders = {
    token: `Bearer ${localStorage.getItem('token')}`
}
/**
 * 上传地址的配置
 * @type {any}
 */
const uploadUrl = import.meta.env.VITE_APP_UPLOAD_URL
/**
 * 图片上传前检测大小
 * @param file 文件
 * @returns {boolean}
 */
const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/')
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isImage) {
        ElMessage.error(t('validate.imageTypeError'))
        return false
    }
    if (!isLt2M) {
        ElMessage.error(t('validate.imageSizeError'))
        return false
    }
    return true
}

/**
 * 图片上传成功后的回调
 * @param response
 * @param uploadFile
 */
const handleUploadSuccess = (response,uploadFile) => {
    // 文件回填操作
    const {id: fileId, addr} = response.data
    uploadFile.fileId = fileId
    reviewForm.value.photoIds.push(fileId)
    reviewForm.value.images.push(addr)

}

/**
 * 图片上传出现错误
 */
const handleUploadError = () => {
    ElMessage.error(t('message.uploadFailed'))
}

/**
 * 删除一张图片信息
 * @param file
 * @returns {Promise<void>}
 */
const handleRemove = async (file) => {
    deletePhoto([file.fileId])
    // 删除的时候还要从数组中移除
    reviewForm.value.photoIds = reviewForm.value.photoIds.filter(id => id !== file.fileId)
}

////// 退款相关的方法配置

// 退款相关
const refundDialogVisible = ref(false)
const refundFormRef = ref(null)
const currentRefundItem = ref(null)
const refundForm = ref({
    amount: 0,
    reason: '',
    description: '',
    images: []
})

const refundReasons = [
    'quality_issue',
    'wrong_product',
    'not_received',
    'damaged',
    'other'
]

/**
 * 退款的校验规则
 * @type {{reason: [{trigger: string, message: string, required: boolean}], amount: [{trigger: string, message: string, required: boolean},{min: number, trigger: string, type: string, message: string}], description: [{trigger: string, message: string, required: boolean},{min: number, max: number, trigger: string, message: string}]}}
 */
const refundRules = {
    amount: [
        {required: true, message: t('validate.refundAmountRequired'), trigger: 'blur'},
        {type: 'number', min: 0, message: t('validate.refundAmountMin'), trigger: 'blur'}
    ],
    reason: [
        {required: true, message: t('validate.refundReasonRequired'), trigger: 'change'}
    ],
    description: [
        {required: true, message: t('validate.refundDescriptionRequired'), trigger: 'blur'},
        {min: 10, max: 500, message: t('validate.refundDescriptionLength'), trigger: 'blur'}
    ]
}

// 获取退款状态样式
const getRefundStatusType = (status) => {
    const types = {
        pending: 'warning',
        approved: 'success',
        rejected: 'danger',
        cancelled: 'info'
    }
    return types[status] || 'info'
}

// 提交退款申请
const submitRefund = async () => {
    if (!refundFormRef.value) return

    await refundFormRef.value.validate(async (valid) => {
        if (valid) {
            submitting.value = true
            try {
                await applyRefund(orderInfo.value.orderCode, {
                    itemId: currentRefundItem.value.id,
                    ...refundForm.value
                })
                ElMessage.success(t('message.refundSuccess'))
                refundDialogVisible.value = false
                // 刷新订单详情
                fetchOrderDetail()
            } catch (error) {
                console.error('Submit refund failed:', error)
                ElMessage.error(t('message.refundFailed'))
            } finally {
                submitting.value = false
            }
        }
    })
}

// 处理退款
const handleRefund = (item) => {
    currentRefundItem.value = item
    refundForm.value = {
        amount: item.price,
        reason: '',
        description: '',
        images: []
    }
    refundDialogVisible.value = true
}

////// 订单相关的配置和方法

// 订单数据
const orderInfo = ref({})
const loading = ref(false)

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
        const response = await getOrderDetail({orderCode: route.params.id})
        // 处理后端返回的数据格式
        const data = response.data || response

        // 转换订单状态从数字到字符串
        const statusMap = {
            0: "pending",
            1: "paid",
            2: "shipped",
            4: "completed",
            5: "cancelled",
            6: "refunding",
            7: "refunded"
        }

        // 构建前端需要的数据结构
        orderInfo.value = {
            id: data.id || data.orderCode,
            orderCode: data.orderCode,
            // 根据商品状态确定整个订单的状态
            status: determineOrderStatus(data.orderProductVoList),
            createTime: data.createTime,
            payTime: data.payTime,
            shipTime: data.shippingTime,
            totalAmount: data.totalAmount,
            shippingFee: data.shippingFee || 0,
            addr: data.addr,
            contactDetailInfo: data.contactDetailInfo,
            receipt: data.receipt,
            orderProductVoList: (data.orderProductVoList || []).map(item => ({
                id: item.id || item.orderId,
                name: item.name,
                price: item.price,
                num: item.num,
                img: item.img,
                hasReviewed: item.isComment || false,
                refundStatus: item.refundStatus,
                specifications: item.specifications || '',
                // 添加商品状态
                status: statusMap[item.status] || 'pending'
            }))
        }
    } catch (error) {
        console.error('Failed to fetch order detail:', error)
        ElMessage.error(t('message.fetchFailed'))
    } finally {
        loading.value = false
    }
}

// 根据商品状态确定整个订单的状态
const determineOrderStatus = (products) => {
    if (!products || products.length === 0) {
        return 'pending'
    }

    // 状态优先级: cancelled > refunded > refunding > completed > shipped > paid > pending
    const statusPriority = {
        'cancelled': 7,
        'refunded': 6,
        'refunding': 5,
        'completed': 4,
        'shipped': 3,
        'paid': 2,
        'pending': 1
    }

    // 数字状态映射到字符串
    const statusMap = {
        0: "pending",
        1: "paid",
        2: "shipped",
        4: "completed",
        5: "cancelled",
        6: "refunding",
        7: "refunded"
    }

    // 获取所有商品的状态
    const statuses = products.map(item => statusMap[item.status] || 'pending')

    // 按优先级排序，取最高优先级的状态
    return statuses.sort((a, b) => statusPriority[b] - statusPriority[a])[0]
}

// 处理倒计时结束
const handleTimeout = () => {
    ElMessage.warning(t('order.autoCancel'))
    // 刷新订单详情
    fetchOrderDetail()
}

// 处理立即支付
const handlePay = () => {
    router.push({
        name: 'Payment',
        query: { 
            orderCode: orderInfo.value.orderCode,
            amount: orderInfo.value.totalAmount.toFixed(2)
        }
    })
}

// 处理图片上传
const handleUpload = async ({file}) => {
    try {
        const {url} = await uploadReviewImage(file)
        if (reviewDialogVisible.value) {
            reviewForm.value.images.push(url)
        } else if (refundDialogVisible.value) {
            refundForm.value.images.push(url)
        }
        return {url}
    } catch (error) {
        ElMessage.error(t('message.uploadFailed'))
        return false
    }
}

////// 评价相关的方法和配置

// 评价相关
const reviewDialogVisible = ref(false)
const reviewFormRef = ref(null)
const currentReviewItem = ref(null)
const submitting = ref(false)

const reviewForm = ref({
    rating: 5,
    content: '',
    photoIds: [],
    images: []
})

const reviewRules = {
    rating: [
        {required: true, message: t('validate.ratingRequired'), trigger: 'change'}
    ],
    content: [
        {required: true, message: t('validate.reviewContentRequired'), trigger: 'blur'},
        {min: 5, max: 500, message: t('validate.reviewContentLength'), trigger: 'blur'}
    ]
}

const ratingTexts = [
    t('review.rating.terrible'),
    t('review.rating.bad'),
    t('review.rating.normal'),
    t('review.rating.good'),
    t('review.rating.excellent')
]

// 处理评价
const handleReview = (item) => {
    currentReviewItem.value = item
    reviewForm.value = {
        rating: 5,
        content: '',
        images: [],
        photoIds:[]
    }
    reviewDialogVisible.value = true
}

// 提交评价
const submitReview = async () => {
    if (!reviewFormRef.value) return

    await reviewFormRef.value.validate(async (valid) => {
        if (valid) {
            submitting.value = true
            try {
                // TODO 单独的商品id
                const reviewRequest = {
                    orderId: orderInfo.value.id,
                    goodsId: 4,
                    content: reviewForm.value.content,
                    level: reviewForm.value.rating,
                    photoIds: reviewForm.value.photoIds
                }
                await submitOrderReview(reviewRequest)
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

// 处理立即支付
const handlePay = () => {
    router.push({
        name: 'Payment',
        query: { 
            orderCode: orderInfo.value.orderCode,
            amount: orderInfo.value.totalAmount.toFixed(2)
        }
    })
}

// 处理返回
const goBack = () => {
    router.back()
}
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

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .status-tag {
        margin: 0 12px;
      }

      .countdown-wrapper {
        margin-left: 4px;
      }
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

          .item-status {
            margin-top: 8px;
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

.item-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style> 