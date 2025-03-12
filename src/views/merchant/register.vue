<template>
  <div class="merchant-register">
    <div class="container">
      <el-card class="register-card">
        <template #header>
          <div class="card-header">
            <h2>{{ $t('merchant.register.title') }}</h2>
            <p>{{ $t('merchant.register.subtitle') }}</p>
          </div>
        </template>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="120px"
          class="register-form"
        >
          <el-form-item :label="$t('merchant.register.email')" prop="email">
            <el-input
              v-model="form.email"
              :placeholder="$t('merchant.register.emailPlaceholder')"
            />
          </el-form-item>

          <el-form-item :label="$t('merchant.register.phone')" prop="phone">
            <el-input
              v-model="form.phone"
              :placeholder="$t('merchant.register.phonePlaceholder')"
            />
          </el-form-item>

          <el-form-item :label="$t('merchant.register.verifyCode')" prop="verifyCode">
            <div class="verify-code-input">
              <el-input
                v-model="form.verifyCode"
                :placeholder="$t('merchant.register.verifyCodePlaceholder')"
              />
              <el-button
                type="primary"
                :disabled="!!countdown"
                @click="handleSendCode"
              >
                {{ countdown ? `${countdown}s` : $t('merchant.register.getCode') }}
              </el-button>
            </div>
          </el-form-item>

          <el-form-item :label="$t('merchant.register.shopName')" prop="shopName">
            <el-input
              v-model="form.shopName"
              :placeholder="$t('merchant.register.shopNamePlaceholder')"
            />
          </el-form-item>

          <el-form-item prop="agreement">
            <el-checkbox v-model="form.agreement">
              {{ $t('merchant.register.agreement') }}
              <el-button link type="primary" @click="viewAgreement">
                {{ $t('merchant.register.terms') }}
              </el-button>
            </el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="submitting"
              class="submit-btn"
              @click="handleSubmit"
            >
              {{ $t('merchant.register.submit') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { sendEmailCode } from '@/api/user'
import { registerMerchant, getMerchantAgreement } from '@/api/merchant'

const router = useRouter()
const { t } = useI18n()
const formRef = ref(null)
const submitting = ref(false)
const countdown = ref(0)
const agreementContent = ref('')

const form = reactive({
  email: '',
  phone: '',
  verifyCode: '',
  shopName: '',
  agreement: false
})

// 表单验证规则
const rules = {
  email: [
    { required: true, message: () => t('merchant.validate.emailRequired'), trigger: 'blur' },
    { type: 'email', message: () => t('merchant.validate.emailFormat'), trigger: 'blur' }
  ],
  phone: [
    { required: true, message: () => t('merchant.validate.phoneRequired'), trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: () => t('merchant.validate.phoneFormat'), trigger: 'blur' }
  ],
  verifyCode: [
    { required: true, message: () => t('merchant.validate.verifyCodeRequired'), trigger: 'blur' }
  ],
  shopName: [
    { required: true, message: () => t('merchant.validate.shopNameRequired'), trigger: 'blur' },
    { min: 2, max: 20, message: () => t('merchant.validate.shopNameLength'), trigger: 'blur' }
  ],
  agreement: [
    { type: 'boolean', message: () => t('merchant.validate.agreementRequired'), trigger: 'change', transform: value => value === true }
  ]
}

// 发送验证码
const handleSendCode = async () => {
  try {
    await formRef.value.validateField('email')
    await sendEmailCode(form.email)
    ElMessage.success(t('message.codeSent'))
    startCountdown()
  } catch (error) {
    console.error('Failed to send code:', error)
    ElMessage.error(t('message.sendCodeFailed'))
  }
}

// 倒计时
const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 查看商家入驻协议
const viewAgreement = async () => {
  try {
    const { content } = await getMerchantAgreement()
    agreementContent.value = content
    ElMessageBox.alert(content, t('merchant.register.terms'), {
      confirmButtonText: t('common.confirm'),
      callback: () => {
        form.agreement = true
      }
    })
  } catch (error) {
    console.error('Failed to get agreement:', error)
  }
}

// 提交注册
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true
    
    // 调用商家注册接口
    await registerMerchant({
      email: form.email,
      phone: form.phone,
      verifyCode: form.verifyCode,
      shopName: form.shopName
    })
    
    // 注册成功后的处理
    ElMessage.success(t('merchant.register.success'))
    
    // 显示成功提示对话框
    await ElMessageBox.alert(
      t('merchant.register.successTips'),
      t('common.success'),
      {
        confirmButtonText: t('common.confirm'),
        type: 'success',
        showClose: false,
        callback: () => {
          // 跳转到商家登录页面
          router.push('/merchant/login')
        }
      }
    )
  } catch (error) {
    console.error('Submit failed:', error)
    ElMessage.error(error.message || t('merchant.register.fail'))
  } finally {
    submitting.value = false
  }
}

// 组件挂载时获取商家入驻协议
onMounted(async () => {
  try {
    const { content } = await getMerchantAgreement()
    agreementContent.value = content
  } catch (error) {
    console.error('Failed to get agreement:', error)
  }
})
</script>

<style lang="scss" scoped>
.merchant-register {
  padding: 40px 0;
  min-height: calc(100vh - var(--app-header-height) - var(--app-footer-height));
  background-color: var(--el-bg-color-page);

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .register-card {
    .card-header {
      text-align: center;
      
      h2 {
        font-size: 24px;
        color: var(--el-text-color-primary);
        margin-bottom: 10px;
      }
      
      p {
        font-size: 14px;
        color: var(--el-text-color-regular);
        margin: 0;
      }
    }

    .register-form {
      margin-top: 30px;
      
      .verify-code-input {
        display: flex;
        gap: 10px;
        
        .el-input {
          flex: 1;
        }
        
        .el-button {
          width: 120px;
        }
      }
      
      .submit-btn {
        width: 100%;
      }
    }
  }
}
</style> 