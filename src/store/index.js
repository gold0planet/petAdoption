import { createStore } from 'vuex'
import axios from 'axios'
import pets from './modules/pets'

export default createStore({
  state: {
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
  },
  
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = {
        userId: userInfo?.userId || null,
        userName: userInfo?.userName || '未登录',
        avatar: userInfo?.avatar || null
      }
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
    },
    CLEAR_USER_STATE(state) {
      state.token = ''
      state.userInfo = null
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  },
  
  actions: {
    // 登录
    async login({ commit }, loginData) {
      try {
        const response = await axios.post('/api/user/login', loginData)
        if (response.data.code === 200) {
          commit('SET_TOKEN', response.data.data.token)
          commit('SET_USER_INFO', {
            userId: response.data.data.userId,
            userName: response.data.data.userName,
            avatar: response.data.data.avatar
          })
          return { success: true }
        }
        return { success: false, message: response.data.message }
      } catch (error) {
        console.error('登录失败:', error)
        return { success: false, message: error.response?.data?.message || '登录失败' }
      }
    },

    // 注册
    async register(registerData) {
      try {
        const response = await axios.post('/api/user/register', registerData)
        if (response.data.code === 200) {
          return { success: true }
        }
        return { success: false, message: response.data.message }
      } catch (error) {
        console.error('注册失败:', error)
        return { success: false, message: error.response?.data?.message || '注册失败' }
      }
    },

    // 发送验证码
    async sendVerificationCode(_, { phone, type }) {
      try {
        const response = await axios.post('/api/user/sendCode', { phone, type })
        if (response.data.code === 200) {
          return { success: true }
        }
        return { success: false, message: response.data.message }
      } catch (error) {
        console.error('发送验证码失败:', error)
        return { success: false, message: error.response?.data?.message || '发送验证码失败' }
      }
    },

    // 退出登录
    async logout({ commit, state }) {
      try {
        // 只有在有 token 的情况下才调用退出登录接口
        if (state.token) {
          await axios.post('/api/user/logout', { token: state.token })
        }
        
        // 清除本地状态
        commit('CLEAR_USER_STATE')
        
        return { success: true }
      } catch (error) {
        console.error('退出登录失败:', error)
        
        // 即使接口调用失败也清除本地状态
        commit('CLEAR_USER_STATE')
        
        return { 
          success: false, 
          message: error.response?.data?.message || '退出登录失败' 
        }
      }
    },

    async fetchPets({ commit }) {
      try {
        const response = await axios.get('/api/pets/adoptions')
        commit('SET_PETS', response.data)
        return { success: true, data: response.data }
      } catch (error) {
        console.error('获取宠物数据失败:', error)
        return { success: false, message: error.response?.data?.message || '获取宠物数据失败' }
      }
    }

  },
  
  getters: {
    isLoggedIn: state => !!state.token,
    userInfo: state => state.userInfo || {
      userId: null,
      userName: '未登录',
      avatar: null
    }
  },

  modules: {
    pets
  }
})
