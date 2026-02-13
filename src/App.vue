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
          <button
            @click="handleLogout"
            class="btn-logout"
            :disabled="isLoggingOut"
          >
            {{ isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión' }}
          </button>
        </div>
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
