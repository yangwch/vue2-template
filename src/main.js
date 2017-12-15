import Vue from 'vue'
import App from './App'
import plugin from './apps/plugin/index'
import router from './router'
import store from './store/'

/* element-ui */
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false;
Vue.use(ElementUI)
Vue.use(plugin)

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
