import { createStore } from 'vuex'

export default createStore({
  state: {
    user: {
      isLoggedIn: true, // 默认设置为已登录状态
      userInfo: {
        id: 1,
        username: '张三',
        avatar: 'https://via.placeholder.com/40',
        phone: '13800138000',
        email: 'zhangsan@example.com'
      }
    }
  },
  mutations: {
    setLoginState(state, isLoggedIn) {
      state.user.isLoggedIn = isLoggedIn;
    },
    setUserInfo(state, userInfo) {
      state.user.userInfo = userInfo;
    },
    logout(state) {
      state.user.isLoggedIn = false;
      state.user.userInfo = null;
    }
  },
  actions: {
    login({ commit }, userInfo) {
      commit('setLoginState', true);
      commit('setUserInfo', userInfo);
    },
    logout({ commit }) {
      commit('logout');
    }
  },
  getters: {
    isLoggedIn: state => state.user.isLoggedIn,
    userInfo: state => state.user.userInfo
  }
})
