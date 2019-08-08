import Vue from 'vue'
import Router from 'vue-router'
import snake from '@/pages/snake'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'snake',
      component: snake
    }
  ]
})
