import petsApi from '@/api/pets'

const state = {
  strayPets: [],
  totalCount: 0,
  loading: false,
  currentPage: 1,
  pageSize: 6,
  filters: {
    type: '',
    age: '',
    gender: '',
    status: ['流浪', '待领养']
  },
  petImages: {} // 缓存已获取的宠物图片
}

const mutations = {
  SET_STRAY_PETS(state, pets) {
    state.strayPets = pets
  },
  SET_TOTAL_COUNT(state, count) {
    state.totalCount = count
  },
  SET_LOADING(state, status) {
    state.loading = status
  },
  SET_CURRENT_PAGE(state, page) {
    state.currentPage = page
  },
  SET_PAGE_SIZE(state, size) {
    state.pageSize = size
  },
  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters }
  },
  // 添加缓存图片的 mutation
  SET_PET_IMAGE(state, { path, imageUrl }) {
    state.petImages = { ...state.petImages, [path]: imageUrl };
  }
}

const actions = {
  async fetchStrayPets({ commit, state }, payload = {}) {
    try {
      commit('SET_LOADING', true)
      
      // 构建查询参数，允许通过payload覆盖默认参数
      const params = {
        page: state.currentPage,
        pageSize: state.pageSize,
        ...state.filters,
        ...payload // 支持传入额外参数覆盖默认值
      }
      
      const response = await petsApi.getStrayPets(params)
      
      // 更新处理逻辑，适配后端返回的格式
      if (response.data.code === 200) {
        const pets = response.data.data.list || [];
        const total = response.data.data.total || 0;
        
        commit('SET_STRAY_PETS', pets)
        commit('SET_TOTAL_COUNT', total)
        
        return {
          success: true,
          data: {
            pets: pets,
            total: total
          }
        }
      } else {
        console.error('获取流浪动物列表失败:', response.data.message)
        return {
          success: false,
          message: response.data.message || '获取流浪动物列表失败'
        }
      }
    } catch (error) {
      console.error('获取流浪动物列表出错:', error)
      return {
        success: false,
        message: '获取流浪动物列表发生异常'
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  updateFilters({ commit, dispatch }, filters, skipFetch = false) {
    commit('SET_FILTERS', filters)
    commit('SET_CURRENT_PAGE', 1) // 重置到第一页
    
    // 如果skipFetch为true，则不触发fetchStrayPets
    return skipFetch ? Promise.resolve() : dispatch('fetchStrayPets')
  },
  
  updatePagination({ commit, dispatch }, { page, pageSize }, skipFetch = false) {
    if (page) commit('SET_CURRENT_PAGE', page)
    if (pageSize) commit('SET_PAGE_SIZE', pageSize)
    
    // 如果skipFetch为true，则不触发fetchStrayPets
    return skipFetch ? Promise.resolve() : dispatch('fetchStrayPets')
  },
  
  // 异步获取宠物图片
  async fetchPetImage({ commit, state }, imagePath) {
    // 如果已经缓存，直接返回缓存的图片URL
    if (state.petImages[imagePath]) {
      return state.petImages[imagePath];
    }
    
    try {
      // 请求图片数据并获取 URL
      const imageUrl = await petsApi.fetchPetImage(imagePath);
      
      // 缓存图片 URL
      commit('SET_PET_IMAGE', { path: imagePath, imageUrl });
      
      return imageUrl;
    } catch (error) {
      console.error('获取宠物图片失败:', error);
      return 'https://via.placeholder.com/300'; // 出错时返回默认图片
    }
  }
}

const getters = {
  getStrayPets: state => state.strayPets,
  getPetsLoading: state => state.loading,
  getPagination: state => ({
    current: state.currentPage,
    pageSize: state.pageSize,
    total: state.totalCount
  }),
  getFilters: state => state.filters,
  // 获取宠物图片URL
  getPetImageUrl: () => (imagePath) => {
    return imagePath ? petsApi.getPetImage(imagePath) : 'https://via.placeholder.com/300';
  },
  // 获取缓存的图片
  getCachedPetImage: state => imagePath => {
    return state.petImages[imagePath] || null;
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 