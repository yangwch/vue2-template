import Vue from 'vue'
import Router from 'vue-router'
import demoPlugin from '@/apps/demo/plugin'
import login from '@/apps/views/login'
import main from '@/apps/components/main'
import home from '@/apps/views/home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/plugin',
      name: 'demoPlugin',
      component: demoPlugin
    },
    {
      path: '/main',
      name: 'main',
      component: main,
      children: [
        {
          path: '/',
          name: 'home',
          component: home
        }
      ]
    }
  ]
})
