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
// import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor, /* { default global options } */)
Vue.prototype.$http=axios
Vue.filter('dateformat',(val)=>{
  const db=new Date(val)
  const y=db.getFullYear()
  const m=(db.getMonth()+1+'').padStart(2,'0')
  const d=(db.getDate()+'').padStart(2,'0')
  const h=(db.getHours()+'').padStart(2,'0')
  const mm=(db.getMinutes()+'').padStart(2,'0')
  const s=(db.getSeconds()+'').padStart(2,'0')
  // console.log(`${y}-${m}-${d} ${h}:${mm}:${s}`)
  return`${y}-${m}-${d} ${h}:${mm}:${s}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
