<template>
  <header class="header bg-white p-4 flex items-center justify-between shadow-md">
    <div class="logo-container flex items-center">
      <img src="/logo.png" alt="Logo" class="logo" />
      <span class="site-name text-lg font-bold ml-6">寻巢</span>
    </div>
    <nav class="nav">
      <ul class="flex space-x-8 items-center">
        <li><router-link to="/adoption" class="hover:text-blue-500">首页</router-link></li>
        <li><router-link to="/adoption" class="hover:text-blue-500">宠物领养</router-link></li>
        <li><router-link to="/lost-pets" class="hover:text-blue-500">宠物挂失</router-link></li>
        <li><router-link to="/care-tips" class="hover:text-blue-500">养护知识</router-link></li>
        <li><router-link to="/breed-recognition" class="hover:text-blue-500">品种识别</router-link></li>
        
        <!-- 消息通知模块 -->
        <li v-if="isLoggedIn" class="relative">
          <div @click="toggleNotifications" class="cursor-pointer relative">
            <i class="fas fa-bell text-xl hover:text-blue-500 transition-colors"></i>
            <span v-if="unreadCount > 0" 
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
          </div>
          
          <!-- 消息下拉菜单 -->
          <div v-show="showNotifications" 
            class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
            <!-- 消息标题栏 -->
            <div class="px-4 py-2 border-b flex justify-between items-center">
              <span class="font-medium">消息通知</span>
              <button @click="markAllAsRead" class="text-sm text-blue-500 hover:text-blue-700">
                全部已读
              </button>
            </div>
            
            <!-- 消息列表 -->
            <div class="max-h-96 overflow-y-auto">
              <template v-if="notifications.length">
                <div v-for="(notification, index) in notifications" 
                  :key="index"
                  :class="['px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors',
                    notification.isRead ? 'bg-white' : 'bg-blue-50']"
                  @click="readNotification(notification)">
                  <div class="flex items-start">
                    <i :class="['fas', notification.icon, 'mt-1 mr-3', 
                      notification.isRead ? 'text-gray-400' : 'text-blue-500']"></i>
                    <div class="flex-1">
                      <h4 class="text-sm font-medium">{{ notification.title }}</h4>
                      <p class="text-sm text-gray-500 mt-1">{{ notification.content }}</p>
                      <span class="text-xs text-gray-400 mt-1 block">{{ notification.time }}</span>
                    </div>
                  </div>
                </div>
              </template>
              <div v-else class="px-4 py-8 text-center text-gray-500">
                暂无消息通知
              </div>
            </div>
            
            <!-- 查看全部按钮 -->
            <div class="px-4 py-2 border-t">
              <router-link to="/messages" class="block text-center text-sm text-blue-500 hover:text-blue-700">
                查看全部消息
              </router-link>
            </div>
          </div>
        </li>

        <li v-if="!isLoggedIn">
          <router-link to="/login" class="text-blue-500 hover:underline">用户登录/注册</router-link>
        </li>
        <li v-else class="relative">
          <div @click="toggleDropdown" class="flex items-center cursor-pointer">
            <img :src="userInfo.avatar" alt="用户头像" class="w-8 h-8 rounded-full object-cover" />
            <span class="ml-2">{{ userInfo.username }}</span>
          </div>
          <div v-show="showDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
            <router-link to="/user-profile" class="block px-4 py-2 hover:bg-gray-100">
              <i class="fas fa-user mr-2"></i>个人中心
            </router-link>
            <router-link to="/my-pets" class="block px-4 py-2 hover:bg-gray-100">
              <i class="fas fa-paw mr-2"></i>我的宠物
            </router-link>
            <router-link to="/messages" class="block px-4 py-2 hover:bg-gray-100">
              <i class="fas fa-envelope mr-2"></i>消息通知
            </router-link>
            <div class="border-t border-gray-100 my-1"></div>
            <a @click="handleLogout" class="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">
              <i class="fas fa-sign-out-alt mr-2"></i>退出登录
            </a>
          </div>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      isLoggedIn: true,
      showDropdown: false,
      showNotifications: false,
      userInfo: {
        username: '张小明',
        avatar: 'https://placekitten.com/100/100'
      },
      unreadCount: 3,
      notifications: [
        {
          id: 1,
          title: '领养申请通知',
          content: '您的领养申请已通过审核，请及时处理',
          time: '10分钟前',
          isRead: false,
          icon: 'fa-heart'
        },
        {
          id: 2,
          title: '系统通知',
          content: '平台新功能上线，点击查看详情',
          time: '1小时前',
          isRead: false,
          icon: 'fa-bell'
        },
        {
          id: 3,
          title: '评论回复',
          content: '有用户回复了您的评论，快去看看吧',
          time: '2小时前',
          isRead: false,
          icon: 'fa-comment'
        }
      ]
    }
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
      if (this.showDropdown) {
        this.showNotifications = false
      }
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
      if (this.showNotifications) {
        this.showDropdown = false
      }
    },
    handleLogout() {
      this.isLoggedIn = false
      this.$router.push('/login')
    },
    readNotification(notification) {
      notification.isRead = true
      this.updateUnreadCount()
      // TODO: 调用API更新消息状态
    },
    markAllAsRead() {
      this.notifications.forEach(notification => {
        notification.isRead = true
      })
      this.updateUnreadCount()
      // TODO: 调用API更新所有消息状态
    },
    updateUnreadCount() {
      this.unreadCount = this.notifications.filter(n => !n.isRead).length
    }
  },
  mounted() {
    // 点击其他区域关闭下拉菜单
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.relative')) {
        this.showDropdown = false
        this.showNotifications = false
      }
    })
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeDropdown)
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1000;
  background-color: white;
}

.nav {
  margin-left: auto;
}

.nav a {
  color: #2d3748;
  text-decoration: none;
}

.nav a:hover {
  text-decoration: underline;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.site-name {
  font-size: 40px;
  margin-left: 20px;
}

.absolute {
  transition: all 0.3s ease;
  z-index: 1001;
}

.relative {
  position: relative;
  z-index: 1001;
}

/* 消息通知动画 */
@keyframes bellShake {
  0% { transform: rotate(0); }
  15% { transform: rotate(5deg); }
  30% { transform: rotate(-5deg); }
  45% { transform: rotate(4deg); }
  60% { transform: rotate(-4deg); }
  75% { transform: rotate(2deg); }
  85% { transform: rotate(-2deg); }
  92% { transform: rotate(1deg); }
  100% { transform: rotate(0); }
}

.fa-bell:hover {
  animation: bellShake 0.8s ease-in-out;
}

/* 未读消息小红点动画 */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.bg-red-500 {
  animation: pulse 2s infinite;
}
</style> 