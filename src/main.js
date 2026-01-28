import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './main.css'

const app = createApp(App)

app.use(router)
app.mount('#app')

if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}