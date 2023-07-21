import Vue from 'vue'
import Router from 'vue-router'
import CarStatus from '@/components/CarStatus'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CarStatus',
      component: CarStatus
    }
  ]
})
