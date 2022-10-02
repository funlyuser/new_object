import Vue from "vue"
import VueRouter from "vue-router"
import login from '../components/login.vue'
import home from '../components/home'
import welcome from '../components/welcome'
import user from '../components/user'
import rights from '../components/rights'
import roles from '../components/roles'
Vue.use(VueRouter)
const routes = [
  {path:'/',redirect:'/login'},
  {path:'/login',component:login},
  {path:'/home',
  component:home,
  redirect:'/welcome',
  children:[
    // {path:'',component:welcome},
    {path:'/welcome',component:welcome},
    {path:'/users',component:user},
    {path:'/rights',component:rights},
    {path:'/roles',component:roles}
  ]}
]

const router = new VueRouter({
  routes
})
router.beforeEach((to,from,next)=>{
  const token=sessionStorage.getItem('token')
  if(to.path==='/login')return next()
  if(!token)return next('/login')
  next()
})

export default router
