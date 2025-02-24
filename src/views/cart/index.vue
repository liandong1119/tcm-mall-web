<template>
  <div class="cart-page">
    <div class="container">
      <el-card class="cart-container">
        <template #header>
          <div class="cart-header">
            <h2>{{ $t('cart.title') }}</h2>
            <el-button
              v-if="cartStore.items.length"
              type="danger"
              link
              @click="handleClearCart"
            >
              {{ $t('cart.clear') }}
            </el-button>
          </div>
        </template>

        <!-- 空购物车 -->
        <div v-if="!cartStore.items.length" class="empty-cart">
          <el-empty :description="$t('cart.empty')">
            <el-button type="primary" @click="$router.push('/')">
              {{ $t('cart.goShopping') }}
            </el-button>
          </el-empty>
        </div>

        <!-- 购物车列表 -->
        <template v-else>
          <!-- 商品列表 -->
          <div class="cart-list">
            <div class="cart-item" v-for="item in cartStore.items" :key="item.id">
              <el-checkbox v-model="item.selected" @change="handleItemSelect" />
              
              <div class="item-info">
                <el-image :src="item.image" :alt="item.name" class="item-image" />
                <div class="item-details">
                  <h3 class="item-name">{{ item.name }}</h3>
                  <p class="item-price">¥{{ item.price.toFixed(2) }}/{{ $t('cart.unit') }}</p>
                </div>
              </div>
              
              <div class="item-quantity">
                <span class="quantity-label">{{ $t('cart.quantity') }}：</span>
                <el-input-number 
                  v-model="item.quantity" 
                  :min="0.1" 
                  :max="99.9"
                  :step="0.1"
                  :precision="1"
                  size="small"
                  @change="(val) => handleQuantityChange(item.id, val)"
                />
                <span class="unit">{{ $t('cart.unit') }}</span>
              </div>
              
              <div class="item-subtotal">
                <span class="subtotal-label">{{ $t('cart.subtotal') }}：</span>
                <span class="subtotal-amount">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
              
              <div class="item-actions">
                <el-button 
                  type="danger" 
                  size="small" 
                  @click="handleRemoveItem(item.id)"
                >
                  {{ $t('common.delete') }}
                </el-button>
              </div>
            </div>
          </div>

          <!-- 底部结算栏 -->
          <div class="cart-footer">
            <div class="select-all">
              <el-checkbox 
                v-model="isAllSelected"
                @change="handleSelectAll"
              >
                {{ $t('cart.selectAll') }}
              </el-checkbox>
            </div>
            
            <div class="cart-total">
              <span class="selected-count">
                {{ $t('cart.selected') }}
                <span class="count">{{ cartStore.selectedCount }}</span>
                {{ $t('cart.items') }}
              </span>
              <span class="total-label">{{ $t('cart.total') }}：</span>
              <span class="total-amount">¥{{ cartStore.selectedAmount.toFixed(2) }}</span>
              <el-button 
                type="danger" 
                size="large"
                :disabled="!cartStore.selectedCount"
                @click="handleCheckout"
              >
                {{ $t('cart.checkout') }}
              </el-button>
            </div>
          </div>
        </template>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useI18n } from 'vue-i18n'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const cartStore = useCartStore()
const { t } = useI18n()

const cartItems = computed(() => cartStore.items)

// 选中商品数量
const selectedCount = computed(() => {
  return cartItems.value.filter(item => item.selected).length
})

// 总金额
const totalAmount = computed(() => {
  return cartItems.value
    .filter(item => item.selected)
    .reduce((total, item) => total + item.price * item.quantity, 0)
})

// 是否全选
const isAllSelected = computed({
  get: () => {
    return cartItems.value.length > 0 && cartItems.value.every(item => item.selected)
  },
  set: (value) => {
    cartItems.value.forEach(item => item.selected = value)
  }
})

// 全选/取消全选
const handleSelectAll = (value) => {
  cartItems.value.forEach(item => item.selected = value)
}

// 选择单个商品
const handleItemSelect = () => {
  // 更新本地存储
  cartStore.saveToStorage()
}

// 修改商品数量
const handleQuantityChange = (id, quantity) => {
  cartStore.updateQuantity(id, quantity)
}

// 删除商品
const handleRemoveItem = (id) => {
  ElMessageBox.confirm(
    t('cart.message.deleteConfirm'),
    t('common.warning'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(() => {
    cartStore.removeItem(id)
    ElMessage.success(t('cart.message.deleteSuccess'))
  })
}

// 清空购物车
const handleClearCart = () => {
  ElMessageBox.confirm(
    t('cart.message.clearConfirm'),
    t('common.warning'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(() => {
    cartStore.clear()
    ElMessage.success(t('cart.message.clearSuccess'))
  })
}

// 结算
const handleCheckout = () => {
  if (selectedCount.value > 0) {
    router.push('/checkout')
  }
}
</script>

<style lang="scss" scoped>
.cart-page {
  padding: 20px 0;
  min-height: 100vh;
  background: #f5f5f5;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .cart-container {
    background: #fff;

    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h2 {
        margin: 0;
        font-size: 20px;
        color: #333;
      }
    }

    .empty-cart {
      padding: 40px 0;
      text-align: center;
    }

    .cart-list {
      .cart-item {
        display: flex;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }

        .item-info {
          display: flex;
          align-items: center;
          margin: 0 20px;
          flex: 1;

          .item-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            margin-right: 15px;
          }

          .item-details {
            .item-name {
              font-size: 16px;
              color: #333;
              margin-bottom: 8px;
            }

            .item-price {
              color: #f56c6c;
              font-size: 14px;
            }
          }
        }

        .item-quantity {
          display: flex;
          align-items: center;
          margin: 0 20px;

          .quantity-label {
            margin-right: 10px;
            color: #666;
          }

          .el-input-number {
            width: 150px;
          }

          .unit {
            margin-left: 10px;
            color: #666;
          }
        }

        .item-subtotal {
          margin: 0 20px;
          min-width: 120px;
          text-align: right;

          .subtotal-label {
            color: #666;
          }

          .subtotal-amount {
            color: #f56c6c;
            font-weight: bold;
          }
        }

        .item-actions {
          margin-left: 20px;
        }
      }
    }

    .cart-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-top: 1px solid #eee;

      .cart-total {
        display: flex;
        align-items: center;

        .selected-count {
          margin-right: 20px;
          color: #666;

          .count {
            color: #f56c6c;
            margin: 0 5px;
          }
        }

        .total-label {
          color: #666;
        }

        .total-amount {
          font-size: 20px;
          color: #f56c6c;
          font-weight: bold;
          margin: 0 20px;
        }
      }
    }
  }
}
</style> 