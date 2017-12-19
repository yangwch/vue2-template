import Vue from 'vue'
import Vuex from 'vuex'
import {getStore, setStore} from '@/config/mUtils'

Vue.use(Vuex)

const state = {
  userInfo: getStore('userInfo'),
  tabState: {},
  locale: getStore('locale') || 'cn'
}

const mutations = {
  /* 页面参数 */
  savetabState (state, tabState) {
    state.tabState = tabState
  },
  /* 保存用户信息 */
  saveUserInfo (state, userInfo) {
    setStore('userInfo', userInfo)
    state.userInfo = userInfo
  },
  saveLocale(state, locale) {
    setStore('locale', locale)
    state.locale = locale
  }
}

const actions = {
  /* 保存tabs状态 */
  sendtabState ({commit}, tabState) {
    commit('savetabState', tabState);
  },
  /* 保存用户信息 */
  saveUserInfo ({commit}, userInfo) {
    try {
      commit('saveUserInfo', userInfo);
    } catch (err) {
      /* console.log('您尚未登陆或者session失效') */
    }
  },
  sendLocale ({commit}, locale) {
    commit('saveLocale', locale);
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
})
