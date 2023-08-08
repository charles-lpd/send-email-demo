import { createApp } from 'vue'
import App from './App.vue'
import './styles/index.scss'
import { importElementPlus } from './element-plus'

const app = createApp(App)

importElementPlus(app)

app.mount('#app')
