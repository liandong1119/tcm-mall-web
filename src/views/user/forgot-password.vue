<template>
  <div class="forgot-password-container">
    <div class="forgot-password-box">
      <!-- 左侧 Banner -->
      <div class="banner-section">
        <img src="@/assets/login-banner.svg" alt="Forgot Password Banner">
        <div class="banner-text">
          <h2>{{ $t('user.resetPassword') }}</h2>
          <p>{{ $t('user.resetPasswordDesc') }}</p>
        </div>
      </div>

      <!-- 右侧重置密码表单 -->
      <div class="form-section">
        <div class="form-header">
          <div class="logo">
            <img src="@/assets/logo.svg" alt="TCM Mall">
            <span>{{ $t('common.systemName') }}</span>
          </div>
          <h2>{{ $t('user.resetPassword') }}</h2>
          <p>{{ $t('user.resetPasswordTip') }}</p>
        </div>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          class="reset-form"
          @submit.prevent="handleSubmit"
        >
          <el-form-item prop="email">
            <el-input
              v-model="form.email"
              :placeholder="$t('user.emailPlaceholder')"
              prefix-icon="Message"
            />
          </el-form-item>

          <el-form-item prop="verificationCode">
            <div class="verification-container">
              <el-input
                v-model="form.verificationCode"
                :placeholder="$t('user.verificationCodePlaceholder')"
                prefix-icon="Key"
              />
              <el-button
                :disabled="countdown > 0"
                @click="handleSendCode"
              >
                {{ countdown > 0 ? `${countdown}s` : $t('user.sendCode') }}
              </el-button>
            </div>
          </el-form-item>

          <el-form-item prop="newPassword">
            <el-input
              v-model="form.newPassword"
              type="password"
              :placeholder="$t('user.newPasswordPlaceholder')"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              :placeholder="$t('user.confirmPasswordPlaceholder')"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              class="submit-btn"
              @click="handleSubmit"
            >
              {{ $t('user.resetPassword') }}
            </el-button>
          </el-form-item>

          <div class="form-footer">
            <router-link to="/user/login">
              {{ $t('user.backToLogin') }}
            </router-link>
          </div>
        </el-form>

        <!-- 语言切换 -->
        <div class="lang-switch">
          <LanguageSwitch />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import LanguageSwitch from '@/components/LanguageSwitch.vue'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref(null)
const loading = ref(false)
const countdown = ref(0)

const form = reactive({
  email: '',
  verificationCode: '',
  newPassword: '',
  confirmPassword: ''
})

const rules = {
  email: [
    { required: true, message: () => t('validate.emailRequired'), trigger: 'blur' },
    { type: 'email', message: () => t('validate.emailInvalid'), trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: () => t('validate.verificationCodeRequired'), trigger: 'blur' },
    { len: 6, message: () => t('validate.verificationCodeLength'), trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: () => t('validate.passwordRequired'), trigger: 'blur' },
    { min: 6, max: 20, message: () => t('validate.passwordLength'), trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: () => t('validate.confirmPasswordRequired'), trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.newPassword) {
          callback(new Error(t('validate.passwordNotMatch')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const handleSendCode = async () => {
  try {
    await formRef.value.validateField('email')
    const success = await userStore.sendVerificationCode(form.email)
    if (success) {
      ElMessage.success(t('message.verificationCodeSent'))
      startCountdown()
    }
  } catch (error) {
    console.error('Send verification code failed:', error)
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    const success = await userStore.resetPassword({
      email: form.email,
      verificationCode: form.verificationCode,
      newPassword: form.newPassword
    })

    if (success) {
      ElMessage.success(t('message.resetPasswordSuccess'))
      router.push('/user/login')
    }
  } catch (error) {
    console.error('Reset password failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.forgot-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 0;
}

.forgot-password-box {
  width: 100vw;
  height: 100vh;
  display: flex;
  background: #fff;
  overflow: hidden;
}

.banner-section {
  flex: 1;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .banner-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #fff;

    h2 {
      font-size: 32px;
      margin-bottom: 16px;
    }

    p {
      font-size: 16px;
      opacity: 0.8;
    }
  }
}

.form-section {
  width: 480px;
  padding: 40px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #fff;

  .form-header {
    text-align: center;
    margin-bottom: 40px;

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;

      img {
        width: 40px;
        height: 40px;
        margin-right: 8px;
      }

      span {
        font-size: 24px;
        color: var(--el-color-primary);
        font-weight: bold;
      }
    }

    h2 {
      font-size: 28px;
      color: var(--el-text-color-primary);
      margin-bottom: 8px;
    }

    p {
      color: var(--el-text-color-regular);
      font-size: 14px;
    }
  }

  .reset-form {
    width: 100%;
    max-width: 360px;
    margin: 0 auto;

    .verification-container {
      display: flex;
      gap: 12px;

      .el-input {
        flex: 1;
      }

      .el-button {
        width: 120px;
      }
    }

    .submit-btn {
      width: 100%;
      height: 44px;
      font-size: 16px;
    }

    .form-footer {
      margin-top: 24px;
      text-align: center;

      a {
        color: var(--el-color-primary);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .lang-switch {
    position: absolute;
    top: 20px;
    right: 20px;
  }
}

@media (max-width: 768px) {
  .forgot-password-box {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }

  .banner-section {
    display: none;
  }

  .form-section {
    width: 100%;
    padding: 20px;
    min-height: 100vh;
  }
}
</style> 