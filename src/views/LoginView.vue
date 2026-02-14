<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-icon">🏥</div>
        <h1>MediCare Access</h1>
        <p>Sistema de Gestión de Citas Médicas</p>
      </div>

      <div v-if="errorMessage" class="alert-error">⚠️ {{ errorMessage }}</div>

      <FormularioLogin @submit="handleLogin" :loading="loading" />

      <div class="login-footer">
        <small>© 2026 MediCare System. Acceso restringido.</small>
      </div>
    </div>
  </div>
</template>

<script>
import { getTokenFacade } from '@/clients/AuthorizationClient'
import FormularioLogin from '@/components/FormularioLogin.vue'

export default {
  components: { FormularioLogin },
  data() {
    return {
      loading: false,
      errorMessage: null
    }
  },
  methods: {
    async handleLogin(credentials) {
      if (this.loading) return
      this.loading = true
      this.errorMessage = null

      try {
        await getTokenFacade(credentials.username, credentials.password)
        this.$router.push('/')
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.errorMessage = 'Usuario o contraseña incorrectos.'
        } else if (error.code === 'ERR_NETWORK') {
          this.errorMessage = 'No se puede conectar con el servidor.'
        } else {
          this.errorMessage = 'Ocurrió un error inesperado.'
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.5rem;
  background: linear-gradient(
    140deg,
    var(--color-bg) 0%,
    var(--color-bg-alt) 100%
  );
}

/* TARJETA */
.login-card {
  background: var(--color-surface);
  width: 100%;
  max-width: 400px;
  padding: 2.25rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-1);
}

/* HEADER */
.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-icon {
  width: 52px;
  height: 52px;
  margin: 0 auto 0.85rem;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(11, 107, 203, 0.12);
  color: var(--color-primary);
  font-size: 1.6rem;
}

.login-header h1 {
  font-size: 1.5rem;
  color: var(--color-text);
  margin: 0;
  font-weight: 700;
}

.login-header p {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  margin-top: 0.35rem;
}

/* ERROR */
.alert-error {
  background-color: rgba(198, 40, 40, 0.1);
  color: var(--color-danger);
  padding: 10px;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  text-align: center;
  border: 1px solid rgba(198, 40, 40, 0.25);
}

/* FOOTER */
.login-footer {
  text-align: center;
  margin-top: 2rem;
  color: var(--color-text-muted);
  font-size: 0.8rem;
}
</style>
