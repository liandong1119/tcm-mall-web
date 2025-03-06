<template>
  <div class="checkout">
    <div class="container">
      <div class="checkout-header">
        <h2>{{ $t('checkout.title') }}</h2>
        <div class="checkout-steps">
          <div class="step active">
            <div class="step-icon">
              <i class="el-icon-location"></i>
              <span class="step-number">1</span>
            </div>
            <span class="step-text">{{ $t('checkout.shippingAddress') }}</span>
          </div>
          <div class="step-divider"></div>
          <div class="step active">
            <div class="step-icon">
              <i class="el-icon-shopping-cart-full"></i>
              <span class="step-number">2</span>
            </div>
            <span class="step-text">{{ $t('checkout.orderSummary') }}</span>
          </div>
          <div class="step-divider"></div>
          <div class="step">
            <div class="step-icon">
              <i class="el-icon-wallet"></i>
              <span class="step-number">3</span>
            </div>
            <span class="step-text">{{ $t('checkout.payment') }}</span>
          </div>
        </div>
      </div>

      <!-- 收货地址 -->
      <el-card class="address-card">
        <template #header>
          <div class="card-header">
            <h3><i class="el-icon-location"></i> {{ $t('checkout.shippingAddress') }}</h3>
            <el-button type="primary" size="small" @click="handleAddAddress">
              <i class="el-icon-plus"></i> {{ $t('checkout.addAddress') }}
            </el-button>
          </div>
        </template>

        <div class="address-list">
          <el-empty v-if="!addresses.length" :description="$t('address.noAddress')"></el-empty>
          <el-radio-group v-else v-model="selectedAddress">
            <div 
              v-for="address in addresses" 
              :key="address.id" 
              class="address-wrapper"
              :class="{ 'address-selected': selectedAddress === address.id }"
            >
              <el-radio
                :label="address.id"
                class="address-item"
              >
                <div class="address-content">
                  <div class="address-header">
                    <div class="info">
                      <span class="name">{{ address.name }}</span>
                      <span class="phone">{{ address.phone }}</span>
                      <span v-if="address.isDefault" class="default-tag">
                        <i class="el-icon-star-on"></i> {{ $t('checkout.defaultAddress') }}
                      </span>
                    </div>
                    <div class="operations">
                      <el-button type="primary" link @click.stop="handleEditAddress(address)">
                        <i class="el-icon-edit"></i> {{ $t('common.edit') }}
                      </el-button>
                      <el-button type="danger" link @click.stop="handleDeleteAddress(address.id)">
                        <i class="el-icon-delete"></i> {{ $t('common.delete') }}
                      </el-button>
                    </div>
                  </div>
                  <div class="address-detail">
                    {{ address.address }}
                  </div>
                </div>
              </el-radio>
            </div>
          </el-radio-group>
        </div>
      </el-card>

      <!-- 订单商品 -->
      <el-card class="order-card">
        <template #header>
          <div class="card-header">
            <h3><i class="el-icon-shopping-cart-full"></i> {{ $t('checkout.orderItems') }}</h3>
            <span class="item-count">{{ cartStore.selectedItems.length }} {{ $t('cart.items') }}</span>
          </div>
        </template>

        <div class="order-items">
          <div class="item-header">
            <span class="column-product">{{ $t('cart.product') }}</span>
            <span class="column-price">{{ $t('cart.price') }}</span>
            <span class="column-quantity">{{ $t('cart.quantity') }}</span>
            <span class="column-subtotal">{{ $t('cart.subtotal') }}</span>
          </div>

          <div
            v-for="item in cartStore.selectedItems"
            :key="item.id"
            class="item"
          >
            <div class="product-info">
              <img :src="item.image" :alt="item.name">
              <div class="product-name">{{ item.name }}</div>
            </div>
            <div class="price" data-label="{{ $t('cart.price') }}">{{ $t('common.currency') }}{{ item.price.toFixed(2) }}</div>
            <div class="quantity" data-label="{{ $t('cart.quantity') }}">{{ item.quantity }}</div>
            <div class="subtotal" data-label="{{ $t('cart.subtotal') }}">{{ $t('common.currency') }}{{ (item.price * item.quantity).toFixed(2) }}</div>
          </div>
        </div>
      </el-card>

      <!-- 订单备注 -->
      <el-card class="remark-card">
        <template #header>
          <div class="card-header">
            <h3><i class="el-icon-document"></i> {{ $t('checkout.orderRemark') }}</h3>
          </div>
        </template>

        <el-input
          v-model="remark"
          type="textarea"
          :rows="3"
          :placeholder="$t('checkout.remarkPlaceholder')"
        />
      </el-card>

      <!-- 订单提交 -->
      <div class="checkout-footer">
        <div class="order-summary">
          <div class="summary-item">
            <span class="label">{{ $t('cart.subtotal') }}:</span>
            <span class="value">{{ $t('common.currency') }}{{ cartStore.selectedAmount.toFixed(2) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">{{ $t('cart.shipping') }}:</span>
            <span class="value">{{ $t('cart.free') }}</span>
          </div>
          <div class="summary-item total">
            <span class="label">{{ $t('checkout.total') }}:</span>
            <span class="amount">{{ $t('common.currency') }}{{ cartStore.selectedAmount.toFixed(2) }}</span>
          </div>
        </div>
        <el-button
          type="primary"
          size="large"
          :loading="submitting"
          :disabled="!selectedAddress || !cartStore.selectedItems.length"
          @click="handleSubmitOrder"
        >
          <i class="el-icon-check"></i> {{ $t('checkout.submitOrder') }}
        </el-button>
      </div>
    </div>

    <!-- 地址编辑对话框 -->
    <el-dialog
      v-model="addressDialogVisible"
      :title="editingAddress ? $t('address.editAddress') : $t('address.addAddress')"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="addressFormRef"
        :model="addressForm"
        :rules="addressRules"
        label-width="100px"
      >
        <el-form-item :label="$t('address.receiver')" prop="name">
          <el-input v-model="addressForm.name" />
        </el-form-item>
        <el-form-item :label="$t('address.receiverPhone')" prop="phone">
          <el-input v-model="addressForm.phone" />
        </el-form-item>
        <el-form-item :label="$t('address.detailAddress')" prop="address">
          <el-input
            v-model="addressForm.address"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="addressForm.isDefault">
            {{ $t('address.setDefault') }}
          </el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addressDialogVisible = false">
            {{ $t('common.cancel') }}
          </el-button>
          <el-button type="primary" @click="handleSaveAddress">
            {{ $t('common.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getAddressList,
  addAddress,
  updateAddress,
  deleteAddress
} from '@/api/user'
import { createOrder } from '@/api/order'

const router = useRouter()
const cartStore = useCartStore()
const { t } = useI18n()

// 收货地址相关
const addresses = ref([
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    address: '北京市朝阳区三里屯街道10号楼1单元801室',
    isDefault: true
  },
  {
    id: 2,
    name: '李四',
    phone: '13900139000',
    address: '上海市浦东新区陆家嘴环路1000号1栋2201室',
    isDefault: false
  },
  {
    id: 3,
    name: '王五',
    phone: '13700137000',
    address: '广州市天河区珠江新城华夏路10号1504室',
    isDefault: false
  }
])

const selectedAddress = ref(addresses.value.find(addr => addr.isDefault)?.id || '')
const addressDialogVisible = ref(false)
const addressFormRef = ref(null)
const editingAddress = ref(null)
const addressForm = ref({
  name: '',
  phone: '',
  address: '',
  isDefault: false
})

const addressRules = {
  name: [
    { required: true, message: t('validate.nameRequired'), trigger: 'blur' },
    { min: 2, max: 20, message: t('validate.nameLength'), trigger: 'blur' }
  ],
  phone: [
    { required: true, message: t('validate.phoneRequired'), trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: t('validate.phoneFormat'), trigger: 'blur' }
  ],
  address: [
    { required: true, message: t('validate.addressRequired'), trigger: 'blur' },
    { min: 5, max: 100, message: t('validate.addressLength'), trigger: 'blur' }
  ]
}

// 订单相关
const remark = ref('')
const submitting = ref(false)

// 获取收货地址列表
const fetchAddresses = async () => {
  // try {
  //   const data = await getAddressList()
  //   addresses.value = data
  //   // 如果有默认地址，选中默认地址
  //   const defaultAddress = data.find(addr => addr.isDefault)
  //   if (defaultAddress) {
  //     selectedAddress.value = defaultAddress.id
  //   } else if (data.length > 0) {
  //     selectedAddress.value = data[0].id
  //   }
  // } catch (error) {
  //   console.error('Failed to fetch addresses:', error)
  //   ElMessage.error(error.message)
  // }
}

// 添加地址
const handleAddAddress = () => {
  editingAddress.value = null
  addressForm.value = {
    name: '',
    phone: '',
    address: '',
    isDefault: false
  }
  addressDialogVisible.value = true
}

// 编辑地址
const handleEditAddress = (address) => {
  editingAddress.value = address
  addressForm.value = { ...address }
  addressDialogVisible.value = true
}

// 删除地址
const handleDeleteAddress = (id) => {
  ElMessageBox.confirm(
    t('address.confirmDelete'),
    t('common.warning'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteAddress(id)
      ElMessage.success(t('address.deleteSuccess'))
      fetchAddresses()
    } catch (error) {
      console.error('Failed to delete address:', error)
      ElMessage.error(error.message)
    }
  })
}

// 保存地址
const handleSaveAddress = async () => {
  if (!addressFormRef.value) return

  await addressFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (editingAddress.value) {
          await updateAddress(editingAddress.value.id, addressForm.value)
        } else {
          await addAddress(addressForm.value)
        }
        ElMessage.success(t('address.saveSuccess'))
        addressDialogVisible.value = false
        fetchAddresses()
      } catch (error) {
        console.error('Failed to save address:', error)
        ElMessage.error(error.message)
      }
    }
  })
}

// 提交订单
const handleSubmitOrder = async () => {
  if (!selectedAddress.value) {
    ElMessage.warning(t('checkout.selectAddress'))
    return
  }

  submitting.value = true
  try {
    const orderData = {
      addressId: selectedAddress.value,
      items: cartStore.selectedItems.map(item => ({
        id: item.id,
        quantity: item.quantity
      })),
      remark: remark.value
    }
    const { orderId } = await createOrder(orderData)
    ElMessage.success(t('checkout.createSuccess'))
    // 清除已购买的商品
    cartStore.clear()
    // 跳转到支付页面
    router.push(`/pay/${orderId}`)
  } catch (error) {
    console.error('Failed to create order:', error)
    ElMessage.error(error.message)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchAddresses()
})
</script>

<style lang="scss" scoped>
.checkout {
  padding: 30px 0;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }

  .checkout-header {
    margin-bottom: 30px;
    text-align: center;

    h2 {
      font-size: 28px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 25px;
    }

    .checkout-steps {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      max-width: 600px;

      .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        
        .step-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #f0f2f5;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          margin-bottom: 10px;
          transition: all 0.3s;
          
          i {
            font-size: 20px;
            color: #909399;
            position: absolute;
            transition: all 0.3s;
          }
          
          .step-number {
            font-size: 18px;
            font-weight: 600;
            color: #909399;
            transition: all 0.3s;
            z-index: 1;
          }
        }
        
        .step-text {
          font-size: 14px;
          color: #909399;
          transition: all 0.3s;
        }
        
        &.active {
          .step-icon {
            background-color: var(--el-color-primary);
            box-shadow: 0 0 0 5px rgba(64, 158, 255, 0.2);
            
            i {
              color: white;
              transform: scale(0);
              opacity: 0;
            }
            
            .step-number {
              color: white;
              transform: scale(1.2);
            }
          }
          
          .step-text {
            color: var(--el-color-primary);
            font-weight: 600;
          }
        }
      }

      .step-divider {
        width: 80px;
        height: 2px;
        background-color: #e4e7ed;
        margin: 0 15px;
        margin-bottom: 10px;
      }
    }
  }

  .el-card {
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    transition: all 0.3s;
    
    &:hover {
      box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
    }
    
    :deep(.el-card__header) {
      padding: 18px 20px;
      border-bottom: 1px solid #ebeef5;
    }
    
    :deep(.el-card__body) {
      padding: 20px;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      margin: 0;
      display: flex;
      align-items: center;

      i {
        margin-right: 8px;
        font-size: 20px;
        color: var(--el-color-primary);
      }
    }

    .item-count {
      font-size: 14px;
      color: #909399;
      background-color: #f0f2f5;
      padding: 4px 10px;
      border-radius: 12px;
    }
  }

  .address-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
  }

  .address-wrapper {
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 4px;
    transition: all 0.3s;
    cursor: pointer;

    &:hover {
      border-color: var(--el-color-primary);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &.selected {
      border-color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }
  }

  :deep(.el-radio) {
    width: 100%;
    height: 100%;
    margin-right: 0;
    padding: 12px;
    display: flex;
    align-items: flex-start;

    .el-radio__label {
      padding: 0;
      margin-left: 8px;
      flex: 1;
    }
  }

  .address-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;

    .info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;

      .name {
        font-weight: bold;
        color: var(--el-text-color-primary);
      }

      .phone {
        color: var(--el-text-color-secondary);
      }

      .default-tag {
        background-color: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
        padding: 2px 6px;
        border-radius: 2px;
        font-size: 12px;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
    }

    .operations {
      display: flex;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.3s;
    }
  }

  .address-wrapper:hover .operations {
    opacity: 1;
  }

  .address-detail {
    color: var(--el-text-color-regular);
    font-size: 13px;
    line-height: 1.4;
    margin-top: 4px;
    padding-left: 22px;
  }

  .order-items {
    .item-header {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      padding: 15px 20px;
      background-color: #f8f9fb;
      color: #909399;
      font-size: 14px;
      font-weight: 500;
      border-radius: 6px;
    }

    .item {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      padding: 20px;
      border-bottom: 1px solid #ebeef5;
      align-items: center;

      &:last-child {
        border-bottom: none;
      }

      .product-info {
        display: flex;
        align-items: center;
        gap: 15px;

        img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #ebeef5;
          transition: all 0.3s;

          &:hover {
            transform: scale(1.05);
          }
        }

        .product-name {
          font-size: 14px;
          color: #303133;
          font-weight: 500;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }

      .price,
      .quantity,
      .subtotal {
        font-size: 14px;
        color: #606266;
      }

      .price,
      .subtotal {
        font-weight: 500;
      }

      .subtotal {
        color: var(--el-color-danger);
        font-weight: bold;
      }
    }
  }

  .remark-card {
    :deep(.el-textarea__inner) {
      border-radius: 4px;
      padding: 12px;
      font-size: 14px;
      
      &:focus {
        border-color: var(--el-color-primary);
      }
    }
  }

  .checkout-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 25px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    margin-bottom: 30px;

    .order-summary {
      .summary-item {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
        
        .label {
          font-size: 14px;
          color: #606266;
          margin-right: 15px;
          min-width: 80px;
          text-align: right;
        }
        
        .value {
          font-size: 14px;
          color: #303133;
          font-weight: 500;
          min-width: 80px;
          text-align: right;
        }
        
        &.total {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #ebeef5;
          
          .label {
            font-size: 16px;
            font-weight: bold;
          }
          
          .amount {
            font-size: 24px;
            color: var(--el-color-danger);
            font-weight: bold;
            min-width: 80px;
            text-align: right;
          }
        }
      }
    }

    .el-button {
      min-width: 180px;
      height: 48px;
      font-size: 16px;
      border-radius: 24px;
      
      i {
        margin-right: 6px;
      }
    }
  }
}

@media (max-width: 768px) {
  .checkout {
    .checkout-header {
      .checkout-steps {
        .step-divider {
          width: 50px;
        }
        
        .step {
          .step-icon {
            width: 40px;
            height: 40px;
            
            i, .step-number {
              font-size: 16px;
            }
          }
          
          .step-text {
            font-size: 12px;
          }
        }
      }
    }
    
    .order-items {
      .item-header {
        display: none;
      }
      
      .item {
        grid-template-columns: 1fr;
        gap: 10px;
        
        .product-info {
          grid-column: 1 / -1;
        }
        
        .price, .quantity, .subtotal {
          display: flex;
          justify-content: space-between;
          
          &::before {
            content: attr(data-label);
            font-weight: 500;
            color: #909399;
          }
        }
      }
    }
    
    .checkout-footer {
      flex-direction: column;
      gap: 20px;
      
      .order-summary {
        width: 100%;
      }
      
      .el-button {
        width: 100%;
      }
    }
  }

  .address-list {
    .address-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;

      .info {
        width: 100%;
      }

      .operations {
        width: 100%;
        justify-content: flex-end;
      }
    }
  }
}
</style> 