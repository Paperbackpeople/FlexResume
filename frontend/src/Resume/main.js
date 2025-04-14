import { createApp } from 'vue'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import zh from './locales/zh.json'
import en from './locales/en.json'

console.log('Loaded messages:', { zh, en }) // 调试日志

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages: {
    zh,
    en
  },
  globalInjection: true
})

const app = createApp(App)
app.use(i18n)
app.mount('#app')