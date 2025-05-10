<template>
  <div class="login-container">
    <div class="login-box bg-white p-8 rounded-lg shadow-lg">
      <!-- 切换标签 -->
      <div class="tabs flex mb-6">
        <button 
          @click="activeTab = 'login'"
          :class="['flex-1 py-2 text-center', activeTab === 'login' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-gray-500']"
        >
          登录
        </button>
        <button 
          @click="activeTab = 'register'"
          :class="['flex-1 py-2 text-center', activeTab === 'register' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-gray-500']"
        >
          注册
        </button>
      </div>

      <!-- 登录表单 -->
      <div v-if="activeTab === 'login'" class="space-y-4">
        <!-- 登录方式切换 -->
        <div class="flex mb-4 bg-gray-100 rounded-lg p-1">
          <button 
            @click="loginType = 'phone'"
            :class="['flex-1 py-2 text-center rounded-md', loginType === 'phone' ? 'bg-white shadow-sm' : '']"
          >
            手机号登录
          </button>
          <button 
            @click="loginType = 'password'"
            :class="['flex-1 py-2 text-center rounded-md', loginType === 'password' ? 'bg-white shadow-sm' : '']"
          >
            密码登录
          </button>
        </div>

        <!-- 手机号登录 -->
        <template v-if="loginType === 'phone'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
            <input 
              type="tel" 
              v-model="loginForm.phone" 
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入手机号"
            >
          </div>
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-1">验证码</label>
            <input 
              type="text" 
              v-model="loginForm.code"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入验证码"
            >
            <button 
              @click="sendCode"
              class="absolute right-2 top-7 text-sm text-blue-600 hover:text-blue-800"
              :disabled="countdown > 0"
            >
              {{ countdown > 0 ? `${countdown}s后重新发送` : '获取验证码' }}
            </button>
          </div>
        </template>

        <!-- 密码登录 -->
        <template v-else>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">账号</label>
            <input 
              type="text" 
              v-model="loginForm.username"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入手机号/用户名"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input 
              type="password" 
              v-model="loginForm.password"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入密码"
            >
          </div>
        </template>

        <!-- 记住登录 & 找回密码 -->
        <div class="flex justify-between items-center text-sm">
          <label class="flex items-center">
            <input type="checkbox" v-model="loginForm.remember" class="mr-2">
            记住登录状态
          </label>
          <a href="#" class="text-blue-600 hover:text-blue-800">忘记密码？</a>
        </div>

        <!-- 登录按钮 -->
        <button 
          @click="handleLogin" 
          class="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          登录
        </button>

        <!-- 第三方登录 -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">第三方账号登录</span>
            </div>
          </div>
          <div class="mt-6 flex justify-center space-x-6">
            <button class="text-gray-600 hover:text-gray-800">
              <i class="fab fa-weixin text-2xl"></i>
            </button>
            <button class="text-gray-600 hover:text-gray-800">
              <i class="fab fa-qq text-2xl"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 注册表单 -->
      <div v-else class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
          <input 
            type="tel" 
            v-model="registerForm.phone"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入手机号"
          >
        </div>
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-1">验证码</label>
          <input 
            type="text" 
            v-model="registerForm.code"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入验证码"
          >
          <button 
            @click="sendRegisterCode"
            class="absolute right-2 top-7 text-sm text-blue-600 hover:text-blue-800"
            :disabled="registerCountdown > 0"
          >
            {{ registerCountdown > 0 ? `${registerCountdown}s后重新发送` : '获取验证码' }}
          </button>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">设置密码</label>
          <input 
            type="password" 
            v-model="registerForm.password"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请设置6-20位密码"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
          <input 
            type="password" 
            v-model="registerForm.confirmPassword"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请再次输入密码"
          >
        </div>

        <!-- 用户协议 -->
        <div class="flex items-center text-sm">
          <input type="checkbox" v-model="registerForm.agreement" class="mr-2">
          <span class="text-gray-600">
            我已阅读并同意
            <a href="#" class="text-blue-600 hover:text-blue-800">《用户协议》</a>
            和
            <a href="#" class="text-blue-600 hover:text-blue-800">《隐私政策》</a>
          </span>
        </div>

        <!-- 注册按钮 -->
        <button 
          @click="handleRegister" 
          class="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          注册
        </button>
      </div>
    </div>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex'
  import CryptoJS from 'crypto-js'

  export default {
    name: 'Login',
    data() {
      return {
        activeTab: 'login',
        loginType: 'phone',
        countdown: 0,
        registerCountdown: 0,
        loginForm: {
          phone: '',
          code: '',
          username: '',
          password: '',
          remember: false
        },
        registerForm: {
          phone: '',
          code: '',
          password: '',
          confirmPassword: '',
          agreement: false
        },
        phoneError: '',
        loading: false
      }
    },
    methods: {
      ...mapActions(['login', 'register', 'sendVerificationCode']),

      // 加密密码
      encryptPassword(password) {
        return CryptoJS.MD5(password).toString()
      },

      // 验证手机号格式
      validatePhone(phone) {
        const phoneRegex = /^1[3-9]\d{9}$/
        const value = phone.trim()
        
        if (!value) {
          return { valid: false, message: '手机号不能为空' }
        } else if (value.length !== 11) {
          return { valid: false, message: '手机号必须是11位' }
        } else if (!/^1[3-9]/.test(value)) {
          return { valid: false, message: '手机号必须以1开头，第二位为3-9' }
        } else if (!/^\d+$/.test(value)) {
          return { valid: false, message: '手机号只能包含数字' }
        } else if (!phoneRegex.test(value)) {
          return { valid: false, message: '请输入正确的手机号格式' }
        }
        return { valid: true }
      },

      // 发送登录验证码
      async sendCode() {
        if (this.countdown > 0) return
        
        const phoneValidation = this.validatePhone(this.loginForm.phone)
        if (!phoneValidation.valid) {
          this.$message.error(phoneValidation.message)
          return
        }

        try {
          const result = await this.sendVerificationCode({
            phone: this.loginForm.phone,
            type: 'login'
          })

          if (result.success) {
            this.$message.success('验证码已发送')
            this.countdown = 60
            const timer = setInterval(() => {
              this.countdown--
              if (this.countdown === 0) {
                clearInterval(timer)
              }
            }, 1000)
          } else {
            this.$message.error(result.message)
          }
        } catch (error) {
          this.$message.error('发送验证码失败，请稍后重试')
        }
      },

      // 发送注册验证码
      async sendRegisterCode() {
        if (this.registerCountdown > 0) return
        
        const phoneValidation = this.validatePhone(this.registerForm.phone)
        if (!phoneValidation.valid) {
          this.$message.error(phoneValidation.message)
          return
        }

        try {
          const result = await this.sendVerificationCode({
            phone: this.registerForm.phone,
            type: 'register'
          })

          if (result.success) {
            this.$message.success('验证码已发送')
            this.registerCountdown = 60
            const timer = setInterval(() => {
              this.registerCountdown--
              if (this.registerCountdown === 0) {
                clearInterval(timer)
              }
            }, 1000)
          } else {
            this.$message.error(result.message)
          }
        } catch (error) {
          this.$message.error('发送验证码失败，请稍后重试')
        }
      },

      // 处理登录
      async handleLogin() {
        if (this.loading) return
        
        // 验证手机号
        const phoneValidation = this.validatePhone(
          this.loginType === 'phone' ? this.loginForm.phone : this.loginForm.username
        )
        if (!phoneValidation.valid) {
          this.$message.error(phoneValidation.message)
          return
        }

        this.loading = true
        try {
          const loginData = {
            loginType: this.loginType,
            phone: this.loginType === 'phone' ? this.loginForm.phone : this.loginForm.username
          }

          if (this.loginType === 'phone') {
            if (!this.loginForm.code) {
              this.$message.error('请输入验证码')
              return
            }
            loginData.code = this.loginForm.code
          } else {
            if (!this.loginForm.password) {
              this.$message.error('请输入密码')
              return
            }
            loginData.password = this.encryptPassword(this.loginForm.password)
          }

          const result = await this.login(loginData)
          if (result.success) {
            this.$message.success('登录成功')
            this.$router.push('/adoption')
          } else {
            this.$message.error(result.message || '登录失败')
          }
        } catch (error) {
          this.$message.error('登录失败，请稍后重试')
        } finally {
          this.loading = false
        }
      },

      // 处理注册
      async handleRegister() {
        if (this.loading) return
        
        // 验证手机号
        const phoneValidation = this.validatePhone(this.registerForm.phone)
        if (!phoneValidation.valid) {
          this.$message.error(phoneValidation.message)
          return
        }

        // 验证其他字段
        if (!this.registerForm.agreement) {
          this.$message.warning('请先同意用户协议和隐私政策')
          return
        }
        if (!this.registerForm.code) {
          this.$message.error('请输入验证码')
          return
        }
        if (!this.registerForm.password) {
          this.$message.error('请输入密码')
          return
        }

        // 调试：输出密码和确认密码的详细信息
        console.log('密码:', this.registerForm.password)
        console.log('确认密码:', this.registerForm.confirmPassword)
        console.log('密码是否相等:', this.registerForm.password === this.registerForm.confirmPassword)

        if (this.registerForm.password !== this.registerForm.confirmPassword) {
          this.$message.error('两次输入的密码不一致')
          return
        }

        this.loading = true
        try {
          const result = await this.register({
            phone: this.registerForm.phone,
            password: this.encryptPassword(this.registerForm.password),
            code: this.registerForm.code
          })

          if (result.success) {
            this.$message.success('注册成功')
            this.activeTab = 'login'
            this.loginForm.phone = this.registerForm.phone
          } else {
            this.$message.error(result.message || '注册失败')
          }
        } catch (error) {
          this.$message.error('注册失败，请稍后重试')
        } finally {
          this.loading = false
        }
      }
    }
  }
  </script>
  
  <style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary-bg-color);
}

.login-box {
  width: 100%;
    max-width: 400px;
  margin: 0 20px;
}

/* 输入框获取焦点时的动画 */
input:focus {
  transition: all 0.2s ease-in-out;
}

/* 按钮点击效果 */
button:active {
  transform: scale(0.98);
}

/* 验证码按钮禁用状态 */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  }
  </style>