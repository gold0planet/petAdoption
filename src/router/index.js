import { createRouter, createWebHistory } from 'vue-router';
import Adoption from '@/views/Adoption.vue';
import Login from '@/views/Login.vue';
import BreedRecognition from '@/views/BreedRecognition.vue';
import Home from '../views/Home.vue';
import LostPets from '../views/LostPets.vue';
import CareTips from '../views/CareTips.vue';
import Contact from '../views/Contact.vue';
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
    component: Adoption
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/breed-recognition',
    name: 'BreedRecognition',
    component: BreedRecognition
  },
  { path: '/lost-pets', component: LostPets },
  { path: '/care-tips', component: CareTips },
  { path: '/contact', component: Contact },
  {
    path: '/user-profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/messages',
    name: 'Messages',
    component: Messages,
    meta: { requiresAuth: true }
  },
  {
    path: '/my-pets',
    name: 'MyPets',
    component: MyPets,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = true;
  
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;