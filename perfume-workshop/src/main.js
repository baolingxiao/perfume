/**
 * 🚀 Vue.js香水工坊 - 主入口文件
 * Last updated: 2025-06-09 18:40
 * Author: Perfume Workshop Team
 * Description: Vue.js版本的香水工坊项目主入口文件，包含Vuetify UI框架配置
 */

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

createApp(App).use(store).use(router).mount('#app')
