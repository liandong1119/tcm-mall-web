<template>
  <div class="checkout">
    <div class="container">
      <!-- 收货地址 -->
      <el-card class="address-card">
        <template #header>
          <div class="card-header">
            <h3>{{ $t('checkout.shippingAddress') }}</h3>
            <el-button type="primary" link @click="handleAddAddress">
              {{ $t('checkout.addAddress') }}
            </el-button>
          </div>
        </template>

        <div class="address-list">
          <el-radio-group v-model="selectedAddress">
            <el-radio
              v-for="address in addresses"
              :key="address.id"
              :label="address.id"
              class="address-item"
            >
              <div class="address-content">
                <div class="info">
                  <span class="name">{{ address.name }}</span>
                  <span class="phone">{{ address.phone }}</span>
                  <span v-if="address.isDefault" class="default-tag">
                    {{ $t('checkout.defaultAddress') }}
                  </span>
                </div>
                <div class="address">{{ address.address }}</div>
              </div>
              <div class="operations">
                <el-button type="primary" link @click.stop="handleEditAddress(address)">
                  {{ $t('common.edit') }}
                </el-button>
                <el-button type="danger" link @click.stop="handleDeleteAddress(address.id)">
                  {{ $t('common.delete') }}
                </el-button>
              </div>
            </el-radio>
          </el-radio-group>
        </div>
      </el-card>

      <!-- 订单商品 -->
      <el-card class="order-card">
        <template #header>
          <h3>{{ $t('checkout.orderItems') }}</h3>
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
            <div class="price">¥{{ item.price.toFixed(2) }}</div>
            <div class="quantity">{{ item.quantity }}</div>
            <div class="subtotal">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
          </div>
        </div>
      </el-card>

      <!-- 订单备注 -->
      <el-card class="remark-card">
        <template #header>
          <h3>{{ $t('checkout.orderRemark') }}</h3>
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
          <span class="label">{{ $t('checkout.total') }}:</span>
          <span class="amount">¥{{ cartStore.selectedAmount.toFixed(2) }}</span>
        </div>
        <el-button
          type="primary"
          size="large"
          :loading="submitting"
          :disabled="!selectedAddress || !cartStore.selectedItems.length"
          @click="handleSubmitOrder"
        >
          {{ $t('checkout.submitOrder') }}
        </el-button>
      </div>
    </div>

    <!-- 地址编辑对话框 -->
    <el-dialog
      v-model="addressDialogVisible"
      :title="editingAddress ? $t('address.edit') : $t('address.add')"
      width="500px"
    >
      <el-form
        ref="addressFormRef"
        :model="addressForm"
        :rules="addressRules"
        label-width="100px"
      >
        <el-form-item :label="$t('address.name')" prop="name">
          <el-input v-model="addressForm.name" />
        </el-form-item>
        <el-form-item :label="$t('address.phone')" prop="phone">
          <el-input v-model="addressForm.phone" />
        </el-form-item>
        <el-form-item :label="$t('address.address')" prop="address">
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

// 收货地址相关
const addresses = ref([])
const selectedAddress = ref('')
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
    { required: true, message: $t('validate.nameRequired'), trigger: 'blur' },
    { min: 2, max: 20, message: $t('validate.nameLength'), trigger: 'blur' }
  ],
  phone: [
    { required: true, message: $t('validate.phoneRequired'), trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: $t('validate.phoneFormat'), trigger: 'blur' }
  ],
  address: [
    { required: true, message: $t('validate.addressRequired'), trigger: 'blur' },
    { min: 5, max: 100, message: $t('validate.addressLength'), trigger: 'blur' }
  ]
}

// 订单相关
const remark = ref('')
const submitting = ref(false)

// 获取收货地址列表
const fetchAddresses = async () => {
  try {
    const data = await getAddressList()
    addresses.value = data
    // 如果有默认地址，选中默认地址
    const defaultAddress = data.find(addr => addr.isDefault)
    if (defaultAddress) {
      selectedAddress.value = defaultAddress.id
    } else if (data.length > 0) {
      selectedAddress.value = data[0].id
    }
  } catch (error) {
    console.error('Failed to fetch addresses:', error)
    ElMessage.error(error.message)
  }
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
    $t('address.confirmDelete'),
    $t('common.warning'),
    {
      confirmButtonText: $t('common.confirm'),
      cancelButtonText: $t('common.cancel'),
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteAddress(id)
      ElMessage.success($t('address.deleteSuccess'))
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
        ElMessage.success($t('address.saveSuccess'))
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
    ElMessage.warning($t('checkout.selectAddress'))
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
    ElMessage.success($t('checkout.createSuccess'))
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
  padding: 20px 0;

  .address-card,
  .order-card,
  .remark-card {
    margin-bottom: 20px;

    :deep(.el-card__header) {
      padding: 15px 20px;

      h3 {
        margin: 0;
        font-size: 16px;
        color: #333;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }

  .address-list {
    .el-radio {
      display: block;
      margin: 0;
      padding: 15px;
      border-bottom: 1px solid #eee;

      &:last-child {
        border-bottom: none;
      }

      .address-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-left: 25px;
      }

      .address-content {
        flex: 1;
        min-width: 0;

        .info {
          margin-bottom: 5px;

          .name {
            font-weight: bold;
            margin-right: 10px;
          }

          .phone {
            color: #666;
            margin-right: 10px;
          }

          .default-tag {
            color: var(--el-color-primary);
            font-size: 12px;
          }
        }

        .address {
          color: #666;
          font-size: 14px;
        }
      }

      .operations {
        margin-left: 20px;
      }
    }
  }

  .order-items {
    .item-header {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      padding: 15px 0;
      border-bottom: 1px solid #eee;
      color: #999;
      font-size: 14px;
    }

    .item {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      padding: 20px 0;
      border-bottom: 1px solid #eee;

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
          border-radius: 4px;
        }

        .product-name {
          font-size: 14px;
          color: #333;
        }
      }

      .price,
      .subtotal {
        color: var(--el-color-danger);
      }
    }
  }

  .checkout-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
    padding: 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .order-summary {
      .label {
        font-size: 16px;
        color: #666;
        margin-right: 10px;
      }

      .amount {
        font-size: 24px;
        color: var(--el-color-danger);
        font-weight: bold;
      }
    }

    .el-button {
      min-width: 150px;
    }
  }
}
</style> 