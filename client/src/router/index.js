import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/outEcpView',
    name: 'outEcpView',
    component: () => import('../views/outEcpView.vue')
  },
  {
    path: '/orgTypeNumber',
    name: 'orgTypeNumber',
    component: () => import('../views/orgTypeNumber.vue')
  },
  {
    path: '/orgTypes',
    name: 'orgTypes',
    component: () => import('../views/orgTypes.vue')
  },
  {
    path: '/solutionsCoef',
    name: 'solutionsCoef',
    component: () => import('../views/solutionsCoef.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
