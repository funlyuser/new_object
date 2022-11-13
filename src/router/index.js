import Vue from "vue"
import VueRouter from "vue-router"
// import login from '../components/login.vue'
// import welcome from '../components/welcome'
const login = () =>
  import(/* webpackChunkName: "group-user" */ '../components/login.vue')
// import home from '../components/home'
const home = () =>
  import(/* webpackChunkName: "group-user" */ '../components/home')
const welcome = () =>
  import(/* webpackChunkName: "group-user" */ '../components/welcome')


// import user from '../components/user'
const user = () =>
  import(/* webpackChunkName: "group-goods" */ '../components/user')
// import rights from '../components/rights'
const rights = () =>
  import(/* webpackChunkName: "group-goods" */ '../components/rights')
// import roles from '../components/roles'
const roles = () =>
  import(/* webpackChunkName: "group-goods" */ '../components/roles')


// import cate from '../components/cate'
const cate = () =>
  import(/* webpackChunkName: "group-cate" */ '../components/cate')
// import params from '../components/params'
const params = () =>
  import(/* webpackChunkName: "group-cate" */ '../components/params')
// import goods from '../components/goods'
const goods = () =>
  import(/* webpackChunkName: "group-cate" */ '../components/goods')


// import add from '../components/add'
const add = () =>
  import(/* webpackChunkName: "group-add" */ '../components/add')
// import orders from '../components/orders'
const orders = () =>
  import(/* webpackChunkName: "group-add" */ '../components/orders')
// import reports from '../components/reports'
const reports = () =>
  import(/* webpackChunkName: "group-add" */ '../components/reports')
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
    {path:'/roles',component:roles},
    {path:'/categories',component:cate},
    {path:'/params',component:params},
    {path:'/goods',component:goods},
    {path:'/add',component:add},
    {path:'/orders',component:orders},
    {path:'/reports',component:reports}
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
