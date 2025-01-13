<template>
  <div class="my-pets">
    <div class="max-w-7xl mx-auto py-8 px-4">
      <!-- 页面标题 -->
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">我的宠物</h1>
          <p class="text-gray-600 mt-2">管理您的宠物信息和健康档案</p>
        </div>
        <button @click="showAddPetModal = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <i class="fas fa-plus mr-2"></i>添加宠物
        </button>
      </div>

      <!-- 宠物列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="pet in pets" :key="pet.id" class="bg-white rounded-lg shadow-sm overflow-hidden">
          <!-- 宠物卡片头部 -->
          <div class="relative">
            <img :src="pet.image" :alt="pet.name" class="w-full h-48 object-cover">
            <div class="absolute top-3 right-3 flex space-x-2">
              <button @click="editPet(pet)" class="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                <i class="fas fa-edit text-gray-600"></i>
              </button>
              <button @click="deletePet(pet)" class="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                <i class="fas fa-trash-alt text-red-600"></i>
              </button>
            </div>
          </div>
          
          <!-- 宠物信息 -->
          <div class="p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-bold">{{ pet.name }}</h3>
              <span :class="['px-2 py-1 rounded-full text-xs', 
                pet.status === '健康' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600']">
                {{ pet.status }}
              </span>
            </div>
            <div class="space-y-2 text-sm text-gray-600">
              <div class="flex items-center">
                <i class="fas fa-paw w-5"></i>
                <span>{{ pet.breed }}</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-birthday-cake w-5"></i>
                <span>{{ pet.age }}</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-venus-mars w-5"></i>
                <span>{{ pet.gender }}</span>
              </div>
            </div>
            
            <!-- 健康记录 -->
            <div class="mt-4 pt-4 border-t">
              <h4 class="font-medium mb-2">最近健康记录</h4>
              <div class="space-y-2">
                <div v-for="(record, index) in pet.healthRecords.slice(0, 2)" :key="index"
                  class="flex items-start text-sm">
                  <i class="fas fa-clipboard-check mt-1 w-5 text-blue-500"></i>
                  <div class="flex-1">
                    <p class="text-gray-800">{{ record.title }}</p>
                    <span class="text-xs text-gray-500">{{ record.date }}</span>
                  </div>
                </div>
              </div>
              <button @click="viewHealthRecords(pet)" 
                class="mt-3 w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                查看完整档案
              </button>
            </div>
          </div>
        </div>

        <!-- 添加宠物卡片 -->
        <div v-if="!pets.length" @click="showAddPetModal = true"
          class="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 cursor-pointer hover:border-blue-500 transition-colors">
          <i class="fas fa-plus-circle text-4xl text-gray-400 mb-2"></i>
          <p class="text-gray-600">添加您的第一只宠物</p>
        </div>
      </div>

      <!-- 添加/编辑宠物模态框 -->
      <div v-if="showAddPetModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg w-full max-w-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold">{{ editingPet ? '编辑宠物信息' : '添加新宠物' }}</h3>
            <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <form @submit.prevent="savePet" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">宠物照片</label>
              <div class="flex items-center space-x-4">
                <img :src="petForm.image || 'https://via.placeholder.com/100'" 
                  class="w-20 h-20 rounded-lg object-cover">
                <button type="button" class="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  上传照片
                </button>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">宠物名称</label>
              <input type="text" v-model="petForm.name" required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">品种</label>
                <input type="text" v-model="petForm.breed" required
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">年龄</label>
                <input type="text" v-model="petForm.age" required
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">性别</label>
              <select v-model="petForm.gender" required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="公">公</option>
                <option value="母">母</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">健康状况</label>
              <select v-model="petForm.status" required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="健康">健康</option>
                <option value="生病">生病</option>
                <option value="恢复中">恢复中</option>
              </select>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" @click="closeModal"
                class="px-4 py-2 border rounded-lg hover:bg-gray-50">
                取消
              </button>
              <button type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {{ editingPet ? '保存修改' : '添加宠物' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Banner from '@/components/Banner.vue'

export default {
  name: 'MyPets',
  components: {
    Banner
  },
  data() {
    return {
      showAddPetModal: false,
      editingPet: null,
      petForm: {
        name: '',
        breed: '',
        age: '',
        gender: '公',
        status: '健康',
        image: ''
      },
      pets: [
        {
          id: 1,
          name: '小花',
          breed: '英国短毛猫',
          age: '2岁',
          gender: '母',
          status: '健康',
          image: 'https://placekitten.com/400/300',
          healthRecords: [
            {
              title: '年度体检',
              date: '2024-01-15'
            },
            {
              title: '疫苗注射',
              date: '2023-12-20'
            }
          ]
        },
        {
          id: 2,
          name: '旺财',
          breed: '金毛寻回犬',
          age: '3岁',
          gender: '公',
          status: '恢复中',
          image: 'https://placedog.net/400/300',
          healthRecords: [
            {
              title: '骨科检查',
              date: '2024-01-18'
            },
            {
              title: '驱虫',
              date: '2024-01-01'
            }
          ]
        }
      ]
    }
  },
  methods: {
    editPet(pet) {
      this.editingPet = pet
      this.petForm = { ...pet }
      this.showAddPetModal = true
    },
    deletePet(pet) {
      if (confirm('确定要删除这只宠物吗？')) {
        this.pets = this.pets.filter(p => p.id !== pet.id)
      }
    },
    viewHealthRecords(pet) {
      // TODO: 跳转到宠物健康档案详情页
      console.log('查看健康档案:', pet.name)
    },
    closeModal() {
      this.showAddPetModal = false
      this.editingPet = null
      this.petForm = {
        name: '',
        breed: '',
        age: '',
        gender: '公',
        status: '健康',
        image: ''
      }
    },
    savePet() {
      if (this.editingPet) {
        // 更新现有宠物
        const index = this.pets.findIndex(p => p.id === this.editingPet.id)
        this.pets[index] = { ...this.editingPet, ...this.petForm }
      } else {
        // 添加新宠物
        const newPet = {
          id: this.pets.length + 1,
          ...this.petForm,
          healthRecords: []
        }
        this.pets.push(newPet)
      }
      this.closeModal()
    }
  }
}
</script>

<style scoped>
.my-pets {
  width: 100%;
  background-color: var(--primary-bg-color);
  min-height: calc(100vh - 64px);
}

/* 卡片悬停效果 */
.pet-card {
  transition: all 0.3s ease;
}

.pet-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* 模态框动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style> 