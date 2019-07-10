import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import Tags from '../store/tags'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/dashboard/:tag',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/*',
      redirect: '/dashboard/' + Tags[0].id // DefaultTag
    }]
})
