import Vue from 'vue'
import Router from 'vue-router'

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
      component: () => import(/* webpackChunkName: "Undo" */ './views/Undo.vue')
    },
    {
      path: '/done',
      name: 'Done',
      meta: {
        requireAuth: true,
      },
      component: () => import(/* webpackChunkName: "Done" */ './views/Done.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      meta: {
        requireAuth: true,
      },
      component: () => import(/* webpackChunkName: "Profile" */ './views/Profile.vue')
    }
  ]
})
