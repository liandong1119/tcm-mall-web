<template>
  <div class="product-detail">
    <div class="container">
      <el-card class="detail-card">
        <div class="product-content">
          <!-- 商品图片 -->
          <div class="product-gallery">
            <el-carousel trigger="click" height="400px" :autoplay="false">
              <el-carousel-item v-for="(image, index) in product.images" :key="index">
                <img :src="image" :alt="product.name">
              </el-carousel-item>
            </el-carousel>
          </div>

          <!-- 商品信息 -->
          <div class="product-info">
            <h1 class="product-name">{{ product.name }}</h1>
            <div class="product-meta">
              <div class="price">
                <span class="label">{{ $t('product.price') }}:</span>
                <span class="amount">¥{{ product.price?.toFixed(2) }}</span>
              </div>
              <div class="stock">
                <span class="label">{{ $t('product.stock') }}:</span>
                <span :class="['value', product.stock > 0 ? 'in-stock' : 'out-stock']">
                  {{ product.stock > 0 ? product.stock : $t('product.outOfStock') }}
                </span>
              </div>
            </div>

            <!-- 购买数量 -->
            <div class="quantity-section">
              <span class="label">{{ $t('product.quantity') }}:</span>
              <el-input-number
                v-model="quantity"
                :min="1"
                :max="product.stock"
                :disabled="product.stock <= 0"
              />
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <el-button
                type="primary"
                :icon="ShoppingCart"
                :disabled="product.stock <= 0"
                @click="handleAddToCart"
              >
                {{ $t('product.addToCart') }}
              </el-button>
              <el-button
                type="danger"
                :icon="ShoppingBag"
                :disabled="product.stock <= 0"
                @click="handleBuyNow"
              >
                {{ $t('product.buyNow') }}
              </el-button>
            </div>
          </div>
        </div>

        <!-- 商品描述 -->
        <div class="product-description">
          <h2>{{ $t('product.description') }}</h2>
          <div class="description-content" v-html="product.description"></div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { ElMessage } from 'element-plus'
import { ShoppingCart, ShoppingBag } from '@element-plus/icons-vue'
import { getProductDetail } from '@/api/product'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const product = ref({})
const quantity = ref(1)
const loading = ref(false)

// 获取商品详情
const fetchProductDetail = async () => {
  loading.value = true
  try {
    const data = await getProductDetail(route.params.id)
    product.value = data
    // 重置数量
    quantity.value = 1
  } catch (error) {
    console.error('Failed to fetch product detail:', error)
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

// 添加到购物车
const handleAddToCart = () => {
  cartStore.addItem({
    ...product.value,
    quantity: quantity.value
  })
  ElMessage.success($t('cart.addSuccess'))
}

// 立即购买
const handleBuyNow = () => {
  cartStore.clear()
  cartStore.addItem({
    ...product.value,
    quantity: quantity.value
  })
  router.push('/checkout')
}

onMounted(() => {
  fetchProductDetail()
})
</script>

<style lang="scss" scoped>
.product-detail {
  padding: 20px 0;

  .detail-card {
    .product-content {
      display: flex;
      gap: 40px;
      margin-bottom: 40px;
    }

    .product-gallery {
      width: 400px;
      flex-shrink: 0;

      :deep(.el-carousel__item) {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f5f5f5;

        img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
      }
    }

    .product-info {
      flex: 1;
      min-width: 0;

      .product-name {
        font-size: 24px;
        color: #333;
        margin: 0 0 20px;
      }

      .product-meta {
        margin-bottom: 20px;

        .price {
          margin-bottom: 10px;

          .label {
            font-size: 16px;
            color: #666;
          }

          .amount {
            font-size: 24px;
            color: var(--el-color-danger);
            margin-left: 10px;
          }
        }

        .stock {
          .label {
            color: #666;
          }

          .value {
            margin-left: 10px;

            &.in-stock {
              color: var(--el-color-success);
            }

            &.out-stock {
              color: var(--el-color-danger);
            }
          }
        }
      }

      .quantity-section {
        display: flex;
        align-items: center;
        margin-bottom: 30px;

        .label {
          margin-right: 10px;
          color: #666;
        }
      }

      .action-buttons {
        display: flex;
        gap: 20px;

        .el-button {
          flex: 1;
          height: 40px;
        }
      }
    }

    .product-description {
      border-top: 1px solid #eee;
      padding-top: 30px;

      h2 {
        font-size: 20px;
        color: #333;
        margin: 0 0 20px;
      }

      .description-content {
        color: #666;
        line-height: 1.8;
      }
    }
  }
}
</style> 