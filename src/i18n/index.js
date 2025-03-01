import { createI18n } from 'vue-i18n'
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import en from './en'
import zh from './zh'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
})

// 更新页面标题的函数
export const updateTitle = (route) => {
  const title = route?.meta?.title ? i18n.global.t(route.meta.title) : ''
  const appTitle = i18n.global.locale.value === 'zh' ? '中药商城' : 'TCM Mall'
  document.title = title ? `${title} - ${appTitle}` : appTitle
}

// 监听语言变化
if (typeof window !== 'undefined') {
  watch(
    () => i18n.global.locale.value,
    () => {
      const route = useRoute()
      updateTitle(route)
    }
  )
}

export default i18n 