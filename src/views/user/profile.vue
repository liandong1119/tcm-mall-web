<template>
  <div class="profile">
    <div class="container">
      <el-card class="profile-card">
        <template #header>
          <div class="card-header">
            <span>{{ t('user.profile') }}</span>
          </div>
        </template>

        <el-tabs v-model="activeTab">
          <!-- 基本信息 -->
          <el-tab-pane :label="t('profile.basicInfo')" name="basic">
            <el-form
              ref="basicFormRef"
              :model="basicForm"
              :rules="basicRules"
              label-width="100px"
              class="profile-form"
            >
              <el-form-item :label="t('user.username')" prop="username">
                <el-input v-model="basicForm.username" disabled />
              </el-form-item>
              <el-form-item :label="t('user.nickname')" prop="nickname">
                <el-input v-model="basicForm.nickname" />
              </el-form-item>
              <el-form-item :label="t('user.email')" prop="email">
                <el-input v-model="basicForm.email" />
              </el-form-item>
              <el-form-item :label="t('user.phone')" prop="phone">
                <el-input v-model="basicForm.phone" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateBasicInfo" :loading="submitting">
                  {{ t('common.save') }}
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- 修改密码 -->
          <el-tab-pane :label="t('profile.changePassword')" name="password">
            <el-form
              ref="passwordFormRef"
              :model="passwordForm"
              :rules="passwordRules"
              label-width="120px"
              class="profile-form"
            >
              <el-form-item :label="t('profile.oldPassword')" prop="oldPassword">
                <el-input
                  v-model="passwordForm.oldPassword"
                  type="password"
                  show-password
                />
              </el-form-item>
              <el-form-item :label="t('profile.newPassword')" prop="newPassword">
                <el-input
                  v-model="passwordForm.newPassword"
                  type="password"
                  show-password
                />
              </el-form-item>
              <el-form-item :label="t('profile.confirmPassword')" prop="confirmPassword">
                <el-input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  show-password
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updatePassword" :loading="submitting">
                  {{ t('common.save') }}
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- 收货地址 -->
          <el-tab-pane :label="t('profile.addresses')" name="address">
            <div class="address-list">
              <div class="address-header">
                <el-button type="primary" @click="handleAddAddress">
                  {{ t('profile.addAddress') }}
                </el-button>
              </div>
              
              <el-empty v-if="!addresses.length" :description="t('profile.noAddress')" />
              
              <div v-else class="address-items">
                <el-card v-for="address in addresses" :key="address.id" class="address-item">
                  <div class="address-content">
                    <div class="info">
                      <span class="name">{{ address.name }}</span>
                      <span class="phone">{{ address.phone }}</span>
                      <el-tag v-if="address.isDefault" size="small" type="success">
                        {{ t('profile.defaultAddress') }}
                      </el-tag>
                    </div>
                    <div class="address">{{ address.address }}</div>
                  </div>
                  <div class="operations">
                    <el-button type="primary" link @click="handleEditAddress(address)">
                      {{ t('common.edit') }}
                    </el-button>
                    <el-button type="danger" link @click="handleDeleteAddress(address)">
                      {{ t('common.delete') }}
                    </el-button>
                    <el-button
                      v-if="!address.isDefault"
                      type="success"
                      link
                      @click="handleSetDefaultAddress(address)"
                    >
                      {{ t('profile.setDefault') }}
                    </el-button>
                  </div>
                </el-card>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <!-- 地址编辑对话框 -->
    <el-dialog
      v-model="addressDialogVisible"
      :title="addressForm.id ? t('profile.editAddress') : t('profile.addAddress')"
      width="500px"
    >
      <el-form
        ref="addressFormRef"
        :model="addressForm"
        :rules="addressRules"
        label-width="100px"
      >
        <el-form-item :label="t('user.name')" prop="name">
          <el-input v-model="addressForm.name" />
        </el-form-item>
        <el-form-item :label="t('user.phone')" prop="phone">
          <el-input v-model="addressForm.phone" />
        </el-form-item>
        <el-form-item :label="t('user.address')" prop="address">
          <el-input v-model="addressForm.address" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="addressForm.isDefault">
            {{ t('profile.setAsDefault') }}
          </el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addressDialogVisible = false">
            {{ t('common.cancel') }}
          </el-button>
          <el-button type="primary" @click="handleSaveAddress" :loading="submitting">
            {{ t('common.save') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useI18n } from 'vue-i18n'
import {
  getUserInfo,
  updateUserInfo,
  changePassword,
  getAddressList,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '@/api/user'

const userStore = useUserStore()
const { t } = useI18n()

// 表单相关
const activeTab = ref('basic')
const basicFormRef = ref(null)
const passwordFormRef = ref(null)
const addressFormRef = ref(null)
const submitting = ref(false)

// 基本信息表单
const basicForm = ref({
  username: '',
  nickname: '',
  email: '',
  phone: ''
})

// 密码表单
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 地址相关
const addresses = ref([])
const addressDialogVisible = ref(false)
const addressForm = ref({
  id: '',
  name: '',
  phone: '',
  address: '',
  isDefault: false
})

// 表单验证规则
const basicRules = {
  nickname: [
    { required: true, message: t('validate.nicknameRequired'), trigger: 'blur' },
    { min: 2, max: 20, message: t('validate.nicknameLength'), trigger: 'blur' }
  ],
  email: [
    { required: true, message: t('validate.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('validate.emailFormat'), trigger: 'blur' }
  ],
  phone: [
    { required: true, message: t('validate.phoneRequired'), trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: t('validate.phoneFormat'), trigger: 'blur' }
  ]
}

const passwordRules = {
  oldPassword: [
    { required: true, message: t('validate.oldPasswordRequired'), trigger: 'blur' },
    { min: 6, max: 20, message: t('validate.passwordLength'), trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: t('validate.newPasswordRequired'), trigger: 'blur' },
    { min: 6, max: 20, message: t('validate.passwordLength'), trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: t('validate.confirmPasswordRequired'), trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error(t('validate.passwordNotMatch')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const addressRules = {
  name: [
    { required: true, message: t('validate.nameRequired'), trigger: 'blur' }
  ],
  phone: [
    { required: true, message: t('validate.phoneRequired'), trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: t('validate.phoneFormat'), trigger: 'blur' }
  ],
  address: [
    { required: true, message: t('validate.addressRequired'), trigger: 'blur' }
  ]
}

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const data = await getUserInfo()
    basicForm.value = {
      username: data.username,
      nickname: data.nickname,
      email: data.email,
      phone: data.phone
    }
  } catch (error) {
    console.error('Failed to fetch user info:', error)
    ElMessage.error(t('message.fetchFailed'))
  }
}

// 获取地址列表
const fetchAddresses = async () => {
  try {
    const data = await getAddressList()
    addresses.value = data
    userStore.setAddresses(data)
  } catch (error) {
    console.error('Failed to fetch addresses:', error)
    ElMessage.error(t('message.fetchFailed'))
  }
}

// 更新基本信息
const updateBasicInfo = async () => {
  if (!basicFormRef.value) return

  await basicFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        await updateUserInfo(basicForm.value)
        ElMessage.success(t('message.updateSuccess'))
        userStore.setUserInfo({ ...userStore.userInfo, ...basicForm.value })
      } catch (error) {
        console.error('Failed to update user info:', error)
        ElMessage.error(t('message.updateFailed'))
      } finally {
        submitting.value = false
      }
    }
  })
}

// 更新密码
const updatePassword = async () => {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        await changePassword(passwordForm.value)
        ElMessage.success(t('message.updateSuccess'))
        passwordForm.value = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      } catch (error) {
        console.error('Failed to update password:', error)
        ElMessage.error(t('message.updateFailed'))
      } finally {
        submitting.value = false
      }
    }
  })
}

// 添加地址
const handleAddAddress = () => {
  addressForm.value = {
    id: '',
    name: '',
    phone: '',
    address: '',
    isDefault: false
  }
  addressDialogVisible.value = true
}

// 编辑地址
const handleEditAddress = (address) => {
  addressForm.value = { ...address }
  addressDialogVisible.value = true
}

// 保存地址
const handleSaveAddress = async () => {
  if (!addressFormRef.value) return

  await addressFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        if (addressForm.value.id) {
          await updateAddress(addressForm.value.id, addressForm.value)
        } else {
          await addAddress(addressForm.value)
        }
        ElMessage.success(t('message.saveSuccess'))
        addressDialogVisible.value = false
        fetchAddresses()
      } catch (error) {
        console.error('Failed to save address:', error)
        ElMessage.error(t('message.saveFailed'))
      } finally {
        submitting.value = false
      }
    }
  })
}

// 删除地址
const handleDeleteAddress = async (address) => {
  try {
    await ElMessageBox.confirm(
      t('message.confirmDelete'),
      t('common.tips'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )
    
    await deleteAddress(address.id)
    ElMessage.success(t('message.deleteSuccess'))
    fetchAddresses()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete address:', error)
      ElMessage.error(t('message.deleteFailed'))
    }
  }
}

// 设置默认地址
const handleSetDefaultAddress = async (address) => {
  try {
    await setDefaultAddress(address.id)
    ElMessage.success(t('message.operateSuccess'))
    fetchAddresses()
  } catch (error) {
    console.error('Failed to set default address:', error)
    ElMessage.error(t('message.operateFailed'))
  }
}

onMounted(() => {
  fetchUserInfo()
  fetchAddresses()
})
</script>

<style lang="scss" scoped>
.profile {
  padding: 20px 0;

  .profile-card {
    max-width: 800px;
    margin: 0 auto;
  }

  .profile-form {
    max-width: 500px;
    margin: 20px auto;
  }

  .address-list {
    .address-header {
      margin-bottom: 20px;
    }

    .address-items {
      display: grid;
      gap: 20px;
    }

    .address-item {
      .address-content {
        .info {
          margin-bottom: 10px;

          .name {
            font-size: 16px;
            font-weight: bold;
            margin-right: 10px;
          }

          .phone {
            color: #666;
            margin-right: 10px;
          }
        }

        .address {
          color: #333;
          line-height: 1.5;
        }
      }

      .operations {
        margin-top: 10px;
        display: flex;
        gap: 10px;
      }
    }
  }
}
</style> 