<template>
  <div class="adoption">
    <Banner />
    <div class="content-container max-w-7xl mx-auto">
      <div class="search-box mt-4">
        <!-- 搜索和过滤 -->
        <div class="search-filter mb-4 flex justify-between items-center">
          <div class="flex items-center space-x-4">
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
          <button @click="openPublishForm" class="btn flex items-center">
            <i class="fas fa-plus mr-2"></i>
            发布领养信息
          </button>
        </div>
      </div>
      <!-- 领养信息展示 -->
      <div class="animal-list mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="animal in filteredAnimals" :key="animal.id" class="animal-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
          <img :src="animal.image" alt="animal.name" class="w-full h-48 object-cover rounded-md mb-4">
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
            <button @click="openDetailModal(animal)" class="btn bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-transform transform hover:-translate-y-1">
              查看详情
            </button>
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
        <span class="close cursor-pointer float-right" @click="closeAdoptionForm">&times;</span>
        <h2 class="text-2xl font-bold mb-4">申请领养 {{ selectedAnimal?.name }}</h2>
        <form @submit.prevent="submitAdoptionForm">
          <div class="mb-4">
            <label for="name" class="block text-gray-700 mb-1">姓名:</label>
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
            <label for="reason" class="block text-gray-700 mb-1">领养理由:</label>
            <textarea v-model="form.reason" required class="border border-gray-300 rounded-lg p-2 w-full"></textarea>
          </div>
          <div class="mb-4">
            <label for="environment" class="block text-gray-700 mb-1">居住环境:</label>
            <textarea v-model="form.environment" required class="border border-gray-300 rounded-lg p-2 w-full"></textarea>
          </div>
          <div class="flex justify-center">
            <button type="submit" class="btn bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-transform transform hover:-translate-y-1">提交申请</button>
          </div>
        </form>
      </div>
    </div>
    <!-- 发布领养信息表单 -->
    <div v-if="showPublishForm" class="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="modal-content bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">发布领养信息</h2>
          <span class="close cursor-pointer text-2xl" @click="closePublishForm">&times;</span>
        </div>
        
        <form class="space-y-4">
          <!-- 基本信息 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 mb-1">宠物名称</label>
              <input 
                type="text" 
                v-model="publishForm.name" 
                required 
                class="border border-gray-300 rounded-lg p-2 w-full"
              >
            </div>
            <div>
              <label class="block text-gray-700 mb-1">品种</label>
              <select 
                v-model="publishForm.breed" 
                required 
                class="border border-gray-300 rounded-lg p-2 w-full"
              >
                <option value="">请选择品种</option>
                <option v-for="breed in breedOptions" :key="breed" :value="breed">
                  {{ breed }}
                </option>
              </select>
            </div>
          </div>

          <!-- 图片上传 -->
          <div>
            <label class="block text-gray-700 mb-1">宠物照片</label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input 
                type="file" 
                ref="imageInput"
                @change="handleImageSelect"
                accept="image/*"
                class="hidden"
              >
              <div v-if="!publishForm.image" class="space-y-2">
                <i class="fas fa-cloud-upload-alt text-3xl text-gray-400"></i>
                <p class="text-gray-500">点击或拖拽上传图片</p>
                <button type="button" @click="$refs.imageInput.click()" class="btn-secondary">
                  选择图片
                </button>
              </div>
              <div v-else class="relative">
                <img :src="publishForm.imagePreview" alt="Preview" class="max-h-48 mx-auto">
                <button 
                  type="button"
                  @click="removeImage" 
                  class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            </div>
          </div>

          <!-- 健康状况 -->
          <div>
            <label class="block text-gray-700 mb-1">健康状况</label>
            <select 
              v-model="publishForm.health" 
              required 
              class="border border-gray-300 rounded-lg p-2 w-full"
            >
              <option value="">请选择健康状况</option>
              <option v-for="health in healthOptions" :key="health" :value="health">
                {{ health }}
              </option>
            </select>
          </div>

          <!-- 地区选择 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 mb-1">省份</label>
              <select 
                v-model="publishForm.province" 
                required 
                class="border border-gray-300 rounded-lg p-2 w-full"
                @change="updatePublishCityOptions"
              >
                <option value="">请选择省份</option>
                <option v-for="province in provinceOptions" :key="province.adcode" :value="province.name">
                  {{ province.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700 mb-1">城市</label>
              <select 
                v-model="publishForm.city" 
                required 
                class="border border-gray-300 rounded-lg p-2 w-full"
              >
                <option value="">请选择城市</option>
                <option v-for="city in publishCityOptions" :key="city.adcode" :value="city.name">
                  {{ city.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- 详细描述 -->
          <div>
            <label class="block text-gray-700 mb-1">详细描述</label>
            <textarea 
              v-model="publishForm.description" 
              required 
              rows="4"
              class="border border-gray-300 rounded-lg p-2 w-full"
              placeholder="请描述宠物的性格、习性、领养要求等信息"
            ></textarea>
          </div>

          <!-- 联系方式 -->
          <div>
            <label class="block text-gray-700 mb-1">联系方式 (手机号)</label>
            <input 
              type="tel" 
              v-model="publishForm.contact" 
              pattern="^1[3-9]\d{9}$"
              required 
              class="border rounded-lg p-2 w-full"
              :class="{
                'border-gray-300': !publishForm.contact,
                'border-red-500': publishForm.contact && publishPhoneError,
                'border-green-500': publishForm.contact && !publishPhoneError
              }"
              placeholder="请输入11位手机号"
              maxlength="11"
              @input="validatePublishPhone"
            />
            <span v-if="publishPhoneError" class="text-red-500 text-sm">{{ publishPhoneError }}</span>
          </div>

          <!-- 提交按钮 -->
          <div class="flex justify-end space-x-4">
            <button type="button" @click="closePublishForm" class="btn-secondary">
              取消
            </button>
            <button 
              type="button" 
              class="btn"
              :disabled="!!publishPhoneError && publishForm.contact.length > 0"
              @click="submitPublishForm"
            >
              发布信息
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- 详细信息模态框 -->
    <div v-if="showDetailModal" class="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="modal-content bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">宠物详细信息</h2>
          <span class="close cursor-pointer text-2xl" @click="closeDetailModal">&times;</span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 左侧图片 -->
          <div>
            <img :src="selectedAnimal?.image" :alt="selectedAnimal?.name" class="w-full h-auto rounded-lg shadow-md">
          </div>
          
          <!-- 右侧信息 -->
          <div class="space-y-4">
            <div>
              <h3 class="text-xl font-bold mb-2">{{ selectedAnimal?.name }}</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">品种：</span>
                  <span>{{ selectedAnimal?.breed }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">健康状况：</span>
                  <span>{{ selectedAnimal?.health }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">所在地区：</span>
                  <span>{{ selectedAnimal?.region }}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 class="font-bold mb-2">详细描述</h4>
              <p class="text-gray-600">{{ selectedAnimal?.description || '暂无描述' }}</p>
            </div>
            
            <div class="pt-4">
              <button @click="openAdoptionForm(selectedAnimal)" class="btn w-full">
                申请领养
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Banner from '@/components/Banner.vue';
import Footer from '@/components/Footer.vue';
import gaodeData from '../../public/gaode.json';

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
          breed: '拉布拉多犬',
          region: '北京',
          health: '健康',
          image: 'https://via.placeholder.com/300'
        },
        {
          id: 2,
          name: '小黑',
          breed: '英国短毛猫',
          region: '上海',
          health: '健康',
          image: 'https://via.placeholder.com/300'
        },
        {
          id: 3,
          name: '小花',
          breed: '柯基犬',
          region: '广州',
          health: '健康',
          image: 'https://via.placeholder.com/300'
        },
        {
          id: 4,
          name: '雪球',
          breed: '布偶猫',
          region: '深圳',
          health: '健康',
          image: 'https://via.placeholder.com/300'
        },
        {
          id: 5,
          name: '灰灰',
          breed: '边境牧羊犬',
          region: '成都',
          health: '健康',
          image: 'https://via.placeholder.com/300'
        },
        {
          id: 6,
          name: '雪花',
          breed: '萨摩耶犬',
          region: '杭州',
          health: '健康',
          image: 'https://via.placeholder.com/300'
        },
        {
          id: 7,
          name: '豆豆',
          breed: '暹罗猫',
          region: '南京',
          health: '健康',
          image: 'https://via.placeholder.com/300'
        }
      ],
      breedOptions: [
        // 犬类品种
        '拉布拉多犬',
        '金毛寻回犬',
        '哈士奇',
        '德国牧羊犬',
        '边境牧羊犬',
        '萨摩耶犬',
        '柯基犬',
        '比熊犬',
        '泰迪犬',
        '博美犬',
        '吉娃娃',
        '法国斗牛犬',
        '巴哥犬',
        '柴犬',
        '秋田犬',
        '阿拉斯加雪橇犬',
        '比格犬',
        '大白熊犬',
        '杜宾犬',
        '罗威纳犬',
        // 猫类品种
        '英国短毛猫',
        '美国短毛猫',
        '波斯猫',
        '加菲猫',
        '暹罗猫',
        '布偶猫',
        '苏格兰折耳猫',
        '俄罗斯蓝猫',
        '缅因猫',
        '挪威森林猫',
        '孟加拉豹猫',
        '斯芬克斯猫',
        '英国蓝猫',
        '金吉拉猫',
        '中国狸花猫',
        '三花猫',
        '银虎斑猫'
      ],
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
        reason: '',
        environment: ''
      },
      provinceOptions: [],
      cityOptions: [],
      filterProvince: '',
      filterCity: '',
      phoneError: '',
      showPublishForm: false,
      publishPhoneError: '',
      publishCityOptions: [],
      publishForm: {
        name: '',
        breed: '',
        health: '',
        province: '',
        city: '',
        description: '',
        contact: '',
        image: null,
        imagePreview: null
      },
      showDetailModal: false,
    };
  },
  computed: {
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
    openAdoptionForm(animal) {
      this.closeDetailModal();
      this.selectedAnimal = animal;
      this.showForm = true;
    },
    closeAdoptionForm() {
      this.showForm = false;
      this.selectedAnimal = null;
      this.form = {
        name: '',
        contact: '',
        reason: '',
        environment: ''
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
    submitAdoptionForm() {
      if (this.phoneError) {
        alert('请输入正确的手机号码');
        return;
      }
      console.log('提交的表单数据:', this.form);
      alert('申请已提交！');
      this.closeAdoptionForm();
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
    openPublishForm() {
      this.showPublishForm = true;
      this.resetPublishForm();
    },
    closePublishForm() {
      this.showPublishForm = false;
      this.resetPublishForm();
    },
    resetPublishForm() {
      this.publishForm = {
        name: '',
        breed: '',
        health: '',
        province: '',
        city: '',
        description: '',
        contact: '',
        image: null,
        imagePreview: null
      };
      this.publishPhoneError = '';
      this.publishCityOptions = [];
    },
    handleImageSelect(event) {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('图片大小不能超过5MB');
          return;
        }
        
        this.publishForm.image = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.publishForm.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    removeImage() {
      this.publishForm.image = null;
      this.publishForm.imagePreview = null;
      this.$refs.imageInput.value = '';
    },
    validatePublishPhone() {
      const phoneRegex = /^1[3-9]\d{9}$/;
      const value = this.publishForm.contact.trim();
      
      if (!value) {
        this.publishPhoneError = '';
        return;
      }
      
      if (!phoneRegex.test(value)) {
        if (value.length !== 11) {
          this.publishPhoneError = '手机号必须是11位';
        } else if (!/^1[3-9]/.test(value)) {
          this.publishPhoneError = '手机号必须以1开头，第二位为3-9';
        } else if (!/^\d+$/.test(value)) {
          this.publishPhoneError = '手机号只能包含数字';
        } else {
          this.publishPhoneError = '请输入正确的手机号格式';
        }
      } else {
        this.publishPhoneError = '';
      }
    },
    updatePublishCityOptions() {
      const selectedProvince = this.provinceOptions.find(
        province => province.name === this.publishForm.province
      );
      this.publishCityOptions = selectedProvince ? selectedProvince.districts : [];
      this.publishForm.city = '';
    },
    async submitPublishForm() {
      // 表单验证
      if (!this.publishForm.name) {
        alert('请输入宠物名称');
        return;
      }
      if (!this.publishForm.breed) {
        alert('请选择宠物品种');
        return;
      }
      if (!this.publishForm.health) {
        alert('请选择健康状况');
        return;
      }
      if (!this.publishForm.province || !this.publishForm.city) {
        alert('请选择完整的地区信息');
        return;
      }
      if (!this.publishForm.description) {
        alert('请填写详细描述');
        return;
      }
      if (this.publishPhoneError || !this.publishForm.contact) {
        alert('请输入正确的手机号码');
        return;
      }

      try {
        // 构建新的宠物信息对象
        const newAnimal = {
          id: Date.now(), // 使用时间戳作为临时ID
          name: this.publishForm.name,
          breed: this.publishForm.breed,
          region: `${this.publishForm.province}${this.publishForm.city}`,
          health: this.publishForm.health,
          image: this.publishForm.imagePreview || 'https://via.placeholder.com/300',
          description: this.publishForm.description,
          contact: this.publishForm.contact
        };

        // 添加到列表开头
        this.animals.unshift(newAnimal);
        
        // 重置页码到第一页
        this.currentPage = 1;

        // 提示成功并关闭表单
        alert('发布成功！');
        this.closePublishForm();
        
      } catch (error) {
        console.error('发布失败:', error);
        alert('发布失败，请重试');
      }
    },
    openDetailModal(animal) {
      this.selectedAnimal = animal;
      this.showDetailModal = true;
    },
    closeDetailModal() {
      this.showDetailModal = false;
      this.selectedAnimal = null;
    }
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
.adoption {
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

.banner {
  /* Banner 的样式 */
}

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