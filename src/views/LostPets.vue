<template>
  <div class="lost-pets">
    <Banner />
    <div class="content-container max-w-7xl mx-auto">
      <div class="search-box mt-4">
        <!-- 搜索和过滤 -->
        <div class="search-filter mb-4 flex justify-start items-center">
          <select v-model="filterBreed" class="filter-select border border-gray-300 rounded-lg p-2">
            <option value="">所有品种</option>
            <option v-for="breed in breedOptions" :key="breed" :value="breed">{{ breed }}</option>
          </select>
          <select v-model="filterHealth" class="filter-select border border-gray-300 rounded-lg p-2">
            <option value="">所有健康状态</option>
            <option v-for="health in healthOptions" :key="health" :value="health">{{ health }}</option>
          </select>
          <select v-model="filterProvince" class="filter-select border border-gray-300 rounded-lg p-2">
            <option value="">所有省份</option>
            <option v-for="province in provinceOptions" :key="province.adcode" :value="province.name">{{ province.name }}</option>
          </select>
          <select v-model="filterCity" class="filter-select border border-gray-300 rounded-lg p-2">
            <option value="">所有城市</option>
            <option v-for="city in cityOptions" :key="city.adcode" :value="city.name">{{ city.name }}</option>
          </select>
        </div>
      </div>
      <!-- 领养信息展示 -->
      <div class="animal-list mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="animal in filteredAnimals" :key="animal.id" class="animal-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
          <img :src="getPetImageUrl(animal.image)" alt="animal.name" class="w-full h-48 object-cover rounded-md mb-4">
          <h3 class="text-xl font-bold mb-2">{{ animal.name }}</h3>
          <div class="flex flex-col items-center mb-4">
            <div class="flex justify-between w-full max-w-sm">
              <span class="text-gray-600 text-right w-1/3">品种:</span>
              <span class="text-gray-600 w-2/3">{{ animal.breed }}</span>
            </div>
            <div class="flex justify-between w-full max-w-sm">
              <span class="text-gray-600 text-right w-1/3">地区:</span>
              <span class="text-gray-600 w-2/3">{{ animal.region }}</span>
            </div>
            <div class="flex justify-between w-full max-w-sm">
              <span class="text-gray-600 text-right w-1/3">健康状态:</span>
              <span class="text-gray-600 w-2/3">{{ animal.health }}</span>
            </div>
          </div>
          <div class="flex justify-center">
            <button @click="openClueForm(animal)" class="btn bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-transform transform hover:-translate-y-1">提供线索</button>
          </div>
        </div>
      </div>
      <!-- 分页器 -->
      <div class="pagination mt-6 flex justify-center space-x-2">
        <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="['btn', 'py-2', 'px-4', 'rounded-lg', 'transition-transform', 'transform', 'hover:-translate-y-1', { 'bg-blue-500 text-white': currentPage === page, 'bg-gray-200': currentPage !== page }]" :disabled="currentPage === page">{{ page }}</button>
      </div>
    </div>
    <!-- 申请领养表单 -->
    <div v-if="showForm" class="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="modal-content bg-white p-6 rounded-lg shadow-lg">
        <span class="close cursor-pointer float-right" @click="closeClueForm">&times;</span>
        <h2 class="text-2xl font-bold mb-4">提供线索 - {{ selectedAnimal?.name }}</h2>
        <form @submit.prevent="submitClueForm">
          <div class="mb-4">
            <label for="name" class="block text-gray-700 mb-1">您的姓名:</label>
            <input type="text" v-model="form.name" required class="border border-gray-300 rounded-lg p-2 w-full" />
          </div>
          <div class="mb-4">
            <label for="contact" class="block text-gray-700 mb-1">联系方式 (手机号):</label>
            <input 
              type="tel" 
              v-model="form.contact" 
              pattern="^1[3-9]\d{9}$"
              required 
              class="border rounded-lg p-2 w-full"
              :class="{
                'border-gray-300': !form.contact,
                'border-red-500': form.contact && phoneError,
                'border-green-500': form.contact && !phoneError
              }"
              placeholder="请输入11位手机号"
              maxlength="11"
              @input="validatePhone"
            />
            <transition name="fade">
              <span v-if="phoneError" class="text-red-500 text-sm mt-1 block">{{ phoneError }}</span>
              <span v-else-if="form.contact && !phoneError" class="text-green-500 text-sm mt-1 block">手机号格式正确</span>
            </transition>
          </div>
          <div class="mb-4">
            <label for="location" class="block text-gray-700 mb-1">发现地点:</label>
            <input type="text" v-model="form.location" required class="border border-gray-300 rounded-lg p-2 w-full" placeholder="请尽可能详细描述发现地点" />
          </div>
          <div class="mb-4">
            <label for="time" class="block text-gray-700 mb-1">发现时间:</label>
            <input type="datetime-local" v-model="form.time" required class="border border-gray-300 rounded-lg p-2 w-full" />
          </div>
          <div class="mb-4">
            <label for="description" class="block text-gray-700 mb-1">详细描述:</label>
            <textarea 
              v-model="form.description" 
              required 
              class="border border-gray-300 rounded-lg p-2 w-full" 
              rows="4"
              placeholder="请描述宠物的状态、行为等详细信息"
            ></textarea>
          </div>
          <div class="flex justify-center">
            <button type="submit" class="btn bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-transform transform hover:-translate-y-1">提交线索</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Banner from '@/components/Banner.vue';
import Footer from '@/components/Footer.vue';
import gaodeData from '../../public/gaode.json';
import petsApi from '@/api/pets';

export default {
  components: {
    Banner,
    Footer
  },
  data() {
    return {
      animals: [
        {
          id: 1,
          name: '小白',
          breed: '拉布拉多',
          region: '北京',
          health: '健康',
          image: 'https://via.placeholder.com/300'
        },
        {
          id: 2,
          name: '小黑',
          breed: '金毛',
          region: '上海',
          health: '健康',
          image: 'https://via.placeholder.com/300'
        },
        {
          id: 3,
          name: '小花',
          breed: '柯基',
          region: '广州',
          health: '健康',
          image: 'https://via.placeholder.com/300'
        },
        {
          id: 4,
          name: '小黄',
          breed: '哈士奇',
          region: '深圳',
          health: '健康',
          image: 'https://via.placeholder.com/300'
        },
        {
          id: 5,
          name: '小灰',
          breed: '边牧',
          region: '成都',
          health: '健康',
          image: 'https://via.placeholder.com/300'
        },
        {
          id: 6,
          name: '小蓝',
          breed: '萨摩耶',
          region: '杭州',
          health: '健康',
          image: 'https://via.placeholder.com/300'
        },
        {
          id: 7,
          name: '小绿',
          breed: '贵宾',
          region: '南京',
          health: '健康',
          image: 'https://via.placeholder.com/300'
        }
      ],
      breedOptions: ['拉布拉多', '金毛', '柯基', '哈士奇', '边牧', '萨摩耶', '贵宾'],
      healthOptions: ['健康', '亚健康', '生病'],
      currentPage: 1,
      itemsPerPage: 6,
      showForm: false,
      selectedAnimal: null,
      filterBreed: '',
      filterRegion: null,
      filterHealth: '',
      form: {
        name: '',
        contact: '',
        location: '',
        time: '',
        description: ''
      },
      provinceOptions: [],
      cityOptions: [],
      filterProvince: '',
      filterCity: '',
      phoneError: '',
    };
  },
  computed: {
    ...mapGetters('pets', [
      'getPetImageUrl'
    ]),
    totalPages() {
      return Math.ceil(this.animals.length / this.itemsPerPage);
    },
    paginatedAnimals() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.animals.slice(start, start + this.itemsPerPage);
    },
    filteredAnimals() {
      return this.paginatedAnimals.filter(animal => {
        return (
          (this.filterBreed === '' || animal.breed === this.filterBreed) &&
          (this.filterHealth === '' || animal.health === this.filterHealth) &&
          (this.filterProvince === '' || animal.region.includes(this.filterProvince)) &&
          (this.filterCity === '' || animal.region.includes(this.filterCity))
        );
      });
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
    
    openClueForm(animal) {
      this.checkLoginAndExecute(() => {
        this.selectedAnimal = animal;
        this.showForm = true;
      })
    },
    closeClueForm() {
      this.showForm = false;
      this.selectedAnimal = null;
      this.form = {
        name: '',
        contact: '',
        location: '',
        time: '',
        description: ''
      };
    },
    validatePhone() {
      const phoneRegex = /^1[3-9]\d{9}$/;
      const value = this.form.contact.trim();
      
      if (!value) {
        this.phoneError = '手机号不能为空';
      } else if (value.length !== 11) {
        this.phoneError = '手机号必须是11位';
      } else if (!/^1[3-9]/.test(value)) {
        this.phoneError = '手机号必须以1开头，第二位为3-9';
      } else if (!/^\d+$/.test(value)) {
        this.phoneError = '手机号只能包含数字';
      } else if (!phoneRegex.test(value)) {
        this.phoneError = '请输入正确的手机号格式';
      } else {
        this.phoneError = '';
      }
    },
    submitClueForm() {
      if (this.phoneError) {
        alert('请输入正确的手机号码');
        return;
      }
      console.log('提交的线索:', this.form);
      alert('感谢您提供线索！');
      this.closeClueForm();
    },
    goToPage(page) {
      this.currentPage = page;
    },
    loadRegions() {
      this.provinceOptions = gaodeData.districts[0].districts;
    },
    updateCityOptions() {
      const selectedProvince = this.provinceOptions.find(province => province.name === this.filterProvince);
      this.cityOptions = selectedProvince ? selectedProvince.districts : [];
      this.filterCity = '';
    },
  },
  mounted() {
    this.loadRegions();
  },
  watch: {
    filterProvince() {
      this.updateCityOptions();
    }
  }
}
</script>

<style scoped>
.lost-pets {
  width: 100%;
  background-color: var(--primary-bg-color);
  padding: 0 0 20px 0;
}

.content-container {
  padding: 20px 20px 0 20px;
}

.animal-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid var(--primary-border-color);
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.animal-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.close {
  cursor: pointer;
  float: right;
}

.btn {
  background-color: var(--primary-btn-color);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s, transform 0.2s;
  border: none;
  cursor: pointer;
}

.btn:hover {
  background-color: var(--primary-btn-hover-color);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .animal-list {
    grid-template-columns: 1fr;
  }
}
/* 
.banner {
  /* Banner 的样式 
} */

.search-box {
  margin-top: 20px; /* 增加与 Banner 的距离 */
}

.filter-select {
  margin-right: 10px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.input-error {
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
</style>