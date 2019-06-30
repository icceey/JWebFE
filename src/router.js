import Vue from 'vue'
import Router from 'vue-router'

import Undo from './views/Undo'
import Done from './views/Done'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import(/* webpackChunkName: "Index" */ './views/Index.vue')
    },
    {
      path: '/todo',
      name: 'Undo',
      meta: {
        requireAuth: true,
      },
      component: Undo
    },
    {
      path: '/done',
      name: 'Done',
      meta: {
        requireAuth: true,
      },
      component: Done
    },
    {
      path: '/profile',
      name: 'profile',
      meta: {
        requireAuth: true,
      },
      component: () => import(/* webpackChunkName: "Profile" */ './views/Profile.vue')
    },
    {
      path: '/setting',
      name: 'setting',
      meta: {
        requireAuth: true,
      },
      component: () => import(/* webpackChunkName: "Setting" */ './views/Setting.vue')
    }
  ]
})
