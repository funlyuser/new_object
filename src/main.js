import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './css/common.css'
import axios from 'axios'
import treetable from 'vue-table-with-tree-grid'
Vue.component('tree-table',treetable)
Vue.config.productionTip = false
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use((config)=>{
  config.headers.authorization=sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http=axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
