import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './tailwind.css'
import '@fortawesome/fontawesome-free/css/all.css'
import './styles/variables.css'
import axios from 'axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// 配置 axios
axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:8080'
axios.interceptors.request.use(
  config => {
    const token = store.state.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          store.dispatch('logout')
          router.push('/login')
          break
        case 403:
          router.push('/403')
          break
        case 404:
          router.push('/404')
          break
        default:
          console.error('API Error:', error.response)
      }
    }
    return Promise.reject(error)
  }
)

const app = createApp(App)

app.use(store)
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .mount('#app')
