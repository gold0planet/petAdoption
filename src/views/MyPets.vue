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
            <img :src="getPetImageUrl(pet.image)" :alt="pet.name" class="w-full h-48 object-cover">
            <div class="absolute top-3 right-3 flex space-x-2">
              <button @click="editPet(pet)" class="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                <i class="fas fa-edit text-blue-500"></i>
              </button>
              <button @click="deletePet(pet.id)" class="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                <i class="fas fa-trash text-red-500"></i>
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
              <div class="mt-3 flex space-x-2">
                <button @click="viewHealthRecords(pet)" 
                  class="flex-1 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  查看完整档案
                </button>
                <button @click="reportLostPet(pet)"
                  :class="[
                    'flex-1 py-2 text-sm rounded-lg transition-colors',
                    pet.isLost 
                      ? 'bg-orange-100 text-orange-600' 
                      : 'text-orange-600 hover:bg-orange-50'
                  ]">
                  {{ pet.isLost ? '已挂失' : '发布挂失' }}
                </button>
              </div>
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
                <img :src="getPetImageUrl(petForm.image) || 'https://via.placeholder.com/100'" 
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

      <!-- 健康记录表单模态框 -->
      <div v-if="showHealthRecordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style="z-index: 60;">
        <div class="bg-white rounded-lg w-full max-w-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold">添加健康记录</h3>
            <button @click="closeHealthRecordModal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <form @submit.prevent="saveHealthRecord" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">记录类型</label>
              <select v-model="healthRecordForm.type" required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="体检">体检</option>
                <option value="疫苗">疫苗</option>
                <option value="驱虫">驱虫</option>
                <option value="治疗">治疗</option>
                <option value="手术">手术</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">日期</label>
              <input type="date" v-model="healthRecordForm.date" required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">标题</label>
              <input type="text" v-model="healthRecordForm.title" required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="例如：年度体检、疫苗注射等">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">详细描述</label>
              <textarea v-model="healthRecordForm.description" rows="4" required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="请详细描述健康记录的具体情况..."></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">医疗机构</label>
              <input type="text" v-model="healthRecordForm.hospital"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="请输入就医的宠物医院名称">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">费用（元）</label>
              <input type="number" v-model="healthRecordForm.cost"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="请输入本次医疗费用">
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" @click="closeHealthRecordModal"
                class="px-4 py-2 border rounded-lg hover:bg-gray-50">
                取消
              </button>
              <button type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                保存记录
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 完整健康档案模态框 -->
      <div v-if="showFullRecordsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="text-xl font-bold">{{ selectedPet?.name }} 的健康档案</h3>
              <p class="text-gray-600 mt-1">完整的健康记录和医疗历史</p>
            </div>
            <button @click="closeFullRecordsModal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="flex justify-between items-center mb-4">
            <div class="flex space-x-4">
              <select v-model="recordFilter.type" 
                class="px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">全部类型</option>
                <option value="体检">体检</option>
                <option value="疫苗">疫苗</option>
                <option value="驱虫">驱虫</option>
                <option value="治疗">治疗</option>
                <option value="手术">手术</option>
              </select>
              <select v-model="recordFilter.year"
                class="px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">全部年份</option>
                <option v-for="year in availableYears" :key="year" :value="year">
                  {{ year }}年
                </option>
              </select>
            </div>
            <button @click="addHealthRecord(selectedPet)"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              添加记录
            </button>
          </div>

          <!-- 时间轴展示 -->
          <div class="space-y-6">
            <div v-for="record in filteredHealthRecords" :key="record.id" 
              class="flex items-start space-x-4 pb-6 border-l-2 border-blue-200 pl-4 relative">
              <div class="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500"></div>
              <div class="flex-1 bg-gray-50 rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <span class="inline-block px-2 py-1 text-sm rounded-full"
                      :class="{
                        'bg-blue-100 text-blue-600': record.type === '体检',
                        'bg-green-100 text-green-600': record.type === '疫苗',
                        'bg-yellow-100 text-yellow-600': record.type === '驱虫',
                        'bg-red-100 text-red-600': record.type === '治疗',
                        'bg-purple-100 text-purple-600': record.type === '手术'
                      }">
                      {{ record.type }}
                    </span>
                    <h4 class="font-medium mt-2">{{ record.title }}</h4>
                  </div>
                  <span class="text-sm text-gray-500">{{ record.date }}</span>
                </div>
                <p class="text-gray-600 text-sm mb-2">{{ record.description }}</p>
                <div class="flex justify-between text-sm text-gray-500">
                  <span>医疗机构：{{ record.hospital }}</span>
                  <span>费用：¥{{ record.cost }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 添加挂失表单模态框 -->
      <div v-if="showLostPetModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg w-full max-w-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold">发布挂失信息</h3>
            <button @click="closeLostPetModal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <form @submit.prevent="saveLostPetReport" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">丢失时间</label>
              <input type="datetime-local" v-model="lostPetForm.lostTime" required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">丢失地点</label>
              <input type="text" v-model="lostPetForm.location" required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="请尽可能详细描述丢失地点">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">详细描述</label>
              <textarea v-model="lostPetForm.description" rows="4" required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="请描述丢失时的具体情况、宠物特征等..."></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">联系方式</label>
              <input type="tel" v-model="lostPetForm.contact" required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="请留下您的联系电话">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">悬赏金额（可选）</label>
              <input type="number" v-model="lostPetForm.reward"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="如有悬赏,请填写金额">
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" @click="closeLostPetModal"
                class="px-4 py-2 border rounded-lg hover:bg-gray-50">
                取消
              </button>
              <button type="submit"
                class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                发布挂失
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 取消挂失确认模态框 -->
      <div v-if="showCancelLostModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg w-full max-w-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold">取消挂失确认</h3>
            <button @click="showCancelLostModal = false" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="py-4">
            <p class="text-gray-600">确定要取消该宠物的挂失状态吗？取消后将不再显示挂失信息。</p>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button @click="showCancelLostModal = false"
              class="px-4 py-2 border rounded-lg hover:bg-gray-50">
              再想想
            </button>
            <button @click="confirmCancelLost"
              class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              确认取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Banner from '@/components/Banner.vue'
import Footer from '@/components/Footer.vue'
import petsApi from '@/api/pets';

export default {
  name: 'MyPets',
  components: {
    Banner,
    Footer
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
      ],
      showHealthRecordModal: false,
      showFullRecordsModal: false,
      selectedPet: null,
      healthRecordForm: {
        type: '体检',
        date: '',
        title: '',
        description: '',
        hospital: '',
        cost: ''
      },
      recordFilter: {
        type: '',
        year: ''
      },
      showLostPetModal: false,
      lostPetForm: {
        lostTime: '',
        location: '',
        description: '',
        contact: '',
        reward: ''
      },
      showCancelLostModal: false,
      petToCancel: null
    }
  },
  computed: {
    ...mapGetters('pets', [
      'getPetImageUrl'
    ]),
    availableYears() {
      if (!this.selectedPet) return []
      const years = this.selectedPet.healthRecords.map(record => 
        new Date(record.date).getFullYear()
      )
      return [...new Set(years)].sort((a, b) => b - a)
    },
    filteredHealthRecords() {
      if (!this.selectedPet) return []
      let records = [...this.selectedPet.healthRecords]
      
      if (this.recordFilter.type) {
        records = records.filter(record => record.type === this.recordFilter.type)
      }
      
      if (this.recordFilter.year) {
        records = records.filter(record => 
          new Date(record.date).getFullYear() === parseInt(this.recordFilter.year)
        )
      }
      
      return records.sort((a, b) => new Date(b.date) - new Date(a.date))
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
      this.selectedPet = pet
      this.showFullRecordsModal = true
      this.recordFilter = {
        type: '',
        year: ''
      }
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
    },
    addHealthRecord(pet) {
      this.selectedPet = pet
      this.showHealthRecordModal = true
      this.healthRecordForm = {
        type: '体检',
        date: new Date().toISOString().split('T')[0],
        title: '',
        description: '',
        hospital: '',
        cost: ''
      }
    },
    closeHealthRecordModal() {
      this.showHealthRecordModal = false
      this.healthRecordForm = {
        type: '体检',
        date: '',
        title: '',
        description: '',
        hospital: '',
        cost: ''
      }
    },
    saveHealthRecord() {
      const newRecord = {
        id: Date.now(),
        ...this.healthRecordForm
      }
      
      const petIndex = this.pets.findIndex(p => p.id === this.selectedPet.id)
      if (petIndex !== -1) {
        if (!this.pets[petIndex].healthRecords) {
          this.pets[petIndex].healthRecords = []
        }
        this.pets[petIndex].healthRecords.unshift(newRecord)
      }
      
      this.closeHealthRecordModal()
    },
    closeFullRecordsModal() {
      this.showFullRecordsModal = false
      this.selectedPet = null
      this.recordFilter = {
        type: '',
        year: ''
      }
    },
    reportLostPet(pet) {
      if (pet.isLost) {
        this.petToCancel = pet;
        this.showCancelLostModal = true;
      } else {
        this.selectedPet = pet;
        this.showLostPetModal = true;
        this.lostPetForm = {
          lostTime: new Date().toISOString().slice(0, 16),
          location: '',
          description: '',
          contact: '',
          reward: ''
        };
      }
    },
    closeLostPetModal() {
      this.showLostPetModal = false
      this.lostPetForm = {
        lostTime: '',
        location: '',
        description: '',
        contact: '',
        reward: ''
      }
    },
    saveLostPetReport() {
      const petIndex = this.pets.findIndex(p => p.id === this.selectedPet.id)
      if (petIndex !== -1) {
        this.pets[petIndex].isLost = true
        this.pets[petIndex].lostInfo = {
          ...this.lostPetForm,
          reportTime: new Date().toISOString()
        }
      }
      this.closeLostPetModal()
    },
    confirmCancelLost() {
      const index = this.pets.findIndex(p => p.id === this.petToCancel.id);
      if (index !== -1) {
        this.pets[index].isLost = false;
        this.pets[index].lostInfo = null;
      }
      this.showCancelLostModal = false;
      this.petToCancel = null;
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
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* 时间轴样式 */
.border-l-2 {
  position: relative;
}

.border-l-2::before {
  content: '';
  position: absolute;
  left: -2px;
  top: 0;
  width: 2px;
  height: 100%;
  background-color: #e5e7eb;
}

/* 挂失状态样式 */
.pet-card.lost {
  border: 2px solid #f97316;
}

.pet-card.lost::before {
  content: '已挂失';
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #f97316;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}
</style> 