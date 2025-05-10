import axios from 'axios'

// 创建专门的 pets API 服务
const petsApi = {
  // 获取流浪动物列表，支持分页和筛选
  getStrayPets(params = {}) {
    // 处理status数组参数
    let requestParams = { ...params };
    
    // 如果status是数组，转换为逗号分隔的字符串
    if (Array.isArray(requestParams.status)) {
      requestParams.status = requestParams.status.join(',');
    }
    
    return axios.get('/api/pets/stray', { params: requestParams })
  },
  
  // 获取单个流浪动物详情
  getStrayPetDetail(id) {
    return axios.get(`/api/pets/stray/${id}`)
  },
  
  // 申请领养
  applyAdoption(petId, data) {
    return axios.post(`/api/pets/adoption/${petId}/apply`, data)
  },
  
  // 获取宠物图片URL
  getPetImage(imagePath) {
    if (!imagePath) return 'https://via.placeholder.com/300';
    
    // 如果是完整URL，直接返回
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // 如果是相对路径，拼接服务器地址
    return `${axios.defaults.baseURL}/${imagePath}`;
  },
  
  // 直接请求后端图片数据
  fetchPetImage(imagePath) {
    if (!imagePath) {
      return Promise.resolve('https://via.placeholder.com/300');
    }
    
    // 如果是完整URL，直接请求该URL
    const url = imagePath.startsWith('http://') || imagePath.startsWith('https://') 
      ? imagePath 
      : `${axios.defaults.baseURL}/${imagePath}`;
    
    // 使用 axios 请求图片，设置 responseType 为 blob
    return axios.get(url, { 
      responseType: 'blob' 
    }).then(response => {
      // 创建一个 URL 对象，用于显示图片
      return URL.createObjectURL(response.data);
    }).catch(error => {
      console.error('获取图片失败:', error);
      return 'https://via.placeholder.com/300'; // 出错时返回默认图片
    });
  }
}

export default petsApi 