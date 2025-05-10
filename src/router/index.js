import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store'
import Adoption from '@/views/Adoption.vue';
import Login from '@/views/Login.vue';
import BreedRecognition from '@/views/BreedRecognition.vue';
import LostPets from '@/views/LostPets.vue';
import CareTips from '@/views/CareTips.vue';
import Contact from '@/views/Contact.vue';
import UserProfile from '@/views/UserProfile.vue';
import Messages from '@/views/Messages.vue';
import MyPets from '@/views/MyPets.vue';

const routes = [
  {
    path: '/',
    redirect: '/adoption'
  },
  {
    path: '/adoption',
    name: 'Adoption',
    component: Adoption,
    meta: { 
      requiresAuth: false,  // 可以查看
      requiresAuthForActions: true  // 操作需要登录
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/breed-recognition',
    name: 'BreedRecognition',
    component: BreedRecognition,
    meta: { 
      requiresAuth: false,
      requiresAuthForActions: true 
    }
  },
  { 
    path: '/lost-pets', 
    component: LostPets,
    meta: { 
      requiresAuth: false,
      requiresAuthForActions: true 
    }
  },
  { 
    path: '/care-tips', 
    component: CareTips,
    meta: { 
      requiresAuth: false,
      requiresAuthForActions: true 
    }
  },
  { 
    path: '/contact', 
    component: Contact,
    meta: { 
      requiresAuth: false,
      requiresAuthForActions: true 
    }
  },
  {
    path: '/user-profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { 
      requiresAuth: true,
      requiresAuthForActions: true 
    }
  },
  {
    path: '/messages',
    name: 'Messages',
    component: Messages,
    meta: { 
      requiresAuth: true,
      requiresAuthForActions: true 
    }
  },
  {
    path: '/my-pets',
    name: 'MyPets',
    component: MyPets,
    meta: { 
      requiresAuth: true,
      requiresAuthForActions: true 
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters.isLoggedIn

  // 完全需要登录的页面
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
    return
  }

  // 对于可以查看但操作需要登录的页面
  if (to.meta.requiresAuthForActions) {
    // 将登录状态存储在路由元信息中，方便页面组件使用
    to.meta.isLoggedIn = isLoggedIn
  }

  next()
})

export default router