<template>
  <div class="breed-recognition">
    <Banner />
    <div class="content-container max-w-7xl mx-auto p-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <!-- 上传区域 -->
        <div class="upload-section mb-8 text-center">
          <h2 class="text-2xl font-bold mb-4">宠物品种识别</h2>
          <p class="text-gray-600 mb-6">上传宠物照片，快速识别品种信息</p>
          
          <div class="upload-area relative mx-auto max-w-xl border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors"
            :class="{ 'border-blue-500': isDragging }"
            @dragenter.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @dragover.prevent
            @drop.prevent="handleDrop">
            
            <input type="file" 
              ref="fileInput" 
              class="hidden" 
              accept="image/*"
              @change="handleFileSelect">
            
            <div v-if="!previewImage" class="text-center">
              <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
              <p class="text-gray-600">拖拽图片到此处或</p>
              <button @click="triggerFileInput" class="btn mt-2">选择图片</button>
            </div>
            
            <div v-else class="preview-container">
              <img :src="previewImage" alt="Preview" class="max-h-64 mx-auto rounded-lg">
              <button @click="resetUpload" class="btn-secondary mt-4">
                重新上传
              </button>
            </div>
          </div>
        </div>

        <!-- 识别结果 -->
        <div v-if="recognitionResult" class="result-section mt-8">
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-xl font-bold mb-4">识别结果</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="result-card p-4 bg-white rounded-lg shadow">
                <h4 class="font-bold text-lg mb-2">主要品种</h4>
                <div class="flex items-center justify-between">
                  <span>{{ recognitionResult.mainBreed }}</span>
                  <span class="text-blue-600 font-bold">{{ recognitionResult.mainConfidence }}%</span>
                </div>
              </div>
              
              <div class="result-card p-4 bg-white rounded-lg shadow">
                <h4 class="font-bold text-lg mb-2">可能的其他品种</h4>
                <ul class="space-y-2">
                  <li v-for="(breed, index) in recognitionResult.otherBreeds" 
                    :key="index"
                    class="flex justify-between">
                    <span>{{ breed.name }}</span>
                    <span class="text-gray-600">{{ breed.confidence }}%</span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="breed-info mt-6 p-4 bg-white rounded-lg shadow">
              <h4 class="font-bold text-lg mb-2">品种特征</h4>
              <p class="text-gray-600">{{ recognitionResult.breedInfo }}</p>
            </div>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div class="text-center text-white">
            <i class="fas fa-spinner fa-spin text-4xl mb-2"></i>
            <p>正在识别中...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Banner from '@/components/Banner.vue';

export default {
  name: 'BreedRecognition',
  components: {
    Banner
  },
  data() {
    return {
      isDragging: false,
      isLoading: false,
      previewImage: null,
      recognitionResult: null,
      uploadedFile: null
    };
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
    
    triggerFileInput() {
      this.checkLoginAndExecute(() => {
        this.$refs.fileInput.click();
      })
    },
    
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.processFile(file);
      }
    },
    
    handleDrop(event) {
      this.checkLoginAndExecute(() => {
        this.isDragging = false;
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
          this.processFile(file);
        }
      })
    },
    
    processFile(file) {
      this.uploadedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target.result;
        this.uploadImage();
      };
      reader.readAsDataURL(file);
    },
    
    resetUpload() {
      this.previewImage = null;
      this.uploadedFile = null;
      this.recognitionResult = null;
      this.$refs.fileInput.value = '';
    },
    
    async uploadImage() {
      if (!this.uploadedFile) return;
      
      this.isLoading = true;
      this.recognitionResult = null;
      
      try {
        const formData = new FormData();
        formData.append('image', this.uploadedFile);
        
        // 这里替换为实际的API调用
        // const response = await axios.post('/api/breed-recognition', formData);
        // this.recognitionResult = response.data;
        
        // 模拟API响应
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.recognitionResult = {
          mainBreed: '拉布拉多犬',
          mainConfidence: 95,
          otherBreeds: [
            { name: '金毛犬', confidence: 3 },
            { name: '德国牧羊犬', confidence: 2 }
          ],
          breedInfo: '拉布拉多犬性格温顺友好，智商很高，适合家庭饲养。它们对人很友善，特别适合有小孩的家庭。这个品种需要适量运动，定期梳理毛发。'
        };
        
      } catch (error) {
        console.error('识别失败:', error);
        // 这里可以添加错误提示
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.breed-recognition {
  width: 100%;
  background-color: var(--primary-bg-color);
  min-height: calc(100vh - 60px);
}

.upload-area {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn {
  background-color: var(--primary-btn-color);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  cursor: pointer;
}

.btn:hover {
  background-color: var(--primary-btn-hover-color);
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

.loading-overlay {
  z-index: 1000;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fa-spin {
  animation: spin 1s linear infinite;
}
</style>
  