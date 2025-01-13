<template>
  <div class="messages">
    <div class="max-w-7xl mx-auto py-8 px-4">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800">消息中心</h1>
        <p class="text-gray-600 mt-2">查看和管理您的所有消息通知</p>
      </div>

      <div class="flex flex-col md:flex-row gap-8">
        <!-- 左侧消息分类 -->
        <div class="md:w-1/4">
          <div class="bg-white rounded-lg shadow-sm p-4">
            <nav class="space-y-2">
              <a 
                v-for="(category, index) in categories" 
                :key="index"
                @click="activeCategory = category.key"
                :class="['flex items-center p-3 rounded-lg cursor-pointer transition-colors',
                  activeCategory === category.key ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50']"
              >
                <i :class="['fas', category.icon, 'w-5']"></i>
                <span class="ml-3">{{ category.label }}</span>
                <span 
                  v-if="category.count" 
                  :class="['ml-auto px-2 py-1 rounded-full text-xs',
                    activeCategory === category.key ? 'bg-blue-100' : 'bg-gray-100']"
                >
                  {{ category.count }}
                </span>
              </a>
            </nav>
          </div>
        </div>

        <!-- 右侧消息列表 -->
        <div class="md:w-3/4">
          <div class="bg-white rounded-lg shadow-sm">
            <!-- 工具栏 -->
            <div class="p-4 border-b flex flex-wrap items-center justify-between gap-4">
              <!-- 左侧批量操作 -->
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input 
                    type="checkbox" 
                    :checked="isAllSelected"
                    @change="toggleSelectAll"
                    class="rounded border-gray-300 text-blue-600 focus:border-blue-500 focus:ring-blue-500"
                  >
                  <span class="ml-2 text-sm text-gray-600">全选</span>
                </label>
                <button 
                  @click="markSelectedAsRead"
                  :disabled="!selectedMessages.length"
                  :class="['px-3 py-1.5 rounded text-sm transition-colors',
                    selectedMessages.length ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-400']"
                >
                  <i class="fas fa-check-circle mr-1"></i>标记已读
                </button>
                <button 
                  @click="deleteSelected"
                  :disabled="!selectedMessages.length"
                  :class="['px-3 py-1.5 rounded text-sm transition-colors',
                    selectedMessages.length ? 'text-red-600 hover:bg-red-50' : 'text-gray-400']"
                >
                  <i class="fas fa-trash-alt mr-1"></i>删除
                </button>
              </div>
              
              <!-- 右侧筛选和搜索 -->
              <div class="flex items-center space-x-4">
                <select 
                  v-model="timeFilter"
                  class="rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">全部时间</option>
                  <option value="today">今天</option>
                  <option value="week">最近7天</option>
                  <option value="month">最近30天</option>
                </select>
                <div class="relative">
                  <input 
                    type="text" 
                    v-model="searchQuery"
                    placeholder="搜索消息..." 
                    class="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  >
                  <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>
            </div>

            <!-- 消息列表 -->
            <div class="divide-y divide-gray-100">
              <template v-if="filteredMessages.length">
                <div 
                  v-for="message in filteredMessages" 
                  :key="message.id"
                  :class="['p-4 transition-colors', message.isRead ? 'bg-white' : 'bg-blue-50']"
                >
                  <div class="flex items-start">
                    <input 
                      type="checkbox"
                      v-model="selectedMessages"
                      :value="message.id"
                      class="mt-1 rounded border-gray-300 text-blue-600 focus:border-blue-500 focus:ring-blue-500"
                    >
                    <div class="ml-4 flex-1">
                      <div class="flex items-center justify-between">
                        <h4 class="font-medium">{{ message.title }}</h4>
                        <span class="text-sm text-gray-500">{{ message.time }}</span>
                      </div>
                      <p class="text-gray-600 mt-1">{{ message.content }}</p>
                      <div class="flex items-center justify-between mt-2">
                        <div class="flex items-center space-x-4">
                          <span class="text-sm text-gray-500">
                            <i :class="['fas', message.icon, 'mr-1']"></i>
                            {{ message.category }}
                          </span>
                          <span v-if="!message.isRead" class="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                            未读
                          </span>
                        </div>
                        <div class="flex items-center space-x-2">
                          <button 
                            v-if="!message.isRead"
                            @click="markAsRead(message)"
                            class="text-sm text-blue-600 hover:text-blue-800"
                          >
                            标记已读
                          </button>
                          <button 
                            @click="deleteMessage(message)"
                            class="text-sm text-red-600 hover:text-red-800"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <div v-else class="p-8 text-center text-gray-500">
                暂无相关消息
              </div>
            </div>

            <!-- 分页器 -->
            <div class="p-4 border-t flex justify-between items-center">
              <span class="text-sm text-gray-500">
                共 {{ totalMessages }} 条消息，未读 {{ unreadCount }} 条
              </span>
              <div class="flex items-center space-x-2">
                <button 
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
                >
                  上一页
                </button>
                <span class="text-sm text-gray-600">
                  第 {{ currentPage }}/{{ totalPages }} 页
                </span>
                <button 
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
                >
                  下一页
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
  name: 'Messages',
  components: {
    Banner
  },
  data() {
    return {
      activeCategory: 'all',
      selectedMessages: [],
      timeFilter: 'all',
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      categories: [
        { key: 'all', label: '全部消息', icon: 'fa-inbox', count: 8 },
        { key: 'adoption', label: '领养相关', icon: 'fa-heart', count: 3 },
        { key: 'system', label: '系统通知', icon: 'fa-bell', count: 2 },
        { key: 'comment', label: '评论回复', icon: 'fa-comment', count: 3 }
      ],
      messages: [
        {
          id: 1,
          title: '领养申请通知',
          content: '您的领养申请已通过审核，请及时处理',
          time: '2024-01-20 10:30',
          category: '领养相关',
          icon: 'fa-heart',
          isRead: false
        },
        {
          id: 2,
          title: '系统更新通知',
          content: '平台将于今晚22:00-23:00进行系统维护，请提前保存重要信息',
          time: '2024-01-19 15:45',
          category: '系统通知',
          icon: 'fa-bell',
          isRead: false
        },
        {
          id: 3,
          title: '评论回复提醒',
          content: '用户"爱心铲屎官"回复了您的评论：谢谢分享，这些建议对我很有帮助',
          time: '2024-01-19 09:20',
          category: '评论回复',
          icon: 'fa-comment',
          isRead: false
        },
        {
          id: 4,
          title: '领养进度更新',
          content: '您申请领养的猫咪"小花"已通过健康检查，可以预约见面时间了',
          time: '2024-01-18 14:15',
          category: '领养相关',
          icon: 'fa-heart',
          isRead: true
        },
        {
          id: 5,
          title: '新功能上线通知',
          content: '宠物品种识别功能已上线，快来体验吧！',
          time: '2024-01-18 11:30',
          category: '系统通知',
          icon: 'fa-bell',
          isRead: true
        }
      ]
    }
  },
  computed: {
    filteredMessages() {
      let filtered = [...this.messages]
      
      // 分类筛选
      if (this.activeCategory !== 'all') {
        const categoryMap = {
          'adoption': '领养相关',
          'system': '系统通知',
          'comment': '评论回复'
        }
        filtered = filtered.filter(msg => msg.category === categoryMap[this.activeCategory])
      }
      
      // 时间筛选
      if (this.timeFilter !== 'all') {
        const now = new Date()
        const msgDate = date => new Date(date)
        filtered = filtered.filter(msg => {
          const diff = now - msgDate(msg.time)
          switch(this.timeFilter) {
            case 'today':
              return diff < 24 * 60 * 60 * 1000
            case 'week':
              return diff < 7 * 24 * 60 * 60 * 1000
            case 'month':
              return diff < 30 * 24 * 60 * 60 * 1000
            default:
              return true
          }
        })
      }
      
      // 关键词搜索
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(msg => 
          msg.title.toLowerCase().includes(query) || 
          msg.content.toLowerCase().includes(query)
        )
      }
      
      // 分页
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return filtered.slice(start, end)
    },
    totalMessages() {
      return this.messages.length
    },
    unreadCount() {
      return this.messages.filter(msg => !msg.isRead).length
    },
    totalPages() {
      return Math.ceil(this.messages.length / this.itemsPerPage)
    },
    isAllSelected() {
      return this.filteredMessages.length > 0 && 
        this.filteredMessages.every(msg => this.selectedMessages.includes(msg.id))
    }
  },
  methods: {
    toggleSelectAll() {
      if (this.isAllSelected) {
        this.selectedMessages = []
      } else {
        this.selectedMessages = this.filteredMessages.map(msg => msg.id)
      }
    },
    markSelectedAsRead() {
      this.messages.forEach(msg => {
        if (this.selectedMessages.includes(msg.id)) {
          msg.isRead = true
        }
      })
      this.selectedMessages = []
    },
    deleteSelected() {
      if (confirm('确定要删除选中的消息吗？')) {
        this.messages = this.messages.filter(msg => !this.selectedMessages.includes(msg.id))
        this.selectedMessages = []
      }
    },
    markAsRead(message) {
      message.isRead = true
    },
    deleteMessage(message) {
      if (confirm('确定要删除这条消息吗？')) {
        this.messages = this.messages.filter(msg => msg.id !== message.id)
      }
    }
  },
  watch: {
    activeCategory() {
      this.currentPage = 1
      this.selectedMessages = []
    },
    timeFilter() {
      this.currentPage = 1
      this.selectedMessages = []
    },
    searchQuery() {
      this.currentPage = 1
      this.selectedMessages = []
    }
  }
}
</script>

<style scoped>
.messages {
  width: 100%;
  background-color: var(--primary-bg-color);
  min-height: calc(100vh - 64px);
}

/* 自定义checkbox样式 */
input[type="checkbox"] {
  cursor: pointer;
}

/* 消息hover效果 */
.message-item:hover {
  background-color: #f8fafc;
}

/* 按钮禁用状态 */
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* 分页按钮样式 */
.pagination-button {
  transition: all 0.2s;
}

.pagination-button:not(:disabled):hover {
  transform: translateY(-1px);
}
</style> 