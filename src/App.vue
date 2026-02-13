<template>
  <header header v-if="$route.name !== 'login'">
    <div class="wrapper">
      <nav class="navbar">
        <div class="brand">🏥 MediCare System</div>
        <div class="menu">
          <RouterLink to="/">Inicio</RouterLink>
          <RouterLink to="/doctors">Doctores</RouterLink>
          <RouterLink to="/patients">Pacientes</RouterLink>
          <RouterLink to="/appointments">Citas</RouterLink>
        </div>
        <button
          @click="handleLogout"
          class="btn-logout"
          :disabled="isLoggingOut"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="logout-icon"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"
            />
            <path d="M9 12h12l-3 -3" />
            <path d="M18 15l3 -3" />
          </svg>
          <span>{{
            isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'
          }}</span>
        </button>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<script>
import { logOutFacade } from './clients/AuthorizationClient'

export default {
  name: 'App',
  data() {
    return {
      isLoggingOut: false
    }
  },
  methods: {
    async handleLogout() {
      if (this.isLoggingOut) return

      try {
        this.isLoggingOut = true

        logOutFacade()
        await this.$router.push('/login')
      } catch (error) {
        console.error('Error durante el logout:', error)
      } finally {
        this.isLoggingOut = false
      }
    }
  }
}
</script>

<style scoped>
.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.btn-logout .logout-icon {
  width: 1.1rem;
  height: 1.1rem;
  stroke: currentColor;
}

.btn-logout:disabled .logout-icon {
  opacity: 0.6;
}
</style>
