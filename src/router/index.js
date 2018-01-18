import Vue from 'vue'
import Router from 'vue-router'
import { routerMode } from './../config/env'
import configRoutes from './config'
const login = r => require.ensure([], () => r(require('@/apps/views/login')), 'login')
const main = r => require.ensure([], () => r(require('@/apps/components/main')), 'main')
const demoPlugin = r => require.ensure([], () => r(require('@/apps/demo/plugin')), 'plugin')
const home = r => require.ensure([], () => r(require('@/apps/views/home')), 'home')

Vue.use(Router)

let mainRoutes = [
  {
    path: '/',
    name: 'home',
    component: home
  }
]
mainRoutes = mainRoutes.concat(configRoutes)

let routes = {
  mode: routerMode,
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/main',
      component: main,
      children: mainRoutes
    }
  ]
}
if (process.env.NODE_ENV === 'development') {
  routes.routes.push({
    path: '/demo',
    name: 'demoPlugin',
    component: demoPlugin
  })
}
export default new Router(routes)
