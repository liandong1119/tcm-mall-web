<template>
  <div class="register-container">
    <div class="register-box">
      <!-- 左侧 Banner -->
      <div class="banner-section">
        <img src="@/assets/register-banner.svg" alt="Register Banner">
        <div class="banner-text">
          <h2>{{ $t('user.welcomeJoin') }}</h2>
          <p>{{ $t('user.registerDesc') }}</p>
        </div>
      </div>

      <!-- 右侧注册表单 -->
      <div class="form-section">
        <div class="form-header">
          <div class="logo">
            <img src="@/assets/logo.svg" alt="TCM Mall">
            <span>{{ $t('common.systemName') }}</span>
          </div>
          <h2>{{ $t('user.register') }}</h2>
          <p>{{ $t('user.registerTip') }}</p>
        </div>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          class="register-form"
          @submit.prevent="handleSubmit"
        >
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              :placeholder="$t('user.usernamePlaceholder')"
              prefix-icon="User"
            />
          </el-form-item>

          <el-form-item prop="phone">
            <el-input
              v-model="form.phone"
              :placeholder="$t('user.phonePlaceholder')"
              prefix-icon="Phone"
            />
          </el-form-item>

          <el-form-item prop="email">
            <el-input
              v-model="form.email"
              :placeholder="$t('user.emailPlaceholder')"
              prefix-icon="Message"
            />
          </el-form-item>

          <el-form-item prop="emailCode">
            <div class="verification-container">
              <el-input
                v-model="form.emailCode"
                :placeholder="$t('user.emailCodePlaceholder')"
                prefix-icon="Key"
              />
              <el-button
                :disabled="emailCountdown > 0"
                @click="handleSendEmailCode"
              >
                {{ emailCountdown > 0 ? `${emailCountdown}s` : $t('user.sendEmailCode') }}
              </el-button>
            </div>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              :placeholder="$t('user.passwordPlaceholder')"
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

          <el-form-item prop="captcha">
            <div class="captcha-container">
              <el-input
                v-model="form.captcha"
                :placeholder="$t('user.captchaPlaceholder')"
                prefix-icon="Key"
              />
              <img 
                :src="captchaUrl" 
                class="captcha-image" 
                alt="captcha"
                @click="refreshCaptcha"
              >
            </div>
          </el-form-item>

          <el-form-item prop="agreement">
            <el-checkbox v-model="form.agreement">
              {{ $t('user.agreement') }}
              <router-link to="/agreement" class="agreement-link">
                {{ $t('user.agreementText') }}
              </router-link>
            </el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              class="submit-btn"
              @click="handleSubmit"
            >
              {{ $t('user.register') }}
            </el-button>
          </el-form-item>

          <div class="form-footer">
            <span>{{ $t('user.hasAccount') }}</span>
            <router-link to="/user/login">
              {{ $t('user.login') }}
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import LanguageSwitch from '@/components/LanguageSwitch.vue'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref(null)
const loading = ref(false)
const captchaUrl = ref('/api/captcha')
const emailCountdown = ref(0)

const form = reactive({
  username: '',
  phone: '',
  email: '',
  emailCode: '',
  password: '',
  confirmPassword: '',
  captcha: '',
  agreement: false
})

const rules = {
  username: [
    { required: true, message: () => t('validate.usernameRequired'), trigger: 'blur' },
    { min: 3, max: 20, message: () => t('validate.usernameLength'), trigger: 'blur' }
  ],
  phone: [
    { required: true, message: () => t('validate.phoneRequired'), trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: () => t('validate.phoneInvalid'), trigger: 'blur' }
  ],
  email: [
    { required: true, message: () => t('validate.emailRequired'), trigger: 'blur' },
    { type: 'email', message: () => t('validate.emailInvalid'), trigger: 'blur' }
  ],
  emailCode: [
    { required: true, message: () => t('validate.emailCodeRequired'), trigger: 'blur' },
    { len: 6, message: () => t('validate.emailCodeLength'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: () => t('validate.passwordRequired'), trigger: 'blur' },
    { min: 6, max: 20, message: () => t('validate.passwordLength'), trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: () => t('validate.confirmPasswordRequired'), trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error(t('validate.passwordNotMatch')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  captcha: [
    { required: true, message: () => t('validate.captchaRequired'), trigger: 'blur' },
    { len: 4, message: () => t('validate.captchaLength'), trigger: 'blur' }
  ],
  agreement: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error(t('validate.agreementRequired')))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

const refreshCaptcha = () => {
  captchaUrl.value = `/api/captcha?t=${Date.now()}`
}

const startEmailCountdown = () => {
  emailCountdown.value = 60
  const timer = setInterval(() => {
    emailCountdown.value--
    if (emailCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const handleSendEmailCode = async () => {
  try {
    await formRef.value.validateField('email')
    const success = await userStore.sendEmailCode(form.email)
    if (success) {
      ElMessage.success(t('message.emailCodeSent'))
      startEmailCountdown()
    }
  } catch (error) {
    console.error('Send email code failed:', error)
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    const success = await userStore.register({
      username: form.username,
      phone: form.phone,
      email: form.email,
      emailCode: form.emailCode,
      password: form.password,
      captcha: form.captcha
    })

    if (success) {
      ElMessage.success(t('message.registerSuccess'))
      router.push('/user/login')
    }
  } catch (error) {
    console.error('Register failed:', error)
    refreshCaptcha()
  } finally {
    loading.value = false
  }
}

// 组件挂载时刷新验证码
onMounted(() => {
  refreshCaptcha()
})
</script>

<style lang="scss" scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 0;
}

.register-box {
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

  .register-form {
    width: 100%;
    max-width: 360px;
    margin: 0 auto;

    .captcha-container {
      display: flex;
      gap: 12px;

      .el-input {
        flex: 1;
      }

      .captcha-image {
        height: 40px;
        border-radius: 4px;
        cursor: pointer;
      }
    }

    .agreement-link {
      color: var(--el-color-primary);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
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
      color: var(--el-text-color-regular);

      a {
        color: var(--el-color-primary);
        text-decoration: none;
        margin-left: 4px;

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
  .register-box {
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