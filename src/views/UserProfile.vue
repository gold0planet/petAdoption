<template>
  <div class="user-profile">
    <div class="max-w-7xl mx-auto py-8 px-4">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800">个人中心</h1>
        <p class="text-gray-600 mt-2">管理您的个人信息和账户设置</p>
      </div>

      <div class="flex flex-col md:flex-row gap-8">
        <!-- 左侧导航 -->
        <div class="md:w-1/4">
          <div class="bg-white rounded-lg shadow-sm p-4">
            <div class="flex items-center space-x-4 p-4 border-b">
              <img :src="userInfo.avatar" alt="用户头像" class="w-16 h-16 rounded-full object-cover">
              <div>
                <h2 class="font-bold text-lg">{{ userInfo.username }}</h2>
                <p class="text-gray-500 text-sm">普通用户</p>
              </div>
            </div>
            <nav class="mt-4">
              <a 
                v-for="(item, index) in navItems" 
                :key="index"
                @click="activeTab = item.key"
                :class="['flex items-center p-3 rounded-lg cursor-pointer transition-colors',
                  activeTab === item.key ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50']"
              >
                <i :class="['fas', item.icon, 'w-5']"></i>
                <span class="ml-3">{{ item.label }}</span>
              </a>
            </nav>
          </div>
        </div>

        <!-- 右侧内容区 -->
        <div class="md:w-3/4">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <!-- 基本信息 -->
            <div v-if="activeTab === 'basic'" class="space-y-6">
              <h3 class="text-lg font-bold pb-4 border-b">基本信息</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">用户名</label>
                  <input type="text" v-model="userInfo.username" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">手机号</label>
                  <input type="tel" v-model="userInfo.phone" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">邮箱</label>
                  <input type="email" v-model="userInfo.email" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">性别</label>
                  <select v-model="userInfo.gender" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="male">男</option>
                    <option value="female">女</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                <div class="col-span-2 space-y-2">
                  <label class="block text-sm font-medium text-gray-700">个人简介</label>
                  <textarea 
                    v-model="userInfo.bio" 
                    rows="3" 
                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="介绍一下自己吧..."
                  ></textarea>
                </div>
              </div>
              <div class="flex justify-end">
                <button @click="saveBasicInfo" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  保存修改
                </button>
              </div>
            </div>

            <!-- 账户安全 -->
            <div v-if="activeTab === 'security'" class="space-y-6">
              <h3 class="text-lg font-bold pb-4 border-b">账户安全</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 class="font-medium">登录密码</h4>
                    <p class="text-sm text-gray-500">建议定期更换密码，确保账户安全</p>
                  </div>
                  <button class="px-4 py-2 border rounded-lg hover:bg-gray-100">修改</button>
                </div>
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 class="font-medium">手机绑定</h4>
                    <p class="text-sm text-gray-500">已绑定：{{ userInfo.phone }}</p>
                  </div>
                  <button class="px-4 py-2 border rounded-lg hover:bg-gray-100">更换</button>
                </div>
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 class="font-medium">邮箱绑定</h4>
                    <p class="text-sm text-gray-500">{{ userInfo.email || '未绑定邮箱' }}</p>
                  </div>
                  <button class="px-4 py-2 border rounded-lg hover:bg-gray-100">
                    {{ userInfo.email ? '更换' : '绑定' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 消息通知 -->
            <div v-if="activeTab === 'notifications'" class="space-y-6">
              <h3 class="text-lg font-bold pb-4 border-b">消息通知</h3>
              <div class="space-y-4">
                <div v-for="(setting, index) in notificationSettings" :key="index" 
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 class="font-medium">{{ setting.label }}</h4>
                    <p class="text-sm text-gray-500">{{ setting.description }}</p>
                  </div>
                  <label class="switch">
                    <input type="checkbox" v-model="setting.enabled">
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>
              <div class="flex justify-end">
                <button @click="saveNotificationSettings" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  保存设置
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Banner from '@/components/Banner.vue'

export default {
  name: 'UserProfile',
  components: {
    Banner
  },
  data() {
    return {
      activeTab: 'basic',
      userInfo: {
        username: '张小明',
        avatar: 'https://placekitten.com/100/100',
        phone: '138****8888',
        email: 'zhang@example.com',
        gender: 'male',
        bio: '热爱小动物，希望能给流浪动物一个温暖的家。'
      },
      navItems: [
        { key: 'basic', label: '基本信息', icon: 'fa-user' },
        { key: 'security', label: '账户安全', icon: 'fa-shield-alt' },
        { key: 'notifications', label: '消息通知', icon: 'fa-bell' }
      ],
      notificationSettings: [
        {
          label: '领养申请通知',
          description: '收到新的领养申请时通知我',
          enabled: true
        },
        {
          label: '系统消息',
          description: '接收系统更新和维护通知',
          enabled: true
        },
        {
          label: '评论回复',
          description: '他人回复我的评论时通知我',
          enabled: true
        }
      ]
    }
  },
  methods: {
    saveBasicInfo() {
      // TODO: 调用API保存用户信息
      this.$message.success('保存成功！')
    },
    saveNotificationSettings() {
      // TODO: 调用API保存通知设置
      this.$message.success('设置已更新！')
    }
  }
}
</script>

<style scoped>
.user-profile {
  width: 100%;
  background-color: var(--primary-bg-color);
  min-height: calc(100vh - 64px); /* 减去header的高度 */
}

/* 开关按钮样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* 输入框焦点样式 */
input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #2196F3;
}

/* 按钮悬停效果 */
button:hover {
  transform: translateY(-1px);
  transition: all 0.2s;
}
</style> 