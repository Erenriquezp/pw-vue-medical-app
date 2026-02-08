import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requireAuthorization: true,
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/appointments',
      name: 'appointments',
      component: () => import('../views/AppointmentsView.vue'),
      meta: {
        requireAuthorization: true,
      }
    },
    {
      path: '/doctors',
      name: 'doctors',
      component: () => import('../views/DoctorsView.vue'),
      meta: {
        requireAuthorization: true,
      }
    },
    {
      path: '/patients',
      name: 'patients',
      component: () => import('../views/PatientsView.vue'),
      meta: {
        requireAuthorization: true,
      }
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuthorization) {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      next();
    } else {
      console.log('Acceso denegado');
      next({name: 'login'});
    }
  } else {
    next();
  }
});

export default router
