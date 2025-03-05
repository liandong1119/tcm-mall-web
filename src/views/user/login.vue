<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 左侧 Banner -->
      <div class="banner-section">
        <img src="@/assets/login-banner.svg" alt="Login Banner">
        <div class="banner-text">
          <h2>{{ $t('user.welcomeBack') }}</h2>
          <p>{{ $t('user.loginDesc') }}</p>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="form-section">
        <div class="form-header">
          <div class="logo">
            <img src="@/assets/logo.svg" alt="TCM Mall">
            <span>{{ $t('common.systemName') }}</span>
          </div>
          <h2>{{ $t('user.login') }}</h2>
          <p>{{ $t('user.loginTip') }}</p>
        </div>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          class="login-form"
          @submit.prevent="handleSubmit"
        >
          <el-form-item prop="account">
            <el-input
              v-model="form.account"
              :placeholder="$t('user.accountPlaceholder')"
              prefix-icon="User"
            />
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

          <div class="form-options">
            <el-checkbox v-model="form.rememberMe">
              {{ $t('user.rememberMe') }}
            </el-checkbox>
            <el-button type="text" @click="handleForgotPassword">
              {{ $t('user.forgotPassword') }}
            </el-button>
          </div>

          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              class="submit-btn"
              @click="handleSubmit"
            >
              {{ $t('user.login') }}
            </el-button>
          </el-form-item>

          <div class="form-footer">
            <span>{{ $t('user.noAccount') }}</span>
            <router-link to="/user/register">
              {{ $t('user.register') }}
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
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import LanguageSwitch from '@/components/LanguageSwitch.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { t } = useI18n()

const formRef = ref(null)
const loading = ref(false)
const captchaUrl = ref('/api/captcha')

const form = reactive({
  account: '',
  password: '',
  captcha: '',
  rememberMe: false
})

const rules = {
  account: [
    { required: true, message: () => t('validate.accountRequired'), trigger: 'blur' },
    { min: 3, max: 20, message: () => t('validate.accountLength'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: () => t('validate.passwordRequired'), trigger: 'blur' },
    { min: 6, max: 20, message: () => t('validate.passwordLength'), trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: () => t('validate.captchaRequired'), trigger: 'blur' },
    { len: 4, message: () => t('validate.captchaLength'), trigger: 'blur' }
  ]
}

const refreshCaptcha = () => {
  captchaUrl.value = `/api/captcha?t=${Date.now()}`
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    const success = await userStore.login({
      account: form.account,
      password: form.password,
      captcha: form.captcha,
      rememberMe: form.rememberMe
    })

      console.log("当前的请求是否成功；",success)
    if (success) {
      ElMessage.success(t('message.loginSuccess'))
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    }
  } catch (error) {
    console.error('Login failed:', error)
    refreshCaptcha()
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = () => {
  router.push('/user/forgot-password')
}

// 组件挂载时刷新验证码
onMounted(() => {
  refreshCaptcha()
})
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 0;
}

.login-box {
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

  .login-form {
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

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
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
  .login-box {
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