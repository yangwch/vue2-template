import Vue from 'vue'
import Vuex from 'vuex'
import {getStore, setStore} from '@/config/mUtils'

Vue.use(Vuex)

const state = {
  userInfo: getStore('userInfo'),
  tabState: {},
  _pageData: {
  }
}

const mutations = {
  /* 页面参数 */
  savePageData (state, _pageData) {
    state._pageData = _pageData;
  },
  savetabState (state, tabState) {
    state.tabState = tabState
  },
  /* 保存用户信息 */
  saveUserInfo (state, userInfo) {
    setStore('userInfo', userInfo)
    state.userInfo = userInfo
  }
}

const actions = {
  sendPageData ({commit}, _pageData) {
    commit('savePageData', _pageData);
  },
  /* 保存tabs状态 */
  sendtabState ({commit}, tabState) {
    commit('savetabState', tabState);
  },
  /* 保存用户信息 */
  sendUserInfo ({commit}, userInfo) {
    try {
      commit('saveUserInfo', userInfo);
    } catch (err) {
      /* console.log('您尚未登陆或者session失效') */
    }
  },
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
})
