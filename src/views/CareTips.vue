<template>
  <div class="care-tips">
    <Banner />
    <div class="content-container max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- 左侧分类导航 -->
        <div class="md:w-1/4">
          <div class="category-nav bg-white p-4 rounded-lg shadow-md">
            <h3 class="text-lg font-bold mb-4 pb-2 border-b border-gray-200">知识分类</h3>
            <ul class="space-y-2">
              <li v-for="category in categories" :key="category.id"
                @click="selectCategory(category)"
                :class="['category-item cursor-pointer p-2 rounded-md transition-colors duration-200',
                  { 'bg-blue-50 text-blue-600': selectedCategory === category.name }]">
                <div class="flex items-center">
                  <i :class="['fas', category.icon, 'mr-3', 'w-5']"></i>
                  <span>{{ category.name }}</span>
                  <span class="ml-auto text-sm text-gray-500">({{ category.count }})</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- 右侧文章列表 -->
        <div class="md:w-3/4">
          <!-- 搜索框 -->
          <div class="search-box mb-6">
            <div class="relative">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="搜索文章..." 
                class="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              >
              <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          <div class="article-list space-y-6">
            <div v-for="article in filteredArticles" :key="article.id" 
              class="article-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <div class="flex flex-col md:flex-row gap-6">
                <div class="md:w-1/3">
                  <img :src="article.image" :alt="article.title" 
                    class="w-full h-48 object-cover rounded-lg">
                </div>
                <div class="md:w-2/3">
                  <h2 class="text-2xl font-bold mb-3 text-gray-800">{{ article.title }}</h2>
                  <p class="text-gray-600 mb-4 line-clamp-3">{{ article.summary }}</p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                      <span class="flex items-center">
                        <i class="fas fa-calendar-alt mr-2"></i>
                        {{ article.date }}
                      </span>
                      <span class="flex items-center">
                        <i class="fas fa-eye mr-2"></i>
                        {{ article.views }}阅读
                      </span>
                      <span class="flex items-center">
                        <i class="fas fa-folder mr-2"></i>
                        {{ article.category }}
                      </span>
                    </div>
                    <button @click="readMore(article)" 
                      class="btn text-sm py-2 px-4">
                      阅读更多
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页器 -->
          <div class="pagination mt-8 flex justify-center space-x-2">
            <button 
              v-for="page in totalPages" 
              :key="page" 
              @click="currentPage = page"
              :class="['btn', 'py-2', 'px-4', 'rounded-lg', 'transition-transform', 'transform', 'hover:-translate-y-1', 
                { 'bg-blue-500 text-white': currentPage === page, 'bg-gray-200': currentPage !== page }]"
              :disabled="currentPage === page">
              {{ page }}
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  </template>
  
  <script>
import Banner from '@/components/Banner.vue';

export default {
  name: 'CareTips',
  components: {
    Banner
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 5,
      selectedCategory: '',
      searchQuery: '',
      categories: [
        { id: 1, name: '日常护理', icon: 'fa-bath', count: 12 },
        { id: 2, name: '营养饮食', icon: 'fa-utensils', count: 8 },
        { id: 3, name: '健康护理', icon: 'fa-heartbeat', count: 15 },
        { id: 4, name: '行为训练', icon: 'fa-graduation-cap', count: 10 },
        { id: 5, name: '生活环境', icon: 'fa-home', count: 6 },
        { id: 6, name: '季节护理', icon: 'fa-cloud-sun', count: 4 }
      ],
      articles: [
        {
          id: 1,
          title: '如何正确给狗狗洗澡',
          summary: '给狗狗洗澡不仅仅是让它们保持清洁，更是维护它们健康的重要步骤。本文将详细介绍给狗狗洗澡的正确步骤、注意事项以及选择合适沐浴产品的方法。',
          image: 'https://via.placeholder.com/600x400',
          date: '2024-01-15',
          views: 1234,
          category: '日常护理'
        },
        {
          id: 2,
          title: '猫咪的日常营养搭配指南',
          summary: '合理的营养搭配是保证猫咪健康的关键。本文将为您介绍猫咪在不同年龄阶段的营养需求，以及如何选择合适的猫粮和营养补充品。',
          image: 'https://via.placeholder.com/600x400',
          date: '2024-01-14',
          views: 2345,
          category: '营养饮食'
        },
        {
          id: 3,
          title: '宠物牙齿护理完全指南',
          summary: '牙齿健康对宠物的整体健康至关重要。本文将介绍日常牙齿护理的方法、预防牙齿疾病的技巧，以及选择合适牙齿护理产品的建议。',
          image: 'https://via.placeholder.com/600x400',
          date: '2024-01-13',
          views: 3456,
          category: '健康护理'
        },
        {
          id: 4,
          title: '新手养狗必读：基础训练方法',
          summary: '正确的训练方法可以帮助您的爱犬养成良好的行为习惯。本文将为新手主人介绍基础的狗狗训练方法，包括坐下、趴下等指令的训练技巧。',
          image: 'https://via.placeholder.com/600x400',
          date: '2024-01-12',
          views: 4567,
          category: '行为训练'
        },
        {
          id: 5,
          title: '室内养猫环境布置技巧',
          summary: '为猫咪创造一个舒适的室内环境，不仅能让它们感到安全和快乐，还能避免许多行为问题。本文将分享室内养猫的环境布置技巧和注意事项。',
          image: 'https://via.placeholder.com/600x400',
          date: '2024-01-11',
          views: 5678,
          category: '生活环境'
        },
        {
          id: 6,
          title: '宠物夏季防暑降温指南',
          summary: '炎热的夏季如何帮助宠物防暑降温？本文将介绍多种实用的降温方法，以及夏季宠物护理的注意事项。',
          image: 'https://via.placeholder.com/600x400',
          date: '2024-01-10',
          views: 6789,
          category: '季节护理'
        }
      ]
    };
  },
  computed: {
    filteredArticles() {
      let filtered = this.articles;
      
      // 按分类筛选
      if (this.selectedCategory) {
        filtered = filtered.filter(article => article.category === this.selectedCategory);
      }
      
      // 按关键字搜索
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(article => 
          article.title.toLowerCase().includes(query) || 
          article.summary.toLowerCase().includes(query) ||
          article.category.toLowerCase().includes(query)
        );
      }

      // 分页处理
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return filtered.slice(start, end);
    },
    totalPages() {
      let filtered = this.articles;
      
      // 按分类筛选
      if (this.selectedCategory) {
        filtered = filtered.filter(article => article.category === this.selectedCategory);
      }
      
      // 按关键字搜索
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(article => 
          article.title.toLowerCase().includes(query) || 
          article.summary.toLowerCase().includes(query) ||
          article.category.toLowerCase().includes(query)
        );
      }

      return Math.ceil(filtered.length / this.itemsPerPage);
    }
  },
  methods: {
    checkLoginAndExecute(action) {
      // 检查是否登录，未登录则提示
      if (!this.$route.meta.isLoggedIn) {
        this.$message.warning('请先登录后再进行操作')
        return false
      }
      return action()
    },
    
    selectCategory(category) {
      this.selectedCategory = this.selectedCategory === category.name ? '' : category.name;
      this.currentPage = 1; // 重置页码
    },
    readMore(article) {
      this.checkLoginAndExecute(() => {
        console.log('查看文章详情:', article.title);
      })
    }
  },
  watch: {
    filterProvince() {
      this.updateCityOptions();
    },
    searchQuery() {
      this.currentPage = 1; // 重置页码
    }
  }
};
</script>

<style scoped>
.care-tips {
  width: 100%;
  background-color: var(--primary-bg-color);
  padding: 0 0 20px 0;
}

.content-container {
  padding: 20px 20px 0 20px;
}

.category-nav {
  position: sticky;
  top: 20px;
}

.category-item {
  cursor: pointer;
}

.category-item:hover {
  background-color: #f0f7ff;
  color: var(--primary-btn-color);
}

.article-card {
  background-color: white;
  transition: all 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.btn {
  background-color: var(--primary-btn-color);
  color: white;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.btn:hover {
  background-color: var(--primary-btn-hover-color);
}

@media (max-width: 768px) {
  .article-card {
    padding: 1rem;
  }
  
  .category-nav {
    position: static;
    margin-bottom: 1rem;
  }
}
</style>
  