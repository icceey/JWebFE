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
      name: 'todoList',
      meta: {
        requireAuth: true,
      },
      component: () => import(/* webpackChunkName: "todoList" */ './views/TodoList.vue')
    },
    {
      path: '/done',
      name: 'doneTodo',
      meta: {
        requireAuth: true,
      },
      component: () => import(/* webpackChunkName: "DoneTodo" */ './views/DoneTodo.vue')
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
