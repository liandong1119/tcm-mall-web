<template>
  <div class="product-detail">
    <div class="container">
      <!-- 商品基本信息 -->
      <el-card class="product-info">
        <el-row :gutter="40">
          <!-- 左侧主图 -->
          <el-col :span="12">
            <div class="product-image">
              <img :src="product.image" :alt="product.name">
            </div>
          </el-col>
          
          <!-- 右侧信息 -->
          <el-col :span="12">
            <div class="product-summary">
              <h1 class="product-name">{{ product.name }}</h1>
              
              <!-- 功能描述 -->
              <div class="product-function">
                <h3>{{ $t('product.detail.functionTitle') }}</h3>
                <div class="function-list">
                  <p v-for="(func, index) in product.functions" :key="index">
                    <el-icon><Check /></el-icon>
                    {{ func }}
                  </p>
                </div>
              </div>
              
              <div class="product-price">
                <span class="price">¥{{ product.price }}</span>
                <span class="unit">/{{ $t('product.detail.unit') }}</span>
              </div>
              
              <div class="product-actions">
                <div class="quantity-wrapper">
                  <span class="label">{{ $t('product.detail.quantity') }}：</span>
                  <el-input-number
                    v-model="quantity"
                    :min="1"
                    :max="99"
                    :step="1"
                    size="large"
                  />
                  <span class="unit">{{ $t('product.detail.unit') }}</span>
                </div>
                
                <div class="buttons">
                  <el-button type="primary" size="large" @click="addToCart">
                    <el-icon><ShoppingCart /></el-icon>
                    {{ $t('product.detail.addToCart') }}
                  </el-button>
                  
                  <el-button type="danger" size="large" @click="buyNow">
                    {{ $t('product.detail.buyNow') }}
                  </el-button>
                  
                  <el-button
                    :type="isFavorite ? 'danger' : 'default'"
                    size="large"
                    @click="toggleFavorite"
                  >
                    <el-icon><Star /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 商品详情标签页 -->
      <el-card class="product-tabs">
        <el-tabs v-model="activeTab">
          <!-- 商品详情 -->
          <el-tab-pane :label="$t('product.detail.detailTab')" name="detail">
            <div class="detail-content">
              <div v-for="(detail, index) in product.details" :key="index" class="detail-item">
                <img v-if="detail.image" :src="detail.image" :alt="detail.title">
                <div class="detail-text">
                  <h3>{{ detail.title }}</h3>
                  <p>{{ detail.content }}</p>
                </div>
              </div>
            </div>
            
            <!-- 药效说明 -->
            <div class="efficacy">
              <h3>{{ $t('product.detail.efficacy') }}</h3>
              <p>{{ product.efficacy }}</p>
            </div>
            
            <!-- 注意事项 -->
            <div class="precautions">
              <h3>{{ $t('product.detail.precautions') }}</h3>
              <ul>
                <li v-for="(item, index) in product.precautions" :key="index">
                  {{ item }}
                </li>
              </ul>
            </div>
          </el-tab-pane>

          <!-- 规格参数 -->
          <el-tab-pane :label="$t('product.detail.specsTab')" name="specs">
            <el-descriptions :column="1" border>
              <el-descriptions-item v-for="(spec, key) in product.specs" :key="key" :label="key">
                {{ spec }}
              </el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>

          <!-- 买家评价 -->
          <el-tab-pane :label="$t('product.detail.reviewsTab')" name="reviews">
            <div class="reviews-list">
              <div v-for="review in reviews" :key="review.id" class="review-item">
                <div class="review-header">
                  <el-avatar :size="40" :src="review.userAvatar" />
                  <div class="review-info">
                    <span class="username">{{ review.username }}</span>
                    <el-rate
                      v-model="review.rating"
                      disabled
                      show-score
                      text-color="#ff9900"
                    />
                  </div>
                  <span class="review-time">{{ review.createTime }}</span>
                </div>
                <div class="review-content">{{ review.content }}</div>
                
                <!-- 商家回复 -->
                <div v-if="review.reply" class="merchant-reply">
                  <div class="reply-header">
                    <el-tag size="small" type="success">{{ $t('product.detail.merchantReply') }}</el-tag>
                    <span class="reply-time">{{ review.replyTime }}</span>
                  </div>
                  <div class="reply-content">{{ review.reply }}</div>
                </div>
              </div>
            </div>
            
            <!-- 评价分页 -->
            <div class="reviews-pagination">
              <el-pagination
                v-model:current-page="reviewPage"
                v-model:page-size="reviewPageSize"
                :total="reviewTotal"
                layout="prev, pager, next"
                @current-change="handleReviewPageChange"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { ShoppingCart, Star, Check } from '@element-plus/icons-vue'
import { getProductDetail, getProductReviews } from '@/api/product'
import { addToFavorite, removeFavorite } from '@/api/favorite'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const { t } = useI18n()

const product = ref({})
const quantity = ref(1)
const isFavorite = ref(false)
const reviews = ref([])
const reviewPage = ref(1)
const reviewPageSize = ref(10)
const reviewTotal = ref(0)
const activeTab = ref('detail')

// 获取商品详情
const fetchProductDetail = async () => {
  try {
    const data = await getProductDetail(route.params.id)
    product.value = data
  } catch (error) {
    console.error('Failed to fetch product detail:', error)
    ElMessage.error(error.message)
  }
}

// 获取商品评价
const fetchReviews = async () => {
  try {
    const { list, total } = await getProductReviews(route.params.id, {
      page: reviewPage.value,
      pageSize: reviewPageSize.value
    })
    reviews.value = list
    reviewTotal.value = total
  } catch (error) {
    console.error('Failed to fetch reviews:', error)
  }
}

// 添加到购物车
const addToCart = () => {
  cartStore.addItem(product.value, quantity.value)
  ElMessage.success(t('product.message.addToCartSuccess'))
}

// 立即购买
const buyNow = () => {
  cartStore.addItem(product.value, quantity.value)
  router.push('/checkout')
}

// 收藏/取消收藏
const toggleFavorite = async () => {
  try {
    if (isFavorite.value) {
      await removeFavorite(product.value.id)
      isFavorite.value = false
      ElMessage.success(t('product.message.unfavoriteSuccess'))
    } else {
      await addToFavorite(product.value.id)
      isFavorite.value = true
      ElMessage.success(t('product.message.favoriteSuccess'))
    }
  } catch (error) {
    console.error('Failed to toggle favorite:', error)
    ElMessage.error(error.message)
  }
}

// 评价分页
const handleReviewPageChange = (page) => {
  reviewPage.value = page
  fetchReviews()
}

onMounted(() => {
  fetchProductDetail()
  fetchReviews()
})
</script>

<style lang="scss" scoped>
.product-detail {
  padding: 20px 0;
  background: #f5f5f5;
  min-height: 100vh;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .product-info {
    margin-bottom: 20px;
    background: #fff;

    .product-image {
      width: 100%;
      height: 400px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fff;
      border-radius: 4px;
      overflow: hidden;

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }

    .product-summary {
      padding: 20px 0;

      .product-name {
        font-size: 24px;
        color: #333;
        margin-bottom: 20px;
        line-height: 1.4;
      }

      .product-function {
        margin-bottom: 20px;
        padding: 15px;
        background: #f8f8f8;
        border-radius: 4px;

        h3 {
          font-size: 16px;
          color: #333;
          margin-bottom: 12px;
        }

        .function-list {
          p {
            display: flex;
            align-items: center;
            color: #666;
            font-size: 14px;
            line-height: 1.8;
            margin-bottom: 8px;

            .el-icon {
              color: #67c23a;
              margin-right: 8px;
            }

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }

      .product-price {
        margin-bottom: 30px;

        .price {
          font-size: 32px;
          color: #f56c6c;
          font-weight: bold;
        }

        .unit {
          margin-left: 5px;
          font-size: 14px;
          color: #999;
        }
      }

      .product-actions {
        .quantity-wrapper {
          display: flex;
          align-items: center;
          margin-bottom: 20px;

          .label {
            margin-right: 10px;
            color: #666;
          }

          .unit {
            margin-left: 10px;
            color: #666;
          }
        }

        .buttons {
          display: flex;
          gap: 10px;
        }
      }
    }
  }

  .product-tabs {
    background: #fff;

    :deep(.el-tabs__nav-wrap) {
      padding: 0 20px;
    }

    .detail-content {
      padding: 20px;

      .detail-item {
        margin-bottom: 30px;

        img {
          width: 100%;
          margin-bottom: 15px;
          border-radius: 4px;
        }

        .detail-text {
          h3 {
            font-size: 16px;
            color: #333;
            margin-bottom: 10px;
          }

          p {
            color: #666;
            line-height: 1.8;
          }
        }
      }
    }

    .efficacy, .precautions {
      margin-bottom: 30px;
      padding: 0 20px;

      h3 {
        font-size: 16px;
        color: #333;
        margin-bottom: 15px;
        padding-left: 10px;
        border-left: 4px solid #f56c6c;
      }

      p {
        color: #666;
        line-height: 1.8;
      }

      ul {
        list-style: disc;
        padding-left: 20px;
        color: #666;

        li {
          margin-bottom: 10px;
          line-height: 1.8;
        }
      }
    }

    .reviews-list {
      padding: 20px;

      .review-item {
        padding: 20px 0;
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }

        .review-header {
          display: flex;
          align-items: center;
          margin-bottom: 10px;

          .review-info {
            margin-left: 10px;
            flex: 1;

            .username {
              font-size: 14px;
              color: #333;
              margin-right: 10px;
            }
          }

          .review-time {
            color: #999;
            font-size: 12px;
          }
        }

        .review-content {
          color: #666;
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .merchant-reply {
          margin-top: 10px;
          background: #f8f8f8;
          padding: 12px;
          border-radius: 4px;

          .reply-header {
            display: flex;
            align-items: center;
            margin-bottom: 8px;

            .reply-time {
              margin-left: 10px;
              font-size: 12px;
              color: #999;
            }
          }

          .reply-content {
            color: #666;
            line-height: 1.6;
            font-size: 14px;
          }
        }
      }
    }

    .reviews-pagination {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      padding-bottom: 20px;
    }
  }
}
</style> 