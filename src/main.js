import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './tailwind.css'
import '@fortawesome/fontawesome-free/css/all.css'
import './styles/variables.css'


createApp(App).use(store).use(router).mount('#app')
