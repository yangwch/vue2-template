import Vue from 'vue'
import App from './App'
import plugin from './apps/plugin/index'
import router from './router'
import store from './store/'
import VueI18n from 'vue-i18n'

/* element-ui */
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import langOptions from '@/apps/i18n'

Vue.config.productionTip = false;
Vue.use(VueI18n)
Vue.use(ElementUI)
Vue.use(plugin)

const i18n = new VueI18n(langOptions)

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
