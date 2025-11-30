import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/LoginPage.vue'
import DataScreen from '../components/DataScreen.vue'
import Design from '../components/DeviceLayoutDesigner.vue'
const routes = [
  {
    path: '/',
    redirect: '/design'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { title: '登录 - 智慧值守管理平台' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DataScreen,
    meta: { title: '数字大屏 - 智慧值守管理平台' }
  },
  {
    path: '/design',
    name: 'design',
    component: Design,
    meta: { title: '布局' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
