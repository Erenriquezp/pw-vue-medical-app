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
        requireAuthorization: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/appointments',
      name: 'appointments',
      component: () => import('../views/CitasView.vue'),
      meta: {
        requireAuthorization: true
      }
    },
    {
      path: '/doctors',
      name: 'doctors',
      component: () => import('../views/DoctoresView.vue'),
      meta: {
        requireAuthorization: true
      }
    },
    {
      path: '/patients',
      name: 'patients',
      component: () => import('../views/PacientesView.vue'),
      meta: {
        requireAuthorization: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt_token')
  const expiresAt = localStorage.getItem('expiresAt')
  const valid = token && expiresAt && Number(expiresAt * 1000) > Date.now()

  if (to.name === 'login' && valid) return next({ name: 'home' })

  if (to.meta.requireAuthorization && !valid) {
    // sesión inválida o no autenticado
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('expiresAt')
    return next({ name: 'login' })
  }

  next()
})

export default router
